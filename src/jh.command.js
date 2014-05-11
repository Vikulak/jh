function jh__command (jh) {

    return function jh__command (scope, name, options) {
        var type = jh.type(scope);
        var module = jh.include('type.' + type);
        if (!module.command || !module.command[name]) {
            throw new Error('Module for type ' + type + ' has no command "' + name + '"');
        }
        var cmdOpts = module.command[name].options;
        var shortIndex = {};

        /**
         * Check for required options
         */
        Object.keys(cmdOpts).forEach(function (key) {
            var short = cmdOpts[key].short;
            shortIndex[short] = key;
            if (cmdOpts[key].required) {
                if (!options[key] && (!short || !options[short])) {
                    throw new Error('Command =type.' + type + '.' + name +
                    ' missing required option: -' + key +
                    (short ? ' (or -' + short + ')' : ''));
                }
            }
        });

        /**
         * Check that all options are valid
         */
        Object.keys(options).forEach(function (key) {
            if (shortIndex[key]) {
                options[shortIndex[key]] = options[key];
                delete options[key];
            }
            if (!cmdOpts[key] && !shortIndex[key]) {
                throw new Error('Command =type.' + type + '.' + name +
                    ' invalid option specified: -' + key);
            }
        });

        /**
         * Execute the command
         */
        return module.command[name].fn(scope, options);
    };

}
