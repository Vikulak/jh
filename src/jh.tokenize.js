function jh__tokenize (jh) {

    return function jh__tokenize (str) {
        var tree = new jh.treestack({m: 'global'});

        /**
         * Stringloop
         */
        jh.stringloop(str, function (chr, op) {
            /**
             * 1 - Check for current close character
             */

            /**
             * 2 - Check for closeIdentical character
             */

            /**
             * 3 - Check for new opens within the current restriction
             */

            /**
             * 4 - Check for new selfs
             */

            /**
             * 5 - Check for errors
             */

            /**
             * Add to queue
             */
        });

        /**
         * If the stack is not closed, indicate
         */
        if (tree.currentDepth() > 0) {
            throw new SyntaxError('Unclosed block');
        }

        /**
         * Return the root node
         */
        return tree.valueOf();
    };
}
