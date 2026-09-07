'use strict';

function flatten(arr, depth = 1) {
  if (!Array.isArray(arr)) throw new TypeError('Expected an array');
  if (depth <= 0) return arr.slice();
  return arr.reduce((acc, val) => {
    if (Array.isArray(val) && depth > 0) {
      acc.push(...flatten(val, depth - 1));
    } else {
      acc.push(val);
    }
    return acc;
  }, []);
}

function flatMap(arr, fn) {
  if (!Array.isArray(arr)) throw new TypeError('Expected an array');
  if (typeof fn !== 'function') throw new TypeError('Expected a function');
  return flatten(arr.map(fn), 1);
}

module.exports = { flatten, flatMap };
