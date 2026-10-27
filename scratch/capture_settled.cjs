const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA = path.join(__dirname, "chrome_settled_profile");
const SCREENSHOT_DIR = path.resolve(__dirname, "..", "docs", "screenshots");

function wait(ms) {
  return new Promise(res => setTimeout(res, ms));
}

function getJson() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 0;
    this.callbacks = new Map();
    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
  }

  ready() {
    return new Promise((resolve) => {
      if (this.ws.readyState === WebSocket.OPEN) resolve();
      else this.ws.onopen = () => resolve();
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.id;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    return res.result ? res.result.value : null;
  }
}

async function main() {
  console.log("Starting Chrome...");
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${USER_DATA}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'http://localhost:5173/'
  ]);

  let targets = null;
  for (let i = 0; i < 20; i++) {
    await wait(400);
    try {
      targets = await getJson();
      if (targets && targets.length > 0) break;
    } catch (e) {}
  }

  const landingTarget = targets.find(t => t.url.includes('localhost:5173') || t.title.includes('SMK') || t.type === 'page');
  const client = new CDPClient(landingTarget.webSocketDebuggerUrl);
  await client.ready();

  await client.send("Page.enable");
  await client.send("DOM.enable");
  await client.send("Runtime.enable");

  // Viewport 1366x850 at 1.5x scale
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: 1366,
    height: 850,
    deviceScaleFactor: 1.5,
    mobile: false
  });

  await client.send("Page.navigate", { url: "http://localhost:5173/" });
  
  // Wait 3.5s for React, Zustand, and all components to fully stabilize
  console.log("Waiting for app stabilization...");
  await wait(3500);

  // Injeksi stylesheet untuk transparansi dan animasi
  await client.eval(`
    (() => {
      const style = document.createElement('style');
      style.id = 'force-visible-style';
      style.textContent = \`
        *, *::before, *::after {
          animation-duration: 0.001s !important;
          animation-delay: 0s !important;
          transition-duration: 0.001s !important;
          transition-delay: 0s !important;
        }
        .opacity-0 {
          opacity: 1 !important;
          transform: none !important;
        }
      \`;
      document.head.appendChild(style);

      // Open first FAQ
      const faqBtn = document.querySelector('#layanan button');
      if (faqBtn) faqBtn.click();

      // Tag features grid
      const headings = Array.from(document.querySelectorAll('h2'));
      const target = headings.find(h => h.textContent.includes('Bersama Membangun'));
      if (target) {
        const sec = target.closest('section');
        if (sec) sec.setAttribute('id', 'section-features-grid');
      }
    })()
  `);
  await wait(600);

  // 1. Hero & Navbar (Top Viewport)
  console.log("1. Capturing Hero & Navbar...");
  await client.eval(`window.scrollTo({ top: 0, behavior: 'instant' });`);
  await wait(300);
  const heroShot = await client.send("Page.captureScreenshot", {
    format: "png",
    clip: { x: 0, y: 0, width: 1366, height: 750, scale: 1 },
    captureBeyondViewport: false
  });
  fs.writeFileSync(path.join(SCREENSHOT_DIR, "landing_01_hero_navbar.png"), Buffer.from(heroShot.data, 'base64'));
  console.log("Saved: landing_01_hero_navbar.png");

  // 2. Dropdown Tracer Study (Cek Ijazah)
  console.log("2. Capturing Dropdown Cek Ijazah...");
  await client.eval(`
    (() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      const buttons = Array.from(document.querySelectorAll('header nav button'));
      const tsBtn = buttons.find(b => b.textContent.includes('Tracer Study'));
      if (tsBtn) tsBtn.click();
    })()
  `);
  await wait(500);
  const dropdownShot = await client.send("Page.captureScreenshot", {
    format: "png",
    clip: { x: 0, y: 0, width: 1366, height: 280, scale: 1 },
    captureBeyondViewport: false
  });
  fs.writeFileSync(path.join(SCREENSHOT_DIR, "landing_02_dropdown_ijazah.png"), Buffer.from(dropdownShot.data, 'base64'));
  console.log("Saved: landing_02_dropdown_ijazah.png");

  // Sembunyikan header fixed dan pastikan scroll ke 0
  await client.eval(`
    (() => {
      const header = document.querySelector('header');
      if (header) header.style.display = 'none';
      window.scrollTo({ top: 0, behavior: 'instant' });
    })()
  `);
  await wait(300);

  const sectionsToCapture = [
    { filename: 'landing_03_fitur_unggulan.png', selector: '#section-features-grid' },
    { filename: 'landing_04_tentang_tracer.png', selector: '#tentang' },
    { filename: 'landing_05_laporan_statistik.png', selector: '#laporan' },
    { filename: 'landing_06_landasan_hukum.png', selector: '#dasar-hukum' },
    { filename: 'landing_07_berita_terkini.png', selector: '#berita' },
    { filename: 'landing_08_faq_layanan.png', selector: '#layanan' },
    { filename: 'landing_09_footer_kontak.png', selector: '#kontak' }
  ];

  for (const item of sectionsToCapture) {
    console.log(`Measuring and capturing ${item.filename} (${item.selector})...`);
    
    // Always ensure scroll is at 0 before measuring
    await client.eval(`window.scrollTo({ top: 0, behavior: 'instant' });`);
    await wait(200);

    const r = await client.eval(`
      (() => {
        const el = document.querySelector('${item.selector}');
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return {
          top: Math.round(rect.top),
          height: Math.round(rect.height),
          width: Math.round(rect.width)
        };
      })()
    `);

    if (!r) {
      console.warn(`Selector ${item.selector} not found!`);
      continue;
    }

    console.log(`Measured ${item.selector}: top = ${r.top}, height = ${r.height}`);

    const pad = item.filename.includes('footer') ? 5 : 15;
    const shot = await client.send("Page.captureScreenshot", {
      format: "png",
      clip: {
        x: 0,
        y: Math.max(0, r.top - pad),
        width: 1366,
        height: r.height + (pad * 2),
        scale: 1
      },
      captureBeyondViewport: true
    });

    fs.writeFileSync(path.join(SCREENSHOT_DIR, item.filename), Buffer.from(shot.data, 'base64'));
    console.log(`Saved ${item.filename} (${Math.round(shot.data.length * 0.75 / 1024)} KB)`);
  }

  // Restore header and reset scroll
  await client.eval(`
    (() => {
      const header = document.querySelector('header');
      if (header) header.style.display = '';
      window.scrollTo({ top: 0, behavior: 'instant' });
    })()
  `);
  await wait(300);

  const docHeight = await client.eval(`document.body.scrollHeight`);
  const fullShot = await client.send("Page.captureScreenshot", {
    format: "png",
    clip: { x: 0, y: 0, width: 1366, height: Math.min(docHeight, 6500), scale: 0.8 },
    captureBeyondViewport: true
  });
  fs.writeFileSync(path.join(SCREENSHOT_DIR, "landing_00_fullpage.png"), Buffer.from(fullShot.data, 'base64'));
  console.log("Saved: landing_00_fullpage.png");

  console.log("ALL SECTIONS SETTLED AND CAPTURED!");
  chrome.kill();
  process.exit(0);
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
