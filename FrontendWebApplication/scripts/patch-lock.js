#!/usr/bin/env node
/**
 * Patch package-lock.json to enforce webpack toolchain compatibility for react-scripts@5:
 * - schema-utils@2.x (2.6.5) for babel-loader 8.2.2 compatibility
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
    'schema-utils': '2.6.5',
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

  // Extra hardening: if any nested entry accidentally resolved schema-utils >=4,
  // coerce it back to 2.6.5 so babel-loader 8.2.2 remains compatible.
  const coerceSchemaUtils = (obj) => {
    if (!obj) return;
    Object.keys(obj).forEach((k) => {
      if (k === 'schema-utils' || k.endsWith('node_modules/schema-utils')) {
        const entry = obj[k];
        if (entry && typeof entry === 'object') {
          const v = entry.version;
          if (typeof v === 'string') {
            const major = parseInt((v.match(/^(\d+)\./) || [])[1] || '0', 10);
            if (!major || major >= 4) {
              entry.version = '2.6.5';
            }
          } else {
            entry.version = '2.6.5';
          }
        }
      }
    });
  };
  coerceSchemaUtils(json.packages);
  if (json.dependencies && json.dependencies['schema-utils']) {
    const dep = json.dependencies['schema-utils'];
    const v = dep.version;
    const major = parseInt((String(v || '').match(/^(\d+)\./) || [])[1] || '0', 10);
    if (!major || major >= 4 || major < 3) {
      dep.version = '3.3.0';
    }
  }

  fs.writeFileSync(lockPath, JSON.stringify(json, null, 2));
  console.log('package-lock.json patched for webpack toolchain compatibility.');
} catch (e) {
  console.warn('patch-lock.js warning:', e.message);
  process.exit(0);
}
