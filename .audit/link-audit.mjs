// link-audit.mjs — walks dist/**/*.html and verifies every internal href / src.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, extname, basename } from 'node:path';

const DIST = '/Users/christianmacion/Contingency/christianmacion.github.io/dist';

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) {
      if (entry === '_pagefind' || entry === '_astro') continue;
      walk(full, files);
    } else if (extname(entry) === '.html') {
      files.push(full);
    }
  }
  return files;
}

function resolveHref(href, fromFile) {
  // href is something like "/foo/", "/foo.html", "/foo/bar", "/foo/bar/"
  if (href.startsWith('/')) {
    // Strip query/fragment
    let path = href.split('#')[0].split('?')[0];
    if (path === '' || path === '/') return join(DIST, 'index.html');
    // Try as-is
    let candidate = join(DIST, path);
    if (existsSync(candidate) && statSync(candidate).isDirectory()) {
      return join(candidate, 'index.html');
    }
    if (existsSync(candidate + '/index.html')) {
      return candidate + '/index.html';
    }
    // Try with /index.html
    if (existsSync(candidate)) return candidate;
    // Try with .html
    if (existsSync(candidate + '.html')) return candidate + '.html';
    // Try as directory + /index.html (already done)
    return null;
  }
  // relative path
  const base = dirname(fromFile);
  let resolved = resolve(base, href);
  if (existsSync(resolved) && statSync(resolved).isDirectory()) {
    return join(resolved, 'index.html');
  }
  if (existsSync(resolved)) return resolved;
  if (existsSync(resolved + '.html')) return resolved + '.html';
  if (existsSync(resolved + '/index.html')) return resolved + '/index.html';
  return null;
}

const files = walk(DIST);
const allHrefs = []; // {from, href, attr}
const externalLinks = [];
const anchorLinks = [];
const mailtoLinks = [];
const telLinks = [];
const dataProtocolLinks = [];

const HREF_RE = /(?:href|src)\s*=\s*"([^"]+)"/gi;
const LINK_REL_RE = /<link[^>]+href\s*=\s*"([^"]+)"/gi;

const targets = new Set();

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  // Extract href + src attributes
  let m;
  HREF_RE.lastIndex = 0;
  while ((m = HREF_RE.exec(html)) !== null) {
    const href = m[1];
    const attr = html.substring(Math.max(0, m.index - 30), m.index).includes('src=') ? 'src' : 'href';
    // Actually need to detect more precisely — but let's get a list first
    allHrefs.push({ from: file, href, attr: 'href_or_src' });
  }
  // Extract link rel href specifically
  LINK_REL_RE.lastIndex = 0;
  while ((m = LINK_REL_RE.exec(html)) !== null) {
    allHrefs.push({ from: file, href: m[1], attr: 'link-href' });
  }
}

const broken = [];
const checked = new Map(); // href -> resolved or null

for (const { from, href, attr } of allHrefs) {
  if (!href) continue;
  if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) continue;
  if (href.startsWith('mailto:')) continue;
  if (href.startsWith('tel:')) continue;
  if (href.startsWith('data:')) continue;
  if (href.startsWith('javascript:')) continue;
  if (href.startsWith('#')) continue;

  let resolved;
  if (checked.has(href)) {
    resolved = checked.get(href);
  } else {
    resolved = resolveHref(href, from);
    checked.set(href, resolved);
  }
  if (!resolved) {
    broken.push({ from: from.replace(DIST, ''), href, attr });
  } else {
    targets.add(resolved);
  }
}

// Orphan detection: any html file in dist that's not targeted by another dist file
const orphans = [];
for (const file of files) {
  // files that ARE link targets from some other file
  if (targets.has(file)) continue;
  // Skip the root
  if (file === join(DIST, 'index.html')) continue;
  // Skip 404 — by design an orphan
  if (file === join(DIST, '404.html')) continue;
  orphans.push(file.replace(DIST, ''));
}

// Output JSON
const result = {
  broken,
  orphans,
  summary: { broken_links: broken.length, orphans: orphans.length },
};
console.log(JSON.stringify(result, null, 2));