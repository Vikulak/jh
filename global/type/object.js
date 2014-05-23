module.exports = function type__object (jh) {

    return {

        command: {

            execute: {
                options: {
                    'code': {
                        short: 'c',
                        required: true
                    }
                },
                fn: function (scope, options) {
                    var key, result, stack = [];
                    options.code.forEach(function (code) {
                        switch (code.m) {
                            case 'expr':
                                stack.push(code);
                                return;
                            case 'define':
                                if (!stack.length) {
                                    throw jh.code.error(code, "No key for definition");
                                }
                                key = jh.exec(scope, stack);
                                stack = [];
                            case 'break':
                                if (stack.length) {
                                    result = jh.exec(scope, stack);
                                    stack = [];
                                    if (key) {
                                        scope[key] = result;
                                        key = undefined;
                                    }
                                }
                                return;
                            default:
                                throw jh.code.error(code, "Invalid code type '" + code.m + "' in object");
                        }
                    });
                    return result;
                }
            }

        }

    };

};
