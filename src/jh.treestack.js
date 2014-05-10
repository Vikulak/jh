function jh__treestack (jh) {

    var jh__treestack = function jh__treestack (root) {

        this.tree = root;
        this.stack = [root];

    };

    (function (ts) {

        ts.currentDepth = function currentDepth () {
            return this.stack.length - 1;
        };

        ts.valueOf = function valueOf () {
            return this.tree;
        };

    })(jh__treestack.prototype);
    
    return jh__treestack;
}
