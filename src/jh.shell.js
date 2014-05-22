function jh__shell (jh) {
    return function jh__shell () {

        /**
         * Default Shell Variables
         */
        jh.$shell = jh.fn.defaults(jh.$shell, {
            prompt: {
                in: (function () {
                    return 'jh ▎';
                })(),
                part: (function () {
                    return '   ▎';
                })(),
                out: (function () {
                    return '  ▶▎';
                })(),
                err: (function () {
                    return '  ■▎Error: ';
                })()
            }
        });

        var rl = require('readline').createInterface({
          input: process.stdin,
          output: process.stdout,
          completer: null /* TODO tab completion */
        });

        rl.setPrompt(jh.$shell.prompt.in);
        var buffer = '';
        var more = false;
        var global = {};
        var print = function (x)  {
            console.log(jh.$shell.prompt.out + x);
        };
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
                    rl.setPrompt(jh.$shell.prompt.part + code + ' ∙∙∙ ');
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
                console.error(jh.$shell.prompt.err + e.message);
            }
            rl.setPrompt(jh.$shell.prompt.in);
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
