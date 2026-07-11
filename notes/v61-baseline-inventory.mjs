// Page inventory: h1/h2/h3 counts + word count per page
import fs from 'node:fs';
import path from 'node:path';

const DIST = '/Users/christianmacion/Contingency/christianmacion.github.io/dist';

const PAGES = [
  '',                                     // home
  'proof',
  'methodology',
  'solutions',
  'certifications',
  'experience',
  'about',
  'now',
  'positions',
  'contact',
  'reading',
  'colophon',
  'papers',
  'projects',
  'mistakes',
  'resume',
  'search',
  'skills',
  'publications',
  'talks',
  'uses',
  'for-recruiters',
  'about-this-site',
  'research/quant/01-deflated-sharpe',
  'research/quant/02-cross-sectional-momentum',
  'research/quant/03-timeseries-momentum-voltarget',
  'research/quant/04-variance-risk-premium',
  'research/quant/05-pairs-cointegration',
  'research/quant/06-funding-carry',
  'research/quant/07-macro-regime-overlay',
  'research/quant/08-backtest-engine-costs',
  'research/quant/09-lookahead-bias-audit',
  'research/ai/01-rag-recall',
  'research/ai/02-toolcall-agent',
  'research/ai/03-judge-harness',
  'research/ai/04-eval-mcp-server',
  'research/ai/05-reflect-revise',
  'research/ai/06-slop-scanner',
];

const HEAD_RE = /<h([1-6])[^>]*>/g;

// Simple HTML to text: strip scripts/styles, decode entities, collapse tags
function htmlToText(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '…')
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&lsquo;|&rsquo;/g, "'")
    .replace(/&rarr;|&larr;|&harr;/g, ' ')
    .replace(/&[a-z0-9#]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function mainScope(html) {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  return m ? m[1] : html;
}

function countHeadings(html) {
  const counts = { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 };
  for (const m of html.matchAll(HEAD_RE)) {
    const lvl = parseInt(m[1], 10);
    if (counts['h' + lvl] !== undefined) counts['h' + lvl]++;
  }
  return counts;
}

const out = [];
for (const slug of PAGES) {
  const file = slug ? path.join(DIST, slug, 'index.html') : path.join(DIST, 'index.html');
  if (!fs.existsSync(file)) { out.push({ slug, exists: false }); continue; }
  const html = fs.readFileSync(file, 'utf8');
  const scope = mainScope(html);
  const text = htmlToText(scope);
  const words = text.split(/\s+/).filter(Boolean).length;
  const h = countHeadings(scope);
  out.push({ slug: slug || '(home)', exists: true, words, ...h });
}

console.log('  slug                                                  h1  h2  h3    words   bytes');
console.log('  ' + '-'.repeat(85));
for (const r of out) {
  if (!r.exists) { console.log(`  MISS ${r.slug}`); continue; }
  const len = fs.statSync(path.join(DIST, r.slug === '(home)' ? '' : r.slug, 'index.html')).size;
  console.log(`  ${r.slug.padEnd(53)} ${String(r.h1).padStart(2)}  ${String(r.h2).padStart(2)}  ${String(r.h3).padStart(2)}  ${String(r.words).padStart(6)}   ${String(len).padStart(7)}`);
}

fs.writeFileSync('/Users/christianmacion/Contingency/christianmacion.github.io/notes/v61-page-inventory.json', JSON.stringify(out, null, 2));
