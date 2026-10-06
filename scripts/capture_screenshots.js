import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const CHROME_PATH = fs.existsSync("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe")
  ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  : "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const BASE_URL = "http://localhost:5174";
const OUTPUT_DIR = path.resolve("docs");
const SCREENSHOT_DIR = path.join(OUTPUT_DIR, "screenshots");

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function run() {
  console.log("Launching browser with:", CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1440,960"],
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 }
  });

  const page = await browser.newPage();
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  console.log("1. Capturing Landing Page...");
  await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded", timeout: 15000 });
  await sleep(800);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "01_landing_page.png") });

  console.log("2. Capturing Login Page...");
  await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded", timeout: 15000 });
  await sleep(800);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "02_login_page.png") });

  console.log("3. Logging in as Alumni...");
  await page.evaluate(() => {
    const authData = {
      state: {
        isAuthenticated: true,
        user: {
          id: "usr-001",
          nisn: "0051234567",
          nama: "Ahmad Dani",
          email: "ahmaddani@example.com",
          role: "alumni",
          jurusan: "Teknik Komputer dan Jaringan",
          tahun_lulus: 2024,
          tracerStatus: "SUDAH",
          submissionId: "2026102498",
          submittedAt: "2026-09-26T13:38:16Z",
          jenisKelamin: "L"
        },
        lastDashboardActivity: Date.now()
      },
      version: 0
    };
    localStorage.setItem("auth-storage", JSON.stringify(authData));
  });

  console.log("4. Capturing Dashboard Beranda (Overview)...");
  await page.goto(`${BASE_URL}/dashboard?tab=beranda`, { waitUntil: "domcontentloaded", timeout: 15000 });
  await sleep(1000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "03_dashboard_beranda.png") });

  console.log("5. Capturing Cek Ijazah Tab...");
  await page.goto(`${BASE_URL}/dashboard?tab=cek_ijazah`, { waitUntil: "domcontentloaded", timeout: 15000 });
  await sleep(1000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "04_dashboard_cek_ijazah.png") });

  console.log("6. Capturing Info Loker Tab...");
  await page.goto(`${BASE_URL}/dashboard?tab=loker`, { waitUntil: "domcontentloaded", timeout: 15000 });
  await sleep(1000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "05_dashboard_loker.png") });

  console.log("7. Capturing Detail Loker Modal...");
  try {
    const cards = await page.$$("button");
    for (const btn of cards) {
      const txt = await page.evaluate((el) => el.textContent, btn);
      if (txt && (txt.includes("Detail") || txt.includes("Lihat"))) {
        await btn.click();
        await sleep(600);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, "06_dashboard_loker_detail.png") });
        await page.keyboard.press("Escape");
        await sleep(300);
        break;
      }
    }
  } catch (err) {
    console.warn("Could not capture loker detail modal:", err.message);
  }

  console.log("8. Capturing Direktori Alumni Tab...");
  await page.goto(`${BASE_URL}/dashboard?tab=alumni`, { waitUntil: "domcontentloaded", timeout: 15000 });
  await sleep(1000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "07_dashboard_alumni.png") });

  console.log("9. Capturing Helpdesk & Pusat Bantuan Tab...");
  await page.goto(`${BASE_URL}/dashboard?tab=helpdesk`, { waitUntil: "domcontentloaded", timeout: 15000 });
  await sleep(1000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "08_dashboard_helpdesk.png") });

  console.log("10. Capturing Tracer Study Page / Wizard...");
  await page.goto(`${BASE_URL}/tracer-study`, { waitUntil: "domcontentloaded", timeout: 15000 });
  await sleep(1000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "09_tracer_study_wizard.png") });

  console.log("11. Capturing Notifikasi / Mail Menu Popup...");
  await page.goto(`${BASE_URL}/dashboard?tab=beranda`, { waitUntil: "domcontentloaded", timeout: 15000 });
  await sleep(800);
  try {
    const mailBtn = await page.$("button[title*='Kotak Masuk'], button[aria-label*='Pesan']");
    if (mailBtn) {
      await mailBtn.click();
      await sleep(500);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, "10_dashboard_notifikasi.png") });
    }
  } catch (err) {
    console.warn("Could not capture mail popup:", err.message);
  }

  console.log("12. Capturing Bukti Tanda Terima Kuesioner (Receipt Modal)...");
  try {
    await page.goto(`${BASE_URL}/dashboard?tab=beranda`, { waitUntil: "domcontentloaded", timeout: 15000 });
    await sleep(800);
    const buttons = await page.$$("button");
    for (const btn of buttons) {
      const text = await page.evaluate((el) => el.textContent, btn);
      if (text && (text.includes("Bukti") || text.includes("Tanda Terima") || text.includes("Unduh"))) {
        await btn.click();
        await sleep(700);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, "11_bukti_tanda_terima_modal.png") });
        break;
      }
    }
  } catch (err) {
    console.warn("Could not capture receipt modal:", err.message);
  }

  await browser.close();
  console.log("All screenshots captured successfully!");
}

run().catch((err) => {
  console.error("Screenshot error:", err);
  process.exit(1);
});
