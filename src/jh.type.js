function jh__type (jh) {

    return function jh__type (obj) {
        if (obj === null) {
            return 'null';
        }
        if (typeof obj === 'function') {
            return 'command';
        }
        if (Array.isArray(obj)) {
            return 'array';
        }
        return typeof obj;
    };

}
