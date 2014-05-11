function jh__tokenize (jh) {

    return function jh__tokenize (str) {

        /**
         * Tree spec:
         *
         * m: mode
         * o: open
         * _: branches
         * $: location
         */
        var tree = new jh.treestack({'m': 'global'});
        var key, testSpec, match, capture = 0, current;

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
             * If a capture is in operation, do that before normal process
             */
            if (capture > 0) {
                tree.queue(chr);
                capture --;
                if (capture === 0) {
                    tree.up();
                }
                return;
            }

            /**
             * Options: error open close closeIdentical
             * capture until self restrict
             */
            current = jh.spec[tree.get('m')];

            /**
             * 0 - Check for current until sequence(s)
             */
            if (current.until) {
                match = op.match(current.until, false);
                if (match) {
                    tree.up(); // no return here
                    current = jh.spec[tree.get('m')];
                }
            }

            /**
             * 1 - Check for current close sequence(s)
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
                        tree.branch({'m': key, 'o': match, '$': op.location()});
                        return tree.up();
                    }
                }
                else if (testSpec.open) {
                    match = op.match(testSpec.open);
                    if (match) {
                        tree.branch({'m': key, 'o': match, '$': op.location()});

                        if (testSpec.capture) {
                            capture = testSpec.capture;
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

        current = jh.spec[tree.get('m')];

        /**
         * If ending where a \n will close, do it
         */
        if (current.until && current.until.indexOf('\n') !== -1) {
            tree.up();
        }

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
