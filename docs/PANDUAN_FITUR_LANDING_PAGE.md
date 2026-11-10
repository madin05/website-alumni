# Panduan & Dokumentasi Fitur Landing Page
**SMK Sasmita Jaya 2 Pamulang**  
*Dokumentasi Arsitektur Antarmuka Publik, Portal Penelusuran Tamatan, dan Navigasi Layanan Terpadu*

---

## 1. Gambaran Umum Landing Page

Landing Page Portal Tracer Study SMK Sasmita Jaya 2 berfungsi sebagai gerbang informasi utama (*front-facing gateway*) bagi publik, calon mitra industri, instansi pembina vokasi, serta khususnya bagi alumni dan peserta didik tingkat akhir. Sistem dirancang dengan prinsip keterbukaan data (*open data access*), estetika visual modern, navigasi intuitif, dan kepatuhan penuh terhadap standar regulasi pendidikan vokasi nasional.

### Sasaran Fungsional Landing Page:
1. **Pusat Akses Alumni (Single Entrypoint):** Memberikan akses langsung bagi alumni untuk melakukan autentikasi akun maupun pengisian instrumen survei penelusuran tamatan.
2. **Keterbukaan Statistik Keterserapan:** Menyajikan data agregat aktivitas alumni (bekerja, melanjutkan studi ke perguruan tinggi, dan berwirausaha) secara transparan dan akuntabel.
3. **Penyelarasan Regulasi Pendidikan Vokasi:** Menampilkan dasar hukum formal pelaksanaan Tracer Study sesuai amanat Peraturan Presiden dan Kementerian Pendidikan Dasar dan Menengah.
4. **Verifikasi Keabsahan Dokumen:** Menyediakan kanal rujukan resmi pengecekan keabsahan ijazah nasional langsung ke portal Pangkalan Data Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi.
5. **Kanal Pengumuman & Layanan Pengaduan:** Mempublikasikan agenda Bursa Kerja Khusus (BKK), lowongan kerja kemitraan industri, serta nomor saluran bantuan cepat (*helpdesk hotline*).

---

## 2. Struktur Visual & Tangkapan Layar Komponen

Seluruh bagian antarmuka landing page telah didokumentasikan dalam resolusi tinggi ke dalam direktori `docs/screenshots/`. Berikut rincian fungsional tiap seksi:

### 2.1 Header Navigasi & Jumbotron Utama (Hero Section)

![Header Navigasi dan Hero Section](file:///c:/Arif/projek%20coding/web_alumni/docs/screenshots/landing_01_hero_navbar.png)

* **Logo Resmi Institusi:** Menampilkan identitas resmi SMK Sasmita Jaya 2 Pamulang yang responsif dan beradaptasi terhadap perubahan kontras latar belakang saat di-scroll.
* **Menu Navigasi Desktop:** Beranda, Tentang, Tracer Study (Dropdown), Berita, Hasil & Laporan, dan Kontak Kami dengan efek hover interaktif.
* **Tombol Akses Login:** Tombol login dengan ikon topi toga yang mengarahkan pengguna secara instan ke halaman autentikasi portal alumni dan admin (`/login`).
* **Headline & Sub-headline:** Pesan strategis *"Masa Depan Lulusan, Dimulai dari Data yang Tepat"* yang menegaskan urgensi validitas data alumni bagi evaluasi mutu sekolah.
* **Tombol Call to Action (CTA):** Tombol utama *"Isi Kuesioner Tracer Study"* berlatar kuning cerah yang membawa alumni langsung ke alur kuesioner mandiri.

---

### 2.2 Menu Dropdown Pelacakan Ijazah Nasional

![Menu Dropdown Pelacakan Ijazah](file:///c:/Arif/projek%20coding/web_alumni/docs/screenshots/landing_02_dropdown_ijazah.png)

* **Penempatan Menu:** Terintegrasi di bawah menu navigasi desktop *"Tracer Study"* dengan transisi halus tanpa jeda hover (*zero-gap hit area*).
* **Fungsi Rujukan Resmi:** Mengarahkan alumni dan publik ke portal resmi verifikasi ijazah pemerintah:  
  `https://ijazah.pendidikan.go.id/`
* **Keamanan & Validitas:** Memastikan proses verifikasi nomor pokok ijazah nasional dikonfirmasi langsung oleh basis data Kemendikbudristek, menghindari risiko manipulasi dokumen kelulusan.

---

### 2.3 Seksi Fitur Unggulan (Features Grid)

![Seksi Fitur Unggulan](file:///c:/Arif/projek%20coding/web_alumni/docs/screenshots/landing_03_fitur_unggulan.png)

Menyajikan 6 pilar layanan utama dengan kartu interaktif berbasis ikon vektor:
1. **Isi Kuesioner:** Akses langsung pengisian instrumen survei aktivitas pasca-lulus.
2. **Lihat Hasil:** Pemantauan data statistik keterserapan lulusan yang akurat dan ringkas.
3. **Data Alumni:** Direktori sebaran data tamatan SMK Sasmita Jaya 2 lintas angkatan.
4. **Dunia Kerja:** Informasi kemitraan industri, pemagangan, dan peluang karir dari mitra DUDI.
5. **Laporan & Statistik:** Unduhan laporan analitik resmi untuk evaluasi dan akreditasi sekolah.
6. **Hubungi Kami:** Pintasan navigasi cepat ke informasi kontak dan pusat layanan sekolah.

---

### 2.4 Seksi Tentang Tracer Study (About Section)

![Seksi Tentang Tracer Study](file:///c:/Arif/projek%20coding/web_alumni/docs/screenshots/landing_04_tentang_tracer.png)

* **Tujuan Program:** Menjelaskan secara ringkas maksud dan fungsi penelusuran rekam jejak lulusan dalam pemetaan relevansi kompetensi kejuruan dengan kebutuhan pasar tenaga kerja.
* **Dampak Pembelajaran:** Menegaskan bahwa umpan balik (*feedback*) alumni dijadikan landasan nyata penyempurnaan kurikulum dan sarana laboratorium praktik.
* **Tombol Selengkapnya:** Mengarahkan pembaca ke dokumen profil tracer study yang lebih mendalam (`/tentang`).

---

### 2.5 Seksi Laporan & Statistik Keterserapan Interaktif

![Seksi Laporan dan Statistik](file:///c:/Arif/projek%20coding/web_alumni/docs/screenshots/landing_05_laporan_statistik.png)

* **Filter Interaktif Ganda:**
  * Dropdown Pemilihan Jurusan: Mendukung filter semua jurusan atau spesifik per program keahlian (Teknik Pemesinan, Teknik Kendaraan Ringan, Teknik Otomasi Industri, dll).
  * Dropdown Pemilihan Tahun Kelulusan: Memungkinkan analisis komparatif antar tahun angkatan.
* **Tiga Indikator Visualisasi Utama:**
  1. *Laju Serap & Aktivitas:* Diagram donat persentase status kelulusan (Bekerja, Melanjutkan Studi/Kuliah, Wirausaha Mandiri, atau Masa Tunggu).
  2. *Kesesuaian Bidang Kerja:* Indikator keselarasan kompetensi ijazah dengan bidang pekerjaan yang ditekuni alumni di industri.
  3. *Sektor & Skala Kerja:* Distribusi penempatan karir pada tingkat BUMN/Nasional, Perusahaan Multinasional, Usaha Lokal, dan Mandiri.
* **Tombol Laporan Lengkap:** Tautan menuju halaman analitik menyeluruh dengan fitur ekspor data (`/laporan`).

---

### 2.6 Seksi Dasar Hukum & Regulasi Formal

![Seksi Dasar Hukum](file:///c:/Arif/projek%20coding/web_alumni/docs/screenshots/landing_06_landasan_hukum.png)

Menampilkan 4 landasan yuridis formal yang mendasari kewajiban pelaksanaan Tracer Study di SMK Sasmita Jaya 2:
1. **Peraturan Presiden No. 68 Tahun 2022:** Revitalisasi Pendidikan Vokasi dan Pelatihan Vokasi.
2. **Permendikdasmen No. 8 Tahun 2025:** Standar Pemantauan Kebekerjaan dan Mutu Lulusan Pendidikan Menengah Kejuruan.
3. **Perdirjen No. 34 Tahun 2025:** Pedoman Teknis Pelaksanaan Penelusuran Tamatan pada Satuan Pendidikan Vokasi.
4. **Surat Edaran No. 3159/B/D2/DV.06.03/2026:** Instruksi Pemberitahuan Pelaksanaan Penelusuran Tamatan SMK Tahun Berjalan.
* **Aksi Unduh File:** Setiap kartu dilengkapi tombol unduh file yang menyediakan salinan berkas keputusan/edaran dalam format dokumen resmi.

---

### 2.7 Seksi Berita & Pengumuman BKK Terkini

![Seksi Berita dan Pengumuman](file:///c:/Arif/projek%20coding/web_alumni/docs/screenshots/landing_07_berita_terkini.png)

* **Pembaruan Informasi Otomatis:** Menghubungkan pengunjung dengan warta terbaru seputar Bursa Kerja Khusus, rekrutmen kampus industri, seminar karir, dan uji kompetensi keahlian.
* **Format Kartu Artikel:** Dilengkapi banner grafis, tanggal publikasi, estimasi durasi membaca, judul, dan ringkasan isi berita.
* **Navigasi Selengkapnya:** Memungkinkan alumni membaca artikel penuh atau menjelajahi arsip pengumuman terdahulu.

---

### 2.8 Seksi Tanya Jawab (FAQ) & Layanan Helpdesk

![Seksi FAQ dan Layanan](file:///c:/Arif/projek%20coding/web_alumni/docs/screenshots/landing_08_faq_layanan.png)

* **Akordion Pertanyaan Interaktif:** Menjawab pertanyaan mendasar seperti definisi tracer study, kerahasiaan data pribadi alumni, tata cara pengisian bagi yang belum bekerja, dan prosedur pendaftaran lowongan kerja BKK.
* **Banner Bantuan WhatsApp:** Kotak aksi terpadu dengan tombol hijau *"Hubungi Helpdesk"* yang membuka tautan WhatsApp resmi pengelola BKK dengan pesan pra-terisi otomatis.

---

### 2.9 Seksi Footer & Kontak Institusi

![Seksi Footer dan Kontak](file:///c:/Arif/projek%20coding/web_alumni/docs/screenshots/landing_09_footer_kontak.png)

* **Identitas Resmi:** Logo SMK Sasmita Jaya 2 versi kontras tinggi (*dark theme*).
* **Alamat Lengkap:** Jl. Surya Kencana No. 1, Pamulang Barat, Kec. Pamulang, Kota Tangerang Selatan, Banten 15417.
* **Saluran Komunikasi:** Alamat email resmi (`sasmitajaya2pml@gmail.com`), nomor telepon kantor `(021) 7427375`, dan nomor faksimile `(021) 7412491`.
* **Kanal Media Sosial:** Tautan ke kanal TikTok, Instagram, dan YouTube resmi sekolah.
* **Tautan Hukum & Kebijakan:** Modal interaktif untuk dokumen *Kebijakan Privasi* dan *Syarat & Ketentuan* penggunaan data alumni.

---

## 3. Matriks Keterkaitan Rute Navigasi

| Elemen Antarmuka | Target Aksi / Rute | Otorisasi Pengguna | Deskripsi Perilaku |
| :--- | :--- | :--- | :--- |
| **Logo SMK Sasmita Jaya 2** | `/#beranda` | Publik | Smooth scroll kembali ke puncak halaman |
| **Menu Beranda** | `/#beranda` | Publik | Fokus pada banner hero utama |
| **Menu Tentang** | `/#tentang` | Publik | Navigasi cepat ke ringkasan tujuan tracer |
| **Dropdown Cek Ijazah** | Eksternal Kemendikbud | Publik | Membuka tab baru verifikasi ijazah nasional |
| **Menu Berita** | `/#berita` | Publik | Fokus pada grid pengumuman terbaru |
| **Menu Hasil & Laporan** | `/laporan` | Publik | Mengalihkan ke dashboard analitik publik |
| **Menu Kontak Kami** | `/#kontak` | Publik | Fokus pada footer alamat & saluran CS |
| **Tombol Login** | `/login` | Tamu / Guest | Membuka portal autentikasi terpusat |
| **Tombol Isi Kuesioner** | `/tracer-study` atau `/login` | Terproteksi | Mengarahkan ke login jika sesi belum aktif |
| **Buka Halaman Laporan** | `/laporan` | Publik | Membuka halaman statistik terperinci |
| **Unduh Regulasi SK** | Berkas Dokumen PDF | Publik | Mengunduh salinan berkas hukum resmi |
| **Tombol Hubungi Helpdesk** | `wa.me/...` | Publik | Membuka percakapan WhatsApp CS BKK |
