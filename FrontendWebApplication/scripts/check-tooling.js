#!/usr/bin/env node
const { createRequire } = require('module');
const requireFromApp = createRequire(process.cwd() + '/');

function safeVersion(name) {
  try {
    const pkg = requireFromApp(`${name}/package.json`);
    return `${name}@${pkg.version}`;
  } catch (e) {
    return `${name}@<not found>`;
  }
}

const targets = [
  'react-scripts',
  'webpack',
  'terser-webpack-plugin',
  'schema-utils',
  'babel-loader',
  'ajv',
  'ajv-keywords'
];

console.log('Resolved tooling versions:');
for (const t of targets) console.log('-', safeVersion(t));
