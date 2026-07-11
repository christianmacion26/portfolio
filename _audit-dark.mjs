#!/usr/bin/env node
/**
 * Dark-mode pass: set localStorage BEFORE first navigation, then capture all 6 pages.
 */
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import http from 'node:http';
import WS from 'ws';

const PAGES = [
  ['https://christianmacion-portfolio.pages.dev/', 'home'],
  ['https://christianmacion-portfolio.pages.dev/proof/', 'proof'],
  ['https://christianmacion-portfolio.pages.dev/methodology/', 'methodology'],
  ['https://christianmacion-portfolio.pages.dev/solutions/', 'solutions'],
  ['https://christianmacion-portfolio.pages.dev/projects/quant/01-deflated-sharpe/', 'dsr'],
  ['https://christianmacion-portfolio.pages.dev/for-recruiters/', 'recruiters'],
];

const OUTDIR = '/tmp/audit-shot';
mkdirSync(OUTDIR, { recursive: true });

const port = 9877 + Math.floor(Math.random() * 200);
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
  '--disable-extensions', `--remote-debugging-port=${port}`,
  '--remote-allow-origins=*', 'about:blank',
], { stdio: ['ignore', 'pipe', 'pipe'] });

async function waitForChrome() {
  for (let i = 0; i < 60; i++) {
    try {
      await new Promise((resolve, reject) => {
        http.get(`http://127.0.0.1:${port}/json/version`, (res) => {
          let b = ''; res.on('data', (c) => (b += c)); res.on('end', () => resolve(b));
        }).on('error', reject);
      });
      return;
    } catch { await new Promise((r) => setTimeout(r, 250)); }
  }
  throw new Error('Chrome did not start');
}
await waitForChrome();
const list = await new Promise((resolve, reject) => {
  http.get(`http://127.0.0.1:${port}/json/list`, (res) => {
    let b = ''; res.on('data', (c) => (b += c)); res.on('end', () => resolve(JSON.parse(b)));
  }).on('error', reject);
});
const target = list.find((t) => t.type === 'page');
const ws = new WS(target.webSocketDebuggerUrl);
let msgId = 0;
const pending = new Map();
ws.on('message', (data) => {
  const msg = JSON.parse(data.toString());
  if (msg.id && pending.has(msg.id)) {
    const { resolve } = pending.get(msg.id);
    pending.delete(msg.id);
    resolve(msg);
  }
});
await new Promise((resolve) => ws.once('open', resolve));
function send(method, params = {}) {
  const id = ++msgId;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve) => pending.set(id, { resolve }));
}
await send('Page.enable');

// Seed localStorage by visiting the origin first.
await send('Page.navigate', { url: 'https://christianmacion-portfolio.pages.dev/' });
await new Promise((r) => setTimeout(r, 3500));
await send('Runtime.evaluate', {
  expression: `localStorage.setItem('theme', 'dark');`,
});
await new Promise((r) => setTimeout(r, 800));

// Force dark via CDP Emulation (prefers-color-scheme: dark) so the inline-script fallback also fires.
await send('Emulation.setEmulatedMedia', {
  features: [{ name: 'prefers-color-scheme', value: 'dark' }],
});
await send('Emulation.setDeviceMetricsOverride', {
  width: 1280, height: 1800, deviceScaleFactor: 1, mobile: false,
});

for (const [url, name] of PAGES) {
  await send('Page.navigate', { url });
  // Re-affirm theme (the inline script reads localStorage on every load).
  await new Promise((r) => setTimeout(r, 5500));
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const outpath = `${OUTDIR}/${name}-dark.png`;
  writeFileSync(outpath, Buffer.from(shot.result.data, 'base64'));
  console.error(`wrote ${outpath} — ${url}`);
}

ws.close();
chrome.kill();