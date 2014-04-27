/**
 * [J]avaScript S[h]ell
 * @author Nate Ferrero
 */
module.exports = (function (jh) {
    doSpec();
    doParse();
    doConsole();

    return jh;

    function doConsole () {
        jh.console = function () {
            var readline = require('readline');
            var rl = readline.createInterface({
              input: process.stdin,
              output: process.stdout,
              completer: null /* TODO tab completion */
            });
            rl.setPrompt('jh | ');
            rl.on('line', function (str) {
                var code = jh.parse(str);
                console.log(code);
                rl.prompt();
            });
            rl.on('close', function() {
              console.log('\nExiting JavaScript Shell');
              //process.exit(0);
            });
            rl.prompt();
        };
    }

    function doParse () {
        jh.parse = function (str) {
            var tree = {m: 'A', c: [], q: ''}, stack = [tree], i, n;

            next:
            for (var pos = 0; pos < str.length; pos ++) {
                /**
                 * Check for valid syntax
                 */
                if (!jh.spec[tree.m]) {
                    throw Error('Invalid syntax at position ' + pos);
                }

                /**
                 * Check for subs
                 */
                if(jh.spec[tree.m].sub) {
                    var sub = false;
                    for (i = 0; i <= jh.spec[tree.m].sub.length; i ++) {
                        var subMode = jh.spec[tree.m].sub[i];
                        switch (subMode) {
                            case 'A':
                                sub = true;
                                break;
                            case 'N':
                                sub = str[pos] === '\n';
                                break;
                            case 'W':
                                sub = !/[a-zA-Z0-9_\-\.]/.test(str[pos]);
                                break;
                        }
                        if (sub) {
                            n = {m: subMode, c: [], q: ''};
                            tree.c.push(tree.q);
                            tree.q = '';
                            tree.c.push(n);
                            stack.push(n);
                            continue next;
                        }
                    }
                }

                /**
                 * Check for ends
                 */
                if(jh.spec[tree.m].end) {
                    var end = false;
                    for (i = 0; i <= jh.spec[tree.m].end.length; i ++) {
                        var endMode = jh.spec[tree.m].end[i];
                        switch (endMode) {
                            case 'A':
                                end = true;
                                break;
                            case 'N':
                                end = str[pos] === '\n';
                                break;
                            case 'W':
                                end = !/[a-zA-Z0-9_\-\.]/.test(str[pos]);
                                break;
                        }
                        if (end) {
                            n = {m: endMode, c: [], q: ''};
                            tree.c.push(tree.q);
                            tree.q = '';
                            if (stack.length < 1) {
                                throw Error('Invalid syntax at position ' + pos);
                            }
                            stack.pop();
                            tree = stack[stack.length - 1];
                            continue next;
                        }
                    }
                }

                /**
                 * Add to queue
                 */
                tree.q += str[pos];
            }
            return stack[0];
        };
    }

    function doSpec () {
        jh.spec = {};
        require('fs').readFileSync('jh.spec').toString().split('=\n')[1].split('\n')
        .filter(function (x) {return x.trim().length}).forEach(function (line) {
            var spec = line.split('...').map(function (x) {
                return x.trim();
            });
            switch(spec.length) {
                case 2:
                    jh.spec[spec[0]] = {end: spec[1].split('')};
                    break;
                case 3:
                    jh.spec[spec[0]] = {sub: spec[1].split(''), end: spec[2].split('')};
                    break;
                default:
                    throw Error('Invalid jh.spec statement: ' + line);
            }
        });
    }
})({});

/**
 * Start the console
 */
module.exports.console();