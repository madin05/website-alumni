# BUKU PANDUAN PENGGUNAAN DASHBOARD ADMIN
## Sistem Informasi Tracer Study & Bursa Kerja Khusus (BKK) — SMK Sasmita Jaya 2

---

## Daftar Isi

1. [Bab 1. Pendahuluan](#1-pendahuluan)
2. [Bab 2. Persiapan Penggunaan](#2-persiapan-penggunaan)
3. [Bab 3. Login dan Akses Dashboard](#3-login-dan-akses-dashboard)
4. [Bab 4. Mengenal Dashboard Admin](#4-mengenal-dashboard-admin)
5. [Bab 5. Panduan Setiap Menu Admin](#5-panduan-setiap-menu-admin)
   - [5.1 Menu Dashboard (Ringkasan & Statistik Utama)](#51-menu-dashboard)
   - [5.2 Menu Data Alumni (Kelola Data Siswa Lulusan)](#52-menu-data-alumni)
   - [5.3 Menu Data Responden (Verifikasi & Rincian Kuesioner)](#53-menu-data-responden)
   - [5.4 Menu Pesan Masuk (Kotak Masuk Alumni)](#54-menu-pesan-masuk)
   - [5.5 Menu Kelola Berita (Publikasi Berita & Informasi)](#55-menu-kelola-berita)
   - [5.6 Menu Kelola Loker (Manajemen Lowongan Kerja & BKK Hub)](#56-menu-kelola-loker)
   - [5.7 Menu Laporan (Ekspor Excel/CSV & Cetak Rekapitulasi Resmi PDF)](#57-menu-laporan)
   - [5.8 Menu Pengaturan (Konfigurasi Target, Pejabat, & Identitas Sekolah)](#58-menu-pengaturan)
6. [Bab 6. Fitur Pendukung Dashboard Admin](#6-fitur-pendukung-dashboard-admin)
7. [Bab 7. Cara Keluar (Logout) dengan Aman](#7-cara-keluar-logout-dengan-aman)

---

## 1. Pendahuluan
Buku panduan ini disusun sebagai pedoman resmi bagi pengelola sekolah dalam mengoperasikan **Dashboard Admin Sistem Informasi Tracer Study & Bursa Kerja Khusus (BKK) SMK Sasmita Jaya 2**. Seluruh penjelasan dan tangkapan layar di dalam dokumen ini mengacu langsung pada antarmuka website versi terbaru.
### 1.1 Tujuan Dokumen
- Memberikan petunjuk langkah demi langkah yang jelas, runtut, dan mudah dipahami bagi pengelola non-teknis dalam menjalankan tugas administrasi harian.
- Memastikan proses pemantauan penelusuran tamatan (*Tracer Study*), pengelolaan basis data lulusan, publikasi berita/informasi, penayangan lowongan kerja mitra industri (DUDI), hingga pencetakan laporan resmi berjalan seragam dan akurat.
- Menjadi rujukan standar operasional prosedur (SOP) pengelolaan portal alumni di lingkungan SMK Sasmita Jaya 2.
### 1.2 Pengguna Sasaran
Dokumen panduan ini ditujukan bagi pengguna internal yang memiliki hak akses pengelolaan sistem, meliputi:
Peran Pengguna
Tanggung Jawab Utama di Dalam Sistem
**Administrator BKK / Koordinator Tracer Study**
Memantau statistik keterserapan lulusan, memeriksa data responden, mengelola lowongan kerja mitra DUDI, membalas pesan alumni, dan mencetak laporan rekapitulasi resmi.
**Staf Tata Usaha / Operator Sekolah**
Memperbarui data induk siswa lulusan (impor/ekspor Excel), memvalidasi kelengkapan identitas alumni, serta memperbarui profil pejabat pengesahan di menu Pengaturan Sistem.
**Tim Humas & Publikasi Sekolah**
Mengelola penerbitan artikel berita kegiatan sekolah, pengumuman BKK, dan kisah sukses alumni melalui menu Kelola Berita.
### 1.3 Ruang Lingkup Fitur Dashboard Admin
Ruang lingkup pengelolaan pada Dashboard Admin mencakup delapan menu utama yang terletak pada bilah navigasi samping (*Sidebar*), yaitu: **(1) Dashboard**, **(2) Data Alumni**, **(3) Data Responden**, **(4) Pesan Masuk**, **(5) Kelola Berita**, **(6) Kelola Loker**, **(7) Laporan**, dan **(8) Pengaturan**.
## 2. Persiapan Penggunaan
### 2.1 Perangkat dan Peramban (Browser) yang Disarankan
- **Perangkat Keras:** Komputer Desktop atau Laptop dengan resolusi layar minimal `1280 x 720 piksel` (disarankan `1366 x 768` atau `1920 x 1080 piksel`) agar tabel data dan grafik terlihat secara utuh. Sistem juga mendukung tampilan responsif pada perangkat tablet dan ponsel pintar.
- **Peramban Web (Browser):** Google Chrome (versi 110 ke atas), Microsoft Edge, atau Mozilla Firefox versi terbaru dengan fitur JavaScript aktif dan izin *pop-up* menyala untuk keperluan cetak PDF.
- **Aplikasi Pendukung:** Microsoft Excel, LibreOffice Calc, atau WPS Office Spreadsheet untuk membuka dan menyunting berkas template impor maupun hasil ekspor data lulusan (`.xlsx` / `.csv`).
### 2.2 Alamat Akses Website & Kebutuhan Akun
- **Alamat Akses Portal:** Buka peramban web dan kunjungi alamat portal resmi sekolah atau alamat jaringan lokal pengujian di `http://localhost:5173/login`.
- **Kredensial Akun:** Siapkan **Username** dan **Password** khusus Administrator BKK yang diberikan oleh Penanggung Jawab Sistem Informasi Sekolah.
Peringatan Keamanan Akun
Jangan pernah membagikan kata sandi (*password*) akun Administrator kepada pihak yang tidak berwenang, dan hindari menyimpan kata sandi pada komputer publik/bersama.

---

## 3. Login dan Akses Dashboard
Halaman Login merupakan pintu gerbang keamanan utama untuk memisahkan hak akses antara alumni dengan pengelola (Administrator BKK). Sistem secara otomatis mengenali peran pengguna dan mengarahkan Admin ke halaman Dashboard Pengelolaan.
### 3.1 Langkah-langkah Masuk (Login) ke Dashboard Admin
- Buka aplikasi peramban web (*browser*) pada komputer Anda, lalu ketikkan alamat portal Tracer Study SMK Sasmita Jaya 2 hingga tampil halaman **Login** seperti pada **Gambar 1** di bawah ini.
- Klik pada kolom **Username** (kotak nomor **1**), kemudian ketikkan nama pengguna akun Administrator BKK Anda.
- Klik pada kolom **Password** (kotak nomor **2**), lalu ketikkan kata sandi akun Anda. Anda dapat menekan ikon mata di sebelah kanan kolom untuk memeriksa ketepatan ketikan kata sandi.
- Klik tombol berwarna biru tua **Masuk & Mulai Survey** (kotak nomor **3**).
- Apabila nama pengguna dan kata sandi sesuai, sistem akan menampilkan pemberitahuan berhasil masuk dan langsung mengarahkan Anda ke halaman utama **Dashboard Admin**.
### 3.2 Penanganan Kendala Gagal Masuk atau Lupa Kata Sandi
- **Pesan Kesalahan Login:** Jika muncul peringatan bahwa kombinasi pengguna atau kata sandi tidak sesuai, periksa kembali penggunaan huruf besar/kecil (*Caps Lock*) pada papan ketik Anda.
- **Bantuan Teknis (Helpdesk):** Apabila Anda lupa kata sandi atau akun terkunci, klik tautan **Hubungi Helpdesk BKK (WhatsApp)** pada bagian bawah formulir login (kotak nomor **4**) untuk meminta pengaturan ulang akses kepada administrator utama.

![Gambar 1. Halaman Login Portal Tracer Study & BKK SMK Sasmita Jaya 2](screenshots/anotasi/01-login.png)
*Gambar 1. Halaman Login Portal Tracer Study & BKK SMK Sasmita Jaya 2*

**Keterangan Penunjuk Nomor pada Gambar:**
- **[1] Kolom Input Username:** Tempat memasukkan nama pengguna (username) akun resmi Administrator BKK.
- **[2] Kolom Input Password:** Tempat memasukkan kata sandi akun. Dilengkapi ikon mata di sisi kanan untuk melihat atau menyembunyikan karakter sandi.
- **[3] Tombol Masuk & Mulai Survey:** Tombol utama untuk memproses otentikasi dan masuk ke halaman Dashboard Admin.
- **[4] Tautan Bantuan Helpdesk BKK:** Tautan bantuan langsung menuju layanan WhatsApp Helpdesk BKK apabila pengelola mengalami kendala akses masuk.

---

## 4. Mengenal Dashboard & 5.1 Menu Dashboard
### 4.1 Bagian-bagian Utama Antarmuka Dashboard Admin
Setelah berhasil masuk, Anda akan disambut oleh tata letak kerja yang terbagi menjadi tiga area utama:
- **Sidebar Navigasi Kiri (Nomor 1):** Memuat logo sekolah, 8 tombol menu pengelolaan, dan tombol **Keluar** di bagian bawah. Menu yang sedang aktif ditandai dengan latar belakang biru tua.
- **Header Atas:** Menampilkan judul halaman yang sedang dibuka, tombol lonceng **Pesan & Notifikasi**, informasi nama/peran pengguna (*Admin BKK*), dan tombol keluar cepat.
- **Area Kerja Utama (Tengah):** Menampilkan isi dari menu yang sedang dipilih, mulai dari banner ringkasan, kartu statistik, grafik, hingga tabel data.
### 5.1 Menu Dashboard (Bagian Atas: Statistik & Grafik Aktivitas)
Menu **Dashboard** merupakan halaman pembuka yang menyajikan ringkasan capaian Tracer Study secara menyeluruh:
- **Pintasan Cepat Banner (Nomor 2):** Gunakan tombol **Data Alumni** atau **Data Responden** di dalam banner biru untuk langsung berpindah ke tabel data induk maupun tabel kuesioner masuk.
- **Filter Periode Angkatan (Nomor 3):** Klik kotak pilihan di sudut kanan atas area kerja untuk memilih cakupan tahun lulusan (misalnya *Semua Angkatan (Total)* atau tahun spesifik seperti *Angkatan 2024*). Seluruh kartu angka dan grafik di bawahnya akan langsung menyesuaikan secara otomatis.
- **Kartu Indikator Capaian (Nomor 4):** Memperlihatkan angka **Target Responden** (total populasi lulusan di basis data) dan persentase **Tingkat Pengisian** kuesioner yang telah masuk.
- **Grafik Distribusi Aktivitas Lulusan (Nomor 5):** Menampilkan persentase sebaran karir alumni ke dalam lima kategori: *Bekerja*, *Melanjutkan Studi*, *Bekerja sambil Kuliah*, *Wirausaha*, dan *Belum/Mencari Kerja*.

![Gambar 2. Halaman Utama Dashboard Admin (Bagian Atas: Navigasi, Banner, & Grafik Statistik)](screenshots/anotasi/02-dashboard-utama.png)
*Gambar 2. Halaman Utama Dashboard Admin (Bagian Atas: Navigasi, Banner, & Grafik Statistik)*

**Keterangan Penunjuk Nomor pada Gambar:**
- **[1] Sidebar Navigasi Menu Admin:** Panel menu di sisi kiri untuk berpindah antar halaman kelola (Dashboard, Data Alumni, Data Responden, Pesan Masuk, Kelola Berita, Kelola Loker, Laporan, dan Pengaturan).
- **[2] Pintasan Data Alumni & Data Responden:** Tombol akses cepat di dalam banner untuk langsung membuka daftar seluruh alumni atau daftar responden kuesioner.
- **[3] Pemilih Periode Angkatan:** Kotak pilihan (dropdown) untuk menyaring seluruh angka statistik dan grafik berdasarkan tahun kelulusan tertentu atau semua angkatan.
- **[4] Kartu Statistik Target & Tingkat Pengisian:** Menampilkan total populasi lulusan (target responden) serta persentase tingkat pengisian kuesioner Tracer Study.
- **[5] Grafik Distribusi Aktivitas Lulusan:** Diagram batang persentase status lulusan (Bekerja, Melanjutkan Studi, Bekerja sambil Kuliah, Wirausaha, dan Belum/Mencari Kerja).

---

## Panel Bawah Dashboard & Lonceng Notifikasi
Apabila Anda menggulir halaman **Dashboard** ke bagian bawah, terdapat dua panel pemantauan progres program keahlian dan kiriman kuesioner terbaru, serta fasilitas lonceng notifikasi di bagian *Header*.
### Cara Menggunakan Lonceng Notifikasi & Panel Pemantauan Bawah
- **Membuka Popover Notifikasi Pesan (Nomor 1):** Klik ikon lonceng di pojok kanan atas layar. Jendela sembul (*popover*) akan menampilkan daftar pesan atau pengajuan Tracer Study terbaru yang belum dibaca. Klik salah satu pesan untuk membuka rinciannya, atau klik **Lihat Semua di Kotak Masuk** di bagian bawah jendela untuk menuju menu Pesan Masuk.
- **Memantau Pengisian per Program Keahlian (Nomor 2):** Panel di sisi kiri bawah menampilkan bilah kemajuan (*progress bar*) untuk setiap jurusan (seperti TKJ, Teknik Pemesinan, TKRO, TITL, Otomatisasi Tata Kelola Perkantoran, dan Akuntansi). Gunakan panel ini untuk mengetahui jurusan mana yang tingkat partisipasi pengisiannya masih perlu ditingkatkan.
- **Memeriksa Kuesioner Masuk Terbaru & Pintasan Laporan (Nomor 3):** Panel di sisi kanan bawah menampilkan daftar alumni yang baru saja mengirimkan kuesioner beserta label status karirnya. Di sudut kanan atas panel ini juga tersedia tombol **Buka Laporan** untuk langsung menuju halaman unduh laporan.
Tips Pemantauan Harian
Biasakan memeriksa **Panel Pengisian per Program Keahlian** setiap awal pekan, lalu gunakan fitur pengingat WhatsApp pada menu *Data Alumni* untuk menghubungi lulusan dari jurusan yang persentase pengisiannya masih rendah.

![Gambar 3. Bagian Bawah Dashboard Utama & Jendela Popover Notifikasi Pesan](screenshots/anotasi/03-dashboard-bawah-notifikasi.png)
*Gambar 3. Bagian Bawah Dashboard Utama & Jendela Popover Notifikasi Pesan*

**Keterangan Penunjuk Nomor pada Gambar:**
- **[1] Tombol Lonceng & Popover Notifikasi Pesan:** Menampilkan daftar pesan dan pemberitahuan terbaru yang belum dibaca beserta tombol pintasan menuju kotak masuk.
- **[2] Panel Pengisian per Program Keahlian:** Rincian progres perbandingan jumlah alumni yang sudah mengisi kuesioner terhadap total lulusan pada masing-masing jurusan.
- **[3] Panel Kuesioner Masuk Terbaru & Tombol Buka Laporan:** Daftar kiriman kuesioner alumni paling mutakhir serta tombol pintasan untuk membuka halaman Laporan dan Ekspor Data.

---

## 5.2 Menu Data Alumni (Data Siswa Lulusan)
Menu **Data Alumni** berfungsi untuk mengelola basis data induk (*Master Data*) seluruh siswa yang telah lulus dari SMK Sasmita Jaya 2, memantau siapa saja yang sudah maupun belum mengisi kuesioner, serta mengirimkan pesan pengingat melalui WhatsApp.
### Langkah-langkah Mengelola Tabel Data Alumni
- Klik menu **Data Alumni** pada bilah navigasi samping kiri hingga tampil halaman **Data Siswa Lulusan** seperti pada **Gambar 4**.
- **Menggunakan Tombol Aksi Utama (Nomor 1):**
Klik ikon **Refresh** (panah melingkar) untuk memuat ulang data terbaru dari server.
- Klik **Ekspor Excel** untuk mengunduh tabel daftar alumni sesuai filter yang sedang aktif ke dalam berkas `.xlsx`.
- Klik **Unduh Format** untuk mendapatkan berkas template Excel resmi sebelum melakukan impor data baru.
- Klik **Impor Berkas** untuk mengunggah data lulusan secara massal dari berkas Excel/CSV.
- **Menyaring Status Pengisian (Nomor 2):** Klik tab **Semua Data** untuk melihat seluruh populasi lulusan, tab **Sudah Mengisi** untuk melihat alumni yang telah menuntaskan kuesioner, atau tab **Belum Mengisi** untuk melihat daftar alumni yang belum berpartisipasi.
- **Mencari & Memfilter Alumni (Nomor 3):** Ketikkan nama siswa, NISN, atau NIK pada kolom pencarian, atau pilih **Program Keahlian** dan **Tahun Lulus** tertentu pada kotak pilihan di sebelahnya.
- **Tindakan pada Baris Tabel (Nomor 4):**
Klik tombol **Lihat** pada kolom *Preview* untuk melihat kartu rincian lengkap alumni.
- Klik tombol hijau **Ingatkan** pada kolom *Pengingat* (khusus alumni berstatus *Belum Mengisi*) untuk membuka aplikasi WhatsApp dengan teks undangan pengisian kuesioner yang sudah tersusun otomatis.
- Klik tombol ikon tempat sampah pada kolom *Aksi* jika ingin menghapus data alumni dari sistem.

![Gambar 4. Halaman Menu Data Alumni (Data Siswa Lulusan)](screenshots/anotasi/04-data-alumni.png)
*Gambar 4. Halaman Menu Data Alumni (Data Siswa Lulusan)*

**Keterangan Penunjuk Nomor pada Gambar:**
- **[1] Baris Tombol Aksi Utama:** Terdiri dari tombol Refresh (muat ulang data), Ekspor Excel, Unduh Format (template Excel), dan Impor Berkas.
- **[2] Tab Filter Status Pengisian:** Penyaring cepat untuk menampilkan Semua Data, hanya alumni yang Sudah Mengisi, atau hanya alumni yang Belum Mengisi kuesioner.
- **[3] Kolom Pencarian, Filter Program Keahlian, & Tahun Lulus:** Alat pencarian berdasarkan nama/NISN/NIK serta penyaringan data per jurusan dan tahun angkatan.
- **[4] Kolom Preview, Pengingat WhatsApp, & Aksi Hapus:** Tombol Lihat untuk membuka rincian alumni, tombol Ingatkan (WhatsApp) bagi alumni yang belum mengisi, serta tombol ikon tempat sampah untuk menghapus data.

---

## Impor Berkas Excel/CSV & Tambah Data Alumni
Untuk memasukkan data siswa lulusan angkatan baru secara cepat tanpa mengetik satu per satu, gunakan fasilitas **Impor Berkas** pada menu Data Alumni.
### Langkah-langkah Mengimpor Data Master Alumni
- Pada halaman **Data Alumni**, klik tombol biru **Impor Berkas** di pojok kanan atas hingga muncul jendela modal **Impor Data Master Alumni** (lihat **Gambar 5**).
- **Unduh & Isi Template (Nomor 1):** Apabila Anda belum memiliki format tabel yang sesuai, klik tombol **Unduh Format Excel**. Buka berkas tersebut di Microsoft Excel, lalu isikan data lulusan sesuai kolom yang ditentukan: `Nama Lengkap`, `NISN`, `NIK`, `Jurusan`, `Tahun Lulus`, `No. Telepon`, dan `Email`. Simpan berkas setelah selesai diisi.
- **Unggah Berkas (Nomor 2):** Tarik dan lepaskan (*drag & drop*) berkas Excel (`.xlsx` / `.xls`) atau `.csv` Anda ke dalam kotak area unggah, atau klik area tersebut untuk memilih berkas dari folder komputer Anda.
- Sistem akan otomatis memeriksa isi berkas dan menampilkan pratinjau jumlah baris yang valid beserta peringatan apabila terdapat baris yang kurang lengkap.
- **Simpan Data (Nomor 3):** Klik tombol biru **Simpan ke Master Data** di bagian kanan bawah modal untuk menyimpan seluruh data lulusan ke dalam sistem.

![Gambar 5. Jendela Modal Impor Data Master Alumni dari Berkas Excel/CSV](screenshots/anotasi/05-impor-data-alumni.png)
*Gambar 5. Jendela Modal Impor Data Master Alumni dari Berkas Excel/CSV*

**Keterangan Penunjuk Nomor pada Gambar:**
- **[1] Petunjuk Struktur Kolom & Tombol Unduh Format Excel:** Panduan susunan kolom wajib (Nama Lengkap, NISN, NIK, Jurusan, Tahun Lulus, No. Telepon, Email) dan tautan unduh contoh berkas Excel.
- **[2] Area Unggah Berkas (Drag & Drop):** Kotak interaktif untuk menarik dan melepas berkas .xlsx, .xls, atau .csv dari komputer.
- **[3] Tombol Tutup & Simpan ke Master Data:** Tombol untuk membatalkan proses atau menyimpan seluruh baris data yang telah tervalidasi ke dalam basis data.

---

## Pratinjau Rincian & Penghapusan Data Alumni
Pengelola dapat memeriksa ringkasan profil seorang lulusan maupun menghapus data yang ganda/tidak valid melalui tombol aksi pada tabel **Data Alumni**:
- **Melihat Rincian Alumni (Gambar 6):** Klik tombol **Lihat** pada kolom *Preview*. Jendela modal akan menampilkan identitas akademik (NISN, NIK, Tahun Lulus, Kontak) serta status dan ringkasan pengisian Tracer Study. Jika alumni sudah mengisi kuesioner, klik tombol **Lihat Detail Responden** (kotak nomor **4**) untuk membuka lembar jawaban lengkapnya.
- **Menghapus Data Alumni (Gambar 7):** Klik ikon tempat sampah pada kolom *Aksi*. Akan muncul dialog konfirmasi **Hapus Data Master Alumni**. Pastikan nama dan NISN yang tertera sudah benar, lalu klik **Ya, Hapus Data** (atau klik **Batal** untuk mengurungkan niat).
Perhatian Saat Menghapus Data Alumni
Tindakan penghapusan bersifat permanen. Menghapus data seorang alumni dari tabel Master Data juga akan menghapus data kuesioner Tracer Study yang pernah dikirimkan oleh alumni bersangkutan.

![Gambar 6. Jendela Modal Preview (Pratinjau) Rincian Data Siswa Lulusan](screenshots/anotasi/06-preview-data-alumni.png)
*Gambar 6. Jendela Modal Preview (Pratinjau) Rincian Data Siswa Lulusan*

**Keterangan Penunjuk Nomor pada Gambar:**
- **[1] Header Profil & Status Pengisian:** Menampilkan nama lengkap alumni, program keahlian, tahun angkatan, dan lencana status pengisian Tracer Study.
- **[2] Kotak Informasi Akademik Pokok:** Menampilkan Nomor Induk Siswa Nasional (NISN), Nomor Induk Kependudukan (NIK terproteksi), dan Program Keahlian.
- **[3] Kotak Kontak Alumni & Pintasan Komunikasi:** Menampilkan Nomor WhatsApp dan Alamat Email alumni beserta tombol cepat Chat WA dan Kirim Email.
- **[4] Tombol Aksi Bawah (Kirim Pengingat WA / Tutup Preview):** Tombol hijau untuk mengirimkan pesan pengingat WhatsApp serta tombol untuk menutup jendela pratinjau.

![Gambar 7. Dialog Konfirmasi Penghapusan Data Master Alumni](screenshots/anotasi/07-hapus-data-alumni.png)
*Gambar 7. Dialog Konfirmasi Penghapusan Data Master Alumni*

**Keterangan Penunjuk Nomor pada Gambar:**
- **[1] Pesan Peringatan Penghapusan Permanen:** Informasi nama dan NISN alumni yang akan dihapus beserta peringatan bahwa data kuesioner terkait juga akan terhapus.
- **[2] Tombol Batal & Ya, Hapus Data:** Tombol Batal untuk membatalkan tindakan atau tombol merah Ya, Hapus Data untuk mengeksekusi penghapusan.

---

## 5.3 Menu Data Responden Tracer Study
Menu **Data Responden** menampilkan daftar seluruh lulusan yang telah mengirimkan formulir kuesioner Tracer Study. Melalui halaman ini, Admin BKK dapat memantau status aktivitas pasca-kelulusan serta memeriksa rincian tempat kerja, perguruan tinggi, atau usaha milik alumni.
### Langkah-langkah Mencari dan Memfilter Data Responden
- Klik menu **Data Responden** pada bilah navigasi kiri hingga tampil halaman **Data Responden Tracer Study** (lihat **Gambar 8**).
- **Memuat Ulang Data (Nomor 1):** Klik tombol **Refresh Data** di sudut kanan atas apabila Anda ingin memastikan kiriman kuesioner yang baru saja masuk dari portal alumni telah tampil di tabel.
- **Pencarian & Penyaringan Multi-Kriteria (Nomor 2):**
Gunakan kolom pencarian untuk mencari berdasarkan **Nama Alumni**, **NISN**, **Nama Perusahaan** tempat bekerja, atau **Nama Perguruan Tinggi**.
- Gunakan kotak pilihan **Semua Jurusan** untuk menyaring responden dari program keahlian tertentu.
- Gunakan kotak pilihan **Semua Angkatan** untuk memfokuskan tampilan pada tahun kelulusan tertentu.
- Gunakan kotak pilihan **Semua Status Aktivitas** untuk menyaring responden yang berstatus *Bekerja*, *Melanjutkan Studi (Kuliah)*, *Bekerja sambil Kuliah*, *Wirausaha*, atau *Belum/Mencari Kerja*.
- **Membuka Rincian Jawaban (Nomor 3):** Pada kolom *Aksi* di sisi paling kanan tabel, klik tombol berikon mata (**Lihat detil data kuesioner**) untuk membuka panel rincian jawaban responden.
- **Navigasi Halaman Tabel (Nomor 4):** Gunakan tombol nomor halaman di bagian kanan bawah tabel untuk berpindah ke halaman daftar responden berikutnya.

![Gambar 8. Halaman Menu Data Responden Tracer Study](screenshots/anotasi/08-data-responden.png)
*Gambar 8. Halaman Menu Data Responden Tracer Study*

**Keterangan Penunjuk Nomor pada Gambar:**
- **[1] Tombol Refresh Data Responden:** Tombol untuk menyinkronkan ulang daftar kiriman kuesioner terbaru dari server basis data.
- **[2] Kolom Pencarian & Filter Kategori:** Pencarian berdasarkan nama, NISN, nama perusahaan, atau kampus, disertai filter Jurusan, Tahun Lulus, dan Status Aktivitas.
- **[3] Tombol Buka Rincian Kuesioner (Ikon Mata):** Tombol pada kolom Aksi untuk membuka panel samping berisi seluruh jawaban kuesioner responden.
- **[4] Navigasi Halaman (Pagination):** Pengatur perpindahan halaman tabel apabila jumlah responden melebihi batas tampilan per halaman.

---

## Memeriksa Rincian Jawaban Kuesioner Responden
Saat Anda menekan tombol ikon mata pada salah satu baris responden, sistem akan memunculkan **Panel Samping (Drawer) Rincian Kuesioner** dari sisi kanan layar seperti terlihat pada **Gambar 9**.
### Informasi yang Ditampilkan pada Panel Rincian Responden
- **Header Responden & Nomor Berkas (Nomor 1):** Menampilkan nama lengkap alumni, lencana tanda terverifikasi, serta **Nomor Berkas** kuesioner (contoh: `#2026100001`).
- **Bagian Identitas Alumni (Nomor 2):** Memuat informasi lengkap responden meliputi NISN, NIK, Tahun Lulus, Program Keahlian, Alamat Email, Nomor Telepon/WhatsApp, serta tautan akun media sosial (LinkedIn, Instagram, Facebook, atau TikTok) jika dicantumkan oleh alumni.
- **Bagian Aktivitas Setelah Kelulusan & Rincian Karir/Studi (Nomor 3):** Menampilkan status aktivitas utama beserta tanggal pengiriman kuesioner. Di bawahnya tersaji rincian mendalam sesuai status alumni:
**Rincian Pekerjaan:** Nama perusahaan/instansi, jabatan/posisi, jenis perusahaan, alamat kota penempatan, tahun mulai bekerja, rentang penghasilan bulanan, dan keselarasan bidang kerja dengan jurusan SMK.
- **Rincian Studi Lanjut (Kuliah):** Nama perguruan tinggi, jenjang pendidikan (D3/D4/S1), program studi/jurusan kuliah, jalur masuk, tahun masuk, dan keselarasan bidang studi.
- **Rincian Wirausaha:** Nama usaha, bidang usaha, alamat tempat usaha, jumlah karyawan, estimasi omset bulanan, dan tahun berdiri.
- **Rincian Pencari Kerja:** Lama waktu mencari pekerjaan, jumlah perusahaan yang telah dilamar, serta kendala utama yang dihadapi alumni.
- **Menutup Panel (Nomor 4):** Setelah selesai memeriksa data, klik tombol **Tutup Panel Rincian** di bagian bawah atau tombol silang (`X`) di pojok kanan atas panel.

![Gambar 9. Panel Samping (Drawer) Rincian Jawaban Kuesioner Responden](screenshots/anotasi/09-detail-responden-drawer.png)
*Gambar 9. Panel Samping (Drawer) Rincian Jawaban Kuesioner Responden*

**Keterangan Penunjuk Nomor pada Gambar:**
- **[1] Header Nama Responden & Nomor Berkas:** Menampilkan nama lengkap alumni beserta nomor registrasi pengisian kuesioner Tracer Study.
- **[2] Bagian Identitas Alumni:** Memuat data NISN, NIK, Tahun Lulus, Jurusan, Email, Nomor WhatsApp, serta tautan media sosial alumni.
- **[3] Bagian Aktivitas Setelah Kelulusan & Rincian Karir/Studi:** Memuat status karir serta jawaban mendalam mengenai tempat bekerja, perguruan tinggi, atau unit wirausaha.
- **[4] Tombol Tutup Panel Rincian:** Tombol di bagian bawah panel untuk menutup tampilan rincian dan kembali ke tabel responden.

---

## 5.4 Menu Pesan Masuk (Kotak Masuk Alumni)
Menu **Pesan Masuk** merupakan pusat kotak masuk (*Inbox*) bagi Admin BKK untuk membaca pemberitahuan pengisian Tracer Study baru, pertanyaan seputar lowongan kerja, maupun saran dan masukan yang dikirimkan oleh alumni.
### Cara Mengelola Kotak Masuk dan Membaca Rincian Pesan
- Klik menu **Pesan Masuk** pada sidebar kiri (**Gambar 10**). Lencana angka di sebelah nama menu menunjukkan jumlah pesan yang belum dibaca.
- Periksa kartu ringkasan di bagian atas (kotak nomor **2** pada Gambar 10) untuk melihat jumlah **Total Pesan Masuk**, pesan **Belum Dibaca**, dan **Pengajuan Tracer Baru**. Gunakan tombol **Tandai Semua Dibaca** (kotak nomor **1**) jika ingin membersihkan status seluruh pesan baru sekaligus.
- Gunakan bilah pencarian dan filter (kotak nomor **3** pada Gambar 10) untuk menyaring pesan menurut kata kunci, status baca (*Semua* / *Belum Dibaca*), atau kategori pesan (*Semua Kategori*, *Tracer Baru*, *Pertanyaan*, *Masukan*).
- Klik pada salah satu baris pesan di dalam daftar (kotak nomor **4** pada Gambar 10) untuk membuka jendela **Rincian Pesan Masuk** (**Gambar 11**).
- Di dalam jendela **Rincian Pesan Masuk** (**Gambar 11**), Anda dapat melihat identitas lengkap pengirim (nomor **1**), subjek dan nomor pengajuan Tracer Study (nomor **2**), serta isi lengkap surat (nomor **3**). Klik tombol **Buka di Data Responden** pada bagian bawah modal (nomor **4**) untuk langsung memeriksa berkas kuesioner pengirim, atau klik **Hapus Pesan** jika pesan sudah tidak diperlukan.

![Gambar 10. Halaman Menu Pesan Masuk (Kotak Masuk Alumni)](screenshots/anotasi/10-pesan-masuk.png)
*Gambar 10. Halaman Menu Pesan Masuk (Kotak Masuk Alumni)*

**Keterangan Penunjuk Nomor pada Gambar:**
- **[1] Tombol Tandai Semua Dibaca:** Tombol untuk mengubah status seluruh pesan yang belum dibaca menjadi sudah dibaca secara sekaligus.
- **[2] Kartu Ringkasan Kotak Masuk:** Menampilkan statistik Total Pesan Masuk, jumlah pesan Belum Dibaca, serta jumlah notifikasi Pengajuan Tracer Baru.
- **[3] Pencarian, Filter Status Baca, & Filter Kategori Pesan:** Alat untuk menyaring daftar pesan berdasarkan kata kunci, status baca (Semua/Belum Dibaca), dan kategori pesan.
- **[4] Daftar Baris Pesan Masuk:** Daftar pesan dari alumni. Klik pada salah satu baris pesan untuk membaca isi surat secara lengkap.

![Gambar 11. Jendela Modal Rincian Pesan Masuk](screenshots/anotasi/11-detail-pesan-masuk.png)
*Gambar 11. Jendela Modal Rincian Pesan Masuk*

**Keterangan Penunjuk Nomor pada Gambar:**
- **[1] Kartu Informasi Pengirim Pesan:** Menampilkan nama pengirim, peran (Alumni), jurusan, tahun angkatan, NISN, alamat email, dan waktu pengiriman.
- **[2] Subjek Pesan & Nomor Pengajuan Tracer Study:** Menampilkan judul pesan beserta nomor berkas kuesioner yang berkaitan dengan pesan tersebut.
- **[3] Isi Lengkap Pesan:** Kotak teks yang memuat isi pesan atau pertanyaan lengkap yang dikirimkan oleh alumni.
- **[4] Tombol Hapus Pesan, Tutup, & Tautan Tindakan:** Tombol untuk menghapus pesan, menutup jendela, atau langsung menuju halaman verifikasi data responden terkait.

---

## 5.5 Menu Kelola Berita & Informasi
Menu **Kelola Berita** digunakan untuk menerbitkan, mengubah, dan menghapus artikel berita, pengumuman BKK, wawasan karir, maupun profil kisah sukses alumni yang ditayangkan pada halaman depan (*Landing Page*) portal.
### Langkah-langkah Membuat dan Menyunting Artikel Berita
- Buka menu **Kelola Berita** pada sidebar kiri (**Gambar 12**). Halaman ini menampilkan kartu ringkasan jumlah artikel (nomor **2**), kolom pencarian dan filter kategori (nomor **3**), serta daftar kartu artikel yang telah terbit.
- Untuk menulis artikel baru, klik tombol biru **Buat Berita Baru** di pojok kanan atas (kotak nomor **1** pada Gambar 12). Untuk mengubah artikel yang sudah ada, klik tombol ikon pensil (**Edit Berita**) pada kartu artikel terkait (kotak nomor **4** pada Gambar 12).
- Pada halaman **Editor Berita** (**Gambar 13**), lengkapi kolom-kolom berikut:
**Metadata Artikel (Nomor 1):** Isi *Judul Berita*, pilih *Kategori Berita* (Pengumuman, Karier & Industri, Kisah Alumni, Kegiatan Sekolah, atau Info BKK), ketik nama *Penulis / Sumber*, dan tentukan *Estimasi Waktu Baca*.
- **Gambar Sampul (Nomor 2):** Unggah foto sampul dari komputer (format JPG/PNG/WebP, maks. 5 MB), masukkan URL gambar eksternal, atau pilih salah satu dari koleksi *Gambar Siap Pakai* yang telah disediakan.
- **Ringkasan & Isi Berita (Nomor 3):** Tuliskan *Ringkasan Singkat (Excerpt)* untuk tampilan kartu depan, lalu ketikkan pembahasan lengkap artikel pada kolom *Isi Lengkap Berita*.
- Periksa tampilan kartu berita Anda pada panel **Pratinjau Kartu Landing Page** di sisi kanan layar (nomor **4** pada Gambar 13). Jika sudah rapi, klik tombol **Publikasikan Berita** atau **Simpan Perubahan** (nomor **5**).

![Gambar 12. Halaman Menu Kelola Berita & Informasi](screenshots/anotasi/12-kelola-berita.png)
*Gambar 12. Halaman Menu Kelola Berita & Informasi*

**Keterangan Penunjuk Nomor pada Gambar:**
- **[1] Tombol Buat Berita Baru:** Tombol utama untuk membuka formulir pembuatan artikel berita, pengumuman, atau kisah sukses alumni.
- **[2] Kartu Statistik Publikasi Berita:** Menampilkan jumlah Total Artikel Terbit, jumlah Kategori Aktif, serta tanggal Pembaruan Terakhir.
- **[3] Pencarian Judul/Penulis & Filter Kategori Berita:** Alat untuk mencari artikel berdasarkan kata kunci atau menyaring menurut kategori berita.
- **[4] Tombol Edit & Hapus pada Kartu Artikel:** Tombol ikon pensil untuk mengubah isi berita dan ikon tempat sampah untuk menghapus artikel dari portal.

![Gambar 13. Formulir Editor Artikel Berita & Pratinjau Landing Page](screenshots/anotasi/13-editor-berita.png)
*Gambar 13. Formulir Editor Artikel Berita & Pratinjau Landing Page*

**Keterangan Penunjuk Nomor pada Gambar:**
- **[1] Kolom Judul, Kategori, Penulis, & Estimasi Baca:** Input metadata utama artikel berita yang wajib dilengkapi sebelum publikasi.
- **[2] Pemilih Gambar Sampul Artikel:** Fasilitas untuk mengunggah foto sampul dari komputer, menempelkan tautan URL gambar, atau memilih gambar siap pakai.
- **[3] Kolom Ringkasan Singkat (Excerpt) & Isi Lengkap Berita:** Area penulisan cuplikan singkat untuk kartu berita serta isi artikel secara menyeluruh.
- **[4] Pratinjau Kartu Landing Page (Live):** Tampilan simulasi kartu berita secara langsung (real-time) sebagaimana akan dilihat oleh pengunjung halaman depan.
- **[5] Tombol Batal & Simpan / Publikasikan Berita:** Tombol untuk membatalkan pengeditan atau menyimpan dan menerbitkan artikel ke halaman depan website.

---

## 5.6 Menu Kelola Loker (Lowongan Kerja & BKK Hub)
Menu **Kelola Loker** memfasilitasi pengurus BKK dalam menayangkan informasi lowongan pekerjaan dari perusahaan mitra Dunia Usaha & Dunia Industri (DUDI) agar dapat dilamar langsung oleh para lulusan SMK Sasmita Jaya 2.
### Memantau Daftar Lowongan dan Melihat Pratinjau Detail
- Klik menu **Kelola Loker** pada sidebar kiri hingga tampil halaman **Kelola Informasi Lowongan Kerja & BKK Hub** (**Gambar 14**).
- Bagian atas halaman menampilkan tombol **Tambah Lowongan Baru** (nomor **1**) serta tiga kartu indikator (nomor **2**) yaitu *Total Lowongan Aktif*, jumlah *Mitra Industri (DUDI)* resmi BKK, dan jumlah *Minat Alumni*.
- Gunakan kolom pencarian, filter tipe kontrak kerja (*Full-time*, *Kontrak*, *Magang*, *Part-time*), serta filter program keahlian sasaran (nomor **3** pada Gambar 14) untuk menemukan lowongan tertentu dengan cepat.
- Pada setiap kartu lowongan terdapat tiga tombol aksi di sisi kanan (nomor **4** pada Gambar 14):
**Ikon Mata (Lihat Detail Lowongan):** Membuka jendela modal pratinjau lengkap lowongan kerja seperti terlihat pada **Gambar 15**, yang memuat informasi gaji, lokasi, batas akhir lamaran (nomor **1**), sasaran program keahlian, deskripsi pekerjaan, dan kualifikasi pelamar (nomor **2**).
- **Ikon Pensil (Edit Lowongan):** Membuka formulir penyuntingan data lowongan kerja.
- **Ikon Tempat Sampah (Hapus Lowongan):** Menghapus tayangan lowongan kerja yang sudah ditutup atau kedaluwarsa.

![Gambar 14. Halaman Menu Kelola Loker (Lowongan Kerja & BKK Hub)](screenshots/anotasi/14-kelola-loker.png)
*Gambar 14. Halaman Menu Kelola Loker (Lowongan Kerja & BKK Hub)*

**Keterangan Penunjuk Nomor pada Gambar:**
- **[1] Tombol Tambah Lowongan Baru:** Tombol untuk membuka formulir penambahan informasi lowongan kerja baru.
- **[2] Kartu Statistik Lowongan Kerja:** Menampilkan ringkasan Total Lowongan Aktif, jumlah Mitra Industri (DUDI), dan metrik Minat Alumni.
- **[3] Pencarian Posisi/Perusahaan, Filter Tipe, & Target Jurusan:** Alat penyaring daftar lowongan berdasarkan nama posisi/perusahaan, jenis kontrak kerja, dan jurusan sasaran.
- **[4] Tombol Aksi Kartu Lowongan (Lihat, Edit, Hapus):** Tombol ikon mata untuk melihat detail lowongan, ikon pensil untuk mengedit, dan ikon tempat sampah untuk menghapus.

![Gambar 15. Jendela Modal Pratinjau Detail Lowongan Kerja](screenshots/anotasi/15-detail-loker-modal.png)
*Gambar 15. Jendela Modal Pratinjau Detail Lowongan Kerja*

**Keterangan Penunjuk Nomor pada Gambar:**
- **[1] Ringkasan Gaji, Lokasi, Tanggal Posting, & Batas Akhir:** Kotak informasi cepat mengenai penawaran gaji, kota penempatan, dan tenggat waktu lamaran.
- **[2] Sasaran Jurusan, Deskripsi Pekerjaan, & Kualifikasi:** Daftar program keahlian yang dibutuhkan beserta uraian tugas dan persyaratan pelamar.
- **[3] Tombol Tutup, Hapus, & Edit Lowongan:** Tombol navigasi untuk menutup jendela pratinjau, menghapus lowongan, atau langsung masuk ke mode pengeditan.

---

## Menambah & Menyunting Lowongan Kerja Baru
Saat Anda mengklik tombol **Tambah Lowongan Baru** atau tombol **Edit Lowongan**, sistem akan menampilkan formulir **Editor Lowongan Kerja** beserta pratinjau langsung seperti pada **Gambar 16**.
### Langkah-langkah Mengisi Formulir Lowongan Kerja
- **Melengkapi Identitas Pekerjaan & Perusahaan (Nomor 1):**
Ketikkan nama jabatan pada kolom **Posisi / Judul Pekerjaan** (contoh: *Junior Network Engineer* atau *Operator Produksi CNC*).
- Ketikkan nama instansi pada kolom **Nama Perusahaan / Industri** beserta **Lokasi Penempatan**.
- Pilih **Tipe Pekerjaan**, isi **Rentang / Estimasi Gaji**, dan tentukan tanggal **Batas Akhir Pendaftaran**.
- Centang kotak **Mitra Resmi BKK SMK Sasmita Jaya 2** apabila perusahaan tersebut memiliki kerja sama penyaluran resmi dengan BKK sekolah.
- **Mengatur Saluran Pendaftaran Mitra (Nomor 2):** Pilih satu atau lebih jalur pengiriman lamaran yang dibuka oleh perusahaan:
**Kirim Email HRD:** Masukkan alamat email rekrutmen perusahaan dan subjek standar lamaran.
- **Chat WhatsApp HRD / BKK:** Masukkan nomor WhatsApp penerima lamaran beserta pesan pembuka otomatis.
- **Walk-in Interview:** Masukkan alamat lengkap lokasi tes/wawancara langsung dan jadwal pelaksanaannya.
- **Website Karir Perusahaan:** Masukkan tautan (URL) formulir rekrutmen resmi milik perusahaan.
- **Menentukan Sasaran Jurusan, Deskripsi, & Kualifikasi:** Gulir formulir ke bawah untuk mencentang program keahlian yang relevan, menuliskan deskripsi tugas pekerjaan, serta merinci daftar persyaratan pelamar.
- **Memeriksa Pratinjau & Menerbitkan (Nomor 3 & 4):** Amati kartu pratinjau di sebelah kanan (nomor **3**). Jika seluruh informasi telah sesuai, klik tombol **Terbitkan Lowongan** atau **Simpan Perubahan** (nomor **4**).

![Gambar 16. Formulir Editor Lowongan Kerja & Konfigurasi Saluran Pendaftaran](screenshots/anotasi/16-editor-loker.png)
*Gambar 16. Formulir Editor Lowongan Kerja & Konfigurasi Saluran Pendaftaran*

**Keterangan Penunjuk Nomor pada Gambar:**
- **[1] Data Utama Lowongan & Penanda Mitra Resmi BKK:** Kolom input Posisi, Nama Perusahaan, Lokasi, Tipe Pekerjaan, Rentang Gaji, Batas Akhir, dan opsi Mitra Resmi BKK.
- **[2] Konfigurasi Saluran Pendaftaran Mitra:** Pengaturan metode melamar kerja (Kirim Email HRD, Chat WhatsApp HRD, Walk-in Interview, atau Website Karir Perusahaan).
- **[3] Pratinjau Kartu Lowongan Kerja (Live):** Simulasi tampilan kartu lowongan kerja secara langsung sebelum diterbitkan ke portal alumni.
- **[4] Tombol Batal & Simpan / Terbitkan Lowongan:** Tombol untuk membatalkan pengisian atau menyimpan dan mempublikasikan lowongan kerja.

---

## 5.7 Menu Laporan dan Ekspor Data Lulusan
Menu **Laporan** menyediakan fasilitas pengunduhan data Tracer Study ke dalam bentuk tabel pengolahan angka (Excel dan CSV) serta pencetakan dokumen **Lembar Rekapitulasi Resmi** berformat surat pengesahan sekolah.
### A. Cara Mengunduh Laporan Berformat Excel (.xlsx) atau CSV (.csv)
- Buka menu **Laporan** pada sidebar kiri hingga tampil halaman **Laporan dan Ekspor Data Lulusan** (**Gambar 17**).
- Pada kartu sebelah kiri, pilih salah satu dari tiga **Format Berkas Ekspor** (kotak nomor **1** pada Gambar 17):
**Laporan Lengkap Tracer Study:** Berisi gabungan data induk alumni, status pengisian, serta rincian karir/studi/wirausaha.
- **Data Mentah (Raw Dataset):** Berisi seluruh kolom jawaban teknis responden untuk keperluan olah data lanjutan.
- **Rekapitulasi Statistik Jurusan:** Berisi tabel ringkasan jumlah dan persentase keterserapan per program keahlian.
- Klik tombol **Unduh Excel (.xlsx)** untuk mendapatkan berkas Microsoft Excel yang sudah rapi, atau klik **Unduh CSV (.csv)** untuk format teks berpemisah koma (kotak nomor **2** pada Gambar 17).
### B. Cara Mencetak / Menyimpan Lembar Rekapitulasi Resmi (PDF)
- Pada kartu sebelah kanan (kotak nomor **3** pada Gambar 17), klik tombol biru tua **Unduh Lembar Rekapitulasi Resmi (PDF)**.
- Sistem akan menyiapkan dokumen resmi seperti pada **Gambar 18** yang dilengkapi dengan **Kop Surat Yayasan & Sekolah** (nomor **1**), **Tabel Rekapitulasi Pengisian per Program Keahlian** (nomor **2**), dan **Blok Tanda Tangan Pengesahan Ketua BKK & Kepala Sekolah** (nomor **3**).
- Pada jendela cetak peramban yang muncul, pilih tujuan (*Destination*) ke **Save as PDF** untuk menyimpan menjadi berkas PDF, atau pilih mesin pencetak (*Printer*) kantor untuk mencetak langsung ke kertas A4.

![Gambar 17. Halaman Menu Laporan dan Ekspor Data Lulusan](screenshots/anotasi/17-laporan-ekspor.png)
*Gambar 17. Halaman Menu Laporan dan Ekspor Data Lulusan*

**Keterangan Penunjuk Nomor pada Gambar:**
- **[1] Pilihan Format Berkas Ekspor Data:** Opsi jenis laporan yang akan diunduh: Laporan Lengkap Tracer Study, Data Mentah (Raw Dataset), atau Rekapitulasi Statistik Jurusan.
- **[2] Tombol Unduh Excel (.xlsx) & Unduh CSV (.csv):** Tombol eksekusi pengunduhan berkas tabel sesuai filter periode angkatan dan jenis format yang dipilih.
- **[3] Kartu & Tombol Unduh Lembar Rekapitulasi Resmi (PDF):** Fasilitas untuk mencetak atau menyimpan dokumen laporan rekapitulasi resmi berformat surat pengesahan sekolah.

![Gambar 18. Pratinjau Lembar Rekapitulasi Resmi Tracer Study (Format Cetak/PDF)](screenshots/anotasi/18-lembar-rekapitulasi-resmi.png)
*Gambar 18. Pratinjau Lembar Rekapitulasi Resmi Tracer Study (Format Cetak/PDF)*

**Keterangan Penunjuk Nomor pada Gambar:**
- **[1] Kop Surat Resmi Yayasan & SMK Sasmita Jaya 2:** Bagian kepala surat resmi yang memuat identitas yayasan, nama sekolah, dan alamat lengkap instansi.
- **[2] Tabel Rekapitulasi Keterserapan Lulusan per Program Keahlian:** Tabel matriks jumlah lulusan yang bekerja, kuliah, wirausaha, dan mencari kerja pada setiap program keahlian.
- **[3] Kolom Pengesahan Ketua BKK & Kepala Sekolah:** Bagian tanda tangan pengesahan laporan yang otomatis mengambil nama dan NIP pejabat dari menu Pengaturan Sistem.

---

## 5.8 Menu Pengaturan Sistem
Menu **Pengaturan** digunakan untuk mengatur target sasaran dan rentang waktu pengisian Tracer Study, memperbarui nama dan NIP pejabat penandatangan laporan resmi, serta menyesuaikan identitas dan kontak layanan BKK sekolah.
### Langkah-langkah Mengubah Konfigurasi pada Menu Pengaturan
- Klik menu **Pengaturan** pada bilah navigasi kiri hingga tampil formulir **Pengaturan Sistem** (lihat **Gambar 19**).
- **Mengatur Target Sasaran & Periode Pengisian (Nomor 1):**
Isikan **Target Jumlah Alumni (Siswa)** dan **Tahun Kelulusan Sasaran** yang menjadi fokus pengumpulan data.
- Tentukan **Tanggal Mulai Pengisian** dan **Tanggal Batas Pengisian** kuesioner Tracer Study.
- **Memperbarui Nama Pejabat Penandatangan Laporan Resmi (Nomor 2):**
Isikan **Nama Kepala Sekolah** beserta **NIP Kepala Sekolah**.
- Isikan **Nama Ketua Bursa Kerja Khusus (BKK)** beserta **NIP / NUPTK Ketua BKK**. Data kedua pejabat ini akan otomatis dicantumkan pada blok pengesahan *Lembar Rekapitulasi Resmi (PDF)* di menu Laporan.
- **Memperbarui Identitas Sekolah & Menyimpan Pengaturan (Nomor 3 & 4):**
Periksa atau ubah **Nama Sekolah**, **NPSN (Nomor Pokok Sekolah Nasional)**, **Alamat Lengkap Sekolah**, serta **Nomor Telepon / WhatsApp BKK** untuk kop surat dan layanan alumni.
- Klik tombol biru tua **Simpan Pengaturan** di bagian bawah formulir (nomor **4**) untuk menyimpan seluruh perubahan.

![Gambar 19. Halaman Menu Pengaturan Sistem](screenshots/anotasi/19-pengaturan-sistem.png)
*Gambar 19. Halaman Menu Pengaturan Sistem*

**Keterangan Penunjuk Nomor pada Gambar:**
- **[1] Bagian Target Sasaran & Periode Pengisian:** Pengaturan Target Jumlah Alumni (Siswa), Tahun Kelulusan Sasaran, serta Tanggal Mulai dan Tanggal Batas Pengisian.
- **[2] Bagian Nama Pejabat Penandatangan Laporan Resmi:** Kolom input Nama Kepala Sekolah beserta NIP dan Nama Ketua BKK beserta NIP/NUPTK untuk pengesahan laporan PDF.
- **[3] Bagian Identitas Sekolah & Kontak Layanan:** Pengaturan Nama Sekolah, NPSN, Alamat Lengkap Sekolah, serta Nomor Telepon/WhatsApp Layanan BKK.
- **[4] Tombol Simpan Pengaturan:** Tombol di bagian bawah formulir untuk menyimpan seluruh perubahan konfigurasi sistem.

---

## 6. Fitur Pendukung & 7. Cara Keluar (Logout)
### 6. Ringkasan Fitur Pendukung Operasional
- **Pencarian Instan & Penyaringan Berlapis:** Tersedia di menu Data Alumni, Data Responden, Pesan Masuk, Kelola Berita, dan Kelola Loker untuk menemukan data dalam hitungan detik tanpa perlu memuat ulang halaman.
- **Sinkronisasi & Penyimpanan Lokal Cerdas:** Setiap perubahan pengaturan pejabat, penambahan berita, lowongan kerja, maupun impor data alumni langsung tersimpan dan tersinkronisasi lintas menu.
- **Pengingat WhatsApp Otomatis:** Memudahkan staf BKK menghubungi alumni yang belum mengisi kuesioner hanya dengan satu kali klik dari tabel Data Alumni maupun jendela Preview Siswa.
### 7. Cara Keluar (Logout) dari Dashboard Admin dengan Aman
Demi menjaga keamanan data lulusan dan mencegah penyalahgunaan akses oleh pihak lain, pastikan Anda selalu keluar (*Logout*) dari akun Admin setiap kali selesai bekerja:
- Klik tombol **Keluar dari Akun** yang terletak di bagian paling bawah *Sidebar* kiri (kotak nomor **1** pada **Gambar 20**), atau melalui menu profil di pojok kanan atas *Header*.
- Akan muncul jendela konfirmasi **Keluar dari Portal?** (kotak nomor **2** pada **Gambar 20**). Klik tombol merah **Ya, Keluar** untuk mengakhiri sesi dan kembali ke halaman Login (atau klik **Batal** jika masih ingin melanjutkan pekerjaan).

![Gambar 20. Tombol Keluar dari Akun pada Sidebar & Dialog Konfirmasi Keluar](screenshots/anotasi/20-logout-keluar.png)
*Gambar 20. Tombol Keluar dari Akun pada Sidebar & Dialog Konfirmasi Keluar*

**Keterangan Penunjuk Nomor pada Gambar:**
- **[1] Tombol Keluar dari Akun di Bawah Sidebar:** Tombol di sudut kiri bawah bilah navigasi samping untuk mengakhiri sesi kerja Administrator BKK.
- **[2] Dialog Konfirmasi Keluar dari Portal:** Kotak konfirmasi keamanan dengan pilihan tombol Batal atau tombol merah Ya, Keluar untuk keluar menuju halaman Login.

---
