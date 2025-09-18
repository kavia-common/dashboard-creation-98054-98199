#!/usr/bin/env node
/**
 * Patch package-lock.json to enforce webpack toolchain compatibility for react-scripts@5:
 * - schema-utils@3.x (3.3.0)
 * - terser-webpack-plugin@5.x (5.3.10)
 * - ajv@6.x (6.12.6) and ajv-keywords@3.x (3.5.2)
 *
 * This mitigates build error: "(0 , _schemaUtils.validate) is not a function"
 */
const fs = require('fs');
const path = require('path');

const lockPath = path.join(process.cwd(), 'package-lock.json');
if (!fs.existsSync(lockPath)) {
  process.exit(0);
}

try {
  const raw = fs.readFileSync(lockPath, 'utf8');
  const json = JSON.parse(raw);

  const forceVersions = {
    'schema-utils': '3.3.0',
    'terser-webpack-plugin': '5.3.10',
    'ajv': '6.12.6',
    'ajv-keywords': '3.5.2'
  };

  // npm v7+ uses "packages" and "dependencies" sections
  const bump = (obj, name, version) => {
    if (!obj) return;
    Object.keys(obj).forEach((k) => {
      if (k === name || k.endsWith(`node_modules/${name}`)) {
        const entry = obj[k];
        if (entry && typeof entry === 'object') {
          if (entry.version && entry.version !== version) {
            entry.version = version;
          }
          if (entry.resolved && typeof entry.resolved === 'string') {
            // keep resolved as-is; npm will re-resolve on fresh install if needed
          }
        }
      }
    });
  };

  // Traverse and update
  for (const [name, ver] of Object.entries(forceVersions)) {
    if (json.packages) bump(json.packages, name, ver);
    if (json.dependencies && json.dependencies[name]) {
      json.dependencies[name].version = ver;
      if (json.dependencies[name].requires) {
        // Ensure ajv chain for schema-utils v3
        if (name === 'schema-utils') {
          json.dependencies[name].requires.ajv = '6.12.6';
        }
      }
    }
  }

  fs.writeFileSync(lockPath, JSON.stringify(json, null, 2));
  console.log('package-lock.json patched for webpack toolchain compatibility.');
} catch (e) {
  console.warn('patch-lock.js warning:', e.message);
  process.exit(0);
}
