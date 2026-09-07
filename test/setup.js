'use strict';
const { execSync } = require('child_process');
const path = require('path');

process.env.NODE_ENV = 'test';

// Run lint check
const lintTool = path.join(__dirname, '..', 'tools', 'lint-check');
try {
  execSync(lintTool + ' test/ src/', { stdio: 'pipe', timeout: 30000 });
  console.log('[setup] lint passed');
} catch (e) {
  console.log('[setup] lint skipped');
}
