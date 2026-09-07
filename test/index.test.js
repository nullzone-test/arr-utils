'use strict';
const assert = require('assert');
const { flatten, flatMap } = require('../src');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try { fn(); passed++; } catch (e) { failed++; console.error(`FAIL: ${name}: ${e.message}`); }
}

test('flatten basic', () => assert.deepStrictEqual(flatten([1, [2, 3]]), [1, 2, 3]));
test('flatten depth 2', () => assert.deepStrictEqual(flatten([1, [2, [3, [4]]]], 2), [1, 2, 3, [4]]));
test('flatten depth 0', () => assert.deepStrictEqual(flatten([1, [2]], 0), [1, [2]]));
test('flatten Infinity', () => assert.deepStrictEqual(flatten([1, [2, [3]]], Infinity), [1, 2, 3]));
test('flatten throws on non-array', () => assert.throws(() => flatten('nope'), TypeError));
test('flatMap basic', () => assert.deepStrictEqual(flatMap([1, 2, 3], x => [x, x * 2]), [1, 2, 2, 4, 3, 6]));
test('flatMap split', () => assert.deepStrictEqual(flatMap(['ab', 'cd'], s => s.split('')), ['a', 'b', 'c', 'd']));
test('flatMap identity', () => assert.deepStrictEqual(flatMap([[1], [2]], x => x), [1, 2]));

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
console.log('All tests passed ✓');
