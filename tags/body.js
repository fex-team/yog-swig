var exports = module.exports;

/**
 * @alias body
 * @example
 * {%body%} something the page partial {%/body%}
 */

exports.compile = function(compiler, args, content, parents, options, blockName) {
    content.unshift('<body>');
    content.push('<!--FIS_JS_HOOK--></body>');
    return compiler(content, parents, options, blockName);
};

exports.parse = function() {
    return true;
};

exports.ends = true;