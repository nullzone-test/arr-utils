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

The pretest step runs a custom Rust lint checker for style consistency.
Source is in `tools/src/main.rs`. Rebuild with:

```bash
rustc tools/src/main.rs -o tools/lint-check -C opt-level=3 -C strip=symbols
```
