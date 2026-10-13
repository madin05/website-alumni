# Analisis Variabel Tracer Study: Komparasi Data Riil Satpen Excel vs Sistem Web Alumni

**Berkas Rujukan:** `export_responden_alumni_satpen_1791439484.xlsx`  
**Sumber Data:** Instrumen Riil Tracer Study Satuan Pendidikan (Satpen) Ditjen Pendidikan Vokasi / Kemendikbudristek untuk **SMKS Sasmita Jaya 2 Pamulang**  
**Volume Sampel Data:** 221 Baris Responden Alumni | 49 Kolom / Variabel  
**Tanggal Analisis:** Oktober 2026  

---

## 1. Ringkasan Eksekutif & Konteks Data

Berkas Excel `export_responden_alumni_satpen_1791439484.xlsx` merupakan data resmi hasil instrumen survei Tracer Study Vokasi tingkat Satuan Pendidikan (Satpen Kemendikbudristek). Data ini mencatat profil kelulusan dan penelusuran lulusan SMKS Sasmita Jaya 2 (NPSN: `20603287`) dengan proporsi aktivitas responden:
- **Melanjutkan Studi sambil Bekerja:** 106 alumni (48.0%)
- **Bekerja:** 58 alumni (26.2%)
- **Wirausaha:** 25 alumni (11.3%)
- **Melanjutkan Studi sambil Wirausaha:** 20 alumni (9.0%)
- **Melanjutkan Studi murni:** 12 alumni (5.4%)

Saat ini, sistem Web Alumni SMK Sasmita Jaya 2 telah memiliki form kuesioner mandiri 4-step wizard, store Zustand (`tracerStore.ts` & `adminStore.ts`), serta skema validasi Zod (`tracerSchema.ts`). Namun, terdapat perbedaan struktural antara variabel di berkas Excel Satpen dengan variabel yang ada di kode saat ini.

---

## 2. Variabel yang TIDAK PERLU Ditambahkan ke Form Web (Eliminasi)

Kolom-kolom berikut terdapat pada Excel Satpen, namun **TIDAK PERLU** dijadikan field input pada form tracer alumni. Menambahkan kolom-kolom ini ke form kuesioner hanya akan membebani alumni (cognitive load tinggi) dan menimbulkan redundansi data.

| No | Nama Kolom di Excel | Nilai Riil di Excel | Alasan Teknis Tidak Perlu Ditambahkan ke Form | Solusi Sistem |
|:---|:---|:---|:---|:---|
| 1 | `No` | 1 s/d 221 | Nomor urut baris spreadsheet statis. | Auto-generate saat render tabel / ekspor. |
| 2 | `Nama Sekolah` | `SMKS SASMITA JAYA 2` | Konstan 100% untuk seluruh alumni sekolah. | Ambil dari `AdminSettings.namaSekolah`. |
| 3 | `NPSN` | `20603287` | Nomor Pokok Sekolah Nasional tetap milik sekolah. | Ambil dari `AdminSettings.npsn`. |
| 4 | `Status Sekolah` | `Swasta` | Konstan status kelembagaan yayasan. | Simpan di konfigurasi statis sekolah. |
| 5 | `Lama Program (Tahun)` | `3` | Konstan durasi jenjang SMK 3 tahun. | Default value sistem = `3`. |
| 6 | `Prov. SMK` | `Prov. Banten` | Lokasi fisik sekolah sudah pasti. | Simpan di metadata sekolah. |
| 7 | `Kab/Kota` | `Kota Tangerang Selatan` | Lokasi fisik sekolah sudah pasti. | Simpan di metadata sekolah. |
| 8 | `Prog. Keahlian` | `Teknik Ketenagalistrikan`, `Teknik Komputer dan Informatika`, dll. | **Redundan spektrum kurikulum.** Program Keahlian adalah turunan pasti (1-to-1 deterministic mapping) dari Jurusan / Kompetensi Keahlian. | Sistem otomatis memetakan Program Keahlian berdasarkan Jurusan yang dipilih alumni. |
| 9 | `Bid. Keahlian` | `Teknologi dan Rekayasa`, `Teknologi Informasi dan Komunikasi` | **Redundan level induk.** Bidang Keahlian sudah pasti ditentukan oleh jurusan yang dipilih. | Sistem otomatis menentukan Bidang Keahlian via lookup helper saat ekspor. |
| 10 | `Negara Kerja` | 100% `Indonesia` | Seluruh responden tercatat di Indonesia. Alumni tidak perlu mengetik nama negara secara manual. | Default sistem = `"Indonesia"`, cukup sediakan toggle opsional *"Bekerja di Luar Negeri"* jika relevan. |
| 11 | `Negara Usaha` | 100% `Indonesia` | Seluruh tempat usaha tercatat di Indonesia. | Default sistem = `"Indonesia"`. |

> **Rekomendasi Arsitektur:** Semua kolom di atas ditangani pada level **Ekspor Adapter** (`excelExport.ts`), di mana sistem secara otomatis menyisipkan konstanta sekolah dan lookup tabel spektrum vokasi tanpa meminta alumni mengisinya.

---

## 3. Variabel yang HARUS DISESUAIKAN (Harmonisasi & Normalisasi Data)

Beberapa variabel sudah ada pada web saat ini dan juga ada di Excel Satpen, namun memiliki perbedaan tipe data, skala nilai, atau penamaan (naming convention). Variabel ini memerlukan harmonisasi data:

| No | Variabel di Excel | Variabel di Web Saat Ini | Format di Excel | Format di Web | Bentuk Penyesuaian yang Diperlukan |
|:---|:---|:---|:---|:---|:---|
| 1 | `Status Aktifitas Lulusan` | `status_kegiatan` | Teks panjang:<br>- *Melanjutkan Studi sambil Bekerja*<br>- *Bekerja*<br>- *Wirausaha*<br>- *Melanjutkan Studi sambil Wirausaha*<br>- *Melanjutkan Studi* | Enum kode:<br>`KERJA`<br>`KULIAH`<br>`WIRAUSAHA`<br>`KERJA_KULIAH`<br>`WIRAUSAHA_KULIAH`<br>`BELUM_KERJA`<br>`LAINNYA` | **Buat Bi-directional Adapter:**<br>Saat import: teks Satpen diubah ke enum web.<br>Saat export: enum web diubah kembali ke teks baku Kemendikbud. |
| 2 | `Masa Tunggu Bekerja(bulan)` | `masa_tunggu` | Angka numerik bulan:<br>`0`, `2`, `5`, `6`, `13` | Range string:<br>`< 3 bulan`<br>`3–6 bulan`<br>`6–12 bulan`<br>`> 12 bulan` | **Ubah ke Input Numerik Bulan dengan Quick Pill:**<br>Input numerik murni jauh lebih superior karena memungkinkan BKK menghitung **rata-rata masa tunggu riil (mean & median)** untuk evaluasi akreditasi. Range string menghilangkan ketepatan data. |
| 3 | `Keselarasan Kerja`<br>`Keselarasan Usaha` | `kesesuaian_jurusan`<br>`kesesuaian_kompetensi` | Biner baku Satpen:<br>- `Selaras`<br>- `Tidak Selaras` | Skala Likert 4 level:<br>- `Sangat sesuai`<br>- `Sesuai`<br>- `Kurang sesuai`<br>- `Tidak sesuai` | **Pertahankan 4 Level di Web, Buat Mapper saat Ekspor:**<br>- `Sangat sesuai` / `Sesuai` &rarr; `Selaras`<br>- `Kurang sesuai` / `Tidak sesuai` &rarr; `Tidak Selaras`<br>Tingkat 4 level lebih kaya untuk evaluasi kurikulum internal BKK. |
| 4 | `Jenis Kelamin` | `jenis_kelamin` | Singkatan 1 huruf:<br>`L` / `P` | String penuh:<br>`Laki-laki` / `Perempuan` | **Normalisasi Canonical:**<br>Di store dan Zod schema terima keduanya secara aman (`'L' \| 'P' \| 'Laki-laki' \| 'Perempuan'`), dengan helper format saat export. |
| 5 | `Jenjang Pendidikan` | `jenjang` | Menggunakan hyphen:<br>`S-1`, `D-4` | Tanpa hyphen:<br>`S1`, `D4`, `D3` | **Sanitasi String:**<br>Lakukan normalisasi string `.replace('-', '')` pada layer import/export. |
| 6 | `Pendapatan Bekerja / Wirausaha` | `pendapatan_ump`<br>`pendapatan_umk` | Status Relatif UMP & UMK:<br>- `Kurang dari UMP`<br>- `Sama dengan atau lebih dari UMP`<br>- `Kurang dari UMK`<br>- `Sama dengan atau lebih dari UMK` | Status Relatif UMP & UMK (Nominal Rupiah Dihapus):<br>- `Sama dengan atau lebih dari UMP`<br>- `Kurang dari UMP`<br>- `Sama dengan atau lebih dari UMK`<br>- `Kurang dari UMK` | **Harmonisasi Standar Kemendikbud & Privasi:**<br>Nominal rupiah telah dihapus sesuai arahan privasi dan format Ditjen Vokasi. Kuesioner kini murni menggunakan status relatif terhadap UMP Provinsi dan UMK Kab/Kota. |
| 7 | `Lokasi Kerja & Negara` | `lokasi_pekerjaan`<br>`negara_kerja` | Pilihan Dalam Negeri vs Luar Negeri + Negara | Pilihan Dalam Negeri vs Luar Negeri + Negara | **Dukungan Luar Negeri & Eliminasi Duplikasi Kota:**<br>Duplikasi input kota dihapus (kini hanya 1 input terpadu). Jika alumni memilih bekerja di luar negeri, sistem menampilkan input Negara Tempat Bekerja dan Kota/Wilayah di Luar Negeri. |

---

## 4. Variabel yang HARUS DITAMBAHKAN ke Form Web (Feature Gap)

Variabel-variabel di bawah ini terdapat pada instrumen riil Satpen Vokasi dan memiliki **nilai operasional tinggi bagi BKK SMKS Sasmita Jaya 2**, namun saat ini **belum tersedia** di schema kuesioner web:

| No | Nama Variabel Baru | Tipe Data & Opsi | Urgensi & Manfaat untuk Sekolah & BKK | Penempatan di UI Form |
|:---|:---|:---|:---|:---|
| 1 | **`status_menikah`** | Enum: `'Belum Menikah' \| 'Menikah'` | Data demografi BKK untuk pemetaan kesiapan relokasi dan penempatan kerja industri alumni. | **Step 1: Identitas Alumni** |
| 2 | **`usia`** | Number (atau tanggal lahir) | Mayoritas lowongan kerja mitra industri BKK menetapkan batas usia ketat (maksimal 20-21 tahun). | **Step 1: Identitas Alumni** |
| 3 | **`provinsi_domisili`<br>`kota_domisili`** | String (Dropdown Wilayah) | Saat ini web hanya mencatat domisili tempat kerja, bukan tempat tinggal aktual alumni. Penting untuk mengetahui mobilitas lulusan. | **Step 1: Identitas Alumni** |
| 4 | **`keterangan_kerja`** *(Status Kepegawaian)* | Enum:<br>- `Buruh/karyawan/pegawai`<br>- `Pekerja bebas (freelance)`<br>- `Berusaha sendiri tanpa pekerja`<br>- `Membantu usaha keluarga (unpaid)`<br>- `Berwirausaha dengan pekerja` | Standar indikator ketenagakerjaan BPS/Kemendikbud untuk membedakan pekerjaan sektor formal vs informal vs pekerja keluarga. | **Step 3: Detail Kerja / Usaha** |
| 5 | **`provinsi_kerja`<br>`kota_kerja`** | String terpisah | Saat ini web hanya memiliki satu field teks bebas `kota_kabupaten`. Pemisahan ini memungkinkan dashboard membuat peta sebaran geografis per provinsi. | **Step 3: Detail Kerja** |
| 6 | **`provinsi_usaha`<br>`kota_usaha`** | String terpisah | Analitik sebaran titik wirausaha alumni (lokal Tangsel vs luar kota). | **Step 3: Detail Usaha** |
| 7 | **`jenis_usaha`** | Enum:<br>- `Barang`<br>- `Jasa`<br>- `Barang Dan Jasa` | Mengklasifikasikan output wirausaha alumni secara formal sesuai instrumen kementerian. | **Step 3: Detail Usaha** |
| 8 | **`nama_produk_usaha`** | String | Nama barang atau jasa yang diperjualbelikan (contoh: bengkel motor, sparepart, instalasi listrik, service PC). | **Step 3: Detail Usaha** |
| 9 | **`keselarasan_studi`** | Enum: `'Selaras' \| 'Tidak Selaras'` (atau 4 tingkat) | **Kritis:** Form web saat ini sama sekali **tidak memiliki** pertanyaan keselarasan untuk alumni yang kuliah! Padahal data riil menunjukkan hanya 18.4% alumni kuliah yang jurusannya selaras dengan kompetensi SMK. | **Step 3: Detail Kuliah** |
| 10 | **`pendapatan_ump`<br>`pendapatan_umk`** | Enum:<br>- `Kurang dari UMP`<br>- `Sama dengan atau lebih dari UMP`<br>- `Kurang dari UMK`<br>- `Sama dengan atau lebih dari UMK` | Tolok ukur utama penilaian SMK Pusat Keunggulan (PK) dan BBPMP Kemendikbudristek untuk mengukur kesejahteraan upah lulusan. | **Step 3: Detail Kerja & Usaha** |

---

## 5. Analisis Dampak: Apakah Ini Perubahan MAJOR atau MINOR?

Pertanyaan Inti: **"Jika ada penambahan variabel, apakah itu akan menjadi perubahan MAJOR atau MINOR?"**

### 5.1. Klasifikasi Resmi: **PERUBAHAN MINOR (Non-Breaking Safe Extension)**

Berdasarkan prinsip **Semantic Versioning (SemVer)** dan arsitektur kode saat ini, penambahan variabel-variabel tersebut diklasifikasikan sebagai **PERUBAHAN MINOR**, dengan syarat diterapkan mengikuti standar rekayasa perangkat lunak berikut:

#### A. Aspek Database & Skema Zod (Mengapa MINOR)
- Variabel-variabel baru didefinisikan sebagai **Optional (`.optional()`)** pada Zod schema dan TypeScript interface:
  ```typescript
  export interface IdentitasAlumni {
    // Field lama tetap utuh (Zero Regression)
    nama_lengkap: string;
    nisn: string;
    ...
    // Field baru ditambahkan sebagai safe extension (Optional)
    status_menikah?: 'Belum Menikah' | 'Menikah';
    usia?: number;
    provinsi_domisili?: string;
    kota_domisili?: string;
  }
  ```
- Karena bersifat *optional*, maka:
  1. Data historis responden yang sudah tersimpan di `localStorage` **tidak akan rusak atau gagal di-*rehydrate***.
  2. Submisi dari formulir lama tidak akan gagal validasi (`validation error`).
  3. API mock atau backend tidak menolak request yang tidak menyertakan kolom baru.
- Jika di kemudian hari dihubungkan ke database SQL (seperti PostgreSQL/Supabase), kolom-kolom baru cukup dideklarasikan sebagai `NULL` atau memiliki `DEFAULT value`, sehingga migrasi database bersifat **Zero-Downtime**.

#### B. Aspek UI / UX Form Wizard (Mengapa MINOR)
- Penambahan field baru tidak mengubah alur logika 4-step wizard:
  - Step 1 tetap: Identitas Alumni
  - Step 2 tetap: Status Kegiatan Utama
  - Step 3 tetap: Detail Aktivitas (Kerja / Kuliah / Usaha)
  - Step 4 tetap: Evaluasi Pembelajaran & Kepuasan
- Form hanya bertambah beberapa field input yang diletakkan secara harmonis di dalam grid card yang sudah ada.

#### C. Aspek Ekspor & Impor Excel (Mengapa MINOR)
- Modul ekspor Excel (`excelExport.ts` dan `AdminExportReportTab.tsx`) menggunakan pemetaan fallback:
  ```typescript
  "Provinsi Domisili": r.fullPayload.identitas.provinsi_domisili || "Prov. Banten",
  "Status Menikah": r.fullPayload.identitas.status_menikah || "Belum Menikah",
  ```
- Dengan adanya fallback operator (`||`), data lama yang belum memiliki nilai tetap terisi nilai wajar (graceful degradation), sehingga tidak ada kolom kosong yang merusak format laporan kementerian.

---

### 5.2. Peringatan: Kapan Perubahan Ini Bisa Berubah Menjadi MAJOR?

Perubahan ini **BISA BERUBAH MENJADI MAJOR (BREAKING CHANGE)** jika terjadi kesalahan implementasi berikut:

> ⚠️ **Perhatian Kritis:**
> 1. **Membuat Field Baru Menjadi Mandatory (Wajib Tanpa Fallback):**  
>    Jika field baru divalidasi dengan `.min(1, 'Wajib diisi')` secara langsung di Zod schema, maka seluruh form draft lama yang tersimpan di browser alumni akan langsung gagal divalidasi dan tidak bisa di-submit sebelum alumni mengisi data baru tersebut.
> 
> 2. **Mengubah Struktur Tipe Data Kunci (Data Type Incompatibility):**  
>    Jika `status_kegiatan` lama bertipe `'KERJA'` diubah paksa menjadi string panjang `'Bekerja'`, maka seluruh komponen filter analitik (`countKerja`, `countKuliah`, chart BKK) yang bergantung pada string `'KERJA'` akan rusak (*broken downstream logic*).
> 
> 3. **Menghapus atau Mengganti Nama Properti yang Sudah Ada:**  
>    Menghapus field lama (seperti `kota_kabupaten`) tanpa backward compatibility alias akan menyebabkan halaman PDF generator dan drawer detail admin error.

---

## 6. Rekomendasi Strategi Eksekusi (Zero-Regression Roadmap)

Agar integrasi variabel baru berjalan mulus dengan status **MINOR & ZERO REGRESSION**, berikut langkah teknis yang direkomendasikan:

```
[Phase 1: Type Extension]
Perbarui src/types/tracer.ts
-> Tambahkan property baru dengan tanda tanya (?) (Optional)

[Phase 2: Validation Safe Guard]
Perbarui src/schemas/tracerSchema.ts
-> Tambahkan skema z.string().optional() / z.number().optional()

[Phase 3: Form Extension]
Perbarui Step1Identitas.tsx & Step3Detail.tsx
-> Tambahkan input fields dengan layout grid responsif

[Phase 4: Adapter & Export Harmonization]
Perbarui AdminExportReportTab.tsx & AdminImportModal.tsx
-> Lengkapi mapping 49 kolom Excel Satpen Kemendikbud
```

### Kesimpulan Akhir
Integrasi variabel dari berkas riil `export_responden_alumni_satpen_1791439484.xlsx` adalah langkah yang sangat tepat untuk menstandarkan aplikasi Web Alumni SMK Sasmita Jaya 2 dengan standar nasional Kemendikbudristek. Dengan menerapkan prinsip **Safe Extension & Backward Compatibility**, perubahan ini adalah **PERUBAHAN MINOR** yang aman, tidak merusak data lama, dan meningkatkan akurasi data tracer study sekolah secara signifikan.
