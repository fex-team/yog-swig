var Swig = require('../../');

var r = {
    fis: {

    }
}

var swig = Swig(r);

console.log(swig.run(swig.compile('{%html "ns:static/mod.js"%}{%endhtml%}')))

console.log(r);