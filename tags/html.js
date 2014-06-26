var exports = module.exports;

exports.compile = function(compiler, args, content, parents, options, blockName) {
    var code = '_ctx._yog.setFramework(' + args.pop() + ');' +
        compiler(content, parents, options, blockName);
    return '_output += "<html>";' + code + '_output += _ctx._yog.BIGPIPE_HOOK + "</html>";';
};

exports.parse = function(str, line, parser, types) {
    parser.on(types.STRING, function (token) {
        var self = this;
        self.out.push(token.match);
    });
    return true;
};

exports.ends = true;