#!/usr/bin/env node
/**
 * dark-shot.mjs — capture dark-mode screenshots at 1280 and 375.
 */
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import http from 'node:http';
import WS from 'ws';

const SHOTS = [
  ['https://christianmacion-portfolio.pages.dev/', 1280, 800, 'dark-home-d.png'],
  ['https://christianmacion-portfolio.pages.dev/', 375, 812, 'dark-home-m.png'],
  ['https://christianmacion-portfolio.pages.dev/for-recruiters/', 1280, 800, 'dark-recruiters-d.png'],
  ['https://christianmacion-portfolio.pages.dev/glossary/', 1280, 800, 'dark-glossary-d.png'],
  ['https://christianmacion-portfolio.pages.dev/methodology/', 1280, 800, 'dark-method-d.png'],
  ['https://christianmacion-portfolio.pages.dev/proof/', 1280, 800, 'dark-proof-d.png'],
  ['https://christianmacion-portfolio.pages.dev/solutions/', 1280, 800, 'dark-solutions-d.png'],
  ['https://christianmacion-portfolio.pages.dev/about/', 1280, 800, 'dark-about-d.png'],
  ['https://christianmacion-portfolio.pages.dev/now/', 1280, 800, 'dark-now-d.png'],
  ['https://christianmacion-portfolio.pages.dev/projects/', 1280, 800, 'dark-projects-d.png'],
  ['https://christianmacion-portfolio.pages.dev/experience/', 1280, 800, 'dark-experience-d.png'],
];

const OUTDIR = process.argv[2] ?? '/tmp/dark-shots';
mkdirSync(OUTDIR, { recursive: true });

const port = 9888 + Math.floor(Math.random() * 200);
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
  '--disable-extensions', `--remote-debugging-port=${port}`,
  '--remote-allow-origins=*', '--force-dark-mode', 'about:blank',
], { stdio: ['ignore', 'pipe', 'pipe'] });

async function wait() {
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
await wait();
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

for (const [url, width, height, outname] of SHOTS) {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] });
  await send('Page.navigate', { url });
  await new Promise((r) => setTimeout(r, 3500));
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const outpath = `${OUTDIR}/${outname}`;
  writeFileSync(outpath, Buffer.from(shot.result.data, 'base64'));
  console.error(`wrote ${outpath} (${width}x${height})`);
}
ws.close();
chrome.kill();