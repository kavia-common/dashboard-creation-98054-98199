#!/usr/bin/env node
/**
 * PUBLIC_INTERFACE
 * Check resolved schema-utils and list packages that declare schema-utils
 * in their dependencies/peerDependencies. Exits non-zero if version != 3.x.
 */
const { createRequire } = require('module');
const fs = require('fs');
const path = require('path');
const requireFromApp = createRequire(process.cwd() + '/');

function getVersion(name) {
  try {
    const pkg = requireFromApp(`${name}/package.json`);
    return pkg.version || null;
  } catch {
    return null;
  }
}

function walk(dir, cb) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    let st;
    try { st = fs.statSync(p); } catch { continue; }
    if (st.isDirectory()) {
      if (f === 'node_modules') continue;
      walk(p, cb);
    } else if (f === 'package.json') {
      try {
        const j = JSON.parse(fs.readFileSync(p, 'utf8'));
        cb(j, p);
      } catch {}
    }
  }
}

const resolved = getVersion('schema-utils');
console.log('schema-utils resolved version:', resolved || '<not found>');
const major = resolved ? parseInt(String(resolved).split('.')[0], 10) : null;

console.log('Packages declaring schema-utils (for visibility):');
walk(path.join(process.cwd(), 'node_modules'), (j, p) => {
  if (!j.name) return;
  const dep = (j.dependencies && j.dependencies['schema-utils']) || null;
  const peer = (j.peerDependencies && j.peerDependencies['schema-utils']) || null;
  if (dep || peer) {
    console.log('-', j.name, 'at', p, 'dep:', dep || '-', 'peer:', peer || '-');
  }
});

if (!resolved || major !== 3) {
  console.error('ERROR: schema-utils must resolve to v3.x for CRA5 toolchain compatibility.');
  process.exit(2);
}
console.log('schema-utils v3 check passed.');
