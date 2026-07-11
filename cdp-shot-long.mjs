// cdp-shot.mjs — capture viewport-sized PNG screenshots via DevTools Protocol
// Usage: node cdp-shot.mjs <url> <width> <height> <out.png>
import WebSocket from 'ws';
import http from 'node:http';
import fs from 'node:fs';
import { spawn } from 'node:child_process';

const [, , urlArg, wArg, hArg, outArg] = process.argv;
if (!urlArg || !wArg || !hArg || !outArg) {
  console.error('usage: node cdp-shot.mjs <url> <width> <height> <out.png>');
  process.exit(1);
}
const width = Number(wArg), height = Number(hArg);

// Start headless Chrome and pull its WS debugger URL.
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--remote-debugging-port=9224',
  '--user-data-dir=/tmp/cdp-shot-' + Date.now(),
  'about:blank',
], { stdio: ['ignore', 'ignore', 'ignore'] });

function getJson(path) {
  return new Promise((res, rej) => {
    http.get('http://127.0.0.1:9224' + path, (r) => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });
}

function waitForChrome(retries = 30) {
  return new Promise((res, rej) => {
    let tries = 0;
    (function tick() {
      getJson('/json/version').then(j => res(j.webSocketDebuggerUrl), (e) => {
        if (++tries >= retries) rej(e); else setTimeout(tick, 250);
      });
    })();
  });
}

const ws = await waitForChrome();
const socket = new WebSocket(ws);
let nextId = 1;
const callbacks = new Map();

socket.on('message', (data) => {
  const msg = JSON.parse(data.toString());
  if (msg.id && callbacks.has(msg.id)) {
    const { res, rej } = callbacks.get(msg.id);
    callbacks.delete(msg.id);
    msg.error ? rej(new Error(JSON.stringify(msg.error))) : res(msg.result);
  }
});

function send(method, params = {}) {
  const id = nextId++;
  return new Promise((res, rej) => {
    callbacks.set(id, { res, rej });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

await new Promise(r => socket.on('open', r));

// Single Page + navigation to URL.
await send('Target.createTarget', { url: 'about:blank' });
const { targetInfos } = await send('Target.getTargets', {});
const pageTarget = targetInfos.find(t => t.type === 'page');
const { sessionId } = await send('Target.attachToTarget', { targetId: pageTarget.targetId, flatten: true });

function sendSession(method, params = {}) {
  const id = nextId++;
  return new Promise((res, rej) => {
    callbacks.set(id, { res, rej });
    socket.send(JSON.stringify({ sessionId, id, method, params }));
  });
}

// Configure viewport to the requested size.
await sendSession('Emulation.setDeviceMetricsOverride', {
  width, height,
  deviceScaleFactor: 1,
  mobile: width < 600,
});

// Navigate to URL and wait for load.
await sendSession('Page.enable');
await new Promise((res, rej) => {
  function onMsg(data) {
    const m = JSON.parse(data.toString());
    if (m.method === 'Page.loadEventFired') { socket.off('message', onMsg); res(); }
  }
  socket.on('message', onMsg);
  sendSession('Page.navigate', { url: urlArg });
});
// Give KaTeX / fonts / animations ~600ms more.
await new Promise(r => setTimeout(r, 3500));

// Read the page's total scrollable height so we can capture the full page if requested.
const fullPage = process.env.FULL_PAGE === '1';
let captureParams = { format: 'png', captureBeyondViewport: false };
if (fullPage) {
  const { result } = await sendSession('Runtime.evaluate', {
    expression: 'document.documentElement.scrollHeight',
    returnByValue: true,
  });
  const totalH = Math.min(Number(result.value) || height, 4000);
  captureParams = { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width, height: totalH, scale: 1 } };
}

// Scroll position (in CSS pixels) for capturing past the fold.
const scrollY = Number(process.env.SCROLL_Y || 0);
if (scrollY > 0) {
  await sendSession('Runtime.evaluate', { expression: `window.scrollTo(0, ${scrollY}); document.documentElement.scrollTop` });
  await new Promise(r => setTimeout(r, 600));
}

const { data } = await sendSession('Page.captureScreenshot', captureParams);
fs.writeFileSync(outArg, Buffer.from(data, 'base64'));
console.log(`wrote ${outArg} (${width}x${height}) from ${urlArg}`);

chrome.kill();
socket.close();
process.exit(0);
