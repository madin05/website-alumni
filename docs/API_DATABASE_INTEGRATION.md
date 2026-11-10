# Panduan Integrasi REST API & Sinkronisasi Database
## Sistem Informasi Alumni & Tracer Study SMK Sasmita Jaya 2

Dokumen ini merupakan kontrak teknis dan panduan integrasi antara frontend Single Page Application (SPA) React dengan layanan backend Fastify REST API dan basis data relasional (PostgreSQL / Neon DB / Prisma ORM).

---

## 1. Arsitektur Komunikasi & Konfigurasi Lingkungan

Frontend mengadopsi pola arsitektur **Hybrid Client-Server Synchronization**:
- **Live Database Mode**: Saat variabel lingkungan `VITE_API_URL` terisi dan server backend aktif, seluruh mutasi data (autentikasi, kuesioner, verifikasi, bursa loker, berita, dan pengaturan) disinkronkan secara langsung ke basis data server.
- **Offline / Local Fallback Mode**: Jika backend tidak tersedia atau server sedang mengalami pemeliharaan, frontend secara elegan beralih ke state lokal berbasis Zustand persist (`localStorage`) untuk menjaga kelangsungan interaksi antarmuka.

### Konfigurasi Variabel Lingkungan Frontend (`.env`)
```env
# URL REST API Backend (tanpa garis miring di akhir)
VITE_API_URL="http://localhost:5000"

# Untuk lingkungan produksi di VPS / Cloud
# VITE_API_URL="https://api-tracer.smksasmitajaya2.sch.id"
```

---

## 2. Mekanisme Autentikasi & Autorisasi

- **Metode**: JSON Web Token (JWT) dengan skema Bearer Token (`Authorization: Bearer <token>`) atau HTTP-only Session Cookie.
- **Peran Pengguna (*Role*)**:
  1. `alumni`: Hak akses portal lulusan, pengisian kuesioner, akses bursa loker mitra, dan pengiriman tiket bantuan.
  2. `admin_bkk`: Hak akses penuh ke seluruh modul panel administrator (monitoring KPI, pra-populasi master data, verifikasi kuesioner, manajemen lowongan, publikasi berita, dan cetak laporan resmi).

---

## 3. Spesifikasi Endpoint REST API

### 3.1 Modul Autentikasi (`/api/v1/auth`)

| Metode | Endpoint | Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Publik | Autentikasi alumni (via NISN/NIK) atau admin BKK (via email) |
| `POST` | `/api/v1/auth/logout` | Terproteksi | Mengakhiri sesi pengguna aktif dan menghapus token |
| `GET` | `/api/v1/auth/me` | Terproteksi | Mengambil profil pengguna yang sedang login |

#### Contoh Payload Login (`POST /api/v1/auth/login`):
```json
{
  "identifier": "0051234567",
  "password": "PasswordSiswa123"
}
```

---

### 3.2 Modul Master Data Alumni (`/api/v1/admin/master-alumni`)

| Metode | Endpoint | Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/admin/master-alumni` | Admin | Menampilkan daftar induk alumni dengan parameter filter jurusan & status |
| `POST` | `/api/v1/admin/master-alumni/import` | Admin | Unggah massal data lulusan dari berkas CSV/Excel Dapodik |
| `GET` | `/api/v1/master-alumni/public` | Publik | Direktori pencarian alumni terbatas untuk jejaring angkatan |

---

### 3.3 Modul Kuesioner Tracer Study (`/api/v1/tracer-study`)

| Metode | Endpoint | Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/tracer-study` | Alumni | Mengirimkan formulir kuesioner lengkap 5 tahap |
| `GET` | `/api/v1/tracer-study/:submissionId` | Terproteksi | Mengambil rincian data tanda terima pengisian kuesioner |

#### Format Respons Submit Sukses (`POST /api/v1/tracer-study`):
```json
{
  "success": true,
  "message": "Data kuesioner Tracer Study berhasil disimpan.",
  "data": {
    "submissionId": "2026102498",
    "submittedAt": "2026-10-13T18:00:00.000Z",
    "status": "PENDING"
  }
}
```

---

### 3.4 Modul Verifikasi Responden (`/api/v1/admin/respondents`)

| Metode | Endpoint | Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/admin/respondents` | Admin | Menampilkan antrean kuesioner masuk dengan filter `PENDING`, `VALID`, `REVISI` |
| `PATCH` | `/api/v1/admin/respondents/:submissionId/verify` | Admin | Memperbarui status verifikasi dan mencatat catatan audit perbaikan |

#### Contoh Payload Verifikasi:
```json
{
  "status": "VALID",
  "note": "Data terverifikasi sesuai konfirmasi penelusuran DUDI",
  "verifiedBy": "Admin BKK Sasmita"
}
```

---

### 3.5 Modul Lowongan Kerja Mitra DUDI (`/api/v1/jobs`)

| Metode | Endpoint | Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/jobs` | Terproteksi | Mengambil katalog lowongan kerja aktif |
| `POST` | `/api/v1/jobs` | Admin | Menambahkan lowongan kerja baru |
| `PUT` | `/api/v1/jobs/:id` | Admin | Memperbarui detail lowongan kerja |
| `DELETE` | `/api/v1/jobs/:id` | Admin | Menghapus data lowongan kerja |
| `POST` | `/api/v1/jobs/:id/click` | Alumni | Mencatat metrik klik minat alumni pada kanal rujukan kerja |

---

### 3.6 Modul Berita & Pengumuman BKK (`/api/v1/news`)

| Metode | Endpoint | Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/news` | Publik | Menampilkan daftar artikel berita dan agenda sekolah |
| `GET` | `/api/v1/news/:slug` | Publik | Mengambil isi lengkap artikel berdasarkan slug |
| `POST` | `/api/v1/news` | Admin | Menerbitkan artikel berita baru |
| `PUT` | `/api/v1/news/:id` | Admin | Memperbarui artikel yang sudah terbit |
| `DELETE` | `/api/v1/news/:id` | Admin | Menghapus artikel berita |

---

### 3.7 Modul Pesan & Helpdesk (`/api/v1/messages`)

| Metode | Endpoint | Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/messages` | Publik / User | Mengirimkan tiket kendala atau pertanyaan alumni |
| `GET` | `/api/v1/messages` | Admin | Mengambil daftar tiket pesan masuk |
| `PATCH` | `/api/v1/messages/:id/read` | Admin | Menandai pesan sebagai sudah dibaca / ditanggapi |

---

### 3.8 Modul Laporan & Pengaturan Sistem

| Metode | Endpoint | Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/admin/reports/overview` | Admin | Mengambil agregasi metrik KPI, distribusi BMW, dan rasio per jurusan |
| `GET` | `/api/v1/admin/reports/export` | Admin | Menghasilkan streaming berkas CSV terformat standar Ditjen Vokasi |
| `GET` | `/api/v1/admin/settings` | Terproteksi | Mengambil parameter kuota target, periode survei, dan kontak BKK |
| `PUT` | `/api/v1/admin/settings` | Admin | Memperbarui konfigurasi sistem sekolah dan nama pejabat |

---

## 4. Distribusi Data Riil Responden SMKS Sasmita Jaya 2

Berdasarkan dataset resmi survei vokasi Kemendikbudristek:
- **Total Master Siswa Lulusan**: 250 Siswa
- **Total Kuesioner Selesai**: 221 Siswa (*Response Rate*: 88.4%)
- **Kategori BMW**:
  - **Bekerja**: 164 Siswa (58 Bekerja Mandiri + 106 Melanjutkan Studi sambil Bekerja)
  - **Melanjutkan Pendidikan (Kuliah)**: 32 Siswa (12 Kuliah Murni + 20 Wirausaha sambil Kuliah)
  - **Wirausaha**: 45 Siswa (25 Wirausaha Murni + 20 Wirausaha sambil Kuliah)
  - **Masa Tunggu / Mencari Kerja**: Terserap dalam batas toleransi standar vokasi (< 3 bulan rata-rata masa tunggu).
