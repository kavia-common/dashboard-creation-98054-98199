#!/usr/bin/env node
/**
 * PUBLIC_INTERFACE
 * Patch @pmmmwh/react-refresh-webpack-plugin to a no-op in production to
 * avoid any code path referencing legacy validateOptions during CRA config eval.
 * This script creates a local alias module that exports a dummy class with the
 * same interface used by CRA (constructor/apply) but does nothing.
 */
const fs = require('fs');
const path = require('path');

const isProd = process.env.NODE_ENV === 'production';
if (!isProd) {
  console.log('patch-refresh-plugin: Skipped (NODE_ENV!=production)');
  process.exit(0);
}

try {
  const targetDir = path.join(process.cwd(), 'node_modules', '@pmmmwh', 'react-refresh-webpack-plugin');
  const aliasPath = path.join(targetDir, 'index.js');
  // Only patch if the real entry exists and our alias not already present
  const pkgPath = path.join(targetDir, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    console.log('patch-refresh-plugin: package not found; nothing to patch');
    process.exit(0);
  }

  const NOOP = `
// Auto-generated no-op for production builds to avoid invoking dev-only plugin internals.
class NoopReactRefreshWebpackPlugin {
  /** PUBLIC_INTERFACE */
  constructor() {}
  /** PUBLIC_INTERFACE */
  apply() {}
}
module.exports = NoopReactRefreshWebpackPlugin;
`;
  // Write alias file to shadow lib/index.js through Node's resolution by main field
  // We will also rewrite package.json "main" to point to this file for production.
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.main = './index.js';
  fs.writeFileSync(aliasPath, NOOP, 'utf8');
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');
  console.log('patch-refresh-plugin: Applied production no-op alias.');
} catch (e) {
  console.warn('patch-refresh-plugin: failed (non-fatal):', e.message);
  process.exit(0);
}
