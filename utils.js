/**
 * @param  {any} x
 * @returns {boolean} Returns `true` if the argument `x` is `null` or `undefined`, otherwise returns `false`
 */
function nullOrUndefined(x) {
    if (x == null || x == undefined) return true;
    else return false;
}

/**
 * @param  {string} s
 * @param  {strign} c
 * @returns the original string `s` minus any instances of the string `c`
 */
function removeAll(s, c) {
    while (s.includes(c)) s.replace(c, '');
    return s;
}

module.exports = {
    nullOrUndefined,
    removeAll
}