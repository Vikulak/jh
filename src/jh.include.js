function jh__include (jh) {

    return function jh__include (name) {
        var module = require(__dirname + '/global/' + name.replace(/\./g, '/') + '.js');
        if (!module) {
            throw new Error('Module not found: ' + name);
        }
        return module(jh);
    };

}
