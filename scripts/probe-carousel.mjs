import { spawn } from 'child_process';
import { setTimeout as wait } from 'timers/promises';

const port = 9245;
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new', '--disable-gpu', '--no-sandbox',
  '--remote-debugging-port=' + port,
  '--window-size=1280,3200',
], { stdio: 'ignore' });

await wait(2500);
const tabsRes = await fetch('http://127.0.0.1:' + port + '/json');
const tabs = await tabsRes.json();
const tab = tabs[0];

import WebSocket from 'ws';
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((r) => ws.once('open', r));

let msgId = 0;
function send(method, params = {}) {
  return new Promise((resolve) => {
    const id = ++msgId;
    const handler = (data) => {
      const msg = JSON.parse(data);
      if (msg.id === id) { ws.off('message', handler); resolve(msg.result); }
    };
    ws.on('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

await send('Emulation.setDeviceMetricsOverride', {
  width: 1280, height: 800, deviceScaleFactor: 1, mobile: false,
});
await send('Page.enable');
await send('Page.navigate', { url: 'https://christianmacion-portfolio.pages.dev/' });
await wait(6000);

const probeScript = `
(function() {
  const out = {
    carouselsByClass: document.querySelectorAll('.stmt-carousel').length,
    carouselsByData: document.querySelectorAll('[data-stmt-carousel]').length,
    titles: Array.from(document.querySelectorAll('h1')).map(h => h.innerText.slice(0, 80)),
    allCarouselHTML: [],
  };
  document.querySelectorAll('.stmt-carousel, [data-stmt-carousel]').forEach((c) => {
    out.allCarouselHTML.push(c.outerHTML.slice(0, 200));
  });
  return out;
})()
`;

const probe = await send('Runtime.evaluate', {
  expression: probeScript,
  returnByValue: true,
});
console.log('PROBE:', JSON.stringify(probe.result.value, null, 2));

ws.close();
chrome.kill();
