module.exports = function type__object (jh) {

    return {

        command: {

            execute: {
                options: jh.exec.options,
                fn: function (scope, options) {
                    return jh.exec.fn(scope, options);
                }
            }

        }

    };

};
