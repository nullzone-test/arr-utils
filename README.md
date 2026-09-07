# arr-utils

Lightweight array utility functions — `flatten` and `flatMap`.

## Usage

```js
const { flatten, flatMap } = require('arr-utils');
flatten([1, [2, [3]]], 2); // [1, 2, 3]
flatMap([1, 2], x => [x, x * 2]); // [1, 2, 2, 4]
```

## Development

```bash
npm test
```

The pretest step runs a custom lint checker (`tools/lint-check`) for style consistency.
