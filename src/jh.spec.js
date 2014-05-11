function jh__spec (jh) {
    var spec = {};

    var def = function (name, opts) {
        opts.name = name; spec[name] = opts; return name;
    };

    /**
     * Allowed spec properties:
     *
     * error            array               Chars that should produce a SyntaxError.
     * open             string OR array     Char(s) that should open this block.
     * close            string OR array     Char(s) that should close this block.
     * closeIdentical   boolean             Close automatically on same sequence as opened with.
     * capture          integer             Capture a number of characters, then close.
     * captureWord      boolean             Capture the next word. Breaks on special chars.
     * self             string              Character to capture.
     * restrict         array               Allow child blocks of these types only.
     */

    def('global',       { error: ['}', ']', ')'] }              );

    def('comment',      { open: '#', close: '\n' }              );

    def('escape',       { open: '\\', capture: 1 }              );

    def('variable',     { open: '$', captureUntil: [
                          '\\', ';', ' ', '\n'
                        ] }                                     );

    def('command',      { open: '=', captureUntil: [
                          '\\', ' ', '\n'
                        ] }                                     );

    def('option',       { open: '-', captureUntil: [
                          '\\', ' ', '\n'
                        ] }                                     );

    def('object',       { open: '{', close: '}' }               );

    def('array',        { open: '[', close: ']' }               );

    def('group',        { open: '(', close: ')' }               );

    def('break',        { self: ',' }                           );

    def('terminate',    { self: ';' }                           );

    def('define',       { self: ':' }                           );

    def('include',      { self: '&' }                           );

    def('string',       { open: ['"""', "'''", '"', "'"],
                          closeIdentical: true,
                          restrict: ['escape', 'variable'] }    );

    return spec;
}
