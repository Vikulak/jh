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
            e.$ = op.info();
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
         * Advance and capture a number of characters
         */
        op.captureCount = function (count) {
            advance += count;
            return str.substr(pos, count);
        };

        /**
         * Capture until a specific match is met
         */
        op.captureUntil = function (matches) {
            Array.isArray(matches) || (
                matches = [matches]
            );
            var found = Infinity;
            for(var i = 0; i < matches.length; i++) {
                var f = str.indexOf(matches[i], pos);
                if (f > -1) {
                    found = Math.min(found, f);
                }
            }

            if (found === Infinity) {
                throw new Error("No termination sequence found for capture");
            }

            advance += found - pos;
            return str.substring(pos + 1, found);
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
