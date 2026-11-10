# Sistem Informasi Alumni & Tracer Study — SMK Sasmita Jaya 2 Pamulang

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

Aplikasi web untuk mendukung pengelolaan data penelusuran tamatan (*Tracer Study*) dan layanan Bursa Kerja Khusus (BKK) bagi lulusan SMK Sasmita Jaya 2 Pamulang. Sistem ini dirancang untuk memetakan transisi lulusan ke dunia kerja, perguruan tinggi, maupun wirausaha mandiri, selaras dengan instrumen penelusuran tamatan pendidikan vokasi.

---

## Daftar Isi
- [Fitur Utama](#fitur-utama)
- [Arsitektur & Tech Stack](#arsitektur--tech-stack)
- [Prasyarat Sistem](#prasyarat-sistem)
- [Instalasi dan Menjalankan Proyek](#instalasi-dan-menjalankan-proyek)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Perintah yang Tersedia](#perintah-yang-tersedia)
- [Struktur Direktori Proyek](#struktur-direktori-proyek)
- [Dokumentasi Pendukung](#dokumentasi-pendukung)
- [Batasan dan Status Proyek](#batasan-dan-status-proyek)
- [Kebijakan Data dan Kerahasiaan](#kebijakan-data-dan-kerahasiaan)

---

## Fitur Utama

### 1. Portal Publik & Informasi
- **Landing Page Terpadu:** Informasi profil tracer study, statistik capaian lulusan, saluran informasi layanan sekolah, dan tautan akses akun.
- **Halaman Detail Tentang (`/tentang`):** Penjelasan tujuan tracer study, 5 tahapan pengisian instrumen, dan saluran bantuan Helpdesk BKK.
- **Portal Berita & Agenda (`/berita`):** Publikasi artikel kegiatan sekolah, agenda rekrutmen kerja, dan informasi pembekalan karir alumni.
- **Laporan Statistik Publik (`/laporan`):** Visualisasi ringkasan keterserapan lulusan berdasarkan program keahlian dan status aktivitas.

### 2. Portal Alumni / Responden
- **Autentikasi Akun Alumni:** Akses masuk mandiri menggunakan Nomor Induk Siswa Nasional (NISN) terdaftar dan kata sandi akun.
- **Kuesioner Tracer Study 5 Tahap (`/tracer-study`):**
  - Tahap 1: Verifikasi data pribadi pokok, kontak WhatsApp aktif, email, dan wilayah domisili.
  - Tahap 2: Pelaporan status kegiatan utama (Bekerja, Kuliah, Wirausaha, Bekerja sambil Kuliah, atau Belum Bekerja) serta waktu tunggu kerja.
  - Tahap 3: Pengisian rincian pekerjaan (nama instansi/perusahaan, jabatan, lokasi, rentang pendapatan) dan tingkat keselarasan jurusan.
  - Tahap 4: Penilaian relevansi kompetensi kejuruan dan aspek pembelajaran yang paling bermanfaat pasca kelulusan.
  - Tahap 5: Penyampaian saran peningkatan kurikulum/BKK/industri, konfirmasi kebenaran data, dan pengiriman kuesioner.
- **Penerbitan Bukti Tanda Terima (PDF):** Unduh lembar tanda terima kuesioner resmi berformat PDF yang memuat nomor registrasi unik, data alumni, dan pengesahan sekolah.
- **Bursa Kerja Khusus (BKK Hub):** Penelusuran lowongan pekerjaan dan kesempatan magang mitra DUDI, lengkap dengan filter jurusan, rincian kualifikasi, dan tautan pendaftaran.
- **Direktori Rekan Alumni:** Pencarian sesama lulusan berdasarkan nama, program keahlian, status karir, dan kota tempat tinggal dengan proteksi privasi kontak.
- **Pusat Bantuan (Helpdesk):** Formulir pengiriman tiket pengaduan langsung ke staf BKK dan daftar pertanyaan umum (FAQ).

### 3. Dashboard Administrator & Pengelola BKK
- **Ringkasan Statistik Eksekutif:** Metrik total populasi lulusan, persentase pengisian survei, diagram sebaran status aktivitas, dan progres per program keahlian.
- **Master Data Alumni:** Manajemen basis data siswa lulusan, pencarian/filter per angkatan, ekspor data ke Excel, serta impor data massal berkas Excel/CSV.
- **Data Responden Kuesioner:** Verifikasi dan peninjauan seluruh rincian instrumen jawaban kuesioner yang dikirimkan oleh alumni.
- **Manajemen Lowongan Kerja:** Tambah, perbarui, dan arsipkan lowongan kerja/magang mitra industri sekolah.
- **Manajemen Berita & Agenda:** Editor artikel berita, agenda kegiatan, dan pengumuman BKK.
- **Kotak Masuk Pesan:** Pemantauan dan penanganan tiket keluhan kendala teknis yang dikirimkan melalui Helpdesk.
- **Laporan & Ekspor:** Pembuatan lembar rekapitulasi resmi dan ekspor data agregat untuk kebutuhan evaluasi internal dan akreditasi sekolah.

---

## Arsitektur & Tech Stack

Aplikasi ini dibangun menggunakan arsitektur Single Page Application (SPA) modern pada sisi frontend, dengan modul backend API berbasis REST:

### Frontend
- **Framework & Bahasa:** React 18.3 + TypeScript 5.6
- **Build Tool:** Vite 5.4
- **Styling:** Tailwind CSS 3.4
- **State Management:** Zustand 4.5 (terintegrasi dengan browser storage persistence)
- **Routing:** React Router DOM v6.26
- **Form Management & Validasi:** React Hook Form 7.53 + Zod 3.23
- **Manipulasi Data & Dokumen:** SheetJS (xlsx 0.18) untuk pengolahan spreadsheet, jsPDF 4.2 untuk penerbitan dokumen PDF resmi
- **Ikonografi:** Lucide React 0.446

### Backend (Direktori `backend/`)
- **Runtime & Web Framework:** Node.js + Fastify 4.29
- **ORM & Basis Data:** Prisma ORM 5.22 + MySQL
- **Autentikasi & Keamanan:** JSON Web Token (JWT), bcryptjs, Fastify Rate Limit, Fastify Helmet, dan CORS handler

---

## Prasyarat Sistem

Sebelum memasang dan menjalankan proyek secara lokal, pastikan perangkat telah memenuhi prasyarat berikut:

- **Node.js:** Versi 18.x atau 20.x LTS (disarankan versi LTS terbaru)
- **Package Manager:** npm (versi 9 atau lebih baru)
- **Git:** Versi 2.x atau lebih baru
- **Basis Data (Opsional, untuk backend API):** MySQL 8.x atau MariaDB 10.x

---

## Instalasi dan Menjalankan Proyek

Ikuti instruksi berikut untuk menyiapkan repositori di lingkungan lokal:

### 1. Clone Repositori
```bash
git clone https://github.com/madin05/website-alumni.git
cd website-alumni
```

### 2. Pemasangan Dependensi Frontend
```bash
npm install
```

### 3. Konfigurasi Variabel Lingkungan Frontend
Salin template berkas konfigurasi:
```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# Linux / macOS
cp .env.example .env
```

### 4. Menjalankan Server Development Frontend
```bash
npm run dev
```
Setelah server aktif, buka peramban dan akses alamat yang tertera pada terminal (secara bawaan: `http://localhost:5173`).

### 5. Menjalankan Backend API (Opsional)
Jika Anda ingin menjalankan layanan backend secara lokal:
```bash
cd backend
npm install
cp .env.example .env
# Sesuaikan DATABASE_URL pada backend/.env dengan konfigurasi MySQL lokal Anda
npx prisma generate
npx prisma db push
npm run dev
```

---

## Konfigurasi Environment

Variabel lingkungan frontend dikonfigurasi melalui berkas `.env`:

| Variabel | Keterangan | Status | Nilai Bawaan / Contoh |
|---|---|---|---|
| `VITE_APP_NAME` | Nama aplikasi yang ditampilkan pada antarmuka | Opsional | `"Tracer Study SMK Sasmita Jaya 2"` |
| `VITE_APP_URL` | Alamat URL origin frontend | Opsional | `http://localhost:5173` |
| `VITE_API_URL` | URL absolut endpoint backend API (kosongkan jika memakai dev proxy) | Opsional | `""` atau `http://localhost:3001` |
| `VITE_PROXY_TARGET` | Target penerusan permintaan proxy `/api` pada mode development Vite | Opsional | `http://localhost:3001` |
| `VITE_HELPDESK_PHONE` | Nomor kontak resmi WhatsApp Helpdesk sekolah (format internasional) | Opsional | `6281298765432` |

---

## Perintah yang Tersedia

Daftar perintah npm yang tersedia pada direktori utama:

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Menjalankan server development Vite dengan Hot Module Replacement (HMR). |
| `npm run build` | Menjalankan pemeriksaan tipe TypeScript (`tsc`) dan melakukan kompilasi berkas produksi ke folder `dist/`. |
| `npm run preview` | Menjalankan server lokal untuk meninjau hasil build produksi dari folder `dist/`. |

---

## Struktur Direktori Proyek

```text
web_alumni/
├── backend/                  # Layanan REST API Fastify, skema Prisma, dan migrasi database
├── docs/                     # Buku panduan resmi, dokumentasi teknis, dan arsip tangkapan layar
│   ├── Buku_Panduan_Dashboard_Admin.pdf
│   ├── Buku_Panduan_Dashboard_User.pdf
│   ├── screenshots/          # Tangkapan layar antarmuka dashboard admin
│   └── screenshots_user/     # Tangkapan layar antarmuka dashboard alumni
├── public/                   # Asset publik statis (logo sekolah, ikon, metadata favicon)
├── src/
│   ├── components/           # Komponen antarmuka React
│   │   ├── about/            # Halaman informasi Tentang Tracer Study
│   │   ├── auth/             # Komponen autentikasi dan halaman login
│   │   ├── common/           # Komponen utilitas bersama (pelacak sesi, scroll navigation)
│   │   ├── dashboard/        # Layout dan tab operasional dashboard admin dan user
│   │   ├── landing/          # Komponen landing page publik (hero, navigasi, fitur, FAQ, footer)
│   │   ├── news/             # Portal berita dan halaman rincian artikel
│   │   ├── report/           # Portal publikasi laporan statistik tracer study
│   │   ├── tracer/           # Formulir wizard kuesioner tracer study (Langkah 1–5 dan bukti selesai)
│   │   └── ui/               # Komponen antarmuka atomik (Button, Input, Modal, Card, Select)
│   ├── data/                 # Data awal / mock data untuk kebutuhan pengembangan antarmuka
│   ├── schemas/              # Skema validasi data menggunakan Zod
│   ├── store/                # Manajemen state global aplikasi (Zustand: authStore, tracerStore, adminStore)
│   ├── types/                # Definisi tipe data TypeScript
│   ├── App.tsx               # Konfigurasi perutean utama (React Router DOM)
│   ├── index.css             # Konfigurasi Tailwind CSS dan utilitas tata letak global
│   └── main.tsx              # Titik masuk utama aplikasi React
├── .env.example              # Template variabel lingkungan frontend
├── index.html                # Berkas HTML template utama
├── package.json              # Manifest proyek dan dependensi frontend
├── tailwind.config.js        # Konfigurasi tema, palet warna, dan breakpoint Tailwind CSS
├── tsconfig.json             # Konfigurasi compiler TypeScript
└── vite.config.ts            # Konfigurasi bundler Vite dan proxy pengembangan
```

---

## Dokumentasi Pendukung

Petunjuk operasional mendalam telah disusun ke dalam dokumen terpisah:
- **Buku Panduan Dashboard Admin:** [docs/Buku_Panduan_Dashboard_Admin.pdf](docs/Buku_Panduan_Dashboard_Admin.pdf)
- **Buku Panduan Dashboard User (Alumni):** [docs/Buku_Panduan_Dashboard_User.pdf](docs/Buku_Panduan_Dashboard_User.pdf)
- **Spesifikasi Teknis API & Integrasi Database:** [docs/API_DATABASE_INTEGRATION.md](docs/API_DATABASE_INTEGRATION.md)

---

## Batasan dan Status Proyek

- **Status Data:** Lingkungan frontend saat ini dilengkapi dengan dataset sintetis untuk kebutuhan simulasi antarmuka dan pengujian alur pengisian kuesioner. Seluruh data alumni, NIK, dan nomor kontak contoh merupakan data sintetis untuk pengujian.
- **Mekanisme Persistensi:** Pada mode pengembangan mandiri (standalone frontend), data preferensi dan status kuesioner tersimpan pada browser storage (`localStorage`). Untuk persistensi terpusat, hubungkan ke server backend API pada folder `backend/`.
- **Validasi Kuesioner:** Sesuai instrumen vokasi, pengisian kuesioner dibatasi satu kali pengiriman per periode bagi masing-masing responden.

---

## Kebijakan Data dan Kerahasiaan

1. **Perlindungan Data Pribadi:** Seluruh identitas alumni (seperti NISN, NIK, nomor telepon, dan email) dikelola dengan prinsip kehati-hatian. Repositori publik ini dilarang keras memuat data pribadi asli milik siswa, alumni, maupun tenaga pengajar.
2. **Kerahasiaan Kredensial:** Seluruh secret konfigurasi, access token, dan password basis data harus dikelola secara terisolasi pada berkas `.env` lokal masing-masing lingkungan kerja dan tidak boleh dikomit ke dalam riwayat Git.

---

Hak Cipta (c) 2026 SMK Sasmita Jaya 2 Pamulang. Hak cipta dilindungi undang-undang.
