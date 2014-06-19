var Swig = require('../../');
var rApi = require('../../../yog/middleware/yog-resource-api');
var fs = require('fs');
var r = {
    fis: new rApi.ResourceApi(__dirname + '/config'),
    write: function (s) {
        console.log(s);
    }
}

var swig = Swig(r, {
    viewdir: __dirname + '/tpls'
});

console.log(swig._render(__dirname + '/tpls/test01.tpl', {
    obj_var: {
        title: 'it\'s a widget'
    }
}, {
    "widget01": function (done) {
        fs.readFile(__dirname + '/data/pagelet01.json', function (err, json) {
            if (err) {
                throw err;
            }
            done(JSON.parse(json));
        });
    }
}));
console.log(r);