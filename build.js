/**
 * [J]avaScript S[h]ell
 * @author Nate Ferrero
 *
 * Build command: node build
 */
var jh_path = './jh.js';

function read (x) {
    return require('fs').readFileSync(x).toString();
}

function write(x, data) {
    return require('fs').writeFileSync(x, data);
}

var main = read('src/main.js')
    .replace(/([^\S\r\n]+)#include\s([\w.]+);/g, function (stmt, space, path) {
        var current = '';
        var lines = path.split('.').map(function (segment) {
            current += current.length ? '.' + segment : segment;
            return space + current + ' || (' + current + ' = {});';
        }).slice(1, -1);
        var str = lines.join('\n') + '\n' + space +
            path + ' = (@)(jh);'.replace('@',
                read('src/' + path + '.js').trim()
                .replace(/\n/g, function (m) {
                    return m + space;
                }));
        return str;
    });

write(jh_path, main);

console.log('[J]avaScript S[h]ell Built successfully!');
