/**
 * fis.baidu.com
 */

var Swig = require('swig').Swig;
var path = require('path');

module.exports = function (res, options) {
    
    if (!res.fis) {
        throw new Error('must `yog-resource-api` is loaded.');
    }

    if (!options || !options['viewdir']) {
        throw new Error('must set `options.viewdir`.');
    }

    //add responseWriter to the context of swig.
    Swig.prototype._r = function () {
        return res;
    };

    Swig.prototype._compileFile = function (id, w_args, opt) {
        opt.resolveFrom = '';
        var p = path.join(options['viewdir'], res.fis.load(id));
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