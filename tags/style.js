var exports = module.exports;

exports.compile = function(compiler, args, content, parents, options, blockName) {
    content.unshift('<style type="text/javascript">');
    content.push('</style>');
    var code = compiler(content, parents, options, blockName);
    return code;
};

exports.parse = function(str, line, parser, types) {
    return true;
};

exports.ends = true;