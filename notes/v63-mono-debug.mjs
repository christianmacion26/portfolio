// Diagnostic: capture which elements fail tabular-nums on a given page
import { chromium } from '/Users/christianmacion/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';

const BASE = 'http://localhost:8767';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const PAGES = ['/markets/', '/prediction-markets/', '/proof/'];

const SCRIPT = `(() => {
  const vh = window.innerHeight;
  const selectors = '[class*="stat"],[class*="num"],[class*="cell"],[class*="row"],[class*="ticker"],[class*="quote"],[class*="metric"],[class*="data"],[class*="depth"],[class*="book"],[class*="ladder"],[class*="order"],[class*="price"],[class*="volume"],[class*="delta"],[class*="coverage"],[class*="tick"],[class*="spread"],[class*="grid"],[class*="tape"],[class*="hero"],[class*="feed"],[class*="event"],[class*="pin"],[class*="ingest"],[class*="desk"],[class*="odo"],[class*="hint"]';
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
  const noTabular = [];
  for (const n of filled) {
    if (!/[\\d]/.test(n.innerText || '')) continue;
    const cs = getComputedStyle(n);
    const tn = cs.fontVariantNumeric.includes('tabular-nums') || cs.fontVariantNumeric === 'tabular-nums';
    if (!tn) {
      noTabular.push({
        cls: n.className.toString().slice(0,80),
        tag: n.tagName,
        text: n.innerText.replace(/\\s+/g,' ').trim().slice(0,40),
        fvn: cs.fontVariantNumeric,
      });
    }
  }
  return { filled: filled.length, noTabular: noTabular.length, samples: noTabular.slice(0,15) };
})()`;

(async () => {
  const browser = await chromium.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage'],
  });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, isMobile: false });
  const page = await ctx.newPage();
  for (const path of PAGES) {
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(900);
    const out = await page.evaluate(SCRIPT);
    console.log(path, 'filled=', out.filled, 'noTabular=', out.noTabular);
    for (const s of out.samples) console.log('  ', JSON.stringify(s));
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(2); });