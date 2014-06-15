var Swig = require('../../');
var rApi = require('../../../yog/middleware/yog-resource-api');
var r = {
    fis: new rApi.ResourceApi(__dirname + '/config')
}

var swig = Swig(r, {
    viewdir: __dirname + '/tpls'
});

console.log(swig.renderFile(__dirname + '/tpls/test01.tpl', {
    obj_var: {
        title: 'it\'s a widget'
    }
}));
console.log(r);