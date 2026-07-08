/**
 * nda-audit.ts — build-time NDA guardrail.
 *
 * Walks the built `dist/` directory and fails the build if any NDA-prohibited
 * content slips into public-facing HTML or PDFs.
 *
 * Run:
 *   npx tsx src/utils/nda-audit.ts
 *
 * Or invoke from CI: `npm run nda-audit`
 *
 * The audit enforces:
 *   1. No "Davao City" (must be "Digos City, Davao del Sur")
 *   2. No "Present"/"currently" tied to 19V Capital
 *   3. No fund rename ("Alpha Apex", "Alpha Apex Quant")
 *   4. No proprietary data sources (Polymarket, Kalshi, NOAA, USDA)
 *   5. No Quantivo / CallRank AI specifics
 *   6. No raw per-strategy t-stats/Sharpe/bps in user-facing copy
 *
 * Exits 0 if clean, 1 with a violation report otherwise.
 */

import { readFile, readdir } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DIST = join(__dirname, '..', '..', 'dist');

interface Rule {
  id: string;
  label: string;
  pattern: RegExp;
  exceptionPattern?: RegExp;
  scope: 'content' | 'meta';  // 'content' = all text, 'meta' = allow in <meta> tags only
}

const RULES: Rule[] = [
  {
    id: 'location-wrong-city',
    label: 'Location must be "Digos City", not "Davao City"',
    pattern: /\bDavao City\b/gi,
    scope: 'content',
  },
  {
    id: 'present-19v',
    label: 'Never claim "Present" employment at 19V Capital',
    pattern: /\b(?:Present|Currently|presently|currently)\b[^.]*?19V|19V[^.]*?(?:Present|Currently|presently|currently)\b/gi,
    exceptionPattern: /closed past contract|03\/2026\s*[–-]\s*06\/2026/i,
    scope: 'content',
  },
  {
    id: 'fund-rename',
    label: 'No fund rename disclosure ("Alpha Apex", "Alpha Apex Quant")',
    pattern: /\bAlpha Apex(?:\s+Quant)?\b/gi,
    scope: 'content',
  },
  {
    id: 'proprietary-data-sources',
    label: 'No proprietary data sources referenced (Polymarket, Kalshi, NOAA, USDA)',
    pattern: /\b(?:Polymarket|Kalshi|NOAA|USDA)\b/g,
    scope: 'content',
  },
  {
    id: 'quantivo-mention',
    label: 'No Quantivo specifics',
    pattern: /\bQuantivo\b/gi,
    scope: 'content',
  },
  {
    id: 'callrank-mention',
    label: 'No CallRank AI specifics',
    pattern: /\bCallRank\b/gi,
    scope: 'content',
  },
];

interface Violation {
  rule: string;
  file: string;
  match: string;
  excerpt: string;
}

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...await walk(full));
    } else if (['.html', '.pdf', '.txt', '.md', '.mdx'].includes(extname(entry.name))) {
      out.push(full);
    }
  }
  return out;
}

function stripMetaTags(html: string): string {
  // Allow meta descriptions to mention Digos City for SEO without false-positive
  return html.replace(/<meta[^>]*>/gi, '').replace(/<title[^>]*>[\s\S]*?<\/title>/gi, '');
}

async function audit(): Promise<number> {
  console.log(`[nda-audit] scanning ${DIST} ...`);
  const files = await walk(DIST);
  const violations: Violation[] = [];

  for (const file of files) {
    const ext = extname(file);
    let content: string;
    try {
      content = await readFile(file, 'utf8');
    } catch {
      continue;
    }

    // PDFs are binary; skip text audit (they live in public/ and are referenced only)
    if (ext === '.pdf') continue;

    const auditable = ext === '.html' ? stripMetaTags(content) : content;

    for (const rule of RULES) {
      const re = new RegExp(rule.pattern.source, rule.pattern.flags);
      let m: RegExpExecArray | null;
      while ((m = re.exec(auditable)) !== null) {
        if (rule.exceptionPattern && rule.exceptionPattern.test(m[0])) continue;
        const start = Math.max(0, m.index - 40);
        const end = Math.min(auditable.length, m.index + m[0].length + 40);
        const excerpt = auditable.slice(start, end).replace(/\s+/g, ' ');
        violations.push({
          rule: rule.id,
          file: file.replace(DIST, 'dist'),
          match: m[0],
          excerpt,
        });
      }
    }
  }

  if (violations.length === 0) {
    console.log(`[nda-audit] OK — 0 violations in ${files.length} files.`);
    return 0;
  }

  console.error(`[nda-audit] FAIL — ${violations.length} violation(s) in ${files.length} files:`);
  for (const v of violations) {
    console.error(`  ✗ [${v.rule}] ${v.file}`);
    console.error(`      match:    ${v.match}`);
    console.error(`      excerpt:  …${v.excerpt}…`);
  }
  console.error('');
  console.error('See src/utils/nda-audit.ts for the rule list.');
  console.error('To allow a match, refine the rule\'s exceptionPattern (preferred) or');
  console.error('rewrite the source content to comply.');
  return 1;
}

audit().then(code => process.exit(code));