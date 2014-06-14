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
        "widget",
        "head"
    ];

    tags.forEach(function (tag) {
        var t = require('./tags/' + tag);
        console.log(tag);
        swig.setTag(tag, t.parse, t.compile, t.ends, t.blockLevel || false);
    });

    return swig;
};