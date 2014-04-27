/**
 * [J]avaScript S[h]ell
 * @author Nate Ferrero
 */
module.exports = (function (jh) {
    generateSpec();

    return jh;

    function generateSpec () {
        jh.spec = {};
        require('fs').readFileSync('jh.spec').toString().split('=\n')[1].split('\n')
        .filter(function (x) {return x.trim().length}).forEach(function (line) {
            var spec = line.split('...').map(function (x) {
                return x.trim();
            });
            switch(spec.length) {
                case 2:
                    jh.spec[spec[0]] = {end: spec[1]};
                    break;
                case 3:
                    jh.spec[spec[0]] = {sub: spec[1], end: spec[2]};
                    break;
                default:
                    throw Error('Invalid jh.spec statement: ' + line);
            }
        });
    }
})({});

console.log(module.exports);