# Video Production & Voice-Over Master Plan — Portal Alumni & Tracer Study (Dashboard User)

**Sumber Utama:** `Buku_Panduan_Dashboard_User.pdf` (Versi 2.0 — 9 November 2026, 11 Halaman, Bab 1–7)  
**Instansi:** SMK Sasmita Jaya 2 (Yayasan Sasmita Jaya)  
**Target Penonton:** Alumni SMK Sasmita Jaya 2 (TKJ, TITL, dan TP)  
**Format Produksi:** 16:9, 1920 × 1080 (Full HD), 30 fps, MP4 (H.264 High Profile), Audio AAC 192 kbps  
**Durasi Total Master:** 09:40 (580.39 detik)  
**Gaya Visual:** Modern Product Presentation (Inspirasi gaya peluncuran Windows 11: background executive dark radial gradient, floating mockup window dengan rounded corners & soft drop shadow, dynamic illuminated spotlight, kinetic lower-third pill, dan privacy masking)  
**Status Produksi:** Selesai dirender penuh (12 video segmen per bab dan 1 video master kompilasi utuh di `scratch/video_studio/output/`).

---

## Daftar Berkas Output Video

| No | Modul / Bab | Berkas MP4 | Durasi | Ukuran |
|:---|:---|:---|:---:|:---:|
| - | **Master Video Utuh** | `scratch/video_studio/output/PORTAL_ALUMNI_PANDUAN_USER_FULL.mp4` | **09:40** | **61.17 MB** |
| 00 | Intro Pengenalan | `scratch/video_studio/output/00_intro.mp4` | 00:22 | 3.02 MB |
| 01 | Bab 1: Ketentuan Akses & Syarat | `scratch/video_studio/output/01_bab1_ketentuan.mp4` | 00:42 | 6.60 MB |
| 02 | Bab 2: Akses Masuk (Login) | `scratch/video_studio/output/02_bab2_login.mp4` | 00:48 | 4.74 MB |
| 03 | Bab 3: Beranda & Navigasi | `scratch/video_studio/output/03_bab3_dashboard.mp4` | 00:56 | 6.71 MB |
| 04 | Bab 4.1: Pengantar & Langkah 1 | `scratch/video_studio/output/04_tracer_intro_step1.mp4` | 01:09 | 6.71 MB |
| 05 | Bab 4.2: Langkah 2 & Langkah 3 | `scratch/video_studio/output/05_tracer_step2_step3.mp4` | 01:09 | 5.48 MB |
| 06 | Bab 4.3: Langkah 4 & Langkah 5 | `scratch/video_studio/output/06_tracer_step4_step5.mp4` | 00:54 | 5.35 MB |
| 07 | Bab 4.4: Bukti Tanda Terima (PDF) | `scratch/video_studio/output/07_tracer_bukti.mp4` | 00:33 | 4.20 MB |
| 08 | Bab 5: Bursa Kerja Khusus (BKK) | `scratch/video_studio/output/08_bab5_bkk.mp4` | 00:52 | 4.45 MB |
| 09 | Bab 6: Direktori Rekan Alumni | `scratch/video_studio/output/09_bab6_direktori.mp4` | 00:43 | 4.99 MB |
| 10 | Bab 7: Helpdesk & Logout | `scratch/video_studio/output/10_bab7_helpdesk_logout.mp4` | 01:07 | 5.29 MB |
| 11 | Outro Penutup | `scratch/video_studio/output/11_outro.mp4` | 00:25 | 3.65 MB |

---

## 1. Creative Direction & Identitas Visual

### A. Konsep Utama: *Modern Campus Digital Experience*
Video dirancang layaknya presentasi produk digital modern: bersih, tenang, terstruktur, dan fokus pada kejelasan antarmuka Portal Alumni SMK Sasmita Jaya 2. Setiap gerakan visual dan kamera berfungsi mengarahkan perhatian ke tombol, kolom isian, atau hasil tindakan yang dijelaskan oleh narator—bukan sekadar rekaman layar panjang yang statis atau slideshow gambar.

### B. Palet Warna & Tipografi
| Elemen | Nilai / Pilihan | Penggunaan dalam Motion & Grafis |
|---|---|---|
| Deep Navy | `#0B2347` | Latar panel intro/outro, judul bab, dan latar *sidebar* konsisten dengan portal |
| Portal Blue | `#2463D3` | Aksen utama, garis penunjuk, *highlight outline*, dan tombol CTA |
| Clean White | `#FFFFFF` | Panel kartu informasi, teks kontras di atas latar gelap, ruang bernapas |
| Soft Gray | `#F3F6FA` | Latar kanvas saat menampilkan *floating UI window* |
| Accent Red | `#D92D35` | Penanda nomor komponen (`01`, `02`, `03`) dan pengingat penting seperlunya |
| Success Green | `#239B69` | Status berhasil dan konfirmasi pengisian kuesioner selesai |
| Tipografi Utama | `Inter` atau `Segoe UI` | Maksimal 2 keluarga huruf (judul tebal tegas, subjudul ringan dengan kontras tinggi) |

### C. Bahasa Motion & Formula Visual (5 Tahap per Fitur)
Setiap bab atau modul mengikuti alur: **Introduce** (judul & manfaat singkat) -> **Reveal** (*floating UI* + *push-in*) -> **Guide** (kursor terarah + *UI spotlight* dengan area lain diredupkan ringan 20–30%) -> **Confirm** (tampilkan hasil/status aktual) -> **Transition** (*pull-back* atau *UI panel slide* ke modul berikutnya).

- **Durasi Entrance:** 250–700 ms dengan kurva *ease-out* halus; judul bab sedikit lebih lambat agar berwibawa.
- **Kamera:** *Slow push-in* (100% -> 130–160%) saat fokus ke kolom atau tombol, *pan* halus antar kolom berdekatan, dan *pull-back* ke 100% sebelum transisi bab.
- **Transisi Konsisten:** Gunakan dua pola utama di seluruh video: *UI panel slide transition* (untuk pindah menu) dan *soft cross-dissolve / mask reveal* (untuk pindah bab).
- **Aturan Ketat:** Tidak memakai efek *glitch*, *shake*, putaran ekstrem, atau elemen bergerak bersamaan yang mengganggu pembacaan label antarmuka.

### D. Aturan Privasi, Kredensial, & URL Publik
1. **URL Login:** Jangan tampilkan atau bacakan `http://localhost:5173/login`. Gunakan instruksi: *"Buka alamat Portal Alumni yang telah diberikan oleh pihak sekolah."* dan tampilkan placeholder visual `[ALAMAT PORTAL RESMI]` bila perlu menampilkan bilah alamat peramban.
2. **Data Identitas Contoh:** Tangkapan layar referensi memuat nama, NISN, NIK, nomor telepon, email, serta nomor registrasi contoh. Editor wajib melakukan *blur/masking* pada NISN, NIK, kontak pribadi, kata sandi, dan nomor registrasi saat menampilkan rekaman/screenshot di layar, serta narator tidak boleh membacakan angka identitas contoh tersebut.
3. **Kontak BKK:** Jangan mengarang nomor WhatsApp atau email lengkap. Pada bagian Helpdesk, tampilkan tampilan kanal sebagaimana adanya atau arahkan penyebutan secara umum ke *WhatsApp BKK Hotline*, *Email Resmi BKK*, dan *Loket Tata Usaha*.
4. **Ketentuan Pengisian:** Tekankan secara tepat bahwa kuesioner Tracer Study dibatasi **1 (satu) kali per periode tahun ajaran**.

---

## 2. Struktur Seri Video (Modular & Gabungan)

| Bagian | Cakupan Buku Panduan | Estimasi Durasi | Fokus Utama |
|---|---|---:|---|
| **Intro** | Pembuka & Identitas Portal | 00:00–00:15 (15 dtk) | Pengenalan Portal Alumni & Tracer Study SMK Sasmita Jaya 2 |
| **Bab 1** | Halaman 2 — Pendahuluan & Akses | 00:15–00:55 (40 dtk) | Sasaran jurusan (TKJ, TITL, TP), perangkat, prasyarat akun, privasi |
| **Bab 2** | Halaman 3 — Akses Masuk (Login) | 00:55–01:40 (45 dtk) | NISN 10 digit, Password, ikon mata, Masuk & Mulai Survey, Helpdesk |
| **Bab 3** | Halaman 4 — Beranda & Navigasi | 01:40–02:35 (55 dtk) | 5 menu sidebar, banner Tracer Study, 3 kartu ringkasan, loker terbaru |
| **Bab 4.1** | Halaman 5 — Pengantar & Langkah 1 | 02:35–03:35 (60 dtk) | Tujuan survei Kemendikdasmen RI, stepper 1–5, data terkunci & kontak |
| **Bab 4.2** | Halaman 6 — Langkah 2 & 3 | 03:35–04:45 (70 dtk) | Status kegiatan utama, waktu tunggu, formulir dinamis rincian karir |
| **Bab 4.3** | Halaman 7 — Langkah 4 & 5 | 04:45–05:45 (60 dtk) | Skala relevansi 1–5, aspek bermanfaat, 3 saran, kirim survei |
| **Bab 4.4** | Halaman 8 — Bukti Tanda Terima | 05:45–06:35 (50 dtk) | Banner berhasil, nomor registrasi unik, Unduh Bukti Pengisian PDF |
| **Bab 5** | Halaman 9 — Lowongan Kerja (BKK) | 06:35–07:40 (65 dtk) | Pencarian loker, filter jurusan, kartu loker, Lihat Detail & Daftar |
| **Bab 6** | Halaman 10 — Direktori Alumni | 07:40–08:30 (50 dtk) | Pencarian rekan, filter jurusan, kartu profil, pagination, catatan privasi |
| **Bab 7** | Halaman 11 — Helpdesk & Logout | 08:30–09:35 (65 dtk) | 3 kanal bantuan, kirim tiket, FAQ, prosedur Keluar dari Akun |
| **Outro** | Penutup Resmi | 09:35–09:55 (20 dtk) | Rangkuman 3 pesan kunci, identitas SMK Sasmita Jaya 2, penutup |

---

## 3. Master Storyboard, Shot List, Motion Direction & Naskah Voice-Over

> **Catatan Penggunaan Naskah Voice-Over:** Kolom **Voice-over** hanya berisi kalimat bersih yang diucapkan narator atau mesin TTS (kecepatan target 115–135 kata/menit). Seluruh petunjuk kamera, kursor, efek sorotan, dan *blur/masking* terpisah di kolom **Visual, Shot List & Motion Direction**.

### A. Intro — Portal Alumni & Tracer Study (00:00–00:15)

| Scene & Durasi | Visual, Shot List & Motion Direction | Voice-over | Aset |
|---|---|---|---|
| **01 — Brand & Title Reveal**<br>00:00–00:07 | **Tipe:** Motion Graphic Intro.<br>**Visual:** Latar Clean White/Soft Gray dengan garis dekorasi halus bertema `#0B2347` dan `#2463D3`. Logo resmi SMK Sasmita Jaya 2 masuk dari tengah dengan *scale-in* ringan (400 ms), lalu bergeser halus ke atas memberi ruang judul bertingkat: `PORTAL ALUMNI & TRACER STUDY` dan subjudul `SMK Sasmita Jaya 2`.<br>**Audio:** Musik korporat modern *fade-in* pelan. | Halo, alumni SMK Sasmita Jaya 2. Selamat datang di panduan penggunaan Portal Alumni dan Tracer Study. | `public/logo-smk.png` |
| **02 — Hero Dashboard Reveal & Keywords**<br>00:07–00:15 | **Tipe:** Floating UI Composition.<br>**Visual:** Tampilan Beranda Portal Alumni (`02-beranda-user.png`) muncul sebagai panel mengambang dengan bayangan lembut (*slide-up* 500 ms + *slow push-in*). Di sisi samping atau bawah tampil 4 kata kunci bergiliran (*stagger* 300 ms): `Tracer Study`, `Bursa Kerja`, `Direktori Alumni`, `Helpdesk`.<br>**Transisi:** *Panel slide* menuju modul Bab 1. | Melalui portal ini, Anda dapat memperbarui data karier setelah lulus, mencari peluang kerja dari mitra industri sekolah, hingga terhubung kembali dengan rekan alumni. | `docs/screenshots_user/asli/02-beranda-user.png` |

---

### B. Bab 1 — Pendahuluan & Ketentuan Akses Akun (00:15–00:55)

| Scene & Durasi | Visual, Shot List & Motion Direction | Voice-over | Aset |
|---|---|---|---|
| **03 — Chapter Card & Sasaran Jurusan**<br>00:15–00:28 | **Tipe:** Kinetic Typography + Badge.<br>**Visual:** Kartu pembuka berlabel `01 — PENDAHULUAN & AKSES AKUN` muncul dengan *mask reveal*. Tiga lencana program keahlian tampil bergantian: `TKJ (Teknik Komputer & Jaringan)`, `TITL (Teknik Instalasi Tenaga Listrik)`, dan `TP (Teknik Pemesinan)`. | Panduan ini ditujukan bagi seluruh lulusan SMK Sasmita Jaya 2 dari jurusan Te-Ka-Je, Te-I-Te-El, dan Te-Pe. | Motion graphic template |
| **04 — Prasyarat Perangkat & Peramban**<br>00:28–00:40 | **Tipe:** Icon Card Grid.<br>**Visual:** Empat ikon perangkat sederhana muncul bertahap (*stagger* 150 ms): Komputer, Laptop, Tablet, dan Smartphone, beserta label peramban pendukung: Google Chrome, Mozilla Firefox, Microsoft Edge, dan Safari versi terbaru. | Anda dapat mengakses portal ini kapan saja melalui komputer, laptop, tablet, maupun ponsel pintar menggunakan peramban versi terbaru yang terhubung internet. | Ikon perangkat vektor sederhana |
| **05 — Ketentuan Akun, Privasi & Batas Pengisian**<br>00:40–00:55 | **Tipe:** Callout Card.<br>**Visual:** Tampilkan ilustrasi kartu kredensial bertuliskan `Username: NISN (10 digit)` dan `Password` (tanpa data asli). Lalu muncul 2 *callout*: ikon perisai (`Privasi & Kerahasiaan Data`) dan penekanan angka `1x` dengan teks: `Pengisian Tracer Study: 1 kali per periode tahun ajaran`.<br>**Transisi:** *Cross-dissolve* ke halaman Login. | Untuk masuk, siapkan sepuluh digit en-i-es-en dan kata sandi akun Anda. Seluruh data dijaga kerahasiaannya untuk evaluasi mutu sekolah dan penyaluran kerja Be-Ka-Ka. Perlu diingat, pengisian kuesioner dibatasi satu kali pada setiap periode tahun ajaran. | Ilustrasi kartu akun + `public/Shield.svg` |

---

### C. Bab 2 — Akses Masuk Portal Alumni (00:55–01:40)

| Scene & Durasi | Visual, Shot List & Motion Direction | Voice-over | Aset |
|---|---|---|---|
| **06 — Reveal Halaman Login**<br>00:55–01:05 | **Tipe:** Screen Recording / Screenshot Full.<br>**Visual:** Tampilkan halaman Login utuh (`01-login-user.png`). Berikan teks overlay ringkas di bagian atas: `Buka [ALAMAT PORTAL RESMI] dari pihak sekolah` (JANGAN tampilkan `localhost`). Kamera melakukan *slow push-in* ke kartu form sebelah kanan. | Pertama, buka alamat Portal Alumni yang telah diberikan oleh pihak sekolah. Anda akan langsung melihat halaman masuk akun alumni. | `docs/screenshots_user/asli/01-login-user.png` |
| **07 — Input Username (NISN) & Password**<br>01:05–01:22 | **Tipe:** Screen Recording + UI Spotlight.<br>**Visual:** Redupkan area luar form. Highlight outline `#2463D3` pada kolom `Username` dengan label `01 — NISN (10 digit)`. Kursor mengetikkan NISN uji yang diblur/masking. Fokus *pan* ke kolom `Password` (`02 — Kata Sandi`), ketik karakter sandi bertitik, lalu kursor menekan ikon mata di sisi kanan kolom. | Masukkan sepuluh digit en-i-es-en Anda pada kolom Username. Setelah itu, ketikkan kata sandi akun pada kolom Password. Jika ingin memastikan huruf dan angka sudah tepat, Anda dapat menekan ikon mata di sebelah kanan kolom. | Rekaman interaksi login |
| **08 — Tombol Masuk & Tautan Helpdesk**<br>01:22–01:40 | **Tipe:** Screen Recording + Result Reveal.<br>**Visual:** Pindahkan spotlight ke tombol biru `Masuk & Mulai Survey` (`03`). Kursor menekan tombol. Sebelum pindah halaman, sorot singkat tautan `Butuh bantuan? Hubungi Helpdesk` (`04`) di bagian bawah form dengan callout `Bantuan Lupa Sandi / NISN`. Setelah itu, tampilkan transisi menuju halaman Beranda.<br>**Transisi:** *UI Panel Slide* ke Dashboard. | Jika semua sudah terisi, klik tombol Masuk dan Mulai Survey untuk membuka beranda akun Anda. Apabila lupa kata sandi atau en-i-es-en tidak dikenali, klik tautan Hubungi Helpdesk di bagian bawah formulir agar langsung terhubung dengan admin Be-Ka-Ka melalui WhatsApp. | Rekaman klik tombol login -> transisi Beranda |

---

### D. Bab 3 — Mengenal Dashboard & Navigasi Utama (01:40–02:35)

| Scene & Durasi | Visual, Shot List & Motion Direction | Voice-over | Aset |
|---|---|---|---|
| **09 — Full Dashboard Overview**<br>01:40–01:52 | **Tipe:** Screen Recording / Floating UI.<br>**Visual:** Tampilkan Beranda Alumni secara penuh (`02-beranda-user.png`) dengan teks identitas contoh disamarkan. Munculkan judul bab `03 — BERANDA & NAVIGASI UTAMA`. | Setelah berhasil masuk, Anda akan disambut oleh halaman Beranda Alumni. Tampilan ini merangkum seluruh status survei dan informasi lowongan terbaru dalam satu layar. | `docs/screenshots_user/asli/02-beranda-user.png` |
| **10 — Sidebar Navigasi (5 Menu Utama)**<br>01:52–02:13 | **Tipe:** UI Spotlight + Camera Pan.<br>**Visual:** Kamera *push-in* ke panel *sidebar* Deep Navy di sisi kiri. Sorot berurutan tiap menu sambil kursor melintas (*hover*) dari atas ke bawah: `Beranda`, `Tracer Study`, `Lowongan Kerja`, `Alumni`, dan `Helpdesk`. | Di sisi kiri layar terdapat lima menu utama. Menu Beranda menampilkan ringkasan akun Anda. Menu Tracer Study untuk mengisi kuesioner atau mengunduh bukti pengisian. Menu Lowongan Kerja berisi info rekrutmen mitra industri, menu Alumni untuk mencari rekan satu sekolah, dan menu Helpdesk untuk menghubungi layanan bantuan. | Rekaman hover sidebar navigasi |
| **11 — Kartu Ringkasan, Loker & Pintasan Banner**<br>02:13–02:35 | **Tipe:** Camera Pan + Spotlight CTA.<br>**Visual:** Kamera *pan* ke area kanan utama. Sorot berturut-turut tiga kartu ringkasan (`Status Tracer Study`, `Direktori Alumni`, `Lowongan BKK Aktif`) dan tiga kartu `Info Loker & Magang` di bawahnya. Lalu kamera menyorot banner biru `Kuesioner Tracer Study 2026 Tersedia` dan tombol `Isi Kuesioner Sekarang`. Kursor mengklik tombol tersebut.<br>**Transisi:** Masuk ke Halaman Pengantar Kuesioner. | Pada area utama, tersedia tiga kartu ringkasan dan cuplikan lowongan magang maupun kerja terbaru. Untuk langsung mulai mengisi survei penelusuran tamatan, Anda cukup menekan tombol Isi Kuesioner Sekarang pada banner biru di bagian atas. | Rekaman klik tombol `Isi Kuesioner Sekarang` |

---

### E. Bab 4 — Kuesioner Tracer Study Kemendikdasmen RI (02:35–06:35)

#### Segmen 4.1: Pengantar Survei & Langkah 1 — Data Lulusan (02:35–03:35)

| Scene & Durasi | Visual, Shot List & Motion Direction | Voice-over | Aset |
|---|---|---|---|
| **12 — Halaman Pengantar Kemendikdasmen**<br>02:35–02:55 | **Tipe:** Screen Recording + Spotlight.<br>**Visual:** Tampilkan halaman `Pengantar bagi Alumni SMK` (`03-tracer-intro.png`). Sorot judul pengantar serta lima poin tujuan pokok secara bergiliran. Kursor *scroll* halus ke bawah dan menekan tombol biru `Mulai Survey`. | Sebelum formulir terbuka, Anda akan melihat halaman pengantar survei penelusuran tamatan dari Direktorat SMK Kemendikdasmen. Halaman ini menjelaskan lima tujuan utama pengumpulan data untuk peningkatan mutu pendidikan vokasi. Setelah membacanya, klik tombol Mulai Survey. | `docs/screenshots_user/asli/03-tracer-intro.png` |
| **13 — Stepper 1–5 & Data Pokok Terkunci**<br>02:55–03:15 | **Tipe:** Push-in + UI Highlight.<br>**Visual:** Tampilkan halaman Langkah 1 (`04-tracer-step1-identitas.png`). Highlight bilah progres horizontal dari `Step 1 - Data Lulusan` sampai `Step 5 - Umpan Balik`. Kemudian sorot kotak isian abu-abu yang terkunci (`Nama Lengkap Alumni`, `NISN`, `NIK`, `Tahun Masuk`, `Tahun Lulus`, `Kompetensi Keahlian / Jurusan SMK`) dengan *blur* pada nilai sensitif. | Di bagian atas formulir terdapat penanda progres dari Langkah satu hingga Langkah lima. Pada Langkah satu, periksa kembali data pokok seperti nama lengkap, en-i-es-en, en-i-ka, tahun masuk, tahun lulus, serta jurusan Anda. Data ini tersinkron otomatis dari sekolah sehingga terkunci dan tidak perlu diubah secara manual. | `docs/screenshots_user/asli/04-tracer-step1-identitas.png` |
| **14 — Melengkapi Kontak & Domisili**<br>03:15–03:35 | **Tipe:** Screen Recording.<br>**Visual:** Kursor *scroll* ke bagian bawah Langkah 1. Tunjukkan pengisian kolom `No.HP / WhatsApp` (`08...`), `Email`, `Jenis Kelamin`, `Usia Saat Ini`, `Status Menikah`, `Provinsi Domisili Tinggal`, dan `Kota / Kab. Domisili Tinggal`. Sorot tombol `Simpan dan Lanjut` di kanan bawah dan klik.<br>**Transisi:** Stepper bergeser aktif ke `Step 2`. | Berikutnya, lengkapi nomor WhatsApp aktif yang diawali angka nol delapan, alamat email aktif, jenis kelamin, usia, status pernikahan, serta wilayah domisili Anda saat ini. Jika sudah lengkap, klik Simpan dan Lanjut di pojok kanan bawah untuk menuju Langkah dua. | Rekaman pengisian Step 1 |

#### Segmen 4.2: Langkah 2 & 3 — Status Aktivitas & Rincian Karir (03:35–04:45)

| Scene & Durasi | Visual, Shot List & Motion Direction | Voice-over | Aset |
|---|---|---|---|
| **15 — Langkah 2: Pilihan Status Kegiatan**<br>03:35–04:00 | **Tipe:** Screen Recording + Spotlight.<br>**Visual:** Tampilkan Langkah 2 (`05-tracer-step2-status.png`). Sorot header `Aktifitas Lulusan`. Highlight kelima opsi status utama secara bergantian: `Bekerja (Full Time / Part Time)`, `Melanjutkan Pendidikan (Kuliah)`, `Wirausaha`, `Bekerja sambil Kuliah`, dan `Belum Bekerja`. Kursor mengklik opsi `Bekerja`. | Pada Langkah dua, Anda diminta memilih status kegiatan utama setelah lulus. Pilihan yang tersedia meliputi bekerja penuh waktu maupun paruh waktu, melanjutkan kuliah, berwirausaha, bekerja sambil kuliah, atau belum bekerja. | `docs/screenshots_user/asli/05-tracer-step2-status.png` |
| **16 — Pilihan Waktu Tunggu & Navigasi**<br>04:00–04:15 | **Tipe:** Screen Recording.<br>**Visual:** Fokus *pan* ke bagian pilihan waktu tunggu: `Kurang dari 3 bulan`, `3–6 bulan`, `6–12 bulan`, dan `Lebih dari 12 bulan`. Kursor memilih salah satu rentang, lalu memperlihatkan tombol `Kembali` dan menekan `Simpan dan Lanjut`.<br>**Transisi:** Stepper bergeser ke `Step 3`. | Setelah itu, pilih lama waktu tunggu hingga Anda mendapatkan kegiatan pertama sejak kelulusan. Anda dapat menekan Kembali jika ingin memeriksa data sebelumnya, atau klik Simpan dan Lanjut untuk melanjutkan ke Langkah tiga. | Rekaman klik `Simpan dan Lanjut` |
| **17 — Langkah 3: Formulir Dinamis Rincian Karir**<br>04:15–04:45 | **Tipe:** Screen Recording + Spotlight.<br>**Visual:** Tampilkan Langkah 3 (`06-tracer-step3-detail.png`). Tampilkan badge informasi: `Formulir menyesuaikan status pada Langkah 2`. Untuk contoh status bekerja, highlight kelompok isian berurutan: `Nama Perusahaan`, `Jenis Badan Usaha`, `Tahun Mulai`, `Status Hubungan Kerja`, `Jabatan / Posisi`, `Lokasi Penempatan`, `Rentang Gaji`, dan `Tingkat Keselarasan Jurusan` (`Sangat Selaras`, `Cukup Selaras`, `Tidak Selaras`). Kursor menekan `Simpan dan Lanjut`. | Di Langkah tiga, kolom formulir menyesuaikan secara otomatis dengan status yang Anda pilih sebelumnya. Sebagai contoh bagi alumni yang bekerja, masukkan nama perusahaan, jenis badan usaha, tahun mulai, status kerja, jabatan, kota penempatan, serta rentang penghasilan bulanan. Terakhir, tentukan tingkat keselarasan pekerjaan dengan jurusan SMK Anda, mulai dari sangat selaras hingga tidak selaras, lalu klik Simpan dan Lanjut. | `docs/screenshots_user/asli/06-tracer-step3-detail.png` |

#### Segmen 4.3: Langkah 4 & 5 — Evaluasi Kompetensi & Umpan Balik (04:45–05:45)

| Scene & Durasi | Visual, Shot List & Motion Direction | Voice-over | Aset |
|---|---|---|---|
| **18 — Langkah 4: Skala Relevansi & Aspek Bermanfaat**<br>04:45–05:13 | **Tipe:** Screen Recording.<br>**Visual:** Tampilkan Langkah 4 (`07-tracer-step4-evaluasi.png`). Sorot bagian skala `1` (`Sangat Tidak Relevan`) sampai `5` (`Sangat Relevan`) secara netral. *Pan* ke bawah menuju kotak centang `Aspek Pembelajaran Paling Bermanfaat` (Kompetensi Teknis, Kedisiplinan, Kerja Sama, Komunikasi, TIK, Kewirausahaan). Kursor klik `Simpan dan Lanjut`. | Langkah empat berisi penilaian relevansi pembelajaran di SMK terhadap aktivitas Anda saat ini, dengan skala satu untuk sangat tidak relevan hingga lima untuk sangat relevan. Di bawahnya, centang satu atau lebih aspek pembelajaran yang paling Anda rasakan manfaatnya setelah lulus, kemudian klik Simpan dan Lanjut. | `docs/screenshots_user/asli/07-tracer-step4-evaluasi.png` |
| **19 — Langkah 5: Tiga Kolom Saran & Konfirmasi Kirim**<br>05:13–05:45 | **Tipe:** Screen Recording + Warning Callout.<br>**Visual:** Tampilkan Langkah 5 (`08-tracer-step5-review.png`). Sorot tiga kotak saran: `Saran untuk meningkatkan pembelajaran di SMK`, `Saran untuk meningkatkan layanan BKK/alumni`, dan `Saran untuk meningkatkan kerja sama sekolah dengan industri`. *Scroll* ke bawah, sorot opsi `Kesediaan dihubungi kembali untuk survei berkala`, centang konfirmasi kebenaran data, dan klik tombol biru `Simpan dan Kirim Survey`.<br>**Transisi:** *Fade* ke halaman Konfirmasi Berhasil. | Pada Langkah lima sebagai tahap terakhir, sampaikan masukan Anda di tiga kotak saran: untuk pembelajaran SMK, layanan Be-Ka-Ka, serta kemitraan industri. Setelah itu, tentukan kesediaan untuk dihubungi kembali pada survei berkala dan centang pernyataan kebenaran data. Pastikan seluruh isian sudah tepat karena survei hanya dapat dikirim satu kali per periode tahun ajaran, lalu klik tombol Simpan dan Kirim Survey. | `docs/screenshots_user/asli/08-tracer-step5-review.png` |

#### Segmen 4.4: Bukti Tanda Terima Tracer Study PDF (05:45–06:35)

| Scene & Durasi | Visual, Shot List & Motion Direction | Voice-over | Aset |
|---|---|---|---|
| **20 — Konfirmasi Tersimpan & Nomor Registrasi**<br>05:45–06:08 | **Tipe:** Screen Recording + Spotlight.<br>**Visual:** Tampilkan halaman hasil (`09-tracer-bukti-selesai.png`). Sorot banner konfirmasi `Pengisian Kuesioner Tracer Study Anda Sudah Tersimpan` serta lencana status `Sudah Mengisi`. Perbesar area ringkasan data dengan masking/blur pada nomor registrasi contoh dan NISN contoh. | Setelah berhasil dikirim, sistem menampilkan keterangan bahwa kuesioner Anda telah tercatat secara permanen beserta nomor registrasi resmi Anda. | `docs/screenshots_user/asli/09-tracer-bukti-selesai.png` |
| **21 — Unduh & Simpan Bukti Pengisian PDF**<br>06:08–06:35 | **Tipe:** Screen Recording + Micro-interaction.<br>**Visual:** Kursor mengklik tombol `Unduh Bukti Pengisian`. Tampilkan pratinjau singkat dokumen Pe-De-Ef dengan kop surat SMK Sasmita Jaya 2 serta stempel digital (data pribadi termasking). Sorot tombol `Kembali ke Dashboard`.<br>**Transisi:** *Panel Slide* ke menu Lowongan Kerja. | Tekan tombol Unduh Bukti Pengisian untuk menyimpan tanda terima resmi berformat Pe-De-Ef. Periksa kembali dokumen unduhan tersebut guna memastikan identitas, status kegiatan, dan stempel digital sekolah tercetak dengan baik, lalu simpan sebagai arsip pribadi apabila sewaktu-waktu dibutuhkan oleh sekolah maupun perusahaan. | Rekaman klik `Unduh Bukti Pengisian` |

---

### F. Bab 5 — Bursa Kerja Khusus / BKK Hub & Lowongan Kerja (06:35–07:40)

| Scene & Durasi | Visual, Shot List & Motion Direction | Voice-over | Aset |
|---|---|---|---|
| **22 — Membuka Menu Lowongan Kerja & Pencarian**<br>06:35–07:03 | **Tipe:** Screen Recording + Push-in.<br>**Visual:** Kursor mengklik menu `Lowongan Kerja` di *sidebar* kiri (`10-loker-alumni.png`). Push-in ke bagian atas: sorot kolom pencarian dan dropdown filter `Semua Jurusan` (`TKJ`, `TITL`, `TP`, `Semua Jurusan`). | Berikutnya, mari kita lihat menu Lowongan Kerja dari Bursa Kerja Khusus atau Be-Ka-Ka sekolah. Anda dapat mencari posisi pekerjaan, nama perusahaan mitra, maupun kota penempatan melalui kolom pencarian, lalu menyaringnya sesuai jurusan keahlian Anda. | `docs/screenshots_user/asli/10-loker-alumni.png` |
| **23 — Kartu Loker & Modal Detail Kualifikasi**<br>07:03–07:25 | **Tipe:** Screen Recording + Spotlight.<br>**Visual:** Sorot kartu loker (`Mitra BKK`, tipe kerja, batas pendaftaran, estimasi gaji, dan lokasi). Kursor mengklik tombol `Lihat Detail` hingga modal rincian terbuka (`11-detail-loker-alumni.png`). Sorot deskripsi tugas dan kualifikasi kejuruan. | Setiap kartu lowongan memuat tipe pekerjaan, estimasi penghasilan, lokasi kerja, serta batas akhir pendaftaran. Klik Lihat Detail pada lowongan yang Anda minati untuk membaca deskripsi tugas dan kualifikasi lengkapnya. | `docs/screenshots_user/asli/11-detail-loker-alumni.png` |
| **24 — Tombol Daftar & Pengingat Batas Akhir**<br>07:25–07:40 | **Tipe:** Spotlight CTA.<br>**Visual:** Sorot tombol biru `Daftar` pada modal detail. Callout: `Portal Karier Mitra` / `WhatsApp Resmi BKK`.<br>**Transisi:** *Panel Slide* ke menu Alumni. | Jika kualifikasi sudah sesuai dan masih dalam masa pendaftaran, klik tombol Daftar. Sistem akan mengarahkan Anda ke portal karier perusahaan mitra atau saluran WhatsApp resmi Be-Ka-Ka untuk proses lamaran. | Rekaman sorotan tombol `Daftar` |

---

### G. Bab 6 — Direktori & Jejaring Rekan Alumni (07:40–08:30)

| Scene & Durasi | Visual, Shot List & Motion Direction | Voice-over | Aset |
|---|---|---|---|
| **25 — Pencarian & Filter Direktori Alumni**<br>07:40–08:05 | **Tipe:** Screen Recording + Push-in.<br>**Visual:** Kursor klik menu `Alumni` di *sidebar* (`12-direktori-alumni.png`). Push-in ke bilah atas: sorot kolom pencarian (`Cari nama alumni, profesi, atau lokasi...`) dan dropdown `Semua Jurusan`. | Fitur berikutnya adalah menu Alumni yang berfungsi sebagai direktori jejaring sesama lulusan. Gunakan kolom pencarian untuk menemukan rekan berdasarkan nama, profesi, maupun kota tempat tinggal, atau saring berdasarkan program keahlian. | `docs/screenshots_user/asli/12-direktori-alumni.png` |
| **26 — Kartu Profil, Pagination & Perlindungan Privasi**<br>08:05–08:30 | **Tipe:** Pull-back + Privacy Callout.<br>**Visual:** Kamera *pull-back* menyorot kartu profil alumni dan navigasi nomor halaman (*pagination*) di pojok kanan bawah. Munculkan callout: `Perlindungan Privasi: NIK & No. WhatsApp pribadi tidak ditampilkan terbuka`.<br>**Transisi:** *Panel Slide* ke menu Helpdesk. | Setiap kartu menampilkan jurusan, tahun kelulusan, aktivitas saat ini, serta kota domisili rekan Anda. Gunakan nomor halaman di pojok kanan bawah untuk menelusuri daftar lulusan lainnya. Demi keamanan data pribadi, en-i-ka dan nomor WhatsApp pribadi alumni tidak ditampilkan secara terbuka pada halaman ini. | Rekaman scroll/pagination |

---

### H. Bab 7 — Pusat Bantuan (Helpdesk) & Keluar dari Akun (08:30–09:35)

| Scene & Durasi | Visual, Shot List & Motion Direction | Voice-over | Aset |
|---|---|---|---|
| **27 — Tiga Saluran Kontak Resmi BKK**<br>08:30–08:50 | **Tipe:** Screen Recording + Spotlight.<br>**Visual:** Kursor klik menu `Helpdesk` di *sidebar* (`13-helpdesk-alumni.png`). Sorot panel atas: `WhatsApp BKK Hotline`, `Email Resmi BKK`, dan `Loket Tata Usaha`. | Apabila Anda mengalami kendala saat mengisi survei atau mengakses informasi lowongan, buka menu Helpdesk. Di bagian atas tersedia tiga saluran bantuan resmi sekolah, yaitu WhatsApp Be-Ka-Ka Hotline, Email Resmi Be-Ka-Ka, dan Loket Tata Usaha. | `docs/screenshots_user/asli/13-helpdesk-alumni.png` |
| **28 — Formulir Tiket Bantuan & FAQ Interaktif**<br>08:50–09:12 | **Tipe:** Screen Recording.<br>**Visual:** Fokus panel kiri `Kirim Pengaduan / Tiket Bantuan` (`Judul Permasalahan`, `Isi Pesan / Pertanyaan`, tombol `Kirim Tiket ke BKK`). *Pan* ke panel kanan `Pertanyaan Umum Alumni (FAQ)` dan buka salah satu FAQ. | Anda juga dapat mengirim pengaduan langsung melalui formulir tiket dengan mengisi judul permasalahan dan uraian pesan, lalu menekan tombol Kirim Tiket ke Be-Ka-Ka. Tim admin akan merespons melalui WhatsApp atau email Anda. Sebelum melapor, periksa juga daftar Pertanyaan Umum di sebelah kanan untuk solusi cepat kendala teknis. | Rekaman interaksi tiket & buka FAQ |
| **29 — Prosedur Logout Aman**<br>09:12–09:35 | **Tipe:** Screen Recording + Dialog Reveal.<br>**Visual:** Sorot tombol `Keluar dari Akun` di sudut kiri bawah *sidebar*. Klik tombol hingga dialog `Keluar dari Portal?` muncul (`14-logout-user.png`). Sorot tombol merah `Ya, Keluar` lalu kembali ke Login. | Setelah seluruh aktivitas selesai, pastikan Anda keluar dari akun dengan aman. Klik tombol Keluar dari Akun di bagian bawah bilah menu kiri, lalu pilih Ya, Keluar pada kotak konfirmasi yang muncul. Biasakan selalu keluar dari akun, terutama saat Anda mengakses portal melalui komputer bersama atau perangkat umum. | `docs/screenshots_user/asli/14-logout-user.png` |

---

### I. Outro — Penutup (09:35–09:55)

| Scene & Durasi | Visual, Shot List & Motion Direction | Voice-over | Aset |
|---|---|---|---|
| **30 — Closing Summary & Identitas Sekolah**<br>09:35–09:55 | **Tipe:** Motion Graphic Outro.<br>**Visual:** Latar `#0B2347`. Panel Dashboard mengambang beserta 3 ringkasan: `1. Pastikan Data Kuesioner Benar`, `2. Unduh Bukti PDF sebagai Arsip`, `3. Selalu Logout Setelah Selesai`. Logo resmi SMK Sasmita Jaya 2 dan fade-out. | Itulah panduan lengkap penggunaan Portal Alumni dan Tracer Study SMK Sasmita Jaya 2. Pastikan data yang Anda kirim sudah benar, simpan bukti pengisian Pe-De-Ef sebagai arsip, dan jangan lupa keluar dari akun setelah selesai. Terima kasih atas partisipasi Anda, dan semoga sukses dalam perjalanan karier maupun studi selanjutnya. | `public/logo-smk.png` |

---

## 4. Asset Checklist

### A. Aset Tersedia di Repositori
- [x] Logo resmi sekolah: `public/logo-smk.png`, `public/logo-smk-dark.png`, `public/logo-yayasan.png`
- [x] Screenshot asli Dashboard User (`docs/screenshots_user/asli/01-login-user.png` s.d. `14-logout-user.png`)
- [x] Screenshot beranotasi (`docs/screenshots_user/anotasi/01-login-user.png` s.d. `14-logout-user.png`)
- [x] Ikon vektor UI pendukung di `public/` (`Shield.svg`, `Graduation.svg`, `Portfolio.svg`, `Job search.svg`, `Phone.svg`)

### B. Aset Tambahan untuk Produksi Video
- [ ] `[ASSET BELUM TERSEDIA]` Klip rekaman layar 1920 × 1080 untuk interaksi live dari build produksi dengan data dummy netral.
- [ ] `[ASSET BELUM TERSEDIA]` Track musik latar instrumental *modern corporate technology*.
- [ ] `[ASSET BELUM TERSEDIA]` Efek suara ringan (*soft whoosh*, *subtle click*, *gentle confirmation*).

---

## 5. Editing Notes & Quality Control Checklist

- **8 Track Timeline:** Screen recording, Masking/Blur layer, UI Spotlight borders, Motion typography, Voice-Over (`-14 LUFS`), Sound effects, Background music (`-24 dB` ducked), Subtitle Bahasa Indonesia (maks 2 baris, safe area).
- **Akurasi:** Urutan langkah sesuai `Buku_Panduan_Dashboard_User.pdf` halaman 1–11; label tombol persis antarmuka; ketentuan pengisian **1 kali per periode tahun ajaran** terjaga; URL `localhost` tidak ditampilkan; data contoh di-masking dan tidak dibacakan.
