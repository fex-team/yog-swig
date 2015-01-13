var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;
var app = express();
var path = require('path');

var NODE_MODULES_PATH = path.join('../../', 'node_modules');
var rApi = require(path.join(NODE_MODULES_PATH, '/yog2-kernel/plugins/views/mapjson.js'));
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
            'expect': '<html >test<!--FIS_BIGPIPE_HOOK--></html>'
        },
        '/body': {
            'tpl': '{%body attrs=\'a="aaaa"\'%}test{%endbody%}',
            'isString': true,
            'expect': '<body a="aaaa">test<!--FIS_JS_HOOK--></body>'
        },
        '/style': {
            'tpl': '{%style%}body{}{%endstyle%}',
            'isString': true,
            'expect': ''
        },
        '/script': {
            'tpl': '{%script%}console.log("fis");{%endscript%}',
            'isString': true,
            'expect': ''
        },
        '/require': {
            'tpl': '{%require "ns:static/mod.js"%}',
            'isString': true,
            'expect': '',
            'cb': function (layer) {
                var scripts = layer.getJs();
                expect(scripts).to.be.deep.equal([
                    "/static/ns/mod.js"
                ]);
            }
        },
        '/widget': {
            'tpl': 'include_widget_page.tpl',
            'expect': 'widget'
        },
        '/html_index.tpl': {
            'tpl': 'index.tpl',
            'expect': '<html lang="en">test<!--FIS_BIGPIPE_HOOK--></html>'
        }
    };

    for (var key in tests) {
        if (!tests.hasOwnProperty(key)) { continue; }
        var itr = tests[key];
        (function (key, itr) {
            app.get(key, function (req, res) {
                app.fis = res.fis;
                var options = {
                    views: path.join(__dirname, '/tpls')
                };
                var protocol = layer(res, options);
                var swig = (new wrap(app, options)).swig;
                var output = '';
                var compileOpt = {
                    locals: {_yog: protocol}
                };
                if (itr['isString']) {
                    output = swig.run(swig.compile(itr['tpl'], compileOpt), {_yog: protocol});
                } else {
                    output = swig.renderFile(itr['tpl'], {_yog: protocol});
                }
                if (itr['cb']) itr['cb'](protocol);
                res.end(output);

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

