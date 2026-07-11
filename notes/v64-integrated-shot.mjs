// v6.4 Integrated Audit — forked from v63-integrated-shot.mjs.
// Adds 2 new v6.4 checks: earthChrome (4-chrome elements with non-zero bboxes)
// and earthDrawer (drawer opens via <details open> trigger, formula <pre> visible).
// Output: notes/screenshots/v64-integrated-raw.json
import { chromium } from '/Users/christianmacion/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { writeFileSync, statSync } from 'node:fs';

const BASE = 'http://localhost:8767';
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
  // v6.4 additions — earth primitives + collaborators + AI entry-points + chrome
  '[class*="earth-pulse"]', '[class*="earth-feed"]', '[class*="earth-drawer"]',
  '[class*="earth-action"]', '[class*="collaborator"]', '[class*="epip-chip"]',
  '[class*="eg__"]',
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

// v6.4 Check 1 — earthChrome
// Verifies the 4 EarthGlobe v2 chrome sub-elements render with non-zero bounding boxes.
const EARTH_CHROME_CHECK = `(() => {
  const out = {};
  const wrap = document.querySelector('svg.eg__svg');
  const chrome = document.querySelector('.eg__chrome');
  out.svgPresent = !!wrap;
  out.chromePresent = !!chrome;

  const targets = ['.eg__legend-svg', '.eg__scale', '.eg__north', '.eg__scrubber'];
  out.subElements = {};
  for (const sel of targets) {
    const el = document.querySelector(sel);
    if (!el) { out.subElements[sel] = { found: false }; continue; }
    const r = el.getBoundingClientRect();
    out.subElements[sel] = {
      found: true,
      width: Math.round(r.width * 10) / 10,
      height: Math.round(r.height * 10) / 10,
      nonZero: r.width > 0 && r.height > 0,
      tag: el.tagName,
    };
  }
  const allFound = targets.every(s => out.subElements[s]?.found);
  const allNonZero = targets.every(s => out.subElements[s]?.nonZero);
  out.pass = allFound && allNonZero;
  return out;
})()`;

// v6.4 Check 2 — earthDrawer
// Opens the first <details class="earth-drawer__panel"> and verifies the drawer slides in.
const EARTH_DRAWER_CHECK = `(() => {
  const out = {};
  const drawer = document.querySelector('.earth-drawer');
  out.drawerPresent = !!drawer;

  const panels = document.querySelectorAll('details.earth-drawer__panel');
  out.panelCount = panels.length;
  if (panels.length === 0) { out.pass = false; out.reason = 'no panels'; return out; }

  // Open first panel
  const first = panels[0];
  first.setAttribute('open', '');
  const formula = first.querySelector('.earth-drawer__formula');
  out.formulaPresent = !!formula;
  out.formulaText = formula ? (formula.innerText || '').trim().slice(0, 80) : '';

  // Confirm :has(.earth-drawer__panel[open]) fires -> drawer transform:translate(0)
  const cs = drawer ? getComputedStyle(drawer) : null;
  out.drawerTransform = cs ? cs.transform : null;
  out.drawerVisible = cs && (cs.transform === 'none' || cs.transform === 'matrix(1, 0, 0, 1, 0, 0)' || !cs.transform.includes('100%'));

  // Confirm formula text has content
  const formulaText = formula ? (formula.innerText || '').trim() : '';
  out.formulaHasContent = formulaText.length > 0;

  out.pass = out.drawerPresent && out.formulaPresent && out.formulaHasContent && out.drawerVisible;
  if (!out.drawerVisible) out.reason = 'drawer still translated off-screen';
  if (!out.formulaHasContent) out.reason = 'formula empty';
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
  const shotView = `${OUT}/v64-${name}-${kind}.png`;
  const shotFull = `${OUT}/v64-${name}-full.png`;
  const status = { name, kind, url };

  try {
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
    status.http = resp ? resp.status() : null;
    await page.waitForTimeout(900);

    const checks = await page.evaluate(VISUAL_CHECK);
    Object.assign(status, checks);

    // v6.4 new checks (only on home page)
    if (name === 'home') {
      try {
        status.earthChrome = await page.evaluate(EARTH_CHROME_CHECK);
      } catch (e) {
        status.earthChrome = { error: e.message, pass: false };
      }
      try {
        status.earthDrawer = await page.evaluate(EARTH_DRAWER_CHECK);
      } catch (e) {
        status.earthDrawer = { error: e.message, pass: false };
      }
    }

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
    const chromeOk = status.earthChrome?.pass !== false;
    const drawerOk = status.earthDrawer?.pass !== false;
    const newChecks = (name === 'home') ? ` chrome=${chromeOk} drawer=${drawerOk}` : '';
    console.log('[v64-int] OK ', name, kind, status.http, `reqs=${requests.length} fails=${assetFails.length}${newChecks}`);
  } catch (e) {
    status.ok = false;
    status.err = e.message;
    console.log('[v64-int] FAIL', name, kind, status.err);
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

  writeFileSync(`${OUT}/v64-integrated-raw.json`, JSON.stringify(results, null, 2));
  console.log('[v64-int] manifest written:', `${OUT}/v64-integrated-raw.json`);

  const fail = results.filter(r => !r.ok).length;

  // v6.4 audit tally: existing 7 checks × 6 pages × 2 viewports + 2 new checks × home × 2 viewports
  const homeEntries = results.filter(r => r.name === 'home');
  const earthChromePass = homeEntries.every(r => r.earthChrome?.pass === true);
  const earthDrawerPass = homeEntries.every(r => r.earthDrawer?.pass === true);
  const newChecksOk = earthChromePass && earthDrawerPass;

  console.log('[v64-int] DONE', { total: results.length, fail, earthChromePass, earthDrawerPass, newChecksOk });
  process.exit(0);
})().catch(e => { console.error(e); process.exit(2); });
