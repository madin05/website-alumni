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
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1440,960"],
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 }
  });

  const page = await browser.newPage();
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // 1. Landing Page
  console.log("1. Capturing Landing Page...");
  await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
  await sleep(1000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "01_landing_page.png") });

  // 2. Login Page
  console.log("2. Capturing Login Page...");
  await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });
  await sleep(800);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "02_login_page.png") });

  // 3. Perform REAL UI Login
  console.log("3. Performing UI Login...");
  await page.waitForSelector("button[type='submit']");
  await page.click("button[type='submit']");
  await sleep(1500);

  console.log("Current page URL after login:", page.url());

  // 4. Dashboard Beranda
  console.log("4. Capturing Dashboard Beranda...");
  await sleep(1000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "03_dashboard_beranda.png") });

  // 5. Cek Ijazah Tab
  console.log("5. Capturing Cek Ijazah Tab...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button, a, div[role='button']"));
    const target = buttons.find(b => b.textContent && b.textContent.includes("Cek Ijazah"));
    if (target) target.click();
  });
  await sleep(1200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "04_dashboard_cek_ijazah.png") });

  // 6. Info Loker Tab
  console.log("6. Capturing Info Loker Tab...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button, a, div[role='button']"));
    const target = buttons.find(b => b.textContent && b.textContent.includes("Loker"));
    if (target) target.click();
  });
  await sleep(1200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "05_dashboard_loker.png") });

  // 7. Detail Loker Modal
  console.log("7. Capturing Detail Loker Modal...");
  try {
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const target = buttons.find(b => b.textContent && (b.textContent.includes("Detail") || b.textContent.includes("Lamar") || b.textContent.includes("Lihat")));
      if (target) target.click();
    });
    await sleep(800);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "06_dashboard_loker_detail.png") });
    await page.keyboard.press("Escape");
    await sleep(400);
  } catch (err) {
    console.warn("Loker modal capture warn:", err.message);
  }

  // 8. Direktori Alumni Tab
  console.log("8. Capturing Direktori Alumni Tab...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("aside button, aside a"));
    const target = buttons.find(b => b.textContent && b.textContent.trim() === "Alumni");
    if (target) target.click();
  });
  await sleep(1200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "07_dashboard_alumni.png") });

  // 9. Helpdesk Tab
  console.log("9. Capturing Helpdesk Tab...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("aside button, aside a"));
    const target = buttons.find(b => b.textContent && b.textContent.includes("Helpdesk"));
    if (target) target.click();
  });
  await sleep(1200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "08_dashboard_helpdesk.png") });

  // 10. Tracer Study Form / Wizard
  console.log("10. Capturing Tracer Study Form...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("aside button, aside a"));
    const target = buttons.find(b => b.textContent && b.textContent.includes("Tracer"));
    if (target) target.click();
  });
  await sleep(1200);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "09_tracer_study_wizard.png") });

  // 11. Mail Notification Dropdown
  console.log("11. Capturing Mail Notification Dropdown...");
  // Go back to beranda
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("aside button, aside a"));
    const target = buttons.find(b => b.textContent && b.textContent.includes("Beranda"));
    if (target) target.click();
  });
  await sleep(800);
  await page.evaluate(() => {
    const mailBtn = document.querySelector("button[title*='Kotak Masuk'], button[aria-label*='Pesan'], button[title*='Pesan']");
    if (mailBtn) mailBtn.click();
  });
  await sleep(800);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "10_dashboard_notifikasi.png") });
  await page.keyboard.press("Escape");
  await sleep(300);

  // 12. Receipt Modal
  console.log("12. Capturing Receipt Modal...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const receiptBtn = buttons.find(b => b.textContent && (b.textContent.includes("Bukti") || b.textContent.includes("Tanda Terima") || b.textContent.includes("Unduh")));
    if (receiptBtn) receiptBtn.click();
  });
  await sleep(800);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "11_bukti_tanda_terima_modal.png") });

  await browser.close();
  console.log("All screenshots captured with real UI state!");
}

run().catch((err) => {
  console.error("Capture error:", err);
  process.exit(1);
});
