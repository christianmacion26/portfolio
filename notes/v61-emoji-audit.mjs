// Quick emoji re-check using the spec's exact regex on saved HTML
import { chromium } from '/Users/christianmacion/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';

const BASE = 'http://localhost:8765';
const PAGES = [
  ['home',      '/'],
  ['markets',   '/markets/'],
  ['prediction','/prediction-markets/'],
  ['research',  '/research/'],
  ['ai',        '/ai/'],
];

// Spec regex: ONLY the main emoji block \u{1F300}-\u{1F9FF}
const RE = /[\u{1F300}-\u{1F9FF}]/gu;

const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
for (const [name, path] of PAGES) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
  const text = await page.evaluate(() => document.body.innerText);
  const hits = (text.match(RE) || []);
  console.log(`${name.padEnd(12)}  strict-spec-emoji=${hits.length}  ${hits.slice(0,8).join(' ')}`);
  await ctx.close();
}
await browser.close();