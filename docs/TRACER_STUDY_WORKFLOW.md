# Workflow & Dokumentasi Teknis: Modul Tracer Study
## Sistem Informasi Alumni & Tracer Study SMK Sasmita Jaya 2

Dokumen ini menjelaskan secara rinci dan aktual seluruh alur kerja (*workflow*), arsitektur komponen, validasi data, logika percabangan kondisional, serta diagram alir (*flowchart*) dari modul **Tracer Study** yang telah diimplementasikan pada kode sumber aplikasi.

---

## 1. Ringkasan Eksekutif & Struktur Berkas

Modul Tracer Study dirancang khusus untuk merekam jejak lulusan SMK Sasmita Jaya 2 sesuai instrumen penelusuran lulusan Direktorat SMK Kemendikdasmen RI dengan gaya antarmuka formal **Dapodik Alumni**. 

### 1.1 Berkas Sumber Kode Terkait
| Modul / Komponen | Path Berkas | Fungsi Utama |
| :--- | :--- | :--- |
| **Routing & Guard** | [`src/App.tsx`](file:///c:/Arif/projek%20coding/web_alumni/src/App.tsx) | Rute `/tracer-study` dan proteksi autentikasi |
| **Tipe Data (Types)** | [`src/types/tracer.ts`](file:///c:/Arif/projek%20coding/web_alumni/src/types/tracer.ts) | Definisi interface TypeScript & payload kuesioner |
| **Skema Validasi** | [`src/schemas/tracerSchema.ts`](file:///c:/Arif/projek%20coding/web_alumni/src/schemas/tracerSchema.ts) | Aturan validasi Zod untuk setiap langkah form |
| **State Management** | [`src/store/tracerStore.ts`](file:///c:/Arif/projek%20coding/web_alumni/src/store/tracerStore.ts) | Store Zustand dengan middleware `persist` (Local Storage) |
| **Sinkronisasi Sesi** | [`src/store/authStore.ts`](file:///c:/Arif/projek%20coding/web_alumni/src/store/authStore.ts) | Update status tracer user (`SUDAH` / `BELUM`) |
| **API Client Service** | [`src/services/tracerService.ts`](file:///c:/Arif/projek%20coding/web_alumni/src/services/tracerService.ts) | Pengiriman data ke endpoint `/api/v1/tracer-study` |
| **Main Orchestrator** | [`src/components/tracer/TracerWizard.tsx`](file:///c:/Arif/projek%20coding/web_alumni/src/components/tracer/TracerWizard.tsx) | Wrapper multi-step form & modal pengendali |
| **Pengantar Survei** | [`src/components/tracer/TracerIntro.tsx`](file:///c:/Arif/projek%20coding/web_alumni/src/components/tracer/TracerIntro.tsx) | Halaman pembuka & petunjuk instrumen resmi |
| **Step 1: Identitas** | [`src/components/tracer/Step1Identity.tsx`](file:///c:/Arif/projek%20coding/web_alumni/src/components/tracer/Step1Identity.tsx) | Form data pribadi alumni & validasi tahun |
| **Step 2: Status** | [`src/components/tracer/Step2Status.tsx`](file:///c:/Arif/projek%20coding/web_alumni/src/components/tracer/Step2Status.tsx) | Pilihan 7 aktivitas utama & masa tunggu |
| **Step 3: Detail** | [`src/components/tracer/Step3Details.tsx`](file:///c:/Arif/projek%20coding/web_alumni/src/components/tracer/Step3Details.tsx) | Form kondisional dinamis (Kerja/Kuliah/Usaha) |
| **Step 4: Evaluasi** | [`src/components/tracer/Step4Evaluation.tsx`](file:///c:/Arif/projek%20coding/web_alumni/src/components/tracer/Step4Evaluation.tsx) | Penilaian relevansi kurikulum & kompetensi |
| **Step 5: Review** | [`src/components/tracer/Step5Review.tsx`](file:///c:/Arif/projek%20coding/web_alumni/src/components/tracer/Step5Review.tsx) | Umpan balik BKK, persetujuan & eksekusi submit |
| **Bukti Pengisian** | [`src/components/tracer/SubmissionReceiptModal.tsx`](file:///c:/Arif/projek%20coding/web_alumni/src/components/tracer/SubmissionReceiptModal.tsx) | Modal tanda bukti resmi & cetak/PDF |

---

## 2. Diagram Alir (Flowcharts)

### 2.1 Flowchart Alur Navigasi & Siklus Hidup Pengguna (User Journey)
Diagram berikut menggambarkan perjalanan alumni mulai dari mengakses tautan hingga mendapatkan tanda bukti registrasi:

```mermaid
flowchart TD
    Start([Pengguna Masuk / Klik Tombol Tracer]) --> CheckAuth{Apakah Sudah Login?}
    
    CheckAuth -- Tidak --> GoLogin[Redirect ke /login]
    GoLogin --> DoLogin[Autentikasi NISN / NIK / Email]
    DoLogin --> BackToRoute[Arahkan ke /tracer-study atau /dashboard]

    CheckAuth -- Ya --> CheckRoute[Akses via Rute /tracer-study atau Tab Dashboard]
    CheckRoute --> CheckTracerDone{Sudah Mengisi di Periode Tahun Aktif?<br/>isTracerDone == true}

    CheckTracerDone -- Ya (Sudah Mengisi) --> ShowLocked[Tampilkan Layar Terkunci Periode 2026<br/>Status: Terkunci 1x Pengisian per Tahun]
    ShowLocked --> LockActions{Pilihan Pengguna}
    LockActions -- Lihat Bukti --> OpenReceiptLocked[Buka SubmissionReceiptModal.tsx]
    LockActions -- Kembali --> GoDashLocked[Navigasi ke /dashboard]

    CheckTracerDone -- Belum Mengisi --> CheckStarted{hasStartedSurvey == true?}

    CheckStarted -- Tidak --> ShowIntro[Tampilkan TracerIntro.tsx<br/>Pengantar Resmi Kemendikdasmen]
    ShowIntro --> ClickStart[Klik Tombol 'MULAI SURVEY']
    ClickStart --> SetStarted[hasStartedSurvey = true]
    
    SetStarted --> Step1[Step 1: DATA LULUSAN<br/>Validasi Identitas & Tahun]
    CheckStarted -- Ya --> Step1

    Step1 -->|Klik Simpan & Lanjut| ValidStep1{Validasi Step 1 Lolos?}
    ValidStep1 -- Gagal --> ShowErr1[Tampilkan Pesan Error di Form]
    ValidStep1 -- Lolos --> SaveStep1[updateIdentitas di Zustand Store]
    SaveStep1 --> Step2[Step 2: STATUS LULUSAN<br/>Pilih 1 dari 7 Aktivitas & Masa Tunggu]

    Step2 -->|Klik Kembali| Step1
    Step2 -->|Klik Simpan & Lanjut| ValidStep2{Status & Masa Tunggu Dipilih?}
    ValidStep2 -- Belum --> WarnModal2[Tampilkan Warning ConfirmModal]
    ValidStep2 -- Lolos --> SaveStep2[updateStatusKegiatan & Reset/Init Child Forms]
    SaveStep2 --> Step3[Step 3: DETAIL AKTIVITAS<br/>Form Kondisional Sesuai Status]

    Step3 -->|Klik Kembali| Step2
    Step3 -->|Klik Simpan & Lanjut| ValidStep3{Field Wajib Cabang Terisi?}
    ValidStep3 -- Belum --> WarnModal3[Tampilkan Warning ConfirmModal]
    ValidStep3 -- Lolos --> SaveStep3[Update detail_kerja / detail_kuliah / detail_usaha]
    SaveStep3 --> Step4[Step 4: PENILAIAN SMK<br/>Skala Relevansi & Kompetensi Bermanfaat]

    Step4 -->|Klik Kembali| Step3
    Step4 -->|Klik Simpan & Lanjut| ValidStep4{Rating & Minimal 1 Skill Dipilih?}
    ValidStep4 -- Belum --> WarnModal4[Tampilkan Warning ConfirmModal]
    ValidStep4 -- Lolos --> SaveStep4[updateEvaluasi di Zustand Store]
    SaveStep4 --> Step5[Step 5: UMPAN BALIK & REVIEW<br/>Saran BKK, Industri, & Checkbox Legal]

    Step5 -->|Klik Kembali| Step4
    Step5 -->|Klik Simpan & Kirim| ValidAgree{Checkbox Pernyataan Dicentang?}
    ValidAgree -- Belum --> ShowErrAgree[Peringatan: Persetujuan Wajib Dicentang]
    ValidAgree -- Ya --> ExecuteSubmit[Panggil submitTracer Payload]

    ExecuteSubmit --> APIReq{Kirim ke Backend API / Store}
    APIReq -- Sukses --> UpdateState[1. Simpan Riwayat di Store<br/>2. Update authStore: tracerStatus = 'SUDAH'<br/>3. Sync ke adminStore Respondents & MasterAlumni<br/>4. Kirim Notifikasi ke mailStore]
    UpdateState --> OpenReceipt[Buka SubmissionReceiptModal.tsx]
    
    OpenReceipt --> ActionReceipt{Pilihan Alumni}
    ActionReceipt --> PrintDoc[Cetak Tanda Bukti / Simpan PDF]
    ActionReceipt --> GoDash[Navigasi ke /dashboard<br/>Banner Berubah Menjadi 'Sudah Mengisi']
```

---

### 2.2 Flowchart Percabangan Logika Kondisional (Step 3: Detail Aktivitas)
Di **Langkah 3**, sistem memeriksa nilai `status_kegiatan` dari `Step 2` dan merender form secara dinamis:

```mermaid
flowchart TD
    StatusInput[Status Kegiatan dari Step 2] --> BranchCheck{Nilai status_kegiatan}

    BranchCheck -->|KERJA| RenderKerja[Render Blok Pekerjaan:<br/>• Perusahaan & Jabatan Wajib<br/>• Bidang & Kota<br/>• Status Kerja Tetap/Kontrak/Magang<br/>• Kesesuaian Jurusan SMK Wajib<br/>• Range Gaji Opsional]
    
    BranchCheck -->|KULIAH| RenderKuliah[Render Blok Perkuliahan:<br/>• Nama Kampus & Prodi Wajib<br/>• Jenjang D3/D4/S1/Lainnya<br/>• Status Kuliah Aktif/Lulus]

    BranchCheck -->|WIRAUSAHA| RenderUsaha[Render Blok Kewirausahaan:<br/>• Nama Usaha Wajib<br/>• Bidang Usaha & Lama Usaha<br/>• Jumlah Karyawan<br/>• Kesesuaian dengan Kejuruan]

    BranchCheck -->|KERJA_KULIAH| RenderMulti1[Render GABUNGAN Blok:<br/>1. Blok Pekerjaan Lengkap<br/>2. Blok Perkuliahan Lengkap]

    BranchCheck -->|WIRAUSAHA_KULIAH| RenderMulti2[Render GABUNGAN Blok:<br/>1. Blok Perkuliahan Lengkap<br/>2. Blok Kewirausahaan Lengkap]

    BranchCheck -->|BELUM_KERJA atau LAINNYA| RenderInfo[Render Banner Khusus:<br/>Informasi Penyaluran Info Loker & Pelatihan dari BKK]

    RenderKerja --> ValidateForm[Validasi Field Wajib Per Blok]
    RenderKuliah --> ValidateForm
    RenderUsaha --> ValidateForm
    RenderMulti1 --> ValidateForm
    RenderInfo --> ValidateForm
    ValidateForm --> ToStep4[Lanjut ke Step 4: Penilaian SMK]
```

---

### 2.3 Flowchart Submit & Sinkronisasi Data (Submission & Storage Flow)
Diagram berikut merinci bagaimana data divalidasi dengan Zod, disimpan ke REST API/klien, dan disinkronkan ke seluruh sistem:

```mermaid
sequenceDiagram
    autonumber
    actor Alumni as Pengguna (Alumni)
    participant UI as Step5Review.tsx
    participant Service as tracerService.ts
    participant Zod as tracerSchema.ts
    participant TStore as tracerStore (Zustand + Persist)
    participant AStore as authStore (User Session)
    participant Modal as SubmissionReceiptModal

    Alumni->>UI: Klik tombol "Simpan dan kirim survey"
    UI->>UI: Cek persetujuan (agreement == true)
    
    UI->>Service: submitTracerStudy(payload)
    Service->>Zod: completeTracerFormSchema.safeParse(payload)
    
    alt Validasi Skema Gagal
        Zod-->>Service: Validation Errors (issues list)
        Service-->>UI: { success: false, errors }
        UI->>Alumni: Tampilkan alert daftar error validasi
    else Validasi Skema Berhasil
        Zod-->>Service: Success
        alt VITE_API_URL Tersedia
            Service->>Backend API: POST /api/v1/tracer-study (JSON Payload)
            Backend API-->>Service: Response JSON { success: true, submission_id, submitted_at }
        else Mode Mock / Client Offline Fallback
            Service->>Service: Generate ID 202610XXXX ([Tahun][Bulan][4-Digit Acak])
            Service-->>Service: Return mock response (PRD Section 5.1)
        end
        Service-->>UI: Response Sukses
        
        UI->>TStore: submitTracer(payload)
        Note over TStore: isSubmitted = true<br/>lastSubmissionId = 202610XXXX<br/>Riwayat masuk submissionHistory<br/>Disimpan di LocalStorage
        
        UI->>AStore: updateUserTracerStatus('SUDAH', submissionId)
        Note over AStore: user.tracerStatus = 'SUDAH'<br/>User session disinkronkan
        
        UI->>UI: Trigger confetti animation
        UI->>Modal: Buka modal bukti pengisian (submissionId)
        Modal-->>Alumni: Tampilkan Tanda Bukti & Opsi Cetak PDF
    end
```

---

## 3. Rincian Teknis Setiap Tahap Workflow

### 3.1 Gerbang Autentikasi & Masuk Wizard
* **Lokasi Kode**: [`src/App.tsx:40-43`](file:///c:/Arif/projek%20coding/web_alumni/src/App.tsx#L40-L43) dan [`src/components/tracer/TracerWizard.tsx:33-37`](file:///c:/Arif/projek%20coding/web_alumni/src/components/tracer/TracerWizard.tsx#L33-L37)
* **Aturan**:
  1. Halaman Tracer Study hanya dapat diakses oleh user yang telah terautentikasi (`isAuthenticated === true`).
  2. Jika pengunjung tamu (belum login) mengakses `/tracer-study`, sistem secara otomatis me-redirect ke `/login`.
  3. Dapat diakses langsung dari menu navigasi utama, tautan cepat di beranda, tombol kartu di detail berita, maupun tab **Tracer Study** di dalam Dashboard Alumni.

---

### 3.2 Tampilan Pengantar (*Intro Screen*)
* **Lokasi Kode**: [`src/components/tracer/TracerIntro.tsx`](file:///c:/Arif/projek%20coding/web_alumni/src/components/tracer/TracerIntro.tsx)
* **Kondisi Muncul**: Saat `hasStartedSurvey === false` pada `useTracerStore`.
* **Elemen yang Ditampilkan**:
  1. Header resmi: *"Pengantar bagi Alumni SMK"*.
  2. 5 Poin Tujuan Tracer Study Kemendikdasmen (keterserapan lulusan, evaluasi mutu, informasi ketenagakerjaan, pemetaan kompetensi, dan akreditasi sekolah).
  3. 3 Butir Petunjuk Pengisian instrumen.
  4. Tombol aksi: `MULAI SURVEY` (mengubah `hasStartedSurvey` menjadi `true` dan scroll ke atas).

---

### 3.3 Step 1: Identitas / Data Pribadi Alumni
* **Lokasi Kode**: [`src/components/tracer/Step1Identity.tsx`](file:///c:/Arif/projek%20coding/web_alumni/src/components/tracer/Step1Identity.tsx)
* **Skema Validasi**: `step1Schema` pada [`src/schemas/tracerSchema.ts:138-185`](file:///c:/Arif/projek%20coding/web_alumni/src/schemas/tracerSchema.ts#L138-L185)
* **Atribut & Validasi**:
  * `nama_lengkap`: Wajib, minimal 3 karakter, maksimal 100 karakter.
  * `nisn`: Wajib, minimal 4 digit string.
  * `nik`: Opsional, maksimal 16 digit angka (sesuai data Dukcapil).
  * `tahun_masuk`: Wajib, angka tahun minimal 2000 s.d. tahun berjalan.
  * `tahun_lulus`: Wajib, angka tahun minimal 2003 s.d. tahun berjalan + 1.
  * *Refinement Rule*: `tahun_lulus >= tahun_masuk` (mencegah inkonsistensi waktu kelulusan).
  * `jurusan`: Wajib, enum 7 kompetensi keahlian resmi SMK Sasmita Jaya 2:
    - *Teknik Komputer dan Jaringan*
    - *Rekayasa Perangkat Lunak*
    - *Teknik Kendaraan Ringan Otomotif*
    - *Teknik Bisnis Sepeda Motor*
    - *Otomatisasi & Tata Kelola Perkantoran*
    - *Akuntansi & Keuangan Lembaga*
    - *Bisnis Daring & Pemasaran*
  * `no_whatsapp`: Wajib, regex validasi format telepon Indonesia `/^(\+62|62|0)8[0-9]{7,11}$/`.
  * `email`: Wajib, format standar email RFC.
  * `jenis_kelamin`: Radio button (*Laki-laki* / *Perempuan*).
* **Fitur Tambahan**: Tombol **"Isi Contoh Data"** untuk pengujian cepat dengan data mock valid.

---

### 3.4 Step 2: Status Kegiatan & Masa Tunggu
* **Lokasi Kode**: [`src/components/tracer/Step2Status.tsx`](file:///c:/Arif/projek%20coding/web_alumni/src/components/tracer/Step2Status.tsx)
* **Pilihan Status (`status_kegiatan`)**:
  1. `KERJA` — Bekerja di instansi / perusahaan / kantor.
  2. `KULIAH` — Melanjutkan studi perguruan tinggi (D3, D4, S1).
  3. `WIRAUSAHA` — Membuka usaha mandiri / menjalankan bisnis.
  4. `KERJA_KULIAH` — Menjalani pekerjaan sekaligus studi perguruan tinggi.
  5. `WIRAUSAHA_KULIAH` — Menjalankan usaha sekaligus studi perguruan tinggi.
  6. `BELUM_KERJA` — Sedang mencari pekerjaan / masa persiapan.
  7. `LAINNYA` — Aktivitas di luar kategori di atas.
* **Pilihan Masa Tunggu (`masa_tunggu`)**:
  - `< 3 bulan`
  - `3–6 bulan`
  - `6–12 bulan`
  - `> 12 bulan`
  - `Belum mendapatkan pekerjaan`
* **Logika Inisialisasi Otomatis**:
  Saat alumni memilih atau mengubah status, action `updateStatusKegiatan` di Zustand secara otomatis menyiapkan template data child object (`detail_kerja`, `detail_kuliah`, `detail_usaha`) atau me-reset child yang tidak relevan menjadi `null`.

---

### 3.5 Step 3: Detail Aktivitas Kondisional
* **Lokasi Kode**: [`src/components/tracer/Step3Details.tsx`](file:///c:/Arif/projek%20coding/web_alumni/src/components/tracer/Step3Details.tsx)
* **Tampilan Dinamis Berdasarkan Status**:
  1. **Jika Ada Unsur Kerja (`KERJA` atau `KERJA_KULIAH`)**:
     * Nama Perusahaan/Instansi (*Wajib*)
     * Jabatan / Posisi Pekerjaan (*Wajib*)
     * Bidang Pekerjaan (*Opsional*)
     * Kota / Kabupaten Tempat Bekerja (*Opsional*)
     * Status Pekerjaan: Radio (*Tetap*, *Kontrak*, *Freelance*, *Magang*)
     * Kesesuaian Pekerjaan dengan Kejuruan SMK (*Wajib*): Radio (*Sangat sesuai*, *Sesuai*, *Kurang sesuai*, *Tidak sesuai*)
     * Kisaran Penghasilan Bulanan (*Opsional*): Radio (< Rp 2jt, Rp 2jt–4jt, Rp 4jt–7jt, > Rp 7jt)
  2. **Jika Ada Unsur Kuliah (`KULIAH`, `KERJA_KULIAH`, atau `WIRAUSAHA_KULIAH`)**:
     * Nama Perguruan Tinggi (*Wajib*)
     * Program Studi (*Wajib*)
     * Jenjang Pendidikan: Radio (*D3*, *D4*, *S1*, *Lainnya*)
     * Status Kuliah: Radio (*Aktif*, *Lulus*, *Tidak melanjutkan*)
  3. **Jika Ada Unsur Wirausaha (`WIRAUSAHA` atau `WIRAUSAHA_KULIAH`)**:
     * Nama Usaha yang Dijalankan (*Wajib*)
     * Bidang Usaha (*Opsional*)
     * Lama Menjalankan Usaha: Radio (< 6 bulan, 6–12 bulan, 1–2 tahun, > 2 tahun)
     * Jumlah Tenaga Kerja: Radio (*Dijalankan sendiri*, *1–3 orang*, *4–10 orang*, *> 10 orang*)
     * Keterkaitan Usaha dengan Kejuruan: Radio (*Sangat berkaitan*, *Berkaitan*, *Kurang berkaitan*, *Tidak berkaitan*)
  4. **Jika Belum Bekerja / Lainnya (`BELUM_KERJA` atau `LAINNYA`)**:
     * Menampilkan kotak informasi khusus: *"Data Anda akan digunakan oleh BKK SMK Sasmita Jaya 2 untuk menyalurkan informasi lowongan kerja aktif dan pelatihan kerja."*

---

### 3.6 Step 4: Penilaian Terhadap SMK & Evaluasi Kurikulum
* **Lokasi Kode**: [`src/components/tracer/Step4Evaluation.tsx`](file:///c:/Arif/projek%20coding/web_alumni/src/components/tracer/Step4Evaluation.tsx)
* **Komponen Evaluasi**:
  1. **Tingkat Relevansi Kompetensi**: Skala Likert 1 s.d. 5 (*1 - Sangat Tidak Relevan* s.d. *5 - Sangat Relevan*).
  2. **Kompetensi yang Paling Bermanfaat**: Pilihan multi-select checkbox (minimal wajib pilih 1):
     - *Kompetensi teknis*
     - *Komputer/TIK*
     - *Komunikasi*
     - *Kerja sama*
     - *Kedisiplinan*
     - *Kewirausahaan*
     - *Lainnya*
  3. **Kompetensi yang Masih Perlu Ditingkatkan**: Textarea terbuka (masukan alumni untuk lab/praktik).
  4. **Bantuan Pembelajaran Menghadapi Dunia Kerja**: Radio (*Sangat membantu*, *Membantu*, *Kurang membantu*, *Tidak membantu*).

---

### 3.7 Step 5: Masukan Alumni, Konfirmasi & Submit
* **Lokasi Kode**: [`src/components/tracer/Step5Review.tsx`](file:///c:/Arif/projek%20coding/web_alumni/src/components/tracer/Step5Review.tsx)
* **Elemen Form**:
  1. Textarea Saran Peningkatan Pembelajaran di SMK.
  2. Textarea Saran Layanan BKK & Hubungan Alumni.
  3. Textarea Saran Kerja Sama Industri & Guru Tamu.
  4. Pilihan Radio Kesediaan Dihubungi Kembali (*Ya* / *Tidak*).
  5. **Kartu Ringkasan Isian**: Menampilkan kilas balik Nama, NISN, Jurusan, dan Status Utama.
  6. **Pernyataan Kebenaran Data (Agreement)**: Checkbox wajib dicentang sebelum data dapat terkirim:
     > *"Saya menyatakan dengan sesungguhnya bahwa data yang saya isikan adalah benar dan sesuai dengan kondisi sebenarnya."*
* **Aksi Eksekusi Pengiriman**:
  - Memanggil `submitTracerStudy(payload)` dari [`src/services/tracerService.ts`](file:///c:/Arif/projek%20coding/web_alumni/src/services/tracerService.ts).
  - Melakukan validasi final payload lengkap via `completeTracerFormSchema.safeParse`.
  - Mengirim payload ke backend via HTTP POST ke `/api/v1/tracer-study` (atau simulasi jika backend belum aktif).
  - Mengupdate status akun alumni pada `authStore` menjadi `SUDAH`.
  - Memicu animasi perayaan confetti (`canvas-confetti`).
  - Membuka modal tanda bukti bukti pengisian.

---

### 3.8 Modal Tanda Bukti Resmi (*Submission Receipt*) & Dokumen PDF
* **Lokasi Kode**: [`src/components/tracer/SubmissionReceiptModal.tsx`](file:///c:/Arif/projek%20coding/web_alumni/src/components/tracer/SubmissionReceiptModal.tsx) dan [`src/lib/pdfGenerator.ts`](file:///c:/Arif/projek%20coding/web_alumni/src/lib/pdfGenerator.ts)
* **Format & Standar Penulisan**:
  1. **Tipografi Formal**: Menggunakan jenis huruf **Times New Roman** (serif) standar administrasi persuratan resmi sekolah.
  2. **Format Nomor Registrasi 10-Digit**: Format angka `[Tahun 4 Digit][Bulan 2 Digit][Nomor Acak/Sequence 4 Digit]`, contoh: `2026102498` (memudahkan pengindeksan database backend dan verifikasi petugas TU).
  3. **Kop Surat Formal Lengkap**: Memuat identitas Yayasan Sasmita Jaya, SMK Sasmita Jaya 2 Pamulang, status Akreditasi "A" Unggul, NPSN, NSS, alamat lengkap, kontak telepon, website, dan email resmi yang dibatasi garis ganda kop surat.
  4. **Struktur Dokumen**:
     - Judul: **SURAT KETERANGAN BUKTI PENGISIAN TRACER STUDY**.
     - Paragraf pembuka formal BKK.
     - Rincian Data Terdaftar: Nama Lengkap, NISN/NIK, Program Keahlian, Tahun Masuk/Lulus, Nomor Kontak (WA), Email, Status Aktivitas, Waktu Pengisian Sistem.
     - Paragraf pengesahan dan keterangan pengambilan Ijazah & Sertifikat BNSP.
     - Bagian tanda tangan, tanggal formal Pamulang, cap stempel digital BKK, dan NIP pejabat berwenang.
     - Catatan kaki kode verifikasi digital (`2026102498-SASMITA-VALID`).
  5. **Tombol Aksi**:
     - Tombol **"Unduh Berkas PDF"**: Meng-generate dokumen PDF formal resolusi tinggi siap cetak via `jsPDF`.
     - Tombol **"Buka Dashboard Alumni"**: Mengarahkan alumni kembali ke beranda akun dengan status data yang telah terverifikasi.

---

## 4. Struktur Kontrak Data (Payload JSON)

Berikut adalah struktur data JSON aktual yang dikirimkan ke server pada saat submit:

```json
{
  "identitas": {
    "nama_lengkap": "Ahmad Dani",
    "nisn": "0051234567",
    "nik": "3674012345670001",
    "tahun_masuk": 2021,
    "tahun_lulus": 2024,
    "jurusan": "Teknik Komputer dan Jaringan",
    "no_whatsapp": "081298765432",
    "email": "ahmaddani@example.com",
    "jenis_kelamin": "Laki-laki"
  },
  "status_kegiatan": "KERJA_KULIAH",
  "masa_tunggu": "< 3 bulan",
  "detail_kerja": {
    "nama_perusahaan": "PT Solusi Teknologi Nusantara",
    "jabatan": "Technical Support",
    "bidang_pekerjaan": "Teknologi Informasi & Jaringan",
    "kota_kabupaten": "Tangerang Selatan",
    "status_pekerjaan": "Tetap",
    "kesesuaian_jurusan": "Sangat sesuai",
    "kisaran_penghasilan": "Rp 4.000.000 – Rp 7.000.000"
  },
  "detail_kuliah": {
    "nama_kampus": "Universitas Pamulang",
    "program_studi": "Teknik Informatika",
    "jenjang": "S1",
    "status_kuliah": "Aktif"
  },
  "detail_usaha": null,
  "evaluasi": {
    "skor_relevansi": 5,
    "kompetensi_bermanfaat": [
      "Kompetensi teknis",
      "Komunikasi",
      "Kerja sama"
    ],
    "kompetensi_ditingkatkan": "Bahasa Inggris dan praktik cloud computing",
    "bantu_dunia_kerja": "Sangat membantu",
    "saran_pembelajaran": "Perbanyak jam praktik industri dan sertifikasi kejuruan.",
    "saran_bkk": "Perluas kemitraan rekrutmen kampus dan industri Jabodetabek.",
    "saran_industri": "Tingkatkan program guru tamu dari praktisi industri.",
    "kesediaan_dihubungi": true
  },
  "agreement": true
}
```

---

### 3.9 Proteksi Pengisian Tahunan (Annual Single-Submission Lock)
* **Lokasi Kode**: [`src/components/tracer/TracerWizard.tsx`](file:///c:/Arif/projek%20coding/web_alumni/src/components/tracer/TracerWizard.tsx)
* **Aturan Bisnis & Regulasi**:
  - Sesuai regulasi penelusuran tamatan Kemendikdasmen RI dan BKK SMK Sasmita Jaya 2, pengisian instrumen kuesioner dibatasi **1 (satu) kali per periode tahun ajaran aktif** per alumni.
  - Alumni yang telah mengisi (`isSubmitted === true` atau `user.tracerStatus === 'SUDAH'`) tidak diperkenankan mengisi ulang secara mandiri guna menjaga integritas data statistik sekolah.
* **Tampilan Layar Terkunci (*Locked State Screen*)**:
  1. **Header Banner**: Menampilkan strip *Tracer Study Periode 2026* dengan badge status *Sudah Mengisi*.
  2. **Banner Sukses & Edukasi**: Penjelasan bahwa data kuesioner periode berjalan telah tersimpan resmi di pangkalan data BKK.
  3. **Data Summary Grid**:
     - Nomor Registrasi Resmi (format 10 digit, contoh: `2026102498`).
     - Waktu & Tanggal Pengisian (format standar WIB).
     - Nama Lengkap & NISN Alumni.
     - Kompetensi Keahlian & Tahun Kelulusan.
  4. **Aksi Utama**:
     - Tombol **"Lihat / Cetak Tanda Terima Resmi"**: Membuka modal bukti tanda pengisian lengkap dengan format formal Times New Roman.
     - Tombol **"Kembali ke Dashboard"**: Navigasi ke ringkasan akun alumni.

---

## 5. Fitur Keandalan Data & UX Tambahan

1. **Proteksi Pengisian Tunggal Tahunan (*Annual Single-Submission Enforcement*)**:
   - Mencegah spam data duplikat dengan secara otomatis mengunci formulir jika akun alumni telah tercatat berstatus `SUDAH`.
2. **Auto-Save & Pencegahan Kehilangan Data (*Draft Persistence*)**:
   - Store formulir diintegrasikan dengan middleware `persist` Zustand (`tracer_study_sasmita2_store` di LocalStorage).
   - Apabila halaman tidak sengaja di-refresh, koneksi putus, atau tab browser ditutup, alumni tidak akan kehilangan isian yang sudah diketik sebelumnya.
3. **Modal Reset Formulir**:
   - Terdapat tombol *"Reset Isian"* pada pojok kanan atas wizard yang dilindungi dialog konfirmasi ([`src/components/ui/ConfirmModal.tsx`](file:///c:/Arif/projek%20coding/web_alumni/src/components/ui/ConfirmModal.tsx)) untuk mengembalikan form ke status bersih jika diperlukan sebelum pengiriman final.
4. **Navigasi Bersahabat dengan Riwayat Browser (*URL Step Synchronization*)**:
   - Setiap langkah form disinkronkan dengan parameter URL `?step=1` hingga `?step=5`.
   - Menjamin tombol **Back (<)** dan **Forward (>)** browser bekerja secara alami tanpa merusak status isian form.
5. **Responsif Seluler & Tablet**:
   - Stepper secara otomatis berubah menjadi mode ringkas numerik pada layar HP (`sm:hidden`), dan mode tab horizontal Dapodik pada layar desktop/tablet.
6. **Integrasi Status Dashboard Real-time**:
   - Begitu submit berhasil, banner pada [`src/components/dashboard/OverviewTab.tsx`](file:///c:/Arif/projek%20coding/web_alumni/src/components/dashboard/OverviewTab.tsx) secara otomatis beralih dari ajakan kuesioner menjadi notifikasi sukses *"Data Tracer Study Anda Sudah Tersimpan"* dengan tombol cepat untuk mencetak ulang tanda bukti kapan saja.
  