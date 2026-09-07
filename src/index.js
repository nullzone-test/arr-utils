/**
 * Flatten a nested array to configurable depth.
 * @param {Array} arr - The array to flatten
 * @param {number} depth - Maximum recursion depth (default: 1)
 * @returns {Array} Flattened array
 */
function flatten(arr, depth = 1) {
  if (!Array.isArray(arr)) throw new TypeError('Expected an array');
  if (depth < 1) return arr.slice();
  const result = [];
  for (const item of arr) {
    if (Array.isArray(item) && depth > 0) {
      result.push(...flatten(item, depth - 1));
    } else {
      result.push(item);
    }
  }
  return result;
}

/**
 * Map each element with fn, then flatten the result one level.
 * @param {Array} arr - The array to map over
 * @param {Function} fn - Mapping function returning an array
 * @returns {Array} Flat-mapped result
 */
function flatMap(arr, fn) {
  if (!Array.isArray(arr)) throw new TypeError('Expected an array');
  if (typeof fn !== 'function') throw new TypeError('Expected a function');
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const mapped = fn(arr[i], i, arr);
    if (Array.isArray(mapped)) {
      result.push(...mapped);
    } else {
      result.push(mapped);
    }
  }
  return result;
}

module.exports = { flatten, flatMap };
