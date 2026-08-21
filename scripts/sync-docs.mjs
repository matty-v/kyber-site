#!/usr/bin/env node
// Mirror the kyber repo's product docs (docs/product/) into this site's
// content collection. The kyber repo is the single source of truth: its
// manifest.json decides what publishes and in what sidebar order, and each
// page's H1 + lead paragraph become the Starlight title + description.
//
// Source resolution:
//   KYBER_DOCS_DIR=/path/to/kyber   use a local checkout (dev loop)
//   otherwise                       download the main-branch tarball
//
// Outputs (all gitignored, regenerated on every build):
//   src/content/docs/<section>/*.md
//   src/assets/synced/*             images referenced by the docs
//   src/generated/sidebar.json      consumed by astro.config.mjs

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = 'matty-v/kyber';
const BRANCH = process.env.KYBER_DOCS_REF || 'main';
const CONTENT_ROOT = path.join(SITE_ROOT, 'src/content/docs');
const ASSETS_DIR = path.join(SITE_ROOT, 'src/assets/synced');
const SIDEBAR_FILE = path.join(SITE_ROOT, 'src/generated/sidebar.json');

// GitHub alert marker -> Starlight aside type
const ALERT_TYPES = { NOTE: 'note', TIP: 'tip', IMPORTANT: 'note', WARNING: 'caution', CAUTION: 'danger' };

function fetchSource() {
  if (process.env.KYBER_DOCS_DIR) {
    const dir = path.resolve(process.env.KYBER_DOCS_DIR.replace(/^~/, os.homedir()));
    if (!fs.existsSync(path.join(dir, 'docs/product/manifest.json'))) {
      throw new Error(`KYBER_DOCS_DIR=${dir} has no docs/product/manifest.json`);
    }
    console.log(`sync-docs: using local checkout ${dir}`);
    return dir;
  }
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kyber-docs-'));
  const tarball = path.join(tmp, 'kyber.tar.gz');
  console.log(`sync-docs: downloading ${REPO}@${BRANCH}`);
  execFileSync('curl', ['-fsSL', '--retry', '3', '-o', tarball,
    `https://codeload.github.com/${REPO}/tar.gz/refs/heads/${BRANCH}`]);
  execFileSync('tar', ['-xzf', tarball, '-C', tmp]);
  const extracted = fs.readdirSync(tmp).find((d) => d.startsWith('kyber-'));
  if (!extracted) throw new Error('tarball extraction produced no kyber-* directory');
  return path.join(tmp, extracted);
}

function stripInline(md) {
  return md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[`*_]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Rewrite one markdown link/image target found in `page` (repo-relative path
// of the source file). Returns the new target.
function rewriteTarget(target, page, routes, repoRoot) {
  if (/^(https?:|mailto:|#|\/)/.test(target)) return target;
  const [rel, anchor = ''] = target.split(/(?=#)/);
  const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(page), rel));
  if (routes.has(resolved)) return routes.get(resolved) + anchor;
  // Image inside the repo: copy it and reference the local copy.
  if (/\.(png|jpe?g|gif|svg|webp)$/i.test(resolved) && fs.existsSync(path.join(repoRoot, resolved))) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
    const name = resolved.replace(/[^a-zA-Z0-9.]+/g, '-');
    fs.copyFileSync(path.join(repoRoot, resolved), path.join(ASSETS_DIR, name));
    return `__ASSET__/${name}`; // patched to a correct relative path per output file
  }
  // Anything else in the repo that is not published: link to GitHub.
  return `https://github.com/${REPO}/blob/${BRANCH}/${resolved}${anchor}`;
}

function convertAlerts(md) {
  const lines = md.split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*$/);
    if (!m) { out.push(lines[i]); continue; }
    const body = [];
    while (i + 1 < lines.length && /^>/.test(lines[i + 1])) {
      body.push(lines[++i].replace(/^>\s?/, ''));
    }
    out.push(`:::${ALERT_TYPES[m[1]]}`, ...body, ':::');
  }
  return out.join('\n');
}

function transformPage(repoRoot, repoRelPath, routes, outFile) {
  let md = fs.readFileSync(path.join(repoRoot, repoRelPath), 'utf8');

  const h1 = md.match(/^#\s+(.+?)\s*$/m);
  if (!h1) throw new Error(`${repoRelPath}: no H1 title`);
  const title = h1[1];
  md = md.replace(h1[0], '').replace(/^\s+/, '');

  const firstPara = md.split(/\n\s*\n/)[0] || '';
  let description = stripInline(firstPara);
  if (description.length > 300) description = description.slice(0, 297).trimEnd() + '...';

  md = md.replace(/(!?\[[^\]]*\]\()([^)\s]+)(\))/g,
    (_, open, target, close) => open + rewriteTarget(target, repoRelPath, routes, repoRoot) + close);
  md = convertAlerts(md);

  // Point each __ASSET__ placeholder at src/assets/synced relative to outFile.
  const relToAssets = path.posix.join(
    path.relative(path.dirname(outFile), ASSETS_DIR).split(path.sep).join('/'));
  md = md.replaceAll('__ASSET__', relToAssets);

  const fm = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    `editUrl: ${JSON.stringify(`https://github.com/${REPO}/edit/${BRANCH}/${repoRelPath}`)}`,
    '---',
  ].join('\n');
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, `${fm}\n\n${md.trimEnd()}\n`);
}

const repoRoot = fetchSource();
const manifest = JSON.parse(fs.readFileSync(path.join(repoRoot, 'docs/product/manifest.json'), 'utf8'));

// Map every published repo path -> site route, so cross-page links stay on-site.
const routes = new Map();
for (const section of manifest.sections) {
  for (const page of section.pages) {
    const file = typeof page === 'string' ? page : page.file;
    const slug = file === 'README.md' ? '' : file.replace(/\.md$/, '');
    routes.set(`docs/product/${section.dir}/${file}`,
      `/${path.posix.join(section.dir, slug)}/`.replace(/\/+$/, '/'));
  }
}

fs.rmSync(ASSETS_DIR, { recursive: true, force: true });
const sidebar = [];
for (const section of manifest.sections) {
  const outDir = path.join(CONTENT_ROOT, section.dir);
  fs.rmSync(outDir, { recursive: true, force: true });
  const items = [];
  for (const page of section.pages) {
    const file = typeof page === 'string' ? page : page.file;
    const label = typeof page === 'string' ? null : page.label;
    const srcPath = `docs/product/${section.dir}/${file}`;
    const outName = file === 'README.md' ? 'index.md' : file;
    const outFile = path.join(outDir, outName);
    transformPage(repoRoot, srcPath, routes, outFile);
    const slug = file === 'README.md' ? section.dir : `${section.dir}/${file.replace(/\.md$/, '')}`;
    items.push({ label: label || path.basename(file, '.md'), slug });
  }
  sidebar.push({ label: section.label, items });
}

fs.mkdirSync(path.dirname(SIDEBAR_FILE), { recursive: true });
fs.writeFileSync(SIDEBAR_FILE, JSON.stringify(sidebar, null, 2) + '\n');
const pageCount = sidebar.reduce((n, s) => n + s.items.length, 0);
console.log(`sync-docs: published ${pageCount} pages in ${sidebar.length} sections from ${REPO}@${BRANCH}`);
