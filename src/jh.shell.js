function jh__shell (jh) {
    return function jh__shell () {
        var rl = require('readline').createInterface({
          input: process.stdin,
          output: process.stdout,
          completer: null /* TODO tab completion */
        });
        var defaultPrompt = 'jh ▎';
        rl.setPrompt(defaultPrompt);
        var buffer = '';
        var more = false;
        var global = {};
        var print = function (x)  {
            console.log('  ▶▎' + x);
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
                var code, showTokens = false;

                if (str.substr(0, 2) === 't!') {
                    code = jh.tokenize(str.substr(2));
                    showTokens = true;
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
                    rl.setPrompt('   ▎' + code + ' ∙∙∙ ');
                    rl.prompt();
                    return;
                }

                if (showTokens) {
                    print('Tokenized: ' + jh.code.format(code));
                }

                else {
                    if (code._ && code._.length) {
                        print(jh.command(global, 'execute', {code: code._}));
                    }
                }
            }
            catch (e) {
                console.error('  ■▎Error: ' + e.message);
            }
            rl.setPrompt(defaultPrompt);
            rl.prompt();
        });
        rl.on('close', function() {
          console.log('\n@Exit'.replace('@', defaultPrompt));
          process.exit(0);
        });
        rl.prompt();
    };
}
