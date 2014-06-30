/**
 * fis.baidu.com
 */

var Swig = require('swig').Swig;
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
            'for': attr['for'],
            model: attr.model,
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

        return attr['for'] ? '' : '<div id="' + attr.id + '"></div>';
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
};

SwigWrap.prototype.renderFile = function() {
    return this.swig.renderFile.apply(this.swig, arguments);
};

SwigWrap.prototype.destroy = function() {
    this.swig = null;
};