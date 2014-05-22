function jh__code__format (jh) {
    return function jh__code__format (code) {
        var str = '(' + code.m + (code.o ? ':' + code.o.replace(/\n/g, '\\n') : '');
        code._ && code._.forEach(function (x) {
            str += ' ' + (typeof x === 'object' ?
                jh.code.format(x) : JSON.stringify(x));
        });
        return str + ')';
    };
}
