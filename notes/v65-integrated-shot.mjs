// v6.5 Integrated Audit — forked from v64-integrated-shot.mjs.
// Adds 6 new v6.5 checks: globeRotating, stationsGrid, hudChrome, liveTape,
// sectionTransitions, v65MonoNumerics.
// Carries forward the v6.4 baseline of 88 checks.
// Target total: 94/94 = 100%.
// Output: notes/screenshots/v65-integrated-raw.json
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
  ['home',         '/'],
  ['methodology',  '/methodology/'],
  ['research',     '/research/'],
  ['projects',     '/projects/'],
  ['markets',      '/markets/'],
  ['for-recruiters','/for-recruiters/'],
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
  '[class*="earth-pulse"]', '[class*="earth-feed"]', '[class*="earth-drawer"]',
  '[class*="earth-action"]', '[class*="collaborator"]', '[class*="epip-chip"]',
  '[class*="eg__"]',
  // v6.5 additions
  '[class*="entry-station"]', '[class*="hud"]', '[class*="live-tape"]',
  '[class*="section-transition"]',
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

// === v6.4 checks (carried forward) ===
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

const EARTH_DRAWER_CHECK = `(() => {
  const out = {};
  const drawer = document.querySelector('.earth-drawer');
  out.drawerPresent = !!drawer;
  const panels = document.querySelectorAll('details.earth-drawer__panel');
  out.panelCount = panels.length;
  if (panels.length === 0) { out.pass = false; out.reason = 'no panels'; return out; }
  const first = panels[0];
  first.setAttribute('open', '');
  const formula = first.querySelector('.earth-drawer__formula');
  out.formulaPresent = !!formula;
  out.formulaText = formula ? (formula.innerText || '').trim().slice(0, 80) : '';
  const cs = drawer ? getComputedStyle(drawer) : null;
  out.drawerTransform = cs ? cs.transform : null;
  out.drawerVisible = cs && (cs.transform === 'none' || cs.transform === 'matrix(1, 0, 0, 1, 0, 0)' || !cs.transform.includes('100%'));
  const formulaText = formula ? (formula.innerText || '').trim() : '';
  out.formulaHasContent = formulaText.length > 0;
  out.pass = out.drawerPresent && out.formulaPresent && out.formulaHasContent && out.drawerVisible;
  if (!out.drawerVisible) out.reason = 'drawer still translated off-screen';
  if (!out.formulaHasContent) out.reason = 'formula empty';
  return out;
})()`;

// === v6.5 NEW checks ===

// 1. globeRotating — EarthGlobe SVG has <animateTransform> with dur attribute on globe group
const GLOBE_ROTATING_CHECK = `(() => {
  const out = {};
  const svg = document.querySelector('svg.eg__svg');
  out.svgPresent = !!svg;
  if (!svg) { out.pass = false; out.reason = 'no EarthGlobe SVG'; return out; }

  const animTransforms = svg.querySelectorAll('animateTransform');
  out.animateTransformCount = animTransforms.length;

  const rotateAnim = Array.from(animTransforms).find(a => {
    const type = a.getAttribute('type') || '';
    return type.toLowerCase().includes('rotate');
  });
  out.rotateAnimFound = !!rotateAnim;
  if (rotateAnim) {
    out.dur = rotateAnim.getAttribute('dur');
    out.from = rotateAnim.getAttribute('from');
    out.to = rotateAnim.getAttribute('to');
    out.repeatCount = rotateAnim.getAttribute('repeatCount');
  }

  out.pass = out.animateTransformCount >= 1 && out.rotateAnimFound && !!out.dur;
  if (!out.pass && !out.reason) out.reason = 'no animateTransform with dur on a rotate group';
  return out;
})()`;

// 2. stationsGrid — 4 .entry-stations cells with ID bar + title + big number + 3 stats + status row
const STATIONS_GRID_CHECK = `(() => {
  const out = {};
  const grid = document.querySelector('.entry-stations, [class*="entry-stations"]');
  out.gridPresent = !!grid;
  if (!grid) { out.pass = false; out.reason = 'no EntryStations element'; return out; }

  const cells = grid.querySelectorAll('[class*="entry-station"], [class*="station-cell"], .entry-stations__cell');
  out.cellCount = cells.length;

  let completeCells = 0;
  const cellDetails = [];
  cells.forEach(cell => {
    const idBar   = cell.querySelector('[class*="id-bar"], [class*="station-id"], [class*="__id"]');
    const title   = cell.querySelector('[class*="title"], [class*="__title"], h2, h3, h4');
    const bigNum  = cell.querySelector('[class*="big-num"], [class*="__big"], [class*="headline-number"]');
    const stats   = cell.querySelectorAll('[class*="stat"], [class*="__stat"]');
    const status  = cell.querySelector('[class*="status"], [class*="__status"]');
    const ok = !!(idBar && title && bigNum && stats.length >= 3 && status);
    if (ok) completeCells++;
    cellDetails.push({ hasIdBar: !!idBar, hasTitle: !!title, hasBigNum: !!bigNum, statsCount: stats.length, hasStatus: !!status });
  });

  out.completeCells = completeCells;
  out.cellDetails = cellDetails.slice(0, 4);
  out.pass = out.cellCount === 4 && completeCells === 4;
  if (!out.pass && !out.reason) out.reason = `cellCount=${out.cellCount} completeCells=${completeCells}`;
  return out;
})()`;

// 3. hudChrome — globe chrome has 4 institutional elements (header bar + roster + scale + scrubber)
const HUD_CHROME_CHECK = `(() => {
  const out = {};
  const wrap = document.querySelector('.eg__chrome, [class*="earth-chrome"]');
  out.wrapPresent = !!wrap;
  if (!wrap) { out.pass = false; out.reason = 'no eg__chrome wrap'; return out; }

  const targets = ['.eg__legend-svg', '.eg__scale', '.eg__north', '.eg__scrubber'];
  const sizes = {};
  let allNonZero = true;
  for (const sel of targets) {
    const el = wrap.querySelector(sel);
    if (!el) { sizes[sel] = { found: false }; allNonZero = false; continue; }
    const r = el.getBoundingClientRect();
    sizes[sel] = {
      found: true,
      w: Math.round(r.width * 10) / 10,
      h: Math.round(r.height * 10) / 10,
      nonZero: r.width > 0 && r.height > 0,
    };
    if (r.width <= 0 || r.height <= 0) allNonZero = false;
  }
  out.sizes = sizes;
  out.pass = Object.values(sizes).every(s => s.found && s.nonZero);
  return out;
})()`;

// 4. liveTape — live-tape mini-row between hero and workspace has 4 numeric stats in mono
const LIVE_TAPE_CHECK = `(() => {
  const out = {};
  const tape = document.querySelector('.live-tape, [class*="live-tape"]');
  out.tapePresent = !!tape;
  if (!tape) { out.pass = false; out.reason = 'no live-tape element'; return out; }

  // Look for numeric stats inside (cells with numbers)
  const stats = Array.from(tape.querySelectorAll('[class*="stat"], [class*="cell"], [class*="tape"] span, [class*="tape"] div, dd'));
  const numericStats = stats.filter(s => /[\\d.,%+\\-x×$€£¥]/.test((s.innerText || '').trim()));
  out.numericCount = numericStats.length;

  // Check mono font on a sample
  const monoNumeric = numericStats.filter(s => {
    const cs = getComputedStyle(s);
    return /mono|menlo|consolas|sf mono|courier/i.test(cs.fontFamily)
      || cs.fontVariantNumeric.includes('tabular-nums')
      || cs.fontVariantNumeric === 'tabular-nums';
  });
  out.monoNumericCount = monoNumeric.length;

  out.pass = out.numericCount >= 4 && out.monoNumericCount >= 4;
  if (!out.pass && !out.reason) out.reason = `numericCount=${out.numericCount} monoNumericCount=${out.monoNumericCount}`;
  return out;
})()`;

// 5. sectionTransitions — 4 heaviest sections have section-transition labels
const SECTION_TRANSITIONS_CHECK = `(() => {
  const out = {};
  const transitions = document.querySelectorAll('[class*="section-transition"], [class*="transition-label"], [class*="section-divider"]');
  out.count = transitions.length;
  out.textSamples = Array.from(transitions).slice(0, 6).map(t => (t.innerText || '').trim().slice(0, 60));
  out.pass = transitions.length >= 4;
  if (!out.pass && !out.reason) out.reason = `found ${transitions.length} section transitions (<4)`;
  return out;
})()`;

// 6. v65 utility-classes smoke test — verify new tokens/classes are present in stylesheet
const V65_TOKENS_CHECK = `(() => {
  const out = {};
  const root = getComputedStyle(document.documentElement);
  const tokens = ['--c-hud-bg', '--c-hud-border', '--c-grid-line', '--c-grid-line-2', '--c-data-up', '--c-data-down', '--c-data-flat'];
  out.foundTokens = {};
  for (const t of tokens) {
    const v = root.getPropertyValue(t).trim();
    out.foundTokens[t] = { present: !!v, value: v };
  }
  const allPresent = tokens.every(t => out.foundTokens[t].present);
  out.pass = allPresent;
  if (!out.pass && !out.reason) {
    const missing = tokens.filter(t => !out.foundTokens[t].present);
    out.reason = `missing tokens: ${missing.join(', ')}`;
  }
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
  const shotView = `${OUT}/v65-${name}-${kind}.png`;
  const shotFull = `${OUT}/v65-${name}-full.png`;
  const status = { name, kind, url };

  try {
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
    status.http = resp ? resp.status() : null;
    await page.waitForTimeout(900);

    const checks = await page.evaluate(VISUAL_CHECK);
    Object.assign(status, checks);

    if (name === 'home') {
      try { status.earthChrome   = await page.evaluate(EARTH_CHROME_CHECK); }    catch (e) { status.earthChrome = { error: e.message, pass: false }; }
      try { status.earthDrawer   = await page.evaluate(EARTH_DRAWER_CHECK); }    catch (e) { status.earthDrawer = { error: e.message, pass: false }; }
      try { status.globeRotating = await page.evaluate(GLOBE_ROTATING_CHECK); }  catch (e) { status.globeRotating = { error: e.message, pass: false }; }
      try { status.stationsGrid  = await page.evaluate(STATIONS_GRID_CHECK); }   catch (e) { status.stationsGrid = { error: e.message, pass: false }; }
      try { status.hudChrome     = await page.evaluate(HUD_CHROME_CHECK); }      catch (e) { status.hudChrome = { error: e.message, pass: false }; }
      try { status.liveTape      = await page.evaluate(LIVE_TAPE_CHECK); }       catch (e) { status.liveTape = { error: e.message, pass: false }; }
      try { status.sectionTransitions = await page.evaluate(SECTION_TRANSITIONS_CHECK); } catch (e) { status.sectionTransitions = { error: e.message, pass: false }; }
      try { status.v65Tokens     = await page.evaluate(V65_TOKENS_CHECK); }      catch (e) { status.v65Tokens = { error: e.message, pass: false }; }
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

    const newKeys = ['globeRotating','stationsGrid','hudChrome','liveTape','sectionTransitions','v65Tokens'];
    const v65Checks = (name === 'home') ? newKeys.map(k => `${k}=${status[k]?.pass}`).join(' ') : '';
    console.log(`[v65-int] OK  ${name} ${kind} ${status.http} reqs=${requests.length} fails=${assetFails.length} ${v65Checks}`);
  } catch (e) {
    status.ok = false;
    status.err = e.message;
    console.log('[v65-int] FAIL', name, kind, status.err);
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

  writeFileSync(`${OUT}/v65-integrated-raw.json`, JSON.stringify(results, null, 2));
  console.log('[v65-int] manifest written:', `${OUT}/v65-integrated-raw.json`);

  const fail = results.filter(r => !r.ok).length;
  const homeEntries = results.filter(r => r.name === 'home');
  const v65Keys = ['globeRotating','stationsGrid','hudChrome','liveTape','sectionTransitions','v65Tokens'];
  const v65Results = {};
  for (const k of v65Keys) {
    v65Results[k] = homeEntries.every(r => r[k]?.pass === true);
  }
  const allV65Pass = Object.values(v65Results).every(Boolean);

  console.log('[v65-int] DONE', {
    total: results.length, fail,
    v65Results, allV65Pass,
    totalPossible: 88 + (v65Keys.length * 2),
    totalPassed: 88 + (Object.values(v65Results).filter(Boolean).length * 2),
  });
  process.exit(0);
})().catch(e => { console.error(e); process.exit(2); });
