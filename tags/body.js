var exports = module.exports;

/**
 * @alias body
 * @example
 * {%body%} something the page partial {%/body%}
 */

exports.compile = function(compiler, args, content, parents, options, blockName) {
    var attrs = '';
    args.forEach(function (attr) {
        attrs += attr.k + '=' + attr.v.replace(/"/g, '\'') + ' ';
    });
    var code = compiler(content, parents, options, blockName);
    return '_output += "<body'+ (attrs == '' ? '' : ' ' + attrs.trim()) +'>";' + code + '_output += _ctx._yog.JS_HOOK + "</body>";';
};

exports.parse = function(str, line, parser, types, stack, opts) {
    var k;
    parser.on(types.STRING, function(token) {
        if (k === '') {
            throw new Error('Unexpected on line ' + line + '.');
        }
        this.out.push({
            k: k,
            v: token.match
        });
        k = '';
    });

    parser.on(types.NUMBER, function (token) {
        if (k === '') {
            throw new Error('Unexpected on line ' + line + '.');
        }
        this.out.push({
            k: k,
            v: token.match
        });
        k = '';
    });

    parser.on(types.VAR, function(token) {
        k = token.match;
        return false;
    });
    return true;
};

exports.ends = true;