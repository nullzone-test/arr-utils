const { flatten } = require('../src/index');

let passed = 0, failed = 0;
function assert(cond, msg) {
  if (cond) { passed++; } else { failed++; console.error('FAIL:', msg); }
}
function eq(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

assert(eq(flatten([1, [2, 3]]), [1, 2, 3]), 'depth 1');
assert(eq(flatten([1, [2, [3, [4]]]], 2), [1, 2, 3, [4]]), 'depth 2');
assert(eq(flatten([1, [2, [3]]], Infinity), [1, 2, 3]), 'infinite');
try { flatten('nope'); assert(false, 'should throw'); } catch(e) { assert(e instanceof TypeError, 'type error'); }

console.log(`${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
console.log('All tests passed ✓');
