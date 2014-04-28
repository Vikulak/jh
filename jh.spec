Jolt Language Specification
@author Nate Ferrero

This File Format:

    X ... Z             X begins and Z terminates
    X ... Y ... Z       X begins, Y branches, and Z terminates

Meaningful characters:

    N: newline
    W: word boundary
    A: any character (initial state)

Only valid as a terminator:

    E: Ends the parent block if the character is a valid end for that block
    X: Fake end, does not move up stack, but may be used as a separator

========================================

, ... X
N ... X
W ... E
A ... \':=-$&{[(#}]),N ...

\ ... A

' ... \$ ... '

: ... \'=-${[(# ... }]),N

} ... E
] ... E
) ... E

= ... \' ... W
- ... \' ... W
$ ... \' ... W
& ... \' ... W

{ ... \':=-$&{[(#}]),N ... }
[ ... \':=-$&{[(#}]),N ... ]
( ... \':=-$&{[(#}]),N ... )

# ... N