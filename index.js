/**
 * 此插件为 yog-view 的 swig 版本显现。
 * 依赖 yog-view。
 */
var Readable = require('stream').Readable;
var util = require('util');
var Swig = require('swig').Swig;
var loader = require('./lib/loader.js');
var debuglog = require('debuglog')('yog-swig');
var tags = [
    "script",
    "style",
    "html",
    "body",
    "require",
    "uri",
    "widget",
    "head",
    "feature",
    "featureelse",
    "spage"
];

var swigInstance;

/**
 * Opitions 说明
 * - `views` 模板根目录
 * - `loader` 模板加载器，默认自带，可选。
 *
 * 更多细节请查看 yog-view
 *
 */
var SwigWrap = module.exports = function SwigWrap(app, options) {

    if (swigInstance) {
        debuglog('use swig instance cache');
        this.swig = swigInstance;
        return;
    }

    debuglog('init swig instance');

    options = options || {};

    // 重写 loader, 让模板引擎，可以识别静态资源标示。如：example:static/lib/jquery.js
    options.loader = options.loader || loader(app, options.views, options.encoding);

    var swig = this.swig = swigInstance = new Swig(options);

    // 加载内置扩展
    tags.forEach(function (tag) {
        var t = require('./tags/' + tag);
        swig.setTag(tag, t.parse, t.compile, t.ends, t.blockLevel || false);
    });

    // 加载用户扩展
    options.tags && Object.keys(options.tags).forEach(function (name) {
        var t = options.tags[name];
        swig.setTag(name, t.parse, t.compile, t.ends, t.blockLevel || false);
    });

    options.filters && Object.keys(options.filters).forEach(function (name) {
        var t = options.filters[name];
        swig.setFilter(name, t);
    });
};

SwigWrap.prototype.cleanCache = function () {
    this.swig.invalidateCache();
};

SwigWrap.prototype.makeStream = function (view, locals) {
    debuglog('create [%s] render stream', view);
    return new EngineStream(this.swig, view, locals);
};

var EngineStream = function (swig, view, locals) {
    this.swig = swig;
    this.view = view;
    this.locals = locals;
    this.reading = false;
    Readable.call(this);
};

util.inherits(EngineStream, Readable);

EngineStream.prototype._read = function () {
    var self = this;
    var state = self._readableState;
    if (this.reading) {
        return;
    }
    this.reading = true;
    debuglog('start render [%s]', this.view);
    this.swig.renderFile(this.view, this.locals, function (error, output) {
        if (error) {
            debuglog('render [%s] failed', self.view);
            return self.emit('error', error);
        }
        debuglog('render [%s] succ', self.view);
        self.push(output);
        self.push(null);
    });
};

// 扩展swig内置函数，用于提供bigpipe支持
Swig.prototype._w = Swig.prototype._widget = function (layer, id, attr, options) {
    var self = this;
    var pathname = layer.resolve(id);

    if (!layer.supportBigPipe() || !attr.mode || attr.mode === 'sync' || layer.isPagelet) {
        layer.load(id);
        return this.compileFile(pathname, options);
    }

    return function (locals) {
        var container = attr['container'] || attr['for'];

        layer.addPagelet({
            container: container,
            model: attr.model,
            id: attr.id,
            mode: attr.mode,
            locals: locals,
            view: pathname,
            viewId: id,

            compiled: function (locals) {
                var fn = self.compileFile(pathname, options);
                locals._yog.load(id);
                return fn.apply(this, arguments);
            }
        });

        return container ? '' : '<div id="' + attr.id + '"></div>';
    };
};