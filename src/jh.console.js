function jh__console (jh) {
    return function jh__console () {
        var rl = require('readline').createInterface({
          input: process.stdin,
          output: process.stdout,
          completer: null /* TODO tab completion */
        });
        var defaultPrompt = '[jh] | ';
        rl.setPrompt(defaultPrompt);
        var buffer = '';
        var more = false;
        rl.on('line', function (str) {
            if (more) {
                str = buffer + str;
                more = false;
            }
            else {
                buffer = '';
            }
            try {
                str += '\n';
                var code = jh.parse(str);
                if (typeof code === 'string') {
                    more = true;
                    buffer = str;
                    rl.setPrompt(' ...' + ' ' + code + ' ');
                    rl.prompt();
                    return;
                }
                console.log(jh.formatCode(code));
            }
            catch (e) {
                console.error('[error] ' + e.message);
            }
            rl.setPrompt(defaultPrompt);
            rl.prompt();
        });
        rl.on('close', function() {
          console.log('\nExiting JavaScript Shell');
          //process.exit(0);
        });
        rl.prompt();
    };
}
