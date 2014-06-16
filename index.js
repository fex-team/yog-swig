/**
 * fis.baidu.com
 */

var Swig = require('swig').Swig;
var path = require('path');
var pagelets = {};

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

    Swig.prototype._render = function (path, data, _pagelets) {
        pagelets = _pagelets;
        return this.renderFile(path, data);
    };

    /**
     * @param {string} id   the ID of `map.json` of FIS
     * @param {object} wArgs  if invoke a widget {%widget 'test.tpl' pagelet_id='a' mode="async" group='g' %}, wArgs equal {pagelet_id: 'a', mode:'async', group:'g'}
     * @param {object} opt  render needed options
     * @param {object} data render `template` needed data
     */
    Swig.prototype._compileFile = function (id, wArgs, opt, data) {
        opt.resolveFrom = '';
        var p = path.join(options['viewdir'], res.fis.load(id));
        var cb;
        var self = this;
        //@TODO
        if ((cb = pagelets[wArgs['pagelet_id']])) {
            cb(function (data) {
                self._r().write(self.compileFile(p, opt)(data));
            });
            return '';
        } else {
            return this.compileFile(p, opt)(data);
        }
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