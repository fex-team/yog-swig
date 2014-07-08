var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;
var yog = require('yog');
var app = express();
var path = require('path');

var NODE_MODULES_PATH = path.join('../../', 'node_modules');
var rApi = require(path.join(NODE_MODULES_PATH, '/yog/middleware/yog-resource-api'));
var bigpipe = require('yog-bigpipe');

app.use(rApi({
    config_dir: __dirname + '/config'
}));

app.use(bigpipe());


var layer = require(path.join(NODE_MODULES_PATH, '/yog-view/lib/layer.js'));

// require self
var wrap = require('../../');

describe('tags', function () {
    var tests = {
        '/html': {
            'tpl': '{%html%}test{%endhtml%}',
            'isString': true,
            'expect': '<html>test<!--FIS_BIGPIPE_HOOK--></html>'
        },
        '/body': {
            'tpl': '{%body%}test{%endbody%}',
            'isString': true,
            'expect': '<body>test<!--FIS_JS_HOOK--></body>'
        },
        '/style': {
            'tpl': '{%style%}alert("test");{%endstyle%}',
            'isString': true,
            'expect': ''
        },
        '/widget': {
            'tpl': 'include_widget_page.tpl',
            'expect': 'widget'
        },
        '/html_index.tpl': {
            'tpl': 'index.tpl',
            'expect': '<html>test<!--FIS_BIGPIPE_HOOK--></html>'
        }
    };

    for (var key in tests) {
        if (!tests.hasOwnProperty(key)) { continue; }
        var itr = tests[key];
        (function (key, itr) {
            app.get(key, function (req, res) {
                var options = {
                    views: path.join(__dirname, '/tpls')
                };
                var protocol = layer(res.fis, res.bigpipe);
                options.locals = {_yog: protocol};
                var swig = wrap(options, protocol).swig;
                if (itr['isString']) {
                    res.end(swig.run(swig.compile(itr['tpl'])));
                } else {
                    res.end(swig.renderFile(itr['tpl']));
                }
            });

            it(key, function (done) {
                request(app)
                    .get(key)
                    .end(function (err, res) {
                        expect(res.text).to.equal(itr['expect']);
                        done();
                    });
            });
        })(key, itr);
    }
});