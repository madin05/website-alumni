import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const CHROME_PATH = fs.existsSync("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe")
  ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  : "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const BASE_URL = "http://localhost:5174";
const OUTPUT_DIR = path.resolve("docs");
const SCREENSHOT_DIR = path.join(OUTPUT_DIR, "screenshots");

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1440,960"],
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 }
  });

  const page = await browser.newPage();
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // Set auth state
  await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });
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

  console.log("1. Capturing Loker Detail Modal...");
  await page.goto(`${BASE_URL}/dashboard?tab=loker`, { waitUntil: "domcontentloaded" });
  await sleep(1000);
  // Find card and click
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button, div[role='button']"));
    const target = buttons.find(b => b.textContent && (b.textContent.includes("Detail") || b.textContent.includes("Lamar") || b.textContent.includes("Lihat")));
    if (target) target.click();
  });
  await sleep(800);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "06_dashboard_loker_detail.png") });

  console.log("2. Capturing Mail Notification Popup...");
  await page.goto(`${BASE_URL}/dashboard?tab=beranda`, { waitUntil: "domcontentloaded" });
  await sleep(1000);
  await page.evaluate(() => {
    const mailBtn = document.querySelector("button[aria-label*='Pesan'], button[title*='Pesan'], button[title*='Kotak']");
    if (mailBtn) mailBtn.click();
  });
  await sleep(800);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "10_dashboard_notifikasi.png") });

  console.log("3. Capturing Bukti Tanda Terima Kuesioner Modal...");
  await page.goto(`${BASE_URL}/dashboard?tab=beranda`, { waitUntil: "domcontentloaded" });
  await sleep(1000);
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const receiptBtn = buttons.find(b => b.textContent && (b.textContent.includes("Bukti") || b.textContent.includes("Tanda Terima") || b.textContent.includes("Unduh")));
    if (receiptBtn) receiptBtn.click();
  });
  await sleep(800);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "11_bukti_tanda_terima_modal.png") });

  await browser.close();
  console.log("Targeted modals captured!");
}

run().catch((err) => {
  console.error("Modal capture error:", err);
  process.exit(1);
});
