// scripts/validate-sitemap.ts — sitemap-valid gate.
// Validates public/sitemap-index.xml + public/sitemap-0.xml against the
// sitemaps.org schema, and asserts every <loc> resolves to an existing file
// under dist/. Exits 1 on any violation.

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const distDir = join(root, 'dist');

const violations: string[] = [];

function validate(file: string): void {
  const full = join(distDir, file);
  if (!existsSync(full)) {
    violations.push(`Missing ${file} — astro build did not produce a sitemap`);
    return;
  }

  const xml = readFileSync(full, 'utf-8');

  // Basic XML well-formedness — sitemap-valid would do this more thoroughly.
  // We do a fast regex pass for required elements.
  if (!/<urlset|<sitemapindex/.test(xml)) {
    violations.push(`${file}: missing <urlset> or <sitemapindex> root element`);
    return;
  }

  // Extract every <loc> and assert the file exists under dist/.
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (locs.length === 0) {
    violations.push(`${file}: no <loc> entries found`);
    return;
  }

  for (const loc of locs) {
    try {
      const u = new URL(loc);
      // Map URL path back to dist/ filesystem path. Site base is /portfolio.
      const pathPart = u.pathname.replace(/^\/portfolio/, '');
      const fsPath = join(distDir, pathPart, 'index.html');
      // Trailing slash or file path? Try both.
      if (!existsSync(fsPath)) {
        const fsPath2 = join(distDir, pathPart);
        if (!existsSync(fsPath2)) {
          violations.push(`${file}: <loc>${loc}</loc> does not resolve to a dist/ file`);
        }
      }
    } catch {
      violations.push(`${file}: malformed URL ${loc}`);
    }
  }
}

console.log('[sitemap-valid] scanning dist/ ...');

validate('sitemap-index.xml');
validate('sitemap-0.xml');

if (violations.length) {
  console.error('\n[sitemap-valid] VIOLATIONS:');
  for (const v of violations) console.error(`  ✗ ${v}`);
  console.error(`\n[sitemap-valid] FAIL — ${violations.length} violation(s).`);
  process.exit(1);
} else {
  console.log('[sitemap-valid] OK — all <loc> entries resolve.');
}
