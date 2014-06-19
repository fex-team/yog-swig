var exports = module.exports;

exports.compile = function(compiler, args, content, parents, options, blockName) {
    content.unshift('<html>');
    content.push('</html>');
    var code = '_ctx._yog.setFramework(_ctx._yog.getUri(' + args.pop() + '));' +
        compiler(content, parents, options, blockName);
    return code;
};

exports.parse = function(str, line, parser, types) {
    parser.on(types.STRING, function (token) {
        var self = this;
        self.out.push(token.match);
    });
    return true;
};

exports.ends = true;