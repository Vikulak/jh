function jh__stringloop (jh) {

    return function jh__stringloop (str, cb) {
        var info = {pos: 0, line: 1, col: 0}, nl, pos;
        var op = {};

        /**
         * Report a syntax error
         */
        op.error = function (e, type) {
            var ctx = '', w = 10;
            for (var p = pos - w; p <= pos + w; p ++) {
                if (p < 0 || p >= str.length) {
                    continue;
                }
                ctx += p === pos ? '' + str[p] + '<--' : str[p];
            }
            ctx = (pos > w ? '...' : '') + ctx + (pos < str.length - w - 1 ? '...' : '');
            e = (type || SyntaxError)(e + ' near ' + ctx + ' @ ' + info.line + ':' + info.col);
            e.$info = JSON.parse(JSON.stringify(info));
            return e;
        };

        /**
         * Loop though string
         */
        for (pos = 0; pos < str.length; pos ++) {

            /**
             * Update line and column info
             */
            if (nl) { info.col = 0; info.line ++; nl = false; }
            info.pos = pos;
            info.col += 1;
            if (str[pos] === '\n') { nl = true; }

            cb(str[pos], op);
        }
    };

}
