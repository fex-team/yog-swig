var fs = require('fs'),
    path = require('path');

module.exports = function(app, basepath, encoding) {
    var ret = {};

    encoding = encoding || 'utf8';
    basepath = (basepath) ? path.normalize(basepath) : null;

    ret.resolve = function(to, from) {
        if (!app.fis){
            throw new Error('yog-swig need load fis resource api');
        }

        var resolve = app.fis.resolve(to);

        to = resolve ? path.join(basepath, resolve) : to;

        return to;
    };

    ret.load = function(identifier, cb) {
        if (!fs || (cb && !fs.readFile) || !fs.readFileSync) {
            throw new Error('Unable to find file ' + identifier + ' because there is no filesystem to read from.');
        }


        identifier = ret.resolve(identifier);

        if (cb) {
            fs.readFile(identifier, encoding, cb);
            return;
        }
        return fs.readFileSync(identifier, encoding);
    };

    return ret;
};