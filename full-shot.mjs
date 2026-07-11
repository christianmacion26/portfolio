#!/usr/bin/env node
/**
 * full-shot.mjs — full-page screenshot at exact viewport width.
 * Usage: node full-shot.mjs <url> <width> <outpath>
 */
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import http from 'node:http';
import WS from 'ws';

const [,, url, widthArg, outpath] = process.argv;
const width = Number.parseInt(widthArg ?? '375', 10);
const height = 812;

const port = 9444 + Math.floor(Math.random() * 200);
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
await send('Emulation.setDeviceMetricsOverride', {
  width, height, deviceScaleFactor: 1, mobile: width < 600,
});
await send('Page.navigate', { url });
await new Promise((r) => setTimeout(r, 3000));
const layout = await send('Page.getLayoutMetrics', {});
const fullH = Math.ceil(layout.result.cssContentSize.height);
console.error(`page height: ${fullH}px, capturing ${width}x${fullH}`);
const shot = await send('Page.captureScreenshot', {
  format: 'png',
  captureBeyondViewport: true,
  clip: { x: 0, y: 0, width, height: fullH, scale: 1 },
});
writeFileSync(outpath, Buffer.from(shot.result.data, 'base64'));
console.error(`wrote ${outpath} (${width}x${fullH})`);
ws.close();
chrome.kill();