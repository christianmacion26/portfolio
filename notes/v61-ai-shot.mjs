// Screenshot capture for the v6.1 Mission F /ai page.
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

async function snap(browser, kind, path, file) {
  const ctx = await browser.newContext(VIEWPORTS[kind]);
  const page = await ctx.newPage();
  const url = `${DIST}${path}index.html`;
  const status = { kind, url, file };
  try {
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
    status.http = resp ? resp.status() : null;
    await page.waitForTimeout(700);
    await page.screenshot({ path: file, fullPage: false });
    status.ok = true;
    console.log('[shot] OK ', kind, status.http, file);
  } catch (e) {
    status.ok = false;
    status.err = e.message;
    console.log('[shot] FAIL', kind, status.err);
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
  const r1 = await snap(browser, 'desktop', '/ai/', `${OUT}/v61-ai-desktop.png`);
  const r2 = await snap(browser, 'mobile',  '/ai/', `${OUT}/v61-ai-mobile.png`);
  await browser.close();
  const ok = [r1, r2].filter(r => r.ok).length;
  console.log('[shot] DONE', { ok, total: 2 });
  const fs = await import('node:fs');
  fs.writeFileSync(`${OUT}/v61-ai-manifest.json`, JSON.stringify([r1, r2], null, 2));
})().catch(e => { console.error(e); process.exit(2); });
