#!/usr/bin/env node
/**
 * multi-shot.mjs — shoot multiple URLs at multiple viewports.
 * Usage: node multi-shot.mjs
 */
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import http from 'node:http';
import WS from 'ws';

const SHOTS = [
  // [url, width, height, outpath]
  ['https://christianmacion-portfolio.pages.dev/', 1280, 800, 'home-desktop.png'],
  ['https://christianmacion-portfolio.pages.dev/', 375, 812, 'home-mobile.png'],
  ['https://christianmacion-portfolio.pages.dev/for-recruiters/', 1280, 800, 'recruiters-desktop.png'],
  ['https://christianmacion-portfolio.pages.dev/for-recruiters/', 375, 812, 'recruiters-mobile.png'],
  ['https://christianmacion-portfolio.pages.dev/glossary/', 1280, 800, 'glossary-desktop.png'],
  ['https://christianmacion-portfolio.pages.dev/glossary/', 375, 812, 'glossary-mobile.png'],
  ['https://christianmacion-portfolio.pages.dev/methodology/', 1280, 800, 'methodology-desktop.png'],
  ['https://christianmacion-portfolio.pages.dev/proof/', 1280, 800, 'proof-desktop.png'],
  ['https://christianmacion-portfolio.pages.dev/solutions/', 1280, 800, 'solutions-desktop.png'],
];

const OUTDIR = process.argv[2] ?? '/tmp/shots';

const port = 9777 + Math.floor(Math.random() * 200);
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

import { mkdirSync } from 'node:fs';
mkdirSync(OUTDIR, { recursive: true });

for (const [url, width, height, outname] of SHOTS) {
  await send('Emulation.setDeviceMetricsOverride', {
    width, height, deviceScaleFactor: 1, mobile: width < 600,
  });
  await send('Page.navigate', { url });
  await new Promise((r) => setTimeout(r, 3000));
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const outpath = `${OUTDIR}/${outname}`;
  writeFileSync(outpath, Buffer.from(shot.result.data, 'base64'));
  console.error(`wrote ${outpath} (${width}x${height}) — ${url}`);
}
ws.close();
chrome.kill();