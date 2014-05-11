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
                    return JSON.stringify(options.code);
                }
            }

        }

    };

};
