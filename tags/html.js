var exports = module.exports;

exports.compile = function(compiler, args, content, parents, options, blockName) {
    var code = (Object.prototype.toString.call(args[0]) === '[object String]' ? '_ctx._yog.setFramework(' + args.shift() + ');' : '') +
        compiler(content, parents, options, blockName);
    var attrs = '';
    args.forEach(function (attr) {
        attrs += attr.k + '=' + attr.v.replace(/"/g, '\'') + ' ';
    });
    return '_output += "<html' + (attrs == '' ? '' : ' ' + attrs.trim()) + '>";' + code + '_output += _ctx._yog.BIGPIPE_HOOK + "</html>";';
};

exports.parse = function(str, line, parser, types) {
    var k, framework;

    parser.on(types.STRING, function(token) {
        if (typeof k == 'undefined') {
            this.out.push(token.match);
            return false;
        }

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