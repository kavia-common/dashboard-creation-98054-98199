#!/usr/bin/env node
/**
 * PUBLIC_INTERFACE
 * Log resolved versions of babel-loader and schema-utils at runtime.
 */
const { createRequire } = require('module');
const req = createRequire(process.cwd() + '/');

function safe(name) {
  try {
    const v = req(`${name}/package.json`).version;
    return `${name}@${v}`;
  } catch {
    return `${name}@<not found>`;
  }
}

console.log('[tooling] resolved:', safe('babel-loader'), ',', safe('schema-utils'));
