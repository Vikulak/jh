function jh__stringloop (jh) {

    return function jh__stringloop (str, cb) {
        var info = {line: 1, col: 0}, nl, pos, advance = 0;
        var op = {};

        /**
         * Get formatted location
         */
        op.location = function () {
            return info.line + ':' + info.col;
        };

        /**
         * Get position
         */
        op.position = function () {
            return pos;
        }

        /**
         * Report a syntax error
         */
        op.error = function (err, type) {
            err = (type || SyntaxError)(err);
            err.$pos = pos;
            err.$loc = op.location();
            return err;
        };

        /**
         * Advance on any matching substring
         */
        op.match = function (choices, adv) {
            Array.isArray(choices) || (
                choices = [choices]
            );
            for (var i = 0; i < choices.length; i++) {
                var len = choices[i].length;
                if (choices[i] === str.substr(pos, len)) {
                    if (adv !== false) {
                        advance += len;
                    }
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
