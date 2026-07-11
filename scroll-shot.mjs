#!/usr/bin/env node
/**
 * scroll-shot.mjs — scroll to a Y position, then capture viewport screenshot.
 * Usage: node scroll-shot.mjs <url> <width> <scrollY> <outpath>
 */
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import http from 'node:http';
import WS from 'ws';

const [,, url, widthArg, scrollYArg, outpath] = process.argv;
const width = Number.parseInt(widthArg ?? '375', 10);
const scrollY = Number.parseInt(scrollYArg ?? '800', 10);
const height = 812;

const port = 9555 + Math.floor(Math.random() * 200);
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
// scroll the page
await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${scrollY});` });
await new Promise((r) => setTimeout(r, 1500));
const shot = await send('Page.captureScreenshot', { format: 'png' });
writeFileSync(outpath, Buffer.from(shot.result.data, 'base64'));
console.error(`wrote ${outpath} (${width}x${height}, scrollY=${scrollY})`);
ws.close();
chrome.kill();