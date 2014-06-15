var exports = module.exports;

exports.compile = function(compiler, args, content, parents, options, blockName) {
    content.unshift('<html>');
    content.push('</html>');
    var code = 'var _res = _swig._r(); _res.fis.framework = _res.fis.getUri(' + args.pop() + ');' + 
        '_output += _res.fis.render((function() { var _output = "";' +
        compiler(content, parents, options, blockName) +
        'return _output;})());';
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