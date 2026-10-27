const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA = path.join(__dirname, "chrome_pdf_view");

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
    'file:///c:/Arif/projek%20coding/web_alumni/docs/DOKUMENTASI_FITUR_DASHBOARD_ADMIN.pdf'
  ]);

  await wait(2000);
  const targets = await getJson();
  const target = targets.find(t => t.url.includes('DOKUMENTASI_FITUR_DASHBOARD_ADMIN.pdf'));
  if (!target) {
    console.log("Not found target");
    chrome.kill();
    return;
  }

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  ws.send(JSON.stringify({
    id: 1,
    method: "Page.captureScreenshot",
    params: { format: "png" }
  }));

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.result && msg.result.data) {
      fs.writeFileSync(path.join(__dirname, "admin_pdf_page1.png"), Buffer.from(msg.result.data, 'base64'));
      console.log("Saved admin_pdf_page1.png");
      chrome.kill();
      process.exit(0);
    }
  };
}

main().catch(e => { console.error(e); process.exit(1); });
