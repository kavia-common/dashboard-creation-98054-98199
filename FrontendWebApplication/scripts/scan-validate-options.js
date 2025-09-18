#!/usr/bin/env node
/**
 * PUBLIC_INTERFACE
 * Scan node_modules for references to the deprecated 'validateOptions' symbol.
 * This helps identify any rogue packages still calling the old API.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(process.cwd(), 'node_modules');
let hits = [];

function scanDir(dir) {
  let entries = [];
  try {
    entries = fs.readdirSync(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    const p = path.join(dir, name);
    let stat;
    try { stat = fs.statSync(p); } catch { continue; }
    if (stat.isDirectory()) {
      if (name === '.bin') continue;
      scanDir(p);
    } else if (stat.isFile()) {
      if (name.endsWith('.js') || name.endsWith('.mjs') || name.endsWith('.cjs')) {
        try {
          const text = fs.readFileSync(p, 'utf8');
          if (text.includes('validateOptions(')) {
            hits.push(p);
          }
        } catch {}
      }
    }
  }
}

console.log('Scanning node_modules for validateOptions(...) usage...');
scanDir(ROOT);
if (hits.length) {
  console.log('Found references to validateOptions in:');
  for (const h of hits) console.log('-', h);
  // Do not fail hard; provide info for CI logs
  process.exitCode = 0;
} else {
  console.log('No direct validateOptions references found.');
}
