const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA = path.join(__dirname, "chrome_test_profile");

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

async function run() {
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${USER_DATA}`,
    '--disable-gpu',
    'http://localhost:5173/'
  ]);

  await wait(1500);
  const targets = await getJson();
  const target = targets.find(t => t.url.includes('localhost:5173'));
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

  await evalCode(`
    const headings = Array.from(document.querySelectorAll('h2'));
    const target = headings.find(h => h.textContent.includes('Bersama Membangun'));
    if (target) {
      const sec = target.closest('section');
      if (sec) sec.setAttribute('id', 'section-features-grid');
    }
  `);

  const coords = await evalCode(`
    JSON.stringify(['#beranda', '#section-features-grid', '#tentang', '#laporan', '#dasar-hukum', '#berita', '#layanan', '#kontak'].map(sel => {
      const el = document.querySelector(sel);
      if (!el) return { sel, found: false };
      const r = el.getBoundingClientRect();
      return {
        sel,
        top: Math.round(r.top + window.scrollY),
        height: Math.round(r.height),
        bottom: Math.round(r.bottom + window.scrollY)
      };
    }))
  `);

  console.log("Section Coordinates:\n", JSON.parse(coords));
  chrome.kill();
  process.exit(0);
}

run();
