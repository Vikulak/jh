function jh__shell (jh) {
    return function jh__shell () {

        /**
         * Default Shell Variables
         */
        jh.$shell = jh.fn.defaults(jh.$shell, {
            colors: {
                in:     jh.colors.grey,
                part:   jh.colors.grey,
                out:    jh.colors.default,
                err:    jh.colors.red
            },
            prompt: {
                in: (function () {
                    return 'jh ┇ ';
                })(),
                part: (function () {
                    return '   ┇ ';
                })(),
                out: (function () {
                    return '  ▶┇ ';
                })(),
                err: (function () {
                    return '  ■┇ Error: ';
                })()
            }
        });

        var rl = require('readline').createInterface({
          input: process.stdin,
          output: process.stdout,
          completer: null /* TODO tab completion */
        });

        /**
         * Adjust prompt length based on color sequences
         */
        var stripColors = function (str) {
            return str.replace(/\033\[[^m]+m/g, '');
        };
        rl._setPrompt = rl.setPrompt;
        rl.setPrompt = function(prompt, length) {
            rl._setPrompt(prompt, length ? length : stripColors(prompt.split(/[\r\n]/).pop()).length);
        };

        rl.setPrompt(jh.style(jh.$shell.prompt.in, jh.$shell.colors.in));
        var buffer = '';
        var more = false;
        var global = {};

        var print = function (x)  {
            console.log(jh.style(jh.$shell.prompt.out + x, jh.$shell.colors.out));
        };

        var print_err = function (x) {
            console.error(jh.style(jh.$shell.prompt.err + x, jh.$shell.colors.err));
        }

        rl.on('line', function (str) {
            if (more) {
                str = buffer + '\n' + str;
                more = false;
            }
            else {
                buffer = '';
            }
            try {
                var code, showTokens = false, showCode = false;

                if (str.substr(0, 2) === 't!') {
                    code = jh.tokenize(str.substr(2));
                    showTokens = true;
                }

                else if (str.substr(0, 2) === 'c!') {
                    code = jh.tokenize(str.substr(2));
                    showCode = true;
                }

                else {
                    code = jh.tokenize(str);
                }

                /**
                 * Accumulate more as needed until all blocks are closed
                 */
                if (typeof code === 'string') {
                    more = true;
                    buffer = str;
                    rl.setPrompt(jh.style(jh.$shell.prompt.part, jh.$shell.colors.part) + code + ' ∙∙∙ ');
                    rl.prompt();
                    return;
                }

                if (showTokens) {
                    print('Tokenized: ' + jh.code.format(code));
                }

                else if (showCode) {
                    print('Raw Code: ' + JSON.stringify(code));
                }

                else {
                    if (code._ && code._.length) {
                        print(jh.command(global, 'execute', {code: code._}));
                    }
                }
            }
            catch (e) {
                print_err(jh.error.format(e));
            }
            rl.setPrompt(jh.style(jh.$shell.prompt.in, jh.$shell.colors.in));
            rl.prompt();
        });
        rl.on('close', function() {
            console.log('');
            print('Exit');
            process.exit(0);
        });
        rl.prompt();
    };
}
