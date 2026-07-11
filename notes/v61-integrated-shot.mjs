// v6.1 Integrated Audit — screenshots + 7 visual checks
// Per Quality_Officer directive: 5 pages × {desktop viewport, mobile viewport, full-page}
import { chromium } from '/Users/christianmacion/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { writeFileSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BASE = 'http://localhost:8765';
const OUT  = '/Users/christianmacion/Contingency/christianmacion.github.io/notes/screenshots';
const REP  = '/Users/christianmacion/Contingency/christianmacion.github.io/notes';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const VIEWPORTS = {
  desktop: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, isMobile: false },
  mobile:  { viewport: { width: 390,  height: 844 }, deviceScaleFactor: 2, isMobile: true,
             userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
             hasTouch: true },
};

const PAGES = [
  ['home',      '/'],
  ['markets',   '/markets/'],
  ['prediction','/prediction-markets/'],
  ['research',  '/research/'],
  ['ai',        '/ai/'],
];

const log = (...a) => console.log('[v61-int]', ...a);

// Tabular-num detection — count elements that contain digits and have tabular-nums applied
// "data context" = any element with a number that is also in <table>, <dl>, .stat, .num, .cell, .row,
// or matches selectors used in numeric/quant/grid cells.
const DATA_CELL_SELECTOR = [
  'table td', 'table th',
  'dt', 'dd',
  '[class*="stat"]', '[class*="num"]', '[class*="cell"]', '[class*="row"]',
  '[class*="ticker"]', '[class*="quote"]', '[class*="metric"]', '[class*="data"]',
  '[class*="depth"]', '[class*="book"]', '[class*="ladder"]', '[class*="order"]',
  '[class*="price"]', '[class*="volume"]', '[class*="delta"]', '[class*="coverage"]',
  '[class*="tick"]', '[class*="spread"]', '[class*="grid"]',
].join(',');

// Visual checks run inside an in-page function
const VISUAL_CHECK = `
() => {
  const out = {};
  const text = document.body ? document.body.innerText : '';
  const html = document.documentElement ? document.documentElement.innerHTML : '';

  // (4) Emoji regex — match any emoji range glyph
  const emojiRegex = /[\\u{1F300}-\\u{1F9FF}\\u{2600}-\\u{27BF}\\u{1F000}-\\u{1F02F}\\u{1F0A0}-\\u{1F0FF}\\u{1F100}-\\u{1F1FF}\\u{1F200}-\\u{1F2FF}\\u{1FA00}-\\u{1FAFF}]/u;
  const emojiHits = (text.match(new RegExp(emojiRegex, 'gu')) || []);
  out.emoji = { count: emojiHits.length, samples: emojiHits.slice(0, 5) };

  // (3) Amber-on-black palette — sample body bg and look for amber color tokens
  const bodyBg = getComputedStyle(document.body).backgroundColor;
  const root = getComputedStyle(document.documentElement);
  const primary = root.getPropertyValue('--c-primary').trim();
  const primary2 = root.getPropertyValue('--c-primary-2').trim();
  const bgVar = root.getPropertyValue('--c-bg').trim();
  out.palette = { bodyBg, primary, primary2, bgVar };

  // (1) Density — count distinct data cells visible above the fold
  // "above the fold" = within viewport (window.innerHeight)
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
  // Count *visible* with non-empty text or numeric content
  const filled = inFold.filter(n => {
    const t = (n.innerText || '').trim();
    return t.length > 0 && /[\\d.,%+\\-x×$€£¥]/.test(t);
  });
  out.density = { inFold: inFold.length, filled: filled.length, samples: filled.slice(0, 8).map(n => n.innerText.replace(/\\s+/g, ' ').trim().slice(0, 60)) };

  // (2) Mono numerics — among the filled data cells, how many have tabular-nums?
  let tabularCount = 0, monospaceCount = 0, totalNumeric = 0;
  const numNodeSamples = [];
  for (const n of filled) {
    const cs = getComputedStyle(n);
    const hasNumeric = /[\\d]/.test(n.innerText || '');
    if (!hasNumeric) continue;
    totalNumeric++;
    if (cs.fontVariantNumeric.includes('tabular-nums') || cs.fontVariantNumeric === 'tabular-nums') tabularCount++;
    if (/mono|menlo|consolas|sf mono|courier/i.test(cs.fontFamily)) monospaceCount++;
    if (numNodeSamples.length < 4) numNodeSamples.push({ tag: n.tagName, cls: n.className.toString().slice(0,60), fn: cs.fontFamily.slice(0,40), fvn: cs.fontVariantNumeric });
  }
  out.monoNumerics = { totalNumeric, tabularCount, monospaceCount, samples: numNodeSamples };

  // (5) Touch targets ≥ 44×44 — measure all clickable elements
  const clickables = Array.from(document.querySelectorAll('a, button, [role="button"], input, select, textarea, summary, [tabindex]'));
  const undersized = [];
  for (const el of clickables) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    // Skip elements with display:none ancestors — bounding rect still 0
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    if (r.width < 44 || r.height < 44) {
      const label = (el.innerText || el.getAttribute('aria-label') || el.getAttribute('href') || el.tagName).trim().slice(0, 40);
      undersized.push({ w: Math.round(r.width), h: Math.round(r.height), label });
    }
  }
  out.touchTargets = { total: clickables.length, undersized: undersized.length, samples: undersized.slice(0, 8) };

  // (6) No horizontal scroll — body width <= viewport
  const bodyW = document.documentElement.scrollWidth;
  const winW  = window.innerWidth;
  out.hScroll = { scrollWidth: bodyW, innerWidth: winW, overflows: bodyW > winW + 1 };

  // (7) Asset 404 — collected by network listener in the parent context (will be merged in after the fact)
  out.viewport = { w: vw, h: vh };

  return out;
}
`;

async function snapOne(browser, name, kind, path) {
  const ctx = await browser.newContext(VIEWPORTS[kind]);
  const page = await ctx.newPage();

  // Network log — collect 404s and all requests
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
  const shotView = `${OUT}/v61-integrated-${name}-${kind}.png`;
  const shotFull = `${OUT}/v61-integrated-${name}-full.png`;
  const status = { name, kind, url };

  try {
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
    status.http = resp ? resp.status() : null;
    await page.waitForTimeout(700); // settle fonts/animations

    // Run visual checks
    const checks = await page.evaluate(`(${VISUAL_CHECK})()`);
    Object.assign(status, checks);

    // Viewport screenshot
    await page.screenshot({ path: shotView, fullPage: false });
    status.viewFile = shotView;

    // Full-page screenshot (only on desktop to keep file sizes sane; mobile fullPage can be huge)
    if (kind === 'desktop') {
      await page.screenshot({ path: shotFull, fullPage: true });
      status.fullFile = shotFull;
      try {
        status.fullBytes = statSync(shotFull).size;
      } catch (_) { /* ignore */ }
    }

    try {
      status.viewBytes = statSync(shotView).size;
    } catch (_) { /* ignore */ }

    // Network summary — exclude OK HTML / data: URIs
    const assetFails = fails.filter(f => !f.url.includes('/index.html') && !f.url.startsWith('data:') && !f.url.includes('favicon.ico'));
    status.assetFails = assetFails;
    status.totalRequests = requests.length;
    status.ok = true;
    log('OK ', name, kind, status.http, `reqs=${requests.length} fails=${assetFails.length}`);
  } catch (e) {
    status.ok = false;
    status.err = e.message;
    log('FAIL', name, kind, status.err);
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

  // Aggregate per-page: the audit verdict uses *desktop* as the canonical version,
  // because mobile adds viewport-fit checks but the design target is desktop.
  // We still surface mobile hScroll + touch-target failures explicitly.
  writeFileSync(`${OUT}/v61-integrated-raw.json`, JSON.stringify(results, null, 2));
  log('manifest written:', `${OUT}/v61-integrated-raw.json`);

  const fail = results.filter(r => !r.ok).length;
  log('DONE', { total: results.length, fail });
  process.exit(0);
})().catch(e => { console.error(e); process.exit(2); });