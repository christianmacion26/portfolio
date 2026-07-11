import WebSocket from 'ws';
import http from 'node:http';
import fs from 'node:fs';
import { spawn } from 'node:child_process';

const url = process.argv[2] || 'https://christianmacion-portfolio.pages.dev/';

const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new', '--disable-gpu', '--no-sandbox',
  '--remote-debugging-port=9242', '--user-data-dir=/tmp/cdp-hc-' + Date.now(), 'about:blank',
], { stdio: ['ignore', 'ignore', 'ignore'] });

function getJson(p) { return new Promise((res, rej) => { http.get('http://127.0.0.1:9242' + p, (r) => { let d=''; r.on('data', c => d+=c); r.on('end', () => res(JSON.parse(d))); }).on('error', rej); }); }
const ws = await new Promise((res, rej) => { let t=0; (function tick(){ getJson('/json/version').then(j=>res(j.webSocketDebuggerUrl), e=>{ if(++t>=60) rej(e); else setTimeout(tick,250); }); })(); });
const socket = new WebSocket(ws);
let nextId = 1; const cbs = new Map();
socket.on('message', (data) => { const msg = JSON.parse(data.toString()); if (msg.id && cbs.has(msg.id)) { const { res, rej } = cbs.get(msg.id); cbs.delete(msg.id); msg.error ? rej(new Error(JSON.stringify(msg.error))) : res(msg.result); } });
function send(method, params = {}) { const id = nextId++; return new Promise((res, rej) => { cbs.set(id, { res, rej }); socket.send(JSON.stringify({ id, method, params })); }); }
await new Promise(r => socket.on('open', r));
await send('Target.createTarget', { url: 'about:blank' });
const { targetInfos } = await send('Target.getTargets', {});
const pageTarget = targetInfos.find(t => t.type === 'page');
const { sessionId } = await send('Target.attachToTarget', { targetId: pageTarget.targetId, flatten: true });
function sendSession(method, params = {}) { const id = nextId++; return new Promise((res, rej) => { cbs.set(id, { res, rej }); socket.send(JSON.stringify({ sessionId, id, method, params })); }); }

await sendSession('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
await sendSession('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] });
await sendSession('Page.enable');
await sendSession('Page.navigate', { url });
await new Promise(r => setTimeout(r, 2000));
await sendSession('Runtime.evaluate', { expression: `document.documentElement.setAttribute('data-theme', 'dark');` });
await new Promise(r => setTimeout(r, 1000));

// scroll to carousel
await sendSession('Runtime.evaluate', { expression: `document.querySelector('[data-stmt-carousel]')?.scrollIntoView({block: 'center'});` });
await new Promise(r => setTimeout(r, 1500));

const probe = await sendSession('Runtime.evaluate', { expression: `
JSON.stringify({
  carousels: document.querySelectorAll('[data-stmt-carousel]').length,
  activeTexts: Array.from(document.querySelectorAll('.stmt-carousel__slide.is-active')).map(s => s.textContent.trim()),
  allTexts: Array.from(document.querySelectorAll('.stmt-carousel__slide')).map(s => s.textContent.trim()),
  viewportHeight: document.querySelector('.stmt-carousel__viewport')?.getBoundingClientRect().height,
  slideHeight: document.querySelector('.stmt-carousel__slide')?.getBoundingClientRect().height,
  computedFontSize: getComputedStyle(document.querySelector('.stmt-carousel__slide.is-active')).fontSize,
  computedColor: getComputedStyle(document.querySelector('.stmt-carousel__slide.is-active')).color,
})
` });
console.log('home probe:', probe.result.value);

const { data } = await sendSession('Page.captureScreenshot', { format: 'png' });
fs.writeFileSync('/tmp/shot-home-carousel.png', Buffer.from(data, 'base64'));

socket.close(); chrome.kill();
