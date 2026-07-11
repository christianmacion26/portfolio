import { spawn } from 'child_process';
import { setTimeout as wait } from 'timers/promises';
import fs from 'fs';
import WebSocket from 'ws';

const url = process.argv[2];
const outPath = process.argv[3];
const vpW = Number(process.argv[4] || 1280);
const vpH = Number(process.argv[5] || 800);

const port = 9400 + Math.floor(Math.random() * 100);
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run',
  '--disable-extensions', '--disable-default-apps',
  '--remote-debugging-port=' + port,
], { stdio: 'ignore', detached: false });

await wait(1500);
let tabs = [];
for (let i = 0; i < 10; i++) {
  try {
    const r = await fetch('http://127.0.0.1:' + port + '/json');
    tabs = await r.json();
    if (tabs.length > 0) break;
  } catch (e) {}
  await wait(300);
}
const tab = tabs[0];

const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((r) => ws.once('open', r));

let msgId = 0;
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++msgId;
    const timeout = setTimeout(() => reject(new Error('timeout ' + method)), 8000);
    const handler = (data) => {
      const msg = JSON.parse(data);
      if (msg.id === id) {
        ws.off('message', handler);
        clearTimeout(timeout);
        resolve(msg.result);
      }
    };
    ws.on('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

await send('Emulation.setDeviceMetricsOverride', {
  width: vpW, height: vpH, deviceScaleFactor: 1, mobile: false,
});
await send('Page.enable');
await send('Page.navigate', { url });
await wait(3500);

const shot = await send('Page.captureScreenshot', { format: 'png' });
fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
console.log('OK', outPath, fs.statSync(outPath).size);

ws.close();
chrome.kill();
