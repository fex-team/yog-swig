var exports = module.exports;

/**
 * @alias body
 * @example
 * {%body%} something the page partial {%/body%}
 */

exports.compile = function(compiler, args, content, parents, options, blockName) {
    var code = compiler(content, parents, options, blockName);
    return '_output += "<body>";' + code + '_output += _ctx._yog.JS_HOOK + "</body>" + _ctx._yog.BIGPIPE_HOOK;';
};

exports.parse = function() {
    return true;
};

exports.ends = true;