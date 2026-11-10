# Arsitektur & Alur Kerja Fitur Informasi Lowongan Kerja (BKK Hub)
SMK Sasmita Jaya 2

Dokumen ini mendefinisikan rancangan alur kerja menyeluruh (end-to-end), aturan bisnis, arsitektur teknis, dan skema data fitur Informasi Lowongan Kerja pada Portal Alumni SMK Sasmita Jaya 2.

Fitur ini mengadopsi model **Information Hub & Direct Referral**. Sistem tidak berfungsi sebagai Applicant Tracking System (ATS) berbasis penyimpanan berkas internal, melainkan sebagai pusat agregasi, verifikasi legalitas loker DUDI (Dunia Usaha dan Dunia Industri), serta pemandu rujukan mandiri alumni yang telah tervalidasi Tracer Study ke kanal rekrutmen resmi mitra industri.

---

## 1. Arsitektur Peran Sistem

```
+-----------------------------------------------------------------------------------+
|                                  BKK HUB PLATFORM                                 |
+-----------------------------------------------------------------------------------+
       |                                      ^                               ^
       | 1. Eksplorasi Lowongan               | 2. Input & Verifikasi Loker   |
       | 2. Validasi Tracer Study             | 3. Monitoring Minat Alumni    |
       v                                      |                               |
+---------------+                     +--------------------+                  |
| ALUMNI / USER |                     | ADMINISTRATOR BKK  |                  |
+---------------+                     +--------------------+                  |
       |                                                                      |
       | 3. Pendaftaran Mandiri Langsung (Direct Referral)                    |
       v                                                                      |
+-----------------------------------------------------------------------------+-----+
|                              MITRA INDUSTRI (DUDI)                                |
|  - Walk-in Interview: Penerimaan berkas fisik di lokasi kerja mitra               |
|  - WhatsApp HRD: Kontak langsung via template chat terstruktur                    |
|  - Email Rekrutmen: Pengiriman berkas CV & portofolio via email resmi             |
|  - Portal Karir: Registrasi melalui website karir / Google Form resmi mitra      |
+-----------------------------------------------------------------------------------+
```

### Definisi Peran:
1. **Alumni (Pencari Informasi):** Menelusuri informasi lowongan kerja terverifikasi, membuka akses kontak pendaftaran setelah menyelesaikan Tracer Study, dan melamar langsung ke pihak mitra industri.
2. **Administrator BKK (Verifikator & Publisher):** Mengelola kurasi lowongan kerja dari DUDI mitra, menentukan metode pendaftaran yang disepakati mitra, dan memantau metrik animo/klik minat alumni.
3. **Mitra Industri (Penerima Mandiri):** Menyediakan rincian kualifikasi kebutuhan tenaga kerja ke pihak sekolah dan menerima berkas pelamar langsung dari alumni SMK Sasmita Jaya 2 tanpa antrean perantara di web.

---

## 2. Alur Pengguna (Sisi Alumni)

Alur penelusuran dan pendaftaran kerja alumni berjalan melalui empat tahapan utama:

```
[Katalog Lowongan] 
       |
       v
[Pilih Lowongan & Klik Akses Pendaftaran]
       |
       +---> [Cek Status Tracer Study]
                   |
                   +--- Belum Mengisi ---> [Modal Peringatan Gatekeeper] ---> [Arahkan ke Tab Tracer Study]
                   |
                   +--- Sudah Mengisi  ---> [Trigger Track Click (Debounced)]
                                                   |
                                                   v
                                        [Modal Direct Referral Dinamis]
                                                   |
                      +----------------------------+----------------------------+
                      |                            |                            |
                      v                            v                            v
               [Kanal Walk-in]             [Kanal WhatsApp]              [Kanal Email]
           - Alamat & Rute Maps         - Nomor HRD (+62...)         - Alamat Email HRD
           - Jadwal Kedatangan          - Template Pesan             - Subjek Terformat
           - Berkas Fisik Wajib         - Tautan wa.me               - Tautan mailto:
           - Salin Alamat               - Salin Template             - Salin Email/Subjek
                                                                                |
                                                                                v
                                                                        [Kanal Portal Web]
                                                                     - URL Form Resmi
                                                                     - Salin Link & Buka Tab
```

### Tahap 1: Eksplorasi Katalog & Filter
- Alumni mengakses tab **Lowongan Kerja** pada Dashboard.
- Sistem menyajikan kartu lowongan kerja aktif yang memuat:
  - Judul posisi dan nama perusahaan mitra.
  - Tipe pekerjaan (Full-time, Magang, Kontrak, Part-time).
  - Badge metode pendaftaran (`Walk-in Interview`, `WhatsApp HRD`, `Kirim Email`, `Portal Karir Resmi`).
  - Badge verifikasi status Mitra DUDI Resmi BKK.
  - Estimasi rentang gaji dan batas waktu pendaftaran (deadline).
  - Tag sasaran program keahlian / jurusan SMK.
- Fitur pencarian teks instan (judul posisi, nama perusahaan, wilayah) dan filter dropdown berdasarkan program keahlian.

### Tahap 2: Validasi Tracer Study (Gatekeeper Security Rule)
- Tombol aksi pada kartu pekerjaan bertindak sebagai titik periksa integritas:
  - Jika alumni **belum menyelesaikan Tracer Study** (`!isTracerDone`):
    - Tombol menampilkan ikon gembok pengaman.
    - Sistem membuka **Modal Alert Akses Terkunci**: *"Lengkapi Tracer Study Terlebih Dahulu"*.
    - Modal memuat alasan kebijakan: rujukan mitra BKK hanya diperuntukkan bagi alumni terverifikasi demi validasi keabsahan data lulusan.
    - Tombol CTA **"Isi Tracer Study Sekarang"** secara otomatis memindahkan rute aktif alumni langsung ke formulir kuesioner `tracer_study`.
  - Jika alumni **sudah menyelesaikan Tracer Study** (`isTracerDone === true`):
    - Akses pendaftaran langsung terbuka menuju Modal Direct Referral.

### Tahap 3: Pelacakan Minat (Click Tracking) & Proteksi Anti-Spam
- Setiap kali pendaftaran lowongan diakses, sistem memicu event pelacakan `trackJobClick(job.id)`.
- **Proteksi Anti-Spam (Debounce):** Diterapkan pembatasan internal berbasis timestamp dengan interval 3.000 ms (3 detik) per job ID. Klik berulang dalam durasi tersebut tidak akan menaikkan metrik berulang kali.
- Metrik ini dicatat untuk kebutuhan analitik BKK sekolah dalam mengukur posisi kerja yang paling diminati oleh lulusan.

### Tahap 4: Modal Rujukan Pendaftaran Mandiri (Direct Referral Channels)
Sistem menampilkan modal rujukan dinamis sesuai nilai `applyType` lowongan:

#### 1. Kanal Walk-in Interview (`walk_in`)
- Ditujukan untuk mitra yang membuka seleksi langsung di lokasi pabrik / kantor cabang.
- **Data yang Ditampilkan:**
  - Jadwal operasional kedatangan (contoh: Senin s/d Kamis, Pukul 08.30 - 11.00 WIB).
  - Alamat lengkap lokasi tujuan seleksi.
  - Tombol **"Salin Alamat Lengkap"** dengan feedback indikator tersalin.
  - Tombol **"Buka di Google Maps"** untuk navigasi GPS langsung.
  - Daftar berkas fisik yang wajib dibawa: Surat lamaran kerja, cetakan CV rapi, pas foto formal terbaru, fotokopi ijazah/SKL, fotokopi sertifikat BNSP/UKK, fotokopi KTP dan KK.
  - Panduan tata tertib: Standar busana formal (kemeja putih, celana bahan hitam, sepatu formal) dan waktu kehadiran.

#### 2. Kanal WhatsApp HRD (`whatsapp`)
- Ditujukan untuk rekrutmen cepat melalui jalur komunikasi langsung HRD mitra.
- **Data yang Ditampilkan:**
  - Nomor telepon WhatsApp HRD dalam format standar internasional (`628...`).
  - Template pesan lamaran resmi yang otomatis memuat variabel dinamis alumni:
    - Nama lengkap alumni (diambil dari akun profil).
    - Program keahlian / jurusan SMK Sasmita Jaya 2.
    - Tahun kelulusan.
    - Judul posisi lowongan yang dilamar.
  - Tombol **"Salin Template Chat"**.
  - Tombol **"Hubungi via WhatsApp"** yang membuka URL `https://wa.me/{cleanNumber}?text={encodedText}` pada tab baru.
  - Petunjuk operasional: Mengirim pesan pada jam kerja (08.00 - 17.00 WIB) dan menyiapkan lampiran berkas CV format PDF.

#### 3. Kanal Email Rekrutmen (`email`)
- Ditujukan untuk korespondensi formal divisi Human Capital Management mitra.
- **Data yang Ditampilkan:**
  - Alamat email rekrutmen resmi mitra.
  - Tombol **"Salin Alamat Email"**.
  - Format subjek email terstandarisasi: `Lamaran Pekerjaan - {Judul Posisi} - {Nama Alumni}`.
  - Tombol **"Salin Subjek Email"**.
  - Tombol **"Buka Aplikasi Email"** yang mengaktifkan URL scheme `mailto:{email}?subject={encodedSubject}`.
  - Petunjuk lampiran: Berkas CV format PDF maksimal 2 MB, portofolio kejuruan, dan salinan ijazah/SKL SMK Sasmita Jaya 2.

#### 4. Kanal Portal Karir Resmi (`external_url`)
- Ditujukan untuk mitra korporasi yang memiliki sistem karir internal atau Google Form khusus.
- **Data yang Ditampilkan:**
  - Tautan URL resmi formulir pendaftaran.
  - Tombol **"Salin Link"**.
  - Tombol **"Buka Portal Pendaftaran Resmi"** yang membuka tab baru secara aman (`rel="noopener noreferrer"`).
  - Petunjuk pengisian: Memastikan alumni mencantumkan asal sekolah SMK Sasmita Jaya 2 secara lengkap untuk mempermudah validasi rekomendasi BKK.

---

## 3. Alur Pengguna (Sisi Administrator BKK)

```
[Kelola Informasi Lowongan Kerja & BKK Hub]
       |
       +---> [Tabel/Kartu Manajemen Loker]
       |           - Badge Tipe & Kanal Pendaftaran
       |           - Metrik Klik Minat Alumni
       |           - Aksi Edit & Hapus
       |
       +---> [Form Editor Lowongan]
                   |
                   +---> [Input Data Umum: Posisi, DUDI, Lokasi, Gaji, Deadline, Jurusan]
                   |
                   +---> [Pilih Metode Pendaftaran (applyType)]
                   |           |
                   |           +--- Email       ---> Input Email & Subjek Terformat
                   |           +--- WhatsApp    ---> Input No. WA (628...) & Template Chat
                   |           +--- Walk-in     ---> Input Alamat Lengkap, Jadwal, Google Maps URL
                   |           +--- Portal Web  ---> Input URL Portal Karir / Google Form
                   |
                   +---> [Live Preview Kartu Real-Time di Panel Kanan]
                   |
                   +---> [Validasi Skema & Publikasikan]
```

### Tahap 1: Monitoring dan Daftar Loker
- Admin BKK dapat melihat ringkasan metrik:
  - **Total Loker Aktif:** Jumlah total lowongan yang tayang.
  - **Mitra DUDI Resmi:** Lowongan dengan verifikasi kemitraan resmi BKK sekolah.
  - **Minat / Klik Alumni:** Akumulasi interaksi alumni yang membuka kanal pendaftaran.
  - **Jurusan Tercover:** Ketercakupan program keahlian SMK Sasmita Jaya 2.
- Setiap kartu lowongan memuat indikator kanal pendaftaran dan jumlah klik minat yang diperoleh secara real-time.

### Tahap 2: Form Editor Lowongan Kerja Dinamis
- **Pemilihan Kanal Pendaftaran:** Admin memilih salah satu dari 4 metode pada pemilih radio card berdesain ringkas.
- **Tampilan Form Kontekstual:** Form hanya memunculkan field input yang relevan dengan metode yang dipilih:
  - Memilih `Walk-in`: Memunculkan input alamat lengkap walk-in, jadwal/jam kedatangan, dan URL Google Maps.
  - Memilih `WhatsApp`: Memunculkan input nomor WhatsApp HRD berstandar internasional dan area teks penulisan template chat rekomendasi.
  - Memilih `Email`: Memunculkan input email rekrutmen mitra dan kustomisasi subjek email.
  - Memilih `Portal Karir`: Memunculkan input URL website rekrutmen mitra.
- **Validasi Data:** Sistem memverifikasi bahwa field wajib per kanal telah diisi sebelum data dapat dipublikasikan.
- **Live Preview:** Panel sisi kanan menampilkan pratinjau kartu lowongan secara instan sesuai perubahan data pada form editor.

---

## 4. Skema Data & Model Teknis

### Interface TypeScript: `JobApplyType` & `JobVacancy`
Lokasi: `src/types/tracer.ts`

```typescript
export type JobApplyType = 'walk_in' | 'whatsapp' | 'email' | 'external_url';

export interface JobVacancy {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: 'Full-time' | 'Internship / Magang' | 'Part-time' | 'Kontrak';
  salary: string;
  targetMajors: string[];
  postedAt: string;
  deadline: string;
  description: string;
  requirements: string[];
  contactPerson: string;
  isBkkPartner: boolean;

  // Field Kanal Direct Referral
  applyType?: JobApplyType;
  locationAddress?: string;     // Alamat lengkap rute walk-in
  walkInSchedule?: string;      // Hari dan jam operasional walk-in
  mapsUrl?: string;             // Tautan lokasi Google Maps
  whatsappNumber?: string;      // Nomor WhatsApp HRD (628...)
  whatsappTemplate?: string;    // Template pesan pembuka WhatsApp
  emailAddress?: string;        // Alamat email rekrutmen mitra
  emailSubject?: string;        // Standar format subjek email
  externalUrl?: string;         // Tautan formulir / portal resmi mitra
  clickCount?: number;          // Metrik jumlah klik minat alumni
}
```

### State Management & Pelacakan Aksi: `useContentStore`
Lokasi: `src/store/contentStore.ts`

```typescript
// Fungsi pelacakan minat yang di-trigger saat alumni membuka rujukan kontak
trackJobClick: (id: string) => {
  set((state) => ({
    jobList: state.jobList.map((job) =>
      job.id === id ? { ...job, clickCount: (job.clickCount || 0) + 1 } : job
    ),
  }));
};
```

---

## 5. Ringkasan Matrix Perbandingan Fitur

| Aspek Penilaian | Model ATS Lama (Upload CV Internal) | Model Information Hub & Direct Referral Baru |
| :--- | :--- | :--- |
| **Penyimpanan Berkas** | Menumpuk berkas PDF di server lokal portal alumni | Alumni membawa/mengirim berkas langsung ke kanal mitra |
| **Beban Admin BKK** | Berat (harus memilah CV satu per satu dan meneruskan manual) | Ringan (fokus pada kurasi legalitas loker DUDI dan kemitraan) |
| **Kecepatan Proses** | Lambat (tertahan di antrean database web sekolah) | Instan (alumni langsung terhubung ke HRD mitra industri) |
| **Privasi Data Alumni** | Rentan tertimbun di database web | Aman (alumni mengontrol penuh data yang dikirimkan ke mitra) |
| **Validasi Tracer Study** | Tidak terkoneksi | Terkunci otomatis (wajib isi Tracer Study sebelum kontak terbuka) |
| **Fleksibilitas Seleksi** | Terbatas hanya pada form seragam | Fleksibel mendukung 4 metode: Walk-in, WhatsApp, Email, & Portal Web |
| **Metrik Ketercapaian** | Hanya hitungan upload berkas | Pelacakan klik minat alumni per lowongan secara transparan |