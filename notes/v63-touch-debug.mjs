// Diagnostic: list which elements are undersized on home/mobile
import { chromium } from '/Users/christianmacion/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';

const BASE = 'http://localhost:8767';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const SCRIPT = `(() => {
  const clickables = Array.from(document.querySelectorAll('a, button, [role="button"], input, select, textarea, summary, [tabindex]'));
  const out = [];
  for (const el of clickables) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    if (r.width < 44 || r.height < 44) {
      const label = (el.innerText || el.getAttribute('aria-label') || el.getAttribute('href') || el.tagName).trim().slice(0, 40);
      out.push({ w: Math.round(r.width), h: Math.round(r.height), label, cls: el.className.toString().slice(0,60) });
    }
  }
  return out;
})()`;

(async () => {
  const browser = await chromium.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage'],
  });
  for (const path of ['/','/markets/','/prediction-markets/','/research/','/ai/','/proof/']) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(900);
    const undersized = await page.evaluate(SCRIPT);
    console.log(`\n=== ${path} (${undersized.length} undersized) ===`);
    for (const u of undersized) console.log(`  ${u.w}x${u.h}  ${u.label}  [${u.cls}]`);
    await ctx.close();
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(2); });
