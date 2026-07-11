// Baseline screenshot capture for v6.1 audit
// Uses Playwright via system Chrome at /Applications/Google Chrome.app
import { chromium } from '/Users/christianmacion/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';

const DIST = 'file:///Users/christianmacion/Contingency/christianmacion.github.io/dist';
const OUT = '/Users/christianmacion/Contingency/christianmacion.github.io/notes/screenshots';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const VIEWPORTS = {
  desktop: { width: 1280, height: 800,  deviceScaleFactor: 1, isMobile: false },
  mobile:  { width: 390,  height: 844,  deviceScaleFactor: 2, isMobile: true,
             userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15' },
};

// Each name -> (viewportKind, url)
const SHOTS = [
  ['home',           'desktop', '/'],
  ['home',           'mobile',  '/'],
  ['proof',          'desktop', '/proof/'],
  ['proof',          'mobile',  '/proof/'],
  ['methodology',    'desktop', '/methodology/'],
  ['methodology',    'mobile',  '/methodology/'],
  ['solutions',      'desktop', '/solutions/'],
  ['solutions',      'mobile',  '/solutions/'],
  ['certifications', 'desktop', '/certifications/'],
  ['certifications', 'mobile',  '/certifications/'],
  ['experience',     'desktop', '/experience/'],
  ['experience',     'mobile',  '/experience/'],
  ['about',          'desktop', '/about/'],
  ['about',          'mobile',  '/about/'],
  ['research',       'desktop', '/research/quant/01-deflated-sharpe/'],
  ['research',       'mobile',  '/research/quant/01-deflated-sharpe/'],
  ['markets',        'desktop', '/markets/'],
  ['markets',        'mobile',  '/markets/'],
];

const log = (...a) => console.log('[shot]', ...a);

async function snap(browser, name, kind, path) {
  const ctx = await browser.newContext(VIEWPORTS[kind]);
  const page = await ctx.newPage();
  const url = `${DIST}${path}index.html`;
  const file = `${OUT}/v61-baseline-${name}-${kind}.png`;
  const status = { name, kind, url, file };
  try {
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
    status.http = resp ? resp.status() : null;
    // wait for any deferred hydration
    await page.waitForTimeout(500);
    await page.screenshot({ path: file, fullPage: false });
    status.ok = true;
    log(status.ok ? 'OK ' : '!! ', name, kind, status.http, file);
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
  for (const [name, kind, path] of SHOTS) {
    const r = await snap(browser, name, kind, path);
    results.push(r);
  }
  await browser.close();
  // Summary
  const ok = results.filter(r => r.ok).length;
  const fail = results.filter(r => !r.ok).length;
  log('DONE', { total: results.length, ok, fail });
  // Write manifest
  const fs = await import('node:fs');
  fs.writeFileSync(`${OUT}/v61-baseline-manifest.json`, JSON.stringify(results, null, 2));
  process.exit(fail > 0 ? 0 : 0); // don't fail the run, just report
})().catch(e => { console.error(e); process.exit(2); });
