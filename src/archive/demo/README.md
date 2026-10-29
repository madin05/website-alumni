# Arsip Kode Demo Tracer Study & Auth

Direktori ini menyimpan seluruh modul dan komponen demo yang sebelumnya digunakan untuk simulasi presentasi atau pengujian audiens.

## Daftar Berkas Arsip

1. **`DemoUserSelect.tsx`**:
   - Komponen dropdown pemilihan 30 akun demo audiens (`user01` s/d `user30`).
   - Dilengkapi indikator ketersediaan status lock real-time, tab filter, dan input pencarian.

2. **`demoUsers.ts`**:
   - Dataset 30 akun demo beserta mapping NISN, NIK, jurusan, dan helper verifikasi sesi demo.

3. **`demoSessionService.ts`**:
   - Layanan manajemen atomic lock, heartbeat sesi aktif, pencegah tabrakan akun, dan isolasi lingkungan (sandbox lokal vs produksi).

4. **`demoAuthSnippet.tsx`**:
   - Kumpulan helper fungsi autofill (`handleQuickDemoAlumni`, `handleAdminDemo`) dan tombol pintas 1-click login yang sebelumnya berada di form login.

## Panduan Restorasi (Jika Dibutuhkan Presentasi / Demo Kembali)

1. **Mengaktifkan Tombol Demo Cepat di `LoginPage.tsx`**:
   - Impor `DemoActionButtons` dan `demoAuthHelpers` dari `src/archive/demo/demoAuthSnippet.tsx`.
   - Pasang kembali di bawah tombol submit login.

2. **Mengaktifkan Dropdown 30 User Audiens**:
   - Impor `DemoUserSelect` dari `src/archive/demo/DemoUserSelect.tsx`.
   - Pasang di atas form login dan hubungkan dengan state `identifier` dan `password`.

