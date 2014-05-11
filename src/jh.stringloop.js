function jh__stringloop (jh) {

    return function jh__stringloop (str, cb) {
        var info = {pos: 0, line: 1, col: 0}, nl, pos, advance = 0;
        var op = {};

        /**
         * Copy info
         */
        op.info = function () {
            return JSON.parse(JSON.stringify(info));
        };

        /**
         * Get formatted location
         */
        op.location = function () {
            return info.line + ':' + info.col;
        };

        /**
         * Report a syntax error
         */
        op.error = function (e, type) {
            var ctx = '', w = 10;
            for (var p = pos - w; p <= pos + w; p ++) {
                if (p < 0 || p >= str.length) {
                    continue;
                }
                ctx += p === pos ? '⌜' + str[p] + '⌟' : str[p];
            }
            ctx = (pos > w ? '...' : '') + ctx + (pos < str.length - w - 1 ? '...' : '');
            e = (type || SyntaxError)(e + ' near ' + ctx.trim() + ' @ ' + op.location());
            e.$info = op.info();
            return e;
        };

        /**
         * Advance on any matching substring
         */
        op.match = function (choices) {
            Array.isArray(choices) || (
                choices = [choices]
            );
            for (var i = 0; i < choices.length; i++) {
                var len = choices[i].length;
                if (choices[i] === str.substr(pos, len)) {
                    advance += len;
                    return choices[i];
                }
            }
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

            if (advance == 1) {
                advance = 0; // since the pos++ happens in the for loop
            }

            if (advance > 0) {
                advance --;
                continue;
            }

            cb(str[pos], op);
        }
    };

}
