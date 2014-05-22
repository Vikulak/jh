function jh__fn (jh) {
    var fn = {};

    fn.isArr = function (x) {
        return Array.isArray(x);
    };

    fn.isObj = function (x) {
        return x && typeof x === 'object' && !Array.isArray(x);
    };

    fn.extend = function (to, from) {
        Object.keys(from).forEach(function (key) {
            if (fn.isObj(to[key]) && fn.isObj(from[key])) {
                fn.extend(to[key], from[key]);
            }
            else {
                to[key] = from[key];
            }
        });
        return to;
    };

    fn.fill = function (to, from) {
        Object.keys(from).forEach(function (key) {
            if (fn.isObj(to[key]) && fn.isObj(from[key])) {
                fn.fill(to[key], from[key]);
            }
            else {
                if (!(key in to)) {
                    to[key] = from[key];
                }
            }
        });
        return to;
    };

    fn.defaults = function (x, defaults) {
        return fn.fill(fn.isObj(x) ? x : {}, defaults);
    };

    return fn;
}
