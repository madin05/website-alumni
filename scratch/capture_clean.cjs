const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA = path.join(__dirname, "chrome_clean_profile");
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

  // Viewport standard
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: 1366,
    height: 850,
    deviceScaleFactor: 1.5,
    mobile: false
  });

  await client.send("Page.navigate", { url: "http://localhost:5173/" });
  await wait(2000);

  // Disable all animations & force full visibility
  await client.eval(`
    (() => {
      const style = document.createElement('style');
      style.id = 'force-visible-style';
      style.textContent = \`
        *, *::before, *::after {
          animation: none !important;
          transition: none !important;
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
  await wait(500);

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
  await wait(400);
  const dropdownShot = await client.send("Page.captureScreenshot", {
    format: "png",
    clip: { x: 0, y: 0, width: 1366, height: 280, scale: 1 },
    captureBeyondViewport: false
  });
  fs.writeFileSync(path.join(SCREENSHOT_DIR, "landing_02_dropdown_ijazah.png"), Buffer.from(dropdownShot.data, 'base64'));
  console.log("Saved: landing_02_dropdown_ijazah.png");

  // Sembunyikan header fixed agar tidak menutupi judul seksi lainnya
  await client.eval(`
    (() => {
      const header = document.querySelector('header');
      if (header) header.style.display = 'none';
    })()
  `);
  await wait(200);

  const sections = [
    { filename: 'landing_03_fitur_unggulan.png', selector: '#section-features-grid', padY: 20 },
    { filename: 'landing_04_tentang_tracer.png', selector: '#tentang', padY: 20 },
    { filename: 'landing_05_laporan_statistik.png', selector: '#laporan', padY: 20 },
    { filename: 'landing_06_landasan_hukum.png', selector: '#dasar-hukum', padY: 20 },
    { filename: 'landing_07_berita_terkini.png', selector: '#berita', padY: 25 },
    { filename: 'landing_08_faq_layanan.png', selector: '#layanan', padY: 20 },
    { filename: 'landing_09_footer_kontak.png', selector: '#kontak', padY: 10 }
  ];

  for (const sec of sections) {
    console.log(`Processing ${sec.filename} (${sec.selector})...`);

    // Get height first
    const h = await client.eval(`
      (() => {
        const el = document.querySelector('${sec.selector}');
        return el ? Math.round(el.offsetHeight) : null;
      })()
    `);

    if (!h) {
      console.warn(`Element ${sec.selector} not found!`);
      continue;
    }

    // Set viewport height dynamically to accommodate the element comfortably
    const vh = Math.max(900, h + 100);
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: 1366,
      height: vh,
      deviceScaleFactor: 1.5,
      mobile: false
    });

    // Scroll element directly to top
    await client.eval(`
      (() => {
        const el = document.querySelector('${sec.selector}');
        el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()
    `);
    await wait(300);

    const rect = await client.eval(`
      (() => {
        const el = document.querySelector('${sec.selector}');
        const r = el.getBoundingClientRect();
        return {
          top: Math.round(r.top),
          height: Math.round(r.height),
          width: Math.round(r.width)
        };
      })()
    `);

    const clipY = Math.max(0, rect.top - sec.padY);
    const clipH = rect.height + (sec.padY * 2);

    const shot = await client.send("Page.captureScreenshot", {
      format: "png",
      clip: {
        x: 0,
        y: clipY,
        width: 1366,
        height: clipH,
        scale: 1
      },
      captureBeyondViewport: false
    });

    fs.writeFileSync(path.join(SCREENSHOT_DIR, sec.filename), Buffer.from(shot.data, 'base64'));
    console.log(`Saved ${sec.filename} (${Math.round(shot.data.length * 0.75 / 1024)} KB)`);
  }

  // Restore header and reset viewport for fullpage screenshot
  await client.eval(`
    (() => {
      const header = document.querySelector('header');
      if (header) header.style.display = '';
      window.scrollTo({ top: 0, behavior: 'instant' });
    })()
  `);

  const docHeight = await client.eval(`document.body.scrollHeight`);
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: 1366,
    height: docHeight + 100,
    deviceScaleFactor: 1.0,
    mobile: false
  });
  await wait(500);

  const fullShot = await client.send("Page.captureScreenshot", {
    format: "png",
    clip: { x: 0, y: 0, width: 1366, height: docHeight, scale: 0.8 },
    captureBeyondViewport: false
  });
  fs.writeFileSync(path.join(SCREENSHOT_DIR, "landing_00_fullpage.png"), Buffer.from(fullShot.data, 'base64'));
  console.log("Saved: landing_00_fullpage.png");

  console.log("SUCCESSFULLY CAPTURED ALL CLEAN SECTIONS!");
  chrome.kill();
  process.exit(0);
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
