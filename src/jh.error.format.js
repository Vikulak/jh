function jh__error__format (jh) {
    return function jh__error__format (str, err) {
        var ctx = '', w = 10, pos = err.$pos;
        for (var p = pos - w; p <= pos + w; p ++) {
            if (p < 0 || p >= str.length) {
                continue;
            }
            var _L = jh.colors.inverse[0];
            var _R = jh.colors.inverse[1];
            ctx += p === pos ? _L + str[p] + _R : str[p];
        }
        ctx = (pos > w ? '...' : '') + ctx + (pos < str.length - w - 1 ? '...' : '');
        return err.constructor(err.message + ' near ' + ctx.trim() + ' @ ' + err.$loc);
    };
}
