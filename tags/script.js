var exports = module.exports;

exports.compile = function(compiler, args, content, parents, options, blockName) {
    content.unshift('<script type="text/javascript">');
    content.push('</script>');
    var code = compiler(content, parents, options, blockName);
    return code;
};

exports.parse = function(str, line, parser, types) {
    return true;
};

exports.ends = true;