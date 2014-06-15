/**
 * fis.baidu.com
 */

var Swig = require('swig').Swig;
var path = require('path');

module.exports = function (res, options) {
    
    options = options || {};

    //add responseWriter to the context of swig.
    Swig.prototype._r = function () {
        return res;
    };

    Swig.prototype._compileFile = function (id, w_args, opt) {
        opt.resolveFrom = '';
        var p = path.join(options['viewdir'], res.fis.getUri(id));
        return this.compileFile(p, opt);
    };

    var swig = new Swig(options);

    var tags  = [
        "script",
        "style",
        "html",
        "body",
        "require",
        "uri",
        "widget",
        "head"
    ];

    tags.forEach(function (tag) {
        var t = require('./tags/' + tag);
        swig.setTag(tag, t.parse, t.compile, t.ends, t.blockLevel || false);
    });

    return swig;
};