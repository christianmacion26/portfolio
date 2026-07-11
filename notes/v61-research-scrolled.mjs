// Captures a few scrolled positions of /research so we can verify the
// factor table, asset-class matrix, and 9-card grid render correctly.
import { chromium } from '/Users/christianmacion/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';

const BASE = 'http://localhost:8765';
const OUT = '/Users/christianmacion/Contingency/christianmacion.github.io/notes/screenshots';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

(async () => {
  const browser = await chromium.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    isMobile: false,
  });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/research/index.html`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);

  // Anchor names map from the section IDs we wrote: acm-heading,
  // r-grid-heading, factor-heading, datasrc-heading, r-disclose-heading.
  const stops = [
    { name: 'matrix', anchor: '#acm-heading' },
    { name: 'grid',   anchor: '#r-grid-heading' },
    { name: 'factor', anchor: '#factor-heading' },
    { name: 'datasrc', anchor: '#datasrc-heading' },
    { name: 'end',    anchor: '#r-disclose-heading' },
  ];

  for (const s of stops) {
    await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      el?.scrollIntoView({ behavior: 'instant', block: 'start' });
    }, s.anchor);
    await page.waitForTimeout(200);
    await page.screenshot({
      path: `${OUT}/v61-research-${s.name}.png`,
      fullPage: false,
    });
    console.log('[section] OK', s.name);
  }

  await browser.close();
})().catch((e) => { console.error(e); process.exit(2); });
