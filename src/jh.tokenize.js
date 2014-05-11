function jh__tokenize (jh) {

    return function jh__tokenize (str) {

        /**
         * Tree spec:
         *
         * m: mode
         * o: open
         * _: branches
         * $: information
         */
        var tree = new jh.treestack({'m': 'global', $: {pos: 0, line: 1, col: 1}});

        /**
         * Stringloop
         */
        jh.stringloop(str, function (chr, op) {

            tree.template(
                function () {
                    var location = op.location();
                    return function (x) {
                        return {'m': 'expr', 'o': x, '$': location};
                    };
                }
            );

            /**
             * Options: error open close closeIdentical
             * capture captureWord self restrict
             */
            var key, testSpec, match, content, current = jh.spec[tree.get('m')];

            /**
             * 1 - Check for current close character
             */
            if (current.close) {
                match = op.match(current.close);
                if (match) {
                    return tree.up();
                }
            }

            /**
             * 2 - Check for closeIdentical character
             */
            if (current.closeIdentical) {
                match = op.match(tree.get('o'));
                if (match) {
                    return tree.up();
                }
            }

            /**
             * 3 - Check for new selfs/opens within the current restriction
             */
            Array.isArray(current.allowed) || (
                current.allowed = Object.keys(jh.spec).filter(function (key) {
                    if (current.restrict) {
                        if (current.restrict.indexOf(key) === -1) {
                            return false;
                        }
                    }
                    return jh.spec[key].open || jh.spec[key].self;
                })
            );

            for (var i = 0; i < current.allowed.length; i++) {
                key = current.allowed[i];
                testSpec = jh.spec[key];
                if (testSpec.self) {
                    /**
                     * Capture entire self as a branch and back up again
                     */
                    match = op.match(testSpec.self);
                    if (match) {
                        tree.branch({'m': key, 'o': match, '$': op.info()});
                        return tree.up();
                    }
                }
                else if (testSpec.open) {
                    match = op.match(testSpec.open);
                    if (match) {
                        tree.branch({'m': key, 'o': match, '$': op.info()});

                        /**
                         * Check auto capture
                         */
                        content = null;
                        if (testSpec.capture) {
                            content = op.captureCount(testSpec.capture);
                        }

                        else if (testSpec.captureUntil) {
                            content = op.captureUntil(testSpec.captureUntil);
                        }

                        if (content !== null) {
                            tree.queue(content);
                            tree.up();
                        }

                        return;
                    }
                }
            }

            /**
             * 4 - Check for errors
             */
            if (current.error) {
                match = op.match(current.error);
                if (match) {
                    throw op.error("Unexpected " + match);
                }
            }

            else if (jh.spec.global.error) {
                match = op.match(jh.spec.global.error);
                if (match) {
                    throw op.error("Unexpected " + match);
                }
            }

            /**
             * 5 - Add to queue
             */
            tree.queue(chr);
        });

        /**
         * If the stack is not closed, indicate
         */
        if (tree.currentDepth() > 1) {
            return tree.get('o');
        }

        /**
         * Return the root node
         */
        return tree.valueOf();
    };
}
