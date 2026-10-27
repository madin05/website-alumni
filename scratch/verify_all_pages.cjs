const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA = path.join(__dirname, "chrome_verify_profile");

function wait(ms) {
  return new Promise(res => setTimeout(res, ms));
}

function getJson() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function main() {
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${USER_DATA}`,
    '--disable-gpu',
    'c:\\Arif\\projek coding\\web_alumni\\docs\\generate_landing_pdf.html'
  ]);

  await wait(1500);
  const targets = await getJson();
  const target = targets.find(t => t.url.includes('generate_landing_pdf.html'));
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  const evalCode = (code) => new Promise((resolve) => {
    const id = Math.floor(Math.random() * 10000);
    const handler = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.id === id) {
        ws.removeEventListener('message', handler);
        resolve(data.result.result.value);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({
      id,
      method: "Runtime.evaluate",
      params: { expression: code, returnByValue: true }
    }));
  });

  const sections = await evalCode(`
    JSON.stringify(Array.from(document.querySelectorAll('section')).map((sec, idx) => {
      const h2 = sec.querySelector('h2');
      const img = sec.querySelector('img');
      const r = sec.getBoundingClientRect();
      return {
        idx: idx + 1,
        title: h2 ? h2.textContent : 'No title',
        imgSrc: img ? img.getAttribute('src') : 'No image',
        height: Math.round(r.height),
        top: Math.round(r.top + window.scrollY)
      };
    }))
  `);

  console.log("Sections in PDF HTML:\n", JSON.parse(sections));
  chrome.kill();
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
