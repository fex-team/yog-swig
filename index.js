/**
 * fis.baidu.com
 */

var Swig = require('swig').Swig;


module.exports = function (res, options) {
    Swig.prototype._r = function () {
        return res;
    };

    var swig = new Swig(options);

    var tags  = [
        "script",
        "style",
        "html",
        "body",
        "require",
        "uri",
        "widget"
    ];

    tags.forEach(function (tag) {
        var t = require('./tags/' + tag);
        swig.setTag(tag, t.parse, t.compile, t.ends, t.blockLevel || false);
    });

    return swig;
};