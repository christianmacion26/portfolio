// v6.1.0 Mission G — capture home page (1280x800 desktop + 390x844 mobile)
// so we can visually verify the new entry-point strip + Markets dropdown.
import { chromium } from '/Users/christianmacion/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';

const DIST = 'http://localhost:8765';
const OUT = '/Users/christianmacion/Contingency/christianmacion.github.io/notes/screenshots';
// Use viewport sizing without `isMobile: true` — that flag enables device
// emulation (touch events, meta viewport override) which can lock the layout
// viewport at a non-ideal size and prevent our @media queries from firing.
// Pure width-based sizing lets the page's <meta viewport> + width=device-width
// rule cascade correctly, so our @media (max-width: 980px / 880px / 540px)
// breakpoints actually apply.
//
// NOTE: newContext({viewport}) alone doesn't always stick with the system
// Chrome this script uses; use page.setViewportSize() AFTER goto as a belt-
// and-suspenders measure.
const VIEWPORTS = {
  desktop: { width: 1280, height: 800, deviceScaleFactor: 1 },
  mobile:  { width: 390,  height: 844, deviceScaleFactor: 1 },
};
const SHOTS = [
  ['home', 'desktop', '/'],
  ['home', 'mobile',  '/'],
];
const log = (...a) => console.log('[shot]', ...a);
async function snap(browser, name, kind, path) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.setViewportSize(VIEWPORTS[kind]);
  const url = `${DIST}${path}index.html`;
  const file = `${OUT}/v61-home-${kind}.png`;
  const status = { name, kind, url, file };
  try {
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
    status.http = resp ? resp.status() : null;
    await page.waitForTimeout(500);
    // Fold-view shot at exactly the spec'd 800h, then a full-page shot so
    // we can see the entry-strip + stat row in one image.
    await page.screenshot({ path: file, fullPage: false });
    await page.screenshot({ path: file.replace('.png', '-full.png'), fullPage: true });
    status.ok = true;
    log('OK', name, kind, status.http, file);
  } catch (e) {
    status.ok = false;
    status.err = e.message;
    log('FAIL', name, kind, status.err);
  } finally {
    await ctx.close();
    return status;
  }
}
const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
});
const out = [];
for (const [n, k, p] of SHOTS) out.push(await snap(browser, n, k, p));
await browser.close();
console.log(JSON.stringify(out, null, 2));