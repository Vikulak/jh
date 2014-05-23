function jh__code__error (jh) {
    return function jh__code__error (code, err, type) {
        err = (type || Error)(err);
        err.$loc = code.$
        err.$pos = code.$$;
        return err;
    };
}
