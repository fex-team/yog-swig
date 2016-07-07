var ATTRS = ['id', 'mode', 'group', 'for', 'model', 'lazy', 'cache'];

exports.compile = function (compiler, args, content, parents, options, blockName) {
    var attr = {};
    for (var i = 0; i < args.length; i++) {
        attr[args[i].k] = args[i].v;
    }
    attr.mode = attr.mode || 'async';
    var compiledContent = compiler(content, parents, options, blockName);
    var output = '_output += _swig._w(_ctx._yog, function(_ctx) { var _output = ""; ' + compiledContent +
        ';return _output;}, ' + JSON.stringify(attr) + ', ' + JSON.stringify(options) + ')(_ctx);';
    return output;
};

exports.parse = function (str, line, parser, types) {
    var k;

    parser.on(types.STRING, function (token) {
        var out = {
            v: '',
            k: ''
        };

        if (~ATTRS.indexOf(k)) {
            out.v = token.match.replace(/^("|')?(.*)\1$/g, '$2');
            out.k = k;
            this.out.push(out);
            k = ''; // reset
        }
    });

    parser.on(types.VAR, function (token) {
        if (~ATTRS.indexOf(token.match)) {
            k = token.match;
            return false;
        }
        return true;
    });
    return true;
};

exports.ends = true;
