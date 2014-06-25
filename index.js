/**
 * fis.baidu.com
 */

var Swig = require('swig').Swig;
var util = require("util");
var EventEmitter = require("events").EventEmitter;
var loader = require('./lib/loader.js');
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


Swig.prototype._w = Swig.prototype._widget = function(api, id, attr, options) {
    var self = this;
    var pathname = api.resolve(id);

    if (!api.supportBigPipe() || !attr.mode || attr.mode === 'sync') {
        api.load(id);
        return this.compileFile(pathname, options);
    }

    return function(locals) {

        api.addPagelet({
            id: attr.id,
            mode: attr.mode,
            locals: locals,
            view: pathname,
            sourceId: id,

            compiled: function(locals) {
                var fn = self.compileFile(pathname, options);
                locals._yog && locals._yog.load(id);
                return fn.apply(this, arguments);
            }
        });

        return '<div id="' + attr.id + '"></div>';
    };
}

var SwigWrap = module.exports = function SwigWrap(options, api) {

    if (!(this instanceof SwigWrap)) {
        return new SwigWrap(options);
    }

    options.loader = options.loader || loader(api, options.views);

    var self = this;
    var swig = this.swig = new Swig(options);

    tags.forEach(function (tag) {
        var t = require('./tags/' + tag);
        swig.setTag(tag, t.parse, t.compile, t.ends, t.blockLevel || false);
    });

    EventEmitter.call(this);
};

util.inherits(SwigWrap, EventEmitter);

SwigWrap.prototype.renderFile = function(path, data) {
    var self = this;

    this.swig.renderFile(path, data, function(err, output) {
        if (err) {
            return self.emit('error', err);
        }

        // 这里支持 chunk 输出内容。
        // 可以先输出部分，如：
        // self.emit('data', 'chunk content');
        // self.emit('flush');

        self.emit('end', output);
    });
};

SwigWrap.prototype.destroy = function() {
    this.emit('destroy');
    this.removeAllListeners();
    this.swig = null;
};