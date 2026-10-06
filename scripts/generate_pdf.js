import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const CHROME_PATH = fs.existsSync("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe")
  ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  : "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const DOCS_DIR = path.resolve("docs");
const SCREENSHOT_DIR = path.join(DOCS_DIR, "screenshots");
const PDF_OUTPUT_PATH = path.join(DOCS_DIR, "DOKUMENTASI_FITUR_DASHBOARD_USER.pdf");

function getBase64Image(filename) {
  const filePath = path.join(SCREENSHOT_DIR, filename);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    return `data:image/png;base64,${data.toString("base64")}`;
  }
  return "";
}

async function generatePdf() {
  console.log("Preparing HTML document with embedded visual assets...");

  const imgLanding = getBase64Image("01_landing_page.png");
  const imgLogin = getBase64Image("02_login_page.png");
  const imgBeranda = getBase64Image("03_dashboard_beranda.png");
  const imgCekIjazah = getBase64Image("04_dashboard_cek_ijazah.png");
  const imgLoker = getBase64Image("05_dashboard_loker.png");
  const imgLokerDetail = getBase64Image("06_dashboard_loker_detail.png");
  const imgAlumni = getBase64Image("07_dashboard_alumni.png");
  const imgHelpdesk = getBase64Image("08_dashboard_helpdesk.png");
  const imgTracer = getBase64Image("09_tracer_study_wizard.png");
  const imgNotif = getBase64Image("10_dashboard_notifikasi.png");
  const imgReceipt = getBase64Image("11_bukti_tanda_terima_modal.png");

  const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Panduan & Dokumentasi Fitur Dashboard Alumni - SMK Sasmita Jaya 2</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    @page {
      size: A4;
      margin: 14mm 14mm 14mm 14mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1e293b;
      background: #ffffff;
      line-height: 1.55;
      font-size: 11.5pt;
    }

    .cover-page {
      page-break-after: always;
      min-height: 90vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 30px 20px;
      border: 2px solid #e2e8f0;
      border-radius: 16px;
      background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
    }

    .cover-header {
      border-bottom: 2px solid #0d2346;
      padding-bottom: 20px;
    }

    .cover-badge {
      display: inline-block;
      background: #0d2346;
      color: #ffffff;
      font-size: 9pt;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 6px 14px;
      border-radius: 20px;
      margin-bottom: 14px;
    }

    .cover-title {
      font-size: 24pt;
      font-weight: 800;
      color: #0d2346;
      line-height: 1.25;
      margin-bottom: 10px;
    }

    .cover-subtitle {
      font-size: 13pt;
      color: #475569;
      font-weight: 500;
      line-height: 1.4;
    }

    .cover-hero-img {
      width: 100%;
      border-radius: 12px;
      border: 1px solid #cbd5e1;
      box-shadow: 0 4px 14px rgba(0,0,0,0.06);
      margin: 20px 0;
      max-height: 340px;
      object-fit: cover;
      object-position: top;
    }

    .cover-meta {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      background: #f1f5f9;
      padding: 16px;
      border-radius: 10px;
      border: 1px solid #e2e8f0;
      font-size: 9.5pt;
    }

    .cover-meta-item strong {
      display: block;
      color: #0d2346;
      font-size: 8.5pt;
      text-transform: uppercase;
      margin-bottom: 2px;
    }

    .section-block {
      page-break-inside: avoid;
      margin-bottom: 28px;
    }

    .page-break {
      page-break-after: always;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 8px;
      margin-bottom: 12px;
    }

    .section-num {
      background: #0d2346;
      color: #ffffff;
      font-size: 10pt;
      font-weight: 700;
      width: 26px;
      height: 26px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .section-title {
      font-size: 14pt;
      font-weight: 700;
      color: #0d2346;
    }

    .target-badge {
      display: inline-block;
      background: #e0f2fe;
      color: #0369a1;
      font-size: 9pt;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 6px;
      margin-bottom: 10px;
    }

    p {
      color: #334155;
      margin-bottom: 10px;
      text-align: justify;
    }

    .feature-list {
      list-style: none;
      margin: 10px 0 14px 0;
    }

    .feature-list li {
      position: relative;
      padding-left: 18px;
      margin-bottom: 6px;
      color: #334155;
      font-size: 10.5pt;
    }

    .feature-list li::before {
      content: "•";
      color: #2563eb;
      font-size: 16pt;
      position: absolute;
      left: 2px;
      top: -4px;
      font-weight: bold;
    }

    .screenshot-box {
      width: 100%;
      border-radius: 10px;
      border: 1px solid #cbd5e1;
      overflow: hidden;
      box-shadow: 0 3px 10px rgba(0,0,0,0.05);
      margin: 12px 0;
      background: #ffffff;
    }

    .screenshot-box img {
      width: 100%;
      display: block;
    }

    .screenshot-caption {
      background: #f8fafc;
      padding: 6px 12px;
      font-size: 8.5pt;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
      font-style: italic;
    }

    .callout-box {
      background: #f8fafc;
      border-left: 4px solid #0d2346;
      padding: 10px 14px;
      border-radius: 0 8px 8px 0;
      margin: 12px 0;
      font-size: 10pt;
      color: #1e293b;
    }

    .callout-box strong {
      color: #0d2346;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin: 12px 0;
    }

    .mini-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 9.5pt;
    }

    .mini-card h4 {
      color: #0d2346;
      font-size: 10pt;
      margin-bottom: 4px;
      font-weight: 700;
    }

    .footer-doc {
      margin-top: 30px;
      padding-top: 12px;
      border-top: 1px solid #cbd5e1;
      display: flex;
      justify-content: space-between;
      color: #94a3b8;
      font-size: 8.5pt;
    }
  </style>
</head>
<body>

  <!-- COVER PAGE -->
  <div class="cover-page">
    <div class="cover-header">
      <div class="cover-badge">Dokumentasi Resmi Sistem</div>
      <h1 class="cover-title">PANDUAN & DOKUMENTASI VISUAL FITUR DASHBOARD ALUMNI</h1>
      <p class="cover-subtitle">Portal Layanan Mandiri, Penelusuran Karir (Tracer Study), Pelacakan Ijazah, dan Career Hub SMK Sasmita Jaya 2</p>
    </div>

    ${imgBeranda ? `<img src="${imgBeranda}" alt="Dashboard Alumni" class="cover-hero-img" />` : ""}

    <div class="cover-meta">
      <div class="cover-meta-item">
        <strong>Pengembang Sistem</strong>
        Bursa Kerja Khusus (BKK) SMK Sasmita Jaya 2
      </div>
      <div class="cover-meta-item">
        <strong>Sasaran Pengguna</strong>
        Alumni Seluruh Angkatan & Jurusan
      </div>
      <div class="cover-meta-item">
        <strong>Tahun Terbit</strong>
        2026 / Edisi Pemutakhiran
      </div>
    </div>
  </div>

  <!-- MODUL 1: AKSES & AUTENTIKASI -->
  <div class="section-block">
    <div class="section-header">
      <div class="section-num">1</div>
      <h2 class="section-title">Gerbang Akses & Autentikasi Pengguna</h2>
    </div>
    <div class="target-badge">Tujuan: Menjamin kemudahan login mandiri alumni dengan proteksi data terpadu</div>
    <p>
      Sistem menyediakan alur autentikasi cepat tanpa password yang rumit. Alumni dapat langsung masuk ke portal menggunakan <strong>NISN (10 Digit)</strong> atau <strong>NIK (16 Digit)</strong> yang sudah terdata pada buku induk kelulusan sekolah.
    </p>

    <div class="screenshot-box">
      ${imgLogin ? `<img src="${imgLogin}" alt="Halaman Login Alumni" />` : ""}
      <div class="screenshot-caption">Gambar 1.1: Antarmuka Halaman Login Mandiri dengan Pilihan Mode NISN / NIK.</div>
    </div>

    <ul class="feature-list">
      <li><strong>Pilihan Login Fleksibel:</strong> Toggle instan antara NISN dan NIK memudahkan alumni yang lupa salah satu nomor identitasnya.</li>
      <li><strong>Akses Langsung Tanpa Kata Sandi Rumit:</strong> Menggunakan pencocokan data presisi untuk meminimalisir kegagalan akses saat alumni butuh mengisi kuesioner mendadak.</li>
      <li><strong>Keamanan Sesi Terintegrasi:</strong> Dilengkapi mekanisme <em>Session Timeout</em> otomatis untuk melindungi data privasi alumni saat membuka web di perangkat umum.</li>
    </ul>
  </div>

  <div class="page-break"></div>

  <!-- MODUL 2: BERANDA DASHBOARD -->
  <div class="section-block">
    <div class="section-header">
      <div class="section-num">2</div>
      <h2 class="section-title">Menu Beranda (Overview Hub)</h2>
    </div>
    <div class="target-badge">Tujuan: Ruang kendali utama yang menampilkan rangkuman status alumni secara instan</div>
    <p>
      Halaman Beranda dirancang sebagai pusat informasi terpadu yang langsung menyajikan poin-poin paling penting: progres kuesioner tracer study, status fisik ijazah, serta rekomendasi lowongan kerja dari mitra industri BKK.
    </p>

    <div class="screenshot-box">
      ${imgBeranda ? `<img src="${imgBeranda}" alt="Beranda Dashboard Alumni" />` : ""}
      <div class="screenshot-caption">Gambar 2.1: Tampilan Beranda Dashboard Alumni lengkap dengan Welcome Banner & Stat Cards.</div>
    </div>

    <div class="grid-2">
      <div class="mini-card">
        <h4>Banner Sapaan Dinamis</h4>
        Menampilkan nama lengkap alumni, status kelulusan, serta tombol aksi cepat untuk mengisi formulir atau mencetak tanda terima kuesioner.
      </div>
      <div class="mini-card">
        <h4>3 Kartu Statistik Ringkas</h4>
        Memberikan indikator warna cepat atas: Status Tracer Study, Status Kesiapan Fisik Ijazah, dan Total Loker Aktif BKK.
      </div>
    </div>

    <ul class="feature-list">
      <li><strong>Rekomendasi Loker Mitra:</strong> Menampilkan cuplikan loker terhangat yang cocok dengan program keahlian alumni bersangkutan.</li>
      <li><strong>Panduan Alur Pasca-Lulus:</strong> Urutan langkah praktis dari pengisian kuesioner hingga proses penempatan kerja.</li>
    </ul>
  </div>

  <div class="page-break"></div>

  <!-- MODUL 3: CEK STATUS FISIK IJAZAH -->
  <div class="section-block">
    <div class="section-header">
      <div class="section-num">3</div>
      <h2 class="section-title">Menu Cek Ijazah (Pelacakan Fisik)</h2>
    </div>
    <div class="target-badge">Tujuan: Memberikan transparansi proses pencetakan dan antrean pengambilan ijazah asli</div>
    <p>
      Fitur ini menyelesaikan masalah klasik alumni yang harus bolak-balik datang ke sekolah hanya untuk menanyakan apakah ijazah aslinya sudah dicap dan siap diambil.
    </p>

    <div class="screenshot-box">
      ${imgCekIjazah ? `<img src="${imgCekIjazah}" alt="Cek Ijazah Tab" />` : ""}
      <div class="screenshot-caption">Gambar 3.1: Pelacakan Status Kesiapan Ijazah dengan Stepper Progres 4 Tahap.</div>
    </div>

    <div class="callout-box">
      <strong>Mekanisme Stepper Progres 4 Tahap:</strong><br>
      1. <em>Verifikasi Berkas</em> &rarr; 2. <em>Penulisan & Pencetakan Blangko</em> &rarr; 3. <em>Ijazah Siap Diambil di Loket</em> &rarr; 4. <em>Ijazah Telah Diterima Alumni</em>.
    </div>

    <ul class="feature-list">
      <li><strong>Informasi Loket & Tanggal:</strong> Mencantumkan secara rinci nama loket pelayanan di sekolah serta estimasi tanggal pengambilan.</li>
      <li><strong>Daftar Dokumen Prasyarat:</strong> Memberitahu alumni berkas apa saja yang wajib dibawa saat datang (misal: Bukti Tracer Study, KTP, dan Bebas Pustaka).</li>
      <li><strong>Cetak Bukti Verifikasi:</strong> Opsi mencetak lembar verifikasi sebagai bukti antrean resmi.</li>
    </ul>
  </div>

  <div class="page-break"></div>

  <!-- MODUL 4: TRACER STUDY & TANDA TERIMA -->
  <div class="section-block">
    <div class="section-header">
      <div class="section-num">4</div>
      <h2 class="section-title">Menu Tracer Study & Tanda Terima Digital</h2>
    </div>
    <div class="target-badge">Tujuan: Penelusuran rekam jejak karir alumni secara sistematis dan terstandar</div>
    <p>
      Formulir kuesioner Tracer Study dikemas dalam bentuk <em>Multi-Step Wizard</em> interaktif yang cerdas. Pertanyaan akan menyesuaikan secara otomatis dengan status alumni (apakah bekerja, kuliah, berwirausaha, atau sedang mencari lowongan).
    </p>

    <div class="screenshot-box">
      ${imgTracer ? `<img src="${imgTracer}" alt="Formulir Wizard Tracer Study" />` : ""}
      <div class="screenshot-caption">Gambar 4.1: Antarmuka Wizard Pengisian Kuesioner Tracer Study.</div>
    </div>

    <div class="screenshot-box">
      ${imgReceipt ? `<img src="${imgReceipt}" alt="Bukti Tanda Terima Kuesioner" />` : ""}
      <div class="screenshot-caption">Gambar 4.2: Modal Bukti Tanda Terima Resmi ber-QR Code & Berkas PDF yang diterbitkan sistem.</div>
    </div>

    <ul class="feature-list">
      <li><strong>Logika Kuesioner Dinamis:</strong> Alumni yang bekerja akan diminta data linieritas jurusan & gaji; alumni yang kuliah diminta nama universitas & prodi; alumni yang wirausaha diminta bidang bisnis & omzet.</li>
      <li><strong>Evaluasi Kurikulum SMK:</strong> Memberi ruang masukan bagi alumni mengenai mutu pengajaran praktikum dan fasilitas lab.</li>
      <li><strong>Surat Keterangan Digital (PDF):</strong> Setelah submit, sistem langsung menerbitkan berkas PDF ber-QR Code valid untuk syarat verifikasi kelulusan.</li>
    </ul>
  </div>

  <div class="page-break"></div>

  <!-- MODUL 5: INFO LOKER & MAGANG BKK -->
  <div class="section-block">
    <div class="section-header">
      <div class="section-num">5</div>
      <h2 class="section-title">Menu Info Loker & Magang (Career Hub)</h2>
    </div>
    <div class="target-badge">Tujuan: Jembatan penyaluran kerja langsung antara alumni dengan mitra industri BKK</div>
    <p>
      Seluruh lowongan kerja dan pemagangan yang tayang pada menu ini telah melalui kurasi ketat dari tim BKK SMK Sasmita Jaya 2, sehingga terjamin keabsahannya dan bebas dari pungutan liar / penipuan.
    </p>

    <div class="screenshot-box">
      ${imgLoker ? `<img src="${imgLoker}" alt="Info Loker Tab" />` : ""}
      <div class="screenshot-caption">Gambar 5.1: Katalog Lowongan Kerja & Magang dengan Filter Jurusan dan Tipe Pekerjaan.</div>
    </div>

    <div class="screenshot-box">
      ${imgLokerDetail ? `<img src="${imgLokerDetail}" alt="Detail Loker Modal" />` : ""}
      <div class="screenshot-caption">Gambar 5.2: Modal Detail Lowongan lengkap dengan Deskripsi Tugas, Persyaratan, & Quick Apply.</div>
    </div>

    <ul class="feature-list">
      <li><strong>Filter Program Keahlian:</strong> Alumni dapat menyaring loker sesuai jurusan spesifik (TKJ, TPM, TITL, TKRO, TBSM).</li>
      <li><strong>Sistem Lamaran Cepat (Quick Apply):</strong> Memungkinkan alumni mengirimkan berkas profil langsung ke penanggung jawab lowongan.</li>
    </ul>
  </div>

  <div class="page-break"></div>

  <!-- MODUL 6: DIREKTORI ALUMNI -->
  <div class="section-block">
    <div class="section-header">
      <div class="section-num">6</div>
      <h2 class="section-title">Menu Alumni (Direktori Teman Angkatan)</h2>
    </div>
    <div class="target-badge">Tujuan: Wadah jejaring profesional dan silaturahmi antar lulusan lintas angkatan</div>
    <p>
      Menu Direktori Alumni memungkinkan lulusan untuk saling menemukan rekan seangkatan, melihat di mana alumni lain bekerja atau berkuliah, serta membuka peluang kolaborasi profesional.
    </p>

    <div class="screenshot-box">
      ${imgAlumni ? `<img src="${imgAlumni}" alt="Direktori Alumni Tab" />` : ""}
      <div class="screenshot-caption">Gambar 6.1: Direktori Pencarian Alumni dengan Filter Tahun Angkatan & Jurusan.</div>
    </div>

    <ul class="feature-list">
      <li><strong>Pencarian Komprehensif:</strong> Mencari rekan berdasarkan nama, program keahlian, atau nama instansi tempat bekerja.</li>
      <li><strong>Transparansi Profil Karir:</strong> Mengetahui persebaran alumni SMK Sasmita Jaya 2 di berbagai universitas terkemuka dan industri ternama.</li>
    </ul>
  </div>

  <div class="page-break"></div>

  <!-- MODUL 7: HELPDESK & NOTIFIKASI -->
  <div class="section-block">
    <div class="section-header">
      <div class="section-num">7</div>
      <h2 class="section-title">Menu Helpdesk & Pusat Notifikasi</h2>
    </div>
    <div class="target-badge">Tujuan: Sarana respon cepat pengaduan kendala administrasi dan pembaruan informasi BKK</div>
    <p>
      Jika alumni mengalami kendala koreksi ejaan data ijazah, permohonan legalisir jarak jauh, atau kendala pengisian sistem, tim BKK menyediakan saluran komunikasi langsung.
    </p>

    <div class="screenshot-box">
      ${imgHelpdesk ? `<img src="${imgHelpdesk}" alt="Helpdesk Tab" />` : ""}
      <div class="screenshot-caption">Gambar 7.1: Pusat Bantuan Helpdesk dengan Hotline WhatsApp, Form Tiket Aduan, & FAQ Interaktif.</div>
    </div>

    <div class="screenshot-box">
      ${imgNotif ? `<img src="${imgNotif}" alt="Pusat Pesan Notifikasi" />` : ""}
      <div class="screenshot-caption">Gambar 7.2: Dropdown Kotak Masuk Notifikasi & Surat Pemberitahuan BKK.</div>
    </div>

    <ul class="feature-list">
      <li><strong>Hotline Resmi WhatsApp:</strong> Akses kontak langsung ke operator BKK selama jam kerja operasional sekolah.</li>
      <li><strong>Tiket Bantuan Mandiri:</strong> Pengajuan pengaduan tertulis dengan pelacakan status penanganan masalah.</li>
      <li><strong>Kotak Masuk Notifikasi:</strong> Pemberitahuan instan saat isian kuesioner alumni berhasil disetujui atau memerlukan revisi.</li>
    </ul>

    <div class="footer-doc">
      <span>SMK Sasmita Jaya 2 Pamulang</span>
      <span>Dokumentasi Sistem Informasi Alumni v1.0</span>
      <span>Hak Cipta Dilindungi</span>
    </div>
  </div>

</body>
</html>`;

  const tempHtmlPath = path.join(DOCS_DIR, "temp_preview.html");
  fs.writeFileSync(tempHtmlPath, htmlContent, "utf8");

  console.log("Launching headless browser to compile PDF document...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.goto(`file://${tempHtmlPath}`, { waitUntil: "networkidle0" });

  console.log("Rendering high quality A4 PDF...");
  await page.pdf({
    path: PDF_OUTPUT_PATH,
    format: "A4",
    printBackground: true,
    displayHeaderFooter: false,
    margin: {
      top: "12mm",
      bottom: "12mm",
      left: "12mm",
      right: "12mm"
    }
  });

  await browser.close();

  // Clean temp html
  if (fs.existsSync(tempHtmlPath)) {
    fs.unlinkSync(tempHtmlPath);
  }

  console.log(`PDF Documentation generated successfully at: ${PDF_OUTPUT_PATH}`);
}

generatePdf().catch((err) => {
  console.error("PDF generation failed:", err);
  process.exit(1);
});
