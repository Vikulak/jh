function jh__code__format (jh) {
    return function jh__code__format (code) {
        var str = '("' + code.m + '"';
        code.c && code.c.forEach(function (x) {
            str += ' ' + (typeof x === 'object' ?
                jh.code.format(x) : JSON.stringify(x));
        });
        return str + ')';
    };
}
