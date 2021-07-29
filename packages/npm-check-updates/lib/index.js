/**
 * NCU Config
 *
 * @see https://github.com/raineorshine/npm-check-updates
 */

const fs = require('fs');

const yarn = fs.existsSync('yarn.lock');
const pnpm = fs.existsSync('pnpm-lock.yaml')

module.exports = {
  upgrade: true,
  packageManager: yarn ? "yarn" : pnpm ? 'pnpm' : 'npm',
  target: "minor",
  reject: ["typescript"],
};
