function jh__colors (jh) {

    jh.style = function (/* str, ... */) {
        var args = Array.prototype.slice.call(arguments);
        var str = args.shift();
        args.forEach(function (style) {
            if (Array.isArray(style) && style.length === 2) {
                str = style[0] + str + style[1];
            }
        });
        return str;
    };

    return {
        // Adapted from https://github.com/Marak/colors.js/blob/master/colors.js

        'default'       : ['', ''],

        // Styles

        'bold'          : ['\033[1m',  '\033[22m'],
        'italic'        : ['\033[3m',  '\033[23m'],
        'underline'     : ['\033[4m',  '\033[24m'],
        'inverse'       : ['\033[7m',  '\033[27m'],
        'strikethrough' : ['\033[9m',  '\033[29m'],

        // Text colors

        // Grayscale
        'white'         : ['\033[37m', '\033[39m'],
        'grey'          : ['\033[90m', '\033[39m'],
        'black'         : ['\033[30m', '\033[39m'],

        // Colors
        'blue'          : ['\033[34m', '\033[39m'],
        'cyan'          : ['\033[36m', '\033[39m'],
        'green'         : ['\033[32m', '\033[39m'],
        'magenta'       : ['\033[35m', '\033[39m'],
        'red'           : ['\033[31m', '\033[39m'],
        'yellow'        : ['\033[33m', '\033[39m'],

        // Background colors

        // Grayscale
        'whiteBG'       : ['\033[47m',      '\033[49m'],
        'greyBG'        : ['\033[49;5;8m',  '\033[49m'],
        'blackBG'       : ['\033[40m',      '\033[49m'],

        // Colors
        'blueBG'        : ['\033[44m', '\033[49m'],
        'cyanBG'        : ['\033[46m', '\033[49m'],
        'greenBG'       : ['\033[42m', '\033[49m'],
        'magentaBG'     : ['\033[45m', '\033[49m'],
        'redBG'         : ['\033[41m', '\033[49m'],
        'yellowBG'      : ['\033[43m', '\033[49m']
    };
}
