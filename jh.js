/**
 * [J]avaScript S[h]ell
 * @author Nate Ferrero
 */
module.exports = (function (jh) {
    doSpec();
    doParse();
    doFormatCode();
    doConsole();

    return jh;

    function doConsole () {
        jh.console = function () {
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

    function doFormatCode () {
        jh.formatCode = function (code) {
            var str = '("' + code.m + '"';
            code.c && code.c.forEach(function (x) {
                str += ' ' + (typeof x === 'object' ?
                    jh.formatCode(x) : JSON.stringify(x));
            });
            return str + ')';
        };
    }

    function doParse () {

        var check = function (valid, char) {
            if (!valid) {
                return;
            }
            if (valid['E']) {
                return {m: 'E'};
            }
            else if (valid['X']) {
                return {m: 'X'};
            }
            else if (valid[char] && !/[A-Z]/.test(char)) {
                return {m: char};
            }
            else if (valid['N'] && char === '\n') {
                return {m: 'N'};
            }
            else if (valid['W'] && !/[a-zA-Z0-9_\-\.]/.test(char)) {
                return {m: 'W'};
            }
            else if (valid['A']) {
                return {m: 'A'};
            }
        };

        var leaf = function (tree, x) {
            Array.isArray(tree.c) || (tree.c = []);
            tree.c.push(x);
            return x;
        };

        var flush = function (tree) {
            if (typeof tree.q === 'string' && tree.q.length) {
                leaf(tree, tree.q);
            }
            delete(tree.q);
        };

        var up = function (stack) {
            stack.pop();
            if (!stack.length) {
                throw new Error('No more items on stack');
            }
            return stack[stack.length - 1];
        };

        var queue = function (tree, x) {
            typeof tree.q === 'string' || (tree.q = '');
            tree.q += x;
        };

        jh.parse = function (str) {
            var tree = {m: 'A', c: []}, stack = [tree];
            var info = {pos: 0, line: 1, col: 0}, nl, pos;

            var err = function (e) {
                var ctx = '', w = 10;
                for (var p = pos - w; p <= pos + w; p ++) {
                    if (p < 0 || p >= str.length) {
                        continue;
                    }
                    ctx += p === pos ? '' + str[p] + '<--' : str[p];
                }
                ctx = (pos > w ? '...' : '') + ctx + (pos < str.length - w - 1 ? '...' : '');
                e = Error(e + ' near ' + ctx + ' @ ' + info.line + ':' + info.col);
                e.$info = JSON.parse(JSON.stringify(info));
                return e;
            };

            next:
            for (pos = 0; pos < str.length; pos ++) {

                /**
                 * Update line and column info
                 */
                if (nl) { info.col = 0; info.line ++; nl = false; }
                info.pos = pos;
                info.col += 1;
                if (str[pos] === '\n') { nl = true; }

                /**
                 * Check for valid syntax
                 */
                if (!tree || !jh.spec[tree.m]) {
                    throw err('Invalid syntax');
                }

                /**
                 * Check for ends
                 */
                var end = check(jh.spec[tree.m].end, str[pos]);
                if (end) {
                    if (end.m === 'A') {
                        queue(tree, str[pos]);
                    }
                    flush(tree);
                    tree = up(stack);
                    switch (end.m) {
                        case 'W':
                            // allow new sub immediately
                            break;
                        default:
                            continue next;
                    }
                }

                /**
                 * Check for subs
                 */
                var sub = check(jh.spec[tree.m].sub, str[pos]);
                if (sub) {
                    if (sub.m === 'E' || sub.m === 'X') {
                        throw err('Invalid character');
                    }

                    /**
                     * Handle instant-ends
                     */
                    var iend = check(jh.spec[sub.m].end, str[pos]);
                    if (iend) {
                        if (iend.m === 'X') {
                            flush(tree);
                            continue next;
                        }
                        if (iend.m === 'E') {
                            flush(tree);
                            if (check(jh.spec[tree.m].end, str[pos])) {
                                tree = up(stack);
                                continue next;
                            }
                            else {
                                throw err('Invalid character');
                            }
                        }
                    }

                    flush(tree);
                    stack.push(sub);
                    tree = leaf(tree, sub);
                    continue next;
                }

                /**
                 * Add to queue
                 */
                queue(tree, str[pos]);
            }

            /**
             * If the stack is not closed, indicate
             */
            if (stack.length > 1) {
                return stack[stack.length - 1].m;
            }

            /**
             * Return the root node
             */
            flush(tree);
            return tree;
        };
    }

    function doSpec () {
        jh.spec = {};
        var a_s_o = function (s, i) {
            var r = {};
            s[i].split('').forEach(function (m) {
                r[m] = true;
            });
            return r;
        };
        require('fs').readFileSync('jh.spec').toString().split('=\n')[1].split('\n')
        .filter(function (x) {return x.trim().length}).forEach(function (line) {
            var spec = line.split('...').map(function (x) {
                return x.trim();
            });
            switch(spec.length) {
                case 2:
                    jh.spec[spec[0]] = {end: a_s_o(spec, 1)};
                    break;
                case 3:
                    jh.spec[spec[0]] = {sub: a_s_o(spec, 1), end: a_s_o(spec, 2)};
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