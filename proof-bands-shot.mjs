#!/usr/bin/env node
/**
 * proof-bands-shot.mjs — capture /proof sections P.2-P.5 lower bands
 * by scrolling to different y offsets in the full page.
 */
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import http from 'node:http';
import WS from 'ws';

const OUT_DIR = '/tmp/v6.0.2-shots';
mkdirSync(OUT_DIR, { recursive: true });

const SECTIONS = [
  // [url, width, height, scroll-y, name]
  ['http://127.0.0.1:9090/proof/', 1280, 800, 1100, 'proof-p2-flagships.png'],
  ['http://127.0.0.1:9090/proof/', 1280, 800, 3500, 'proof-p4-artifacts.png'],
  ['http://127.0.0.1:9090/proof/', 1280, 800, 1800, 'proof-p3-shipped.png'],
  ['http://127.0.0.1:9090/positions/', 1280, 800, 1100, 'positions-conversations.png'],
];

async function shotOne(url, width, height, scrollY, name) {
  const port = 9450 + Math.floor(Math.random() * 200);
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    '--disable-extensions', `--remote-debugging-port=${port}`,
    '--remote-allow-origins=*', 'about:blank',
  ], { stdio: ['ignore', 'pipe', 'pipe'] });
  for (let i = 0; i < 40; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(`http://127.0.0.1:${port}/json/version`, (res) => {
          let b = ''; res.on('data', (c) => (b += c)); res.on('end', () => resolve(b));
        });
        req.on('error', reject);
      });
      break;
    } catch { await new Promise((r) => setTimeout(r, 200)); }
  }
  const list = await new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}/json`, (res) => {
      let b = ''; res.on('data', (c) => (b += c)); res.on('end', () => resolve(JSON.parse(b)));
    }).on('error', reject);
  });
  const target = list.find((t) => t.type === 'page') ?? list[0];
  const ws = new WS(target.webSocketDebuggerUrl);
  await new Promise((r) => ws.on('open', r));
  let id = 1;
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const myId = id++;
      const onMsg = (data) => {
        const msg = JSON.parse(data.toString());
        if (msg.id === myId) { ws.off('message', onMsg); resolve(msg.result); }
      };
      ws.on('message', onMsg);
      ws.send(JSON.stringify({ id: myId, method, params }));
    });
  }
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width, height, deviceScaleFactor: 1, mobile: width <= 600,
  });
  await send('Page.navigate', { url });
  await new Promise((r) => setTimeout(r, 2500));
  // Scroll
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${scrollY})` });
  await new Promise((r) => setTimeout(r, 800));
  const { data } = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(`${OUT_DIR}/${name}`, Buffer.from(data, 'base64'));
  ws.close();
  chrome.kill();
  console.log(`wrote ${name} (y=${scrollY})`);
}

for (const args of SECTIONS) await shotOne(...args);
