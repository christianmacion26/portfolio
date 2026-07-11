// v6.2.1 Polish Audit — 6 pages × 3 modes (desktop, mobile, full-page) = 18 shots.
// Cloned from notes/v62-integrated-shot.mjs per the v61-patterns.md pattern.
// Renamed output prefix `v62-1polish-` and bound to local port 8766 (per
// the v6.2.1 mission brief; 8765 is shared with the previous v6.2 driver).
// Driver fires the same 7 checks per page: density, monoNumerics, palette,
// emoji, touchTargets, hScroll, asset-fail.
import { chromium } from '/Users/christianmacion/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { writeFileSync, statSync } from 'node:fs';

const BASE = 'http://localhost:8766';
const OUT  = '/Users/christianmacion/Contingency/christianmacion.github.io/notes/screenshots';
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
  ['proof',     '/proof/'],
];

const DATA_CELL_SELECTOR = [
  'table td', 'table th',
  'dt', 'dd',
  '[class*="stat"]', '[class*="num"]', '[class*="cell"]', '[class*="row"]',
  '[class*="ticker"]', '[class*="quote"]', '[class*="metric"]', '[class*="data"]',
  '[class*="depth"]', '[class*="book"]', '[class*="ladder"]', '[class*="order"]',
  '[class*="price"]', '[class*="volume"]', '[class*="delta"]', '[class*="coverage"]',
  '[class*="tick"]', '[class*="spread"]', '[class*="grid"]',
  '[class*="tape"]', '[class*="hero"]', '[class*="feed"]',
  '[class*="event"]', '[class*="pin"]', '[class*="ingest"]',
  '[class*="desk"]', '[class*="odo"]', '[class*="hint"]',
].join(',');

const VISUAL_CHECK = `(() => {
  const out = {};
  const text = document.body ? document.body.innerText : '';
  const emojiRegex = /[\\u{1F300}-\\u{1F9FF}\\u{2600}-\\u{27BF}\\u{1F000}-\\u{1F02F}\\u{1F0A0}-\\u{1F0FF}\\u{1F100}-\\u{1F1FF}\\u{1F200}-\\u{1F2FF}\\u{1FA00}-\\u{1FAFF}]/u;
  const emojiHits = (text.match(new RegExp(emojiRegex, 'gu')) || []);
  out.emoji = { count: emojiHits.length, samples: emojiHits.slice(0, 5) };

  const bodyBg = getComputedStyle(document.body).backgroundColor;
  const root = getComputedStyle(document.documentElement);
  const primary = root.getPropertyValue('--c-primary').trim();
  const primary2 = root.getPropertyValue('--c-primary-2').trim();
  const bgVar = root.getPropertyValue('--c-bg').trim();
  out.palette = { bodyBg, primary, primary2, bgVar };

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
  out.density = { inFold: inFold.length, filled: filled.length, samples: filled.slice(0, 8).map(n => n.innerText.replace(/\\s+/g, ' ').trim().slice(0, 60)) };

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
  out.touchTargets = { total: clickables.length, undersized: undersized.length, samples: undersized.slice(0, 8) };

  const bodyW = document.documentElement.scrollWidth;
  const winW  = window.innerWidth;
  out.hScroll = { scrollWidth: bodyW, innerWidth: winW, overflows: bodyW > winW + 1 };

  out.viewport = { w: vw, h: vh };
  return out;
})()`;

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
  // 3 modes → 3 file shapes:
  //   desktop → v62-1polish-{name}-desktop.png  (above-fold 1280×800)
  //   mobile  → v62-1polish-{name}-mobile.png   (above-fold 390×844)
  //   full    → v62-1polish-{name}-full.png     (desktop full-page, all viewports covered via desktop)
  // v62.1 polish keeps the same 18-shot shape as v6.2 integrated; only
  // the file prefix and port differ.
  const shotView = `${OUT}/v62-1polish-${name}-${kind === 'desktop' ? 'desktop' : 'mobile'}.png`;
  const shotFull = `${OUT}/v62-1polish-${name}-full.png`;
  const status = { name, kind, url };

  try {
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
    status.http = resp ? resp.status() : null;
    await page.waitForTimeout(900);

    const checks = await page.evaluate(VISUAL_CHECK);
    Object.assign(status, checks);

    await page.screenshot({ path: shotView, fullPage: false });
    status.viewFile = shotView;

    if (kind === 'desktop') {
      await page.screenshot({ path: shotFull, fullPage: true });
      status.fullFile = shotFull;
      try { status.fullBytes = statSync(shotFull).size; } catch (_) {}
    }

    try { status.viewBytes = statSync(shotView).size; } catch (_) {}

    const assetFails = fails.filter(f => !f.url.includes('/index.html') && !f.url.startsWith('data:') && !f.url.includes('favicon.ico'));
    status.assetFails = assetFails;
    status.totalRequests = requests.length;
    status.ok = true;
    console.log('[v62-1p] OK ', name, kind, status.http, `reqs=${requests.length} fails=${assetFails.length}`);
  } catch (e) {
    status.ok = false;
    status.err = e.message;
    console.log('[v62-1p] FAIL', name, kind, status.err);
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

  writeFileSync(`${OUT}/v62-1polish-raw.json`, JSON.stringify(results, null, 2));
  console.log('[v62-1p] manifest written:', `${OUT}/v62-1polish-raw.json`);

  const fail = results.filter(r => !r.ok).length;
  console.log('[v62-1p] DONE', { total: results.length, fail });
  process.exit(0);
})().catch(e => { console.error(e); process.exit(2); });
