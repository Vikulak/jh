Jolt Language Specification
@author Nate Ferrero

This File Format:

    X ... Z             X begins and Z terminates
    X ... Y ... Z       X begins, Y branches, and Z terminates

Meaningful characters:

    A: any character (initial state)
    N: newline
    W: word boundary

========================================

A ... \':=-$&{[(# ... ,N

\ ... A

' ... \$ ... '

: ... \'=-${[(# ... ,N

= ... \' ... W
- ... \' ... W
$ ... \' ... W
& ... \' ... W

{ ... A ... }
[ ... A ... ]
( ... A ... )

# ... N