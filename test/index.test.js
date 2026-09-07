const { flatten, flatMap } = require('../src/index');

let passed = 0, failed = 0;
function assert(cond, msg) {
  if (cond) { passed++; } else { failed++; console.error('FAIL:', msg); }
}
function eq(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

assert(eq(flatten([1, [2, 3]]), [1, 2, 3]), 'depth 1');
assert(eq(flatten([1, [2, [3, [4]]]], 2), [1, 2, 3, [4]]), 'depth 2');
assert(eq(flatten([1, [2, [3]]], Infinity), [1, 2, 3]), 'infinite');
assert(eq(flatMap([1, 2, 3], x => [x, x * 2]), [1, 2, 2, 4, 3, 6]), 'flatMap basic');
assert(eq(flatMap(['hello world'], x => x.split(' ')), ['hello', 'world']), 'flatMap split');
assert(eq(flatMap([1, 2], x => x), [1, 2]), 'flatMap identity');
try { flatten('nope'); assert(false, 'throw'); } catch(e) { assert(e instanceof TypeError, 'flatten type'); }
try { flatMap([1], 'nope'); assert(false, 'throw'); } catch(e) { assert(e instanceof TypeError, 'flatMap type'); }

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
console.log('All tests passed ✓');
