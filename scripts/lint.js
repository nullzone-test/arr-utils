const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', '.lintrc.json');
let config = { tool: 'eslint', args: ['test/'] };

try {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (e) {}

try {
  execSync(`${config.tool} ${config.args.join(' ')}`, {
    stdio: 'pipe', timeout: 60000, cwd: path.join(__dirname, '..')
  });
} catch (e) {}
