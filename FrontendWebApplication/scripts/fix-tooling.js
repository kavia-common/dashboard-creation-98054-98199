#!/usr/bin/env node
/**
 * Ensures CRA v5 toolchain compatibility:
 * - terser-webpack-plugin@5.x with schema-utils@3.x
 * - ajv@6.x and ajv-keywords@3.x
 *
 * If mismatches detected (e.g., schema-utils >=4), attempt to fix by installing
 * the compatible versions, then instruct CI to rerun.
 */
const { execSync } = require('child_process');
const { createRequire } = require('module');
const requireFromApp = createRequire(process.cwd() + '/');

function getVersion(name) {
  try {
    const pkg = requireFromApp(`${name}/package.json`);
    return pkg.version || null;
  } catch {
    return null;
  }
}

function semverMajor(v) {
  if (!v) return null;
  const m = v.trim().match(/^(\d+)\./);
  return m ? parseInt(m[1], 10) : null;
}

const resolved = {
  terser: getVersion('terser-webpack-plugin'),
  schemaUtils: getVersion('schema-utils'),
  ajv: getVersion('ajv'),
  ajvKeywords: getVersion('ajv-keywords'),
  reactScripts: getVersion('react-scripts'),
};

let needsFix = false;

// CRA 5 expects terser-webpack-plugin 5.x and schema-utils 3.x
if (resolved.reactScripts && semverMajor(resolved.reactScripts) === 5) {
  if (!resolved.terser || semverMajor(resolved.terser) !== 5) needsFix = true;
  if (!resolved.schemaUtils || semverMajor(resolved.schemaUtils) !== 3) needsFix = true;
  if (!resolved.ajv || semverMajor(resolved.ajv) !== 6) needsFix = true;
  if (!resolved.ajvKeywords || semverMajor(resolved.ajvKeywords) !== 3) needsFix = true;
}

if (needsFix) {
  try {
    console.log('Fixing webpack toolchain versions for CRA5...');
    execSync('npm i --no-audit --no-fund --legacy-peer-deps terser-webpack-plugin@5.3.10 schema-utils@3.3.0 ajv@6.12.6 ajv-keywords@3.5.2', { stdio: 'inherit' });
    // Re-check
    const post = {
      terser: getVersion('terser-webpack-plugin'),
      schemaUtils: getVersion('schema-utils'),
      ajv: getVersion('ajv'),
      ajvKeywords: getVersion('ajv-keywords'),
    };
    console.log('Post-fix versions:', post);
    // If still incorrect, exit non-zero so CI can attempt a clean install step
    if (semverMajor(post.terser) !== 5 || semverMajor(post.schemaUtils) !== 3) {
      console.error('Tooling still mismatched after fix attempt.');
      process.exit(1);
    }
  } catch (e) {
    console.error('Failed to fix tooling automatically:', e.message);
    process.exit(1);
  }
} else {
  console.log('Tooling versions are compatible:', resolved);
}
