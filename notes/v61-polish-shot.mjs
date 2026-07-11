// v6.1 Polish — verify P0/P1/P2 fixes via screenshots + touch-target check.
// Captures:
//   /prediction-markets/  desktop 1280×800   → v61-polish-prediction-desktop.png
//   /                     mobile  390×844    → v61-polish-home-mobile.png
// The mobile shot also runs the touch-target check (under-44×44 count).
import { chromium } from '/Users/christianmacion/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { writeFileSync, statSync } from 'node:fs';

const BASE = 'http://localhost:8765';
const OUT  = '/Users/christianmacion/Contingency/christianmacion.github.io/notes/screenshots';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const SHOTS = [
  {
    name: 'prediction-desktop',
    url: '/prediction-markets/',
    viewport: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, isMobile: false },
    kind: 'density',
  },
  {
    name: 'home-mobile',
    url: '/',
    viewport: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true,
                hasTouch: true,
                userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15' },
    kind: 'touch',
  },
];

// Playwright page.evaluate accepts a function directly. Define both checks
// as Node-side functions and pass them in. They close over no Node state.
function touchCheck() {
  const clickables = Array.from(document.querySelectorAll('a, button, [role="button"], input, select, textarea, summary, [tabindex]'));
  const undersized = [];
  for (const el of clickables) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    if (r.width < 44 || r.height < 44) {
      undersized.push({
        w: Math.round(r.width),
        h: Math.round(r.height),
        label: (el.innerText || el.getAttribute('aria-label') || el.getAttribute('href') || el.tagName).trim().slice(0, 60),
        tag: el.tagName,
        cls: (typeof el.className === 'string' ? el.className : el.className.baseVal || '').slice(0, 60),
      });
    }
  }
  const navLinks = Array.from(document.querySelectorAll('.nav__link, .nav__primary .nav-more__summary'));
  const navTiny  = navLinks.filter((el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.height < 44;
  }).length;
  return {
    total: clickables.length,
    undersized: undersized.length,
    navLinks: navLinks.length,
    navTiny,
    samples: undersized.slice(0, 12),
  };
}

function densityCheck() {
  const vh = window.innerHeight;
  const DATA = [
    'table td','table th','dt','dd',
    '[class*="stat"]','[class*="num"]','[class*="cell"]','[class*="row"]',
    '[class*="ticker"]','[class*="tape"]','[class*="metric"]','[class*="data"]',
    '[class*="depth"]','[class*="book"]','[class*="ladder"]','[class*="order"]',
    '[class*="price"]','[class*="volume"]','[class*="delta"]','[class*="coverage"]',
    '[class*="tick"]','[class*="spread"]','[class*="grid"]',
    '[class*="card__"]',
  ].join(',');
  const nodes = Array.from(document.querySelectorAll(DATA));
  const inFold = nodes.filter(n => {
    const r = n.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    if (r.bottom < 0 || r.top > vh) return false;
    return true;
  });
  const filled = inFold.filter(n => {
    const t = (n.innerText || '').trim();
    return t.length > 0 && /[\d.,%+\-x×$€£¥]/.test(t);
  });
  const tapeItems = Array.from(document.querySelectorAll('.tape__item'))
    .filter(n => { const r = n.getBoundingClientRect(); return r.bottom > 0 && r.top < vh && r.width > 0; });
  return {
    inFold: inFold.length,
    filled: filled.length,
    tapeItems: tapeItems.length,
    samples: filled.slice(0, 6).map(n => n.innerText.replace(/\s+/g, ' ').trim().slice(0, 60)),
  };
}

const log = (...a) => console.log('[v61-polish]', ...a);

(async () => {
  const browser = await chromium.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  const results = [];
  for (const shot of SHOTS) {
    const ctx = await browser.newContext(shot.viewport);
    const page = await ctx.newPage();
    const out = `${OUT}/v61-polish-${shot.name}.png`;
    try {
      const resp = await page.goto(BASE + shot.url, { waitUntil: 'networkidle', timeout: 20000 });
      await page.waitForTimeout(700);
      await page.screenshot({ path: out, fullPage: false });
      const checks = await page.evaluate(shot.kind === 'touch' ? touchCheck : densityCheck);
      const bytes = statSync(out).size;
      const status = {
        name: shot.name,
        url: BASE + shot.url,
        http: resp ? resp.status() : null,
        out,
        bytes,
        kind: shot.kind,
      };
      if (shot.kind === 'touch') status.touch = checks;
      else status.density = checks;
      log(shot.name, 'OK', status.http, `${bytes}B`,
          shot.kind === 'touch'
            ? `undersized=${checks.undersized}/${checks.total} navTiny=${checks.navTiny}/${checks.navLinks}`
            : `cells=${checks.filled} tape=${checks.tapeItems}`);
      results.push(status);
    } catch (e) {
      log(shot.name, 'FAIL', e.message);
      results.push({ name: shot.name, ok: false, err: e.message });
    } finally {
      await ctx.close();
    }
  }
  await browser.close();
  writeFileSync(`${OUT}/v61-polish-raw.json`, JSON.stringify(results, null, 2));
  log('manifest →', `${OUT}/v61-polish-raw.json`);
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(2); });