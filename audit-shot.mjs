#!/usr/bin/env node
/**
 * audit-shot.mjs — capture all 18 pages at desktop (1280x800) and mobile (375x812).
 * Usage: node audit-shot.mjs
 *
 * CDP-only viewport sizing (Emulation.setDeviceMetricsOverride). Uses a longer
 * settle delay (5s) and a more aggressive idle wait via Page.lifecycleEvent to
 * let the Astro islands settle.
 */
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import http from 'node:http';
import WS from 'ws';

const BASE = 'https://christianmacion-portfolio.pages.dev';
const PATHS = [
  '/', '/for-recruiters/', '/glossary/', '/methodology/', '/proof/', '/solutions/',
  '/projects/', '/experience/', '/certifications/', '/positions/', '/now/',
  '/about/', '/contact/', '/skills/', '/publications/', '/mistakes/', '/uses/',
  '/resume/',
];
const VIEWPORTS = [
  { w: 1280, h: 800, tag: 'desktop' },
  { w: 375, h: 812, tag: 'mobile' },
];

const SHOTS = [];
for (const p of PATHS) {
  for (const v of VIEWPORTS) {
    const slug = p === '/' ? 'home' : p.replace(/^\//, '').replace(/\/$/, '').replace(/\//g, '-');
    SHOTS.push([BASE + p, v.w, v.h, `${slug}-${v.tag}.png`]);
  }
}

const OUTDIR = process.argv[2] ?? '/tmp/shots-audit-v6';
mkdirSync(OUTDIR, { recursive: true });

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
await send('Network.enable');
await send('Page.setLifecycleEventsEnabled', { enabled: true });

for (const [url, width, height, outname] of SHOTS) {
  await send('Emulation.setDeviceMetricsOverride', {
    width, height, deviceScaleFactor: 1, mobile: width < 600,
  });
  // Reset scroll & navigate
  await send('Page.navigate', { url });
  // Wait longer for fonts + any JS hydration
  await new Promise((r) => setTimeout(r, 4500));
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const outpath = `${OUTDIR}/${outname}`;
  writeFileSync(outpath, Buffer.from(shot.result.data, 'base64'));
  console.error(`wrote ${outpath} (${width}x${height}) — ${url}`);
}
ws.close();
chrome.kill();
