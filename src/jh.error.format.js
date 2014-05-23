function jh__error__format (jh) {
    return function jh__error__format (str, err) {
        return 'ERRRRRRR';
        var ctx = '', w = 10;
        for (var p = pos - w; p <= pos + w; p ++) {
            if (p < 0 || p >= str.length) {
                continue;
            }
            ctx += p === pos ? '⌜' + str[p] + '⌟' : str[p];
        }
        ctx = (pos > w ? '...' : '') + ctx + (pos < str.length - w - 1 ? '...' : '');
        e = (type || SyntaxError)(e + ' near ' + ctx.trim() + ' @ ' + op.location());
    };
}
