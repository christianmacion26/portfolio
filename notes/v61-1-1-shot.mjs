// v6.1.1 Polish Re-Audit — re-shoot 5 pages × 2 viewports = 10 shots.
// Per Quality_Officer directive: re-run the same 7 visual checks with
// new filename convention `v61-1-1-*.png`. Verifies P1 + P2 polish
// closed the v6.1 post-polish audit gaps (universal tabular-nums
// coverage + 44×44 search-icon hit area).
import { chromium } from '/Users/christianmacion/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { writeFileSync, statSync } from 'node:fs';

const BASE = 'http://localhost:8766';
const OUT  = '/Users/christianmacion/Contingency/christianmacion.github.io/notes/screenshots';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const TAG = 'v61-1-1';

const VIEWPORTS = {
  desktop: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, isMobile: false },
  mobile:  { viewport: { width: 390,  height: 844 }, deviceScaleFactor: 2, isMobile: true,
             userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
             hasTouch: true },
};

const PAGES = [
  ['home',       '/'],
  ['markets',    '/markets/'],
  ['prediction', '/prediction-markets/'],
  ['research',   '/research/'],
  ['ai',         '/ai/'],
];

const DATA_CELL_SELECTOR = [
  'table td', 'table th',
  'dt', 'dd',
  '[class*="stat"]', '[class*="num"]', '[class*="cell"]', '[class*="row"]',
  '[class*="ticker"]', '[class*="quote"]', '[class*="metric"]', '[class*="data"]',
  '[class*="depth"]', '[class*="book"]', '[class*="ladder"]', '[class*="order"]',
  '[class*="price"]', '[class*="volume"]', '[class*="delta"]', '[class*="coverage"]',
  '[class*="tick"]', '[class*="spread"]', '[class*="grid"]',
].join(',');

const VISUAL_CHECK = `
() => {
  const out = {};
  const text = document.body ? document.body.innerText : '';

  // (4) Emoji regex — spec range only (1F300-1F9FF per the brief)
  const emojiRegex = /[\\u{1F300}-\\u{1F9FF}]/u;
  const emojiHits = (text.match(new RegExp(emojiRegex, 'gu')) || []);
  out.emoji = { count: emojiHits.length, samples: emojiHits.slice(0, 5) };

  // (3) Amber-on-black palette
  const bodyBg = getComputedStyle(document.body).backgroundColor;
  const root = getComputedStyle(document.documentElement);
  const primary = root.getPropertyValue('--c-primary').trim();
  const primary2 = root.getPropertyValue('--c-primary-2').trim();
  out.palette = { bodyBg, primary, primary2 };

  // (1) Density — above-fold numeric cells
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  const selectors = ${JSON.stringify(DATA_CELL_SELECTOR)};
  const nodes = Array.from(document.querySelectorAll(selectors));
  const inFold = nodes.filter(n => {
    const r = n.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    if (r.bottom < 0 || r.top > vh) return false;
    return true;
  });
  const filled = inFold.filter(n => {
    const t = (n.innerText || '').trim();
    return t.length > 0 && /[\\d.,%+\\-x×$€£¥]/.test(t);
  });
  out.density = { inFold: inFold.length, filled: filled.length,
    samples: filled.slice(0, 8).map(n => n.innerText.replace(/\\s+/g, ' ').trim().slice(0, 60)) };

  // (2) Mono numerics tabular-nums coverage
  let tabularCount = 0, monospaceCount = 0, totalNumeric = 0;
  const numSamples = [];
  for (const n of filled) {
    const cs = getComputedStyle(n);
    if (!/[\\d]/.test(n.innerText || '')) continue;
    totalNumeric++;
    if (cs.fontVariantNumeric.includes('tabular-nums')) tabularCount++;
    if (/mono|menlo|consolas|sf mono|courier/i.test(cs.fontFamily)) monospaceCount++;
    if (numSamples.length < 4) numSamples.push({ tag: n.tagName, cls: n.className.toString().slice(0,60), fn: cs.fontFamily.slice(0,40), fvn: cs.fontVariantNumeric });
  }
  out.monoNumerics = { totalNumeric, tabularCount, monospaceCount, pct: totalNumeric > 0 ? Math.round(100 * tabularCount / totalNumeric) : 100, samples: numSamples };

  // (5) Touch targets ≥ 44×44
  const clickables = Array.from(document.querySelectorAll('a, button, [role="button"], input, select, textarea, summary, [tabindex]'));
  const undersized = [];
  for (const el of clickables) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    if (r.width < 44 || r.height < 44) {
      const label = (el.innerText || el.getAttribute('aria-label') || el.getAttribute('href') || el.tagName).trim().slice(0, 40);
      undersized.push({ w: Math.round(r.width), h: Math.round(r.height), label });
    }
  }
  out.touchTargets = { total: clickables.length, undersized: undersized.length,
    pct: clickables.length > 0 ? Math.round(100 * (1 - undersized.length / clickables.length)) : 100,
    samples: undersized.slice(0, 8) };

  // (6) No horizontal scroll
  out.hScroll = { scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth,
    overflows: document.documentElement.scrollWidth > window.innerWidth + 1 };

  out.viewport = { w: vw, h: vh };
  return out;
}
`;

async function snapOne(browser, name, kind, path) {
  const ctx = await browser.newContext(VIEWPORTS[kind]);
  const page = await ctx.newPage();

  const requests = [];
  const fails = [];
  page.on('response', async (resp) => {
    const status = resp.status();
    const url = resp.url();
    requests.push({ url, status, type: resp.request().resourceType() });
    if (status >= 400) fails.push({ url, status });
  });
  page.on('requestfailed', (req) => {
    fails.push({ url: req.url(), status: 0, failure: req.failure()?.errorText });
  });

  const url = `${BASE}${path}`;
  const shotView = `${OUT}/${TAG}-${name}-${kind}.png`;
  const status = { name, kind, url, tag: TAG };

  try {
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
    status.http = resp ? resp.status() : null;
    await page.waitForTimeout(700);

    const checks = await page.evaluate(`(${VISUAL_CHECK})()`);
    Object.assign(status, checks);

    await page.screenshot({ path: shotView, fullPage: false });
    status.viewFile = shotView;
    status.viewBytes = statSync(shotView).size;

    const assetFails = fails.filter(f =>
      !f.url.includes('/index.html') &&
      !f.url.startsWith('data:') &&
      !f.url.endsWith('/favicon.ico')
    );
    status.assetFails = assetFails;
    status.totalRequests = requests.length;
    status.ok = true;
    console.log('[v6.1.1]', 'OK', name, kind, status.http, `reqs=${requests.length} fails=${assetFails.length}`);
  } catch (e) {
    status.ok = false;
    status.err = e.message;
    console.log('[v6.1.1]', 'FAIL', name, kind, status.err);
  } finally {
    await ctx.close();
    return status;
  }
}

(async () => {
  const browser = await chromium.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const results = [];
  for (const [name, path] of PAGES) {
    for (const kind of ['desktop', 'mobile']) {
      const r = await snapOne(browser, name, kind, path);
      results.push(r);
    }
  }
  await browser.close();

  writeFileSync(`${OUT}/${TAG}-raw.json`, JSON.stringify(results, null, 2));
  console.log('[v6.1.1] manifest written');
  const fail = results.filter(r => !r.ok).length;
  console.log('[v6.1.1] DONE', { total: results.length, fail });
  process.exit(0);
})().catch(e => { console.error(e); process.exit(2); });
