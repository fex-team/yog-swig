var exports = module.exports;

exports.compile = function(compiler, args, content, parents, options, blockName) {
    var code = 'var _res = _swig._r(); _res.fis.addScript((function () { var _output = "";'
        + compiler(content, parents, options, blockName)
        + ' return _output; })());';
    return code;
};

exports.parse = function(str, line, parser, types) {
    return true;
};

exports.ends = true;