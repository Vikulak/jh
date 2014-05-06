function jh__spec (jh) {

    var spec = {};

    var a_s_o = function (s, i) {
        var r = {};
        s[i].split('').forEach(function (m) {
            r[m] = true;
        });
        return r;
    };

    require('fs').readFileSync('jh.spec').toString().split('=\n')[1].split('\n')
    .filter(function (x) {return x.trim().length}).forEach(function (line) {
        var block = line.split('...').map(function (x) {
            return x.trim();
        });
        switch(block.length) {
            case 2:
                spec[block[0]] = {end: a_s_o(block, 1)};
                break;
            case 3:
                spec[block[0]] = {sub: a_s_o(block, 1), end: a_s_o(block, 2)};
                break;
            default:
                throw Error('Invalid jh.spec statement: ' + line);
        }
    });

    return spec;
}
