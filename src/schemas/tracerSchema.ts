import { z } from 'zod';

export const JURUSAN_OPTIONS = [
  'Teknik Pemesinan',
  'Teknik Instalasi Tenaga Listrik',
  'Teknik Elektronika Industri',
  'Teknik Kendaraan Ringan Otomotif',
  'Teknik dan Bisnis Sepeda Motor',
  'Teknik Komputer dan Jaringan',
] as const;

export const JENIS_KELAMIN_OPTIONS = [
  'Laki-laki',
  'Perempuan',
] as const;

export const STATUS_KEGIATAN_OPTIONS = [
  { value: 'KERJA', label: 'Bekerja', desc: 'Bekerja di instansi / perusahaan / kantor' },
  { value: 'KULIAH', label: 'Melanjutkan kuliah', desc: 'Melanjutkan studi perguruan tinggi (D3, D4, S1)' },
  { value: 'WIRAUSAHA', label: 'Berwirausaha', desc: 'Membuka usaha mandiri / menjalankan bisnis' },
  { value: 'KERJA_KULIAH', label: 'Kuliah & Kerja', desc: 'Menjalani perkuliahan sekaligus bekerja' },
  { value: 'WIRAUSAHA_KULIAH', label: 'Kuliah & Wirausaha', desc: 'Menjalani perkuliahan sekaligus berwirausaha / membuka bisnis' },
  { value: 'BELUM_KERJA', label: 'Belum bekerja', desc: 'Sedang mencari pekerjaan / persiapan' },
  { value: 'LAINNYA', label: 'Lainnya', desc: 'Aktivitas di luar kategori di atas' },
] as const;

export const MASA_TUNGGU_OPTIONS = [
  '< 3 bulan',
  '3–6 bulan',
  '6–12 bulan',
  '> 12 bulan',
  'Belum mendapatkan pekerjaan',
] as const;

export const STATUS_MENIKAH_OPTIONS = [
  'Belum Menikah',
  'Menikah',
] as const;

export const KETERANGAN_KERJA_OPTIONS = [
  'Buruh/karyawan/pegawai',
  'Pekerja bebas (tidak punya majikan tetap)',
  'Berusaha/berwirausaha sendiri tanpa dibantu orang lain',
  'Membantu menjalankan usaha/wirausaha keluarga dan tidak dibayar',
  'Berusaha/berwirausaha dengan dibantu pekerja tak dibayar',
] as const;

export const JENIS_USAHA_OPTIONS = [
  'Barang',
  'Jasa',
  'Barang Dan Jasa',
] as const;

export const KESELARASAN_STUDI_OPTIONS = [
  'Selaras',
  'Tidak Selaras',
] as const;

export const PENDAPATAN_UMP_OPTIONS = [
  'Sama dengan atau lebih dari UMP',
  'Kurang dari UMP',
] as const;

export const PENDAPATAN_UMK_OPTIONS = [
  'Sama dengan atau lebih dari UMK',
  'Kurang dari UMK',
] as const;

export const STATUS_PEKERJAAN_OPTIONS = [
  'Tetap',
  'Kontrak',
  'Freelance',
  'Magang',
] as const;

export const KESESUAIAN_KERJA_OPTIONS = [
  'Sangat sesuai',
  'Sesuai',
  'Kurang sesuai',
  'Tidak sesuai',
] as const;

export const PENGHASILAN_OPTIONS = [
  '< Rp 2.000.000',
  'Rp 2.000.000 – Rp 4.000.000',
  'Rp 4.000.000 – Rp 7.000.000',
  '> Rp 7.000.000',
] as const;

export const JENJANG_KULIAH_OPTIONS = [
  'D3',
  'D4',
  'S1',
  'S2',
  'S3',
  'Lainnya',
] as const;

export const STATUS_KULIAH_OPTIONS = [
  'Aktif',
  'Lulus',
  'Tidak melanjutkan',
] as const;

export const LAMA_USAHA_OPTIONS = [
  '< 6 bulan',
  '6–12 bulan',
  '1–2 tahun',
  '> 2 tahun',
] as const;

export const JUMLAH_KARYAWAN_OPTIONS = [
  'Belum ada (Dijalankan sendiri)',
  '1 – 3 orang',
  '4 – 10 orang',
  '> 10 orang',
] as const;

export const KESESUAIAN_USAHA_OPTIONS = [
  'Sangat berkaitan',
  'Berkaitan',
  'Kurang berkaitan',
  'Tidak berkaitan',
] as const;

export const KOMPETENSI_BERMANFAAT_OPTIONS = [
  'Kompetensi teknis',
  'Komputer/TIK',
  'Komunikasi',
  'Kerja sama',
  'Kedisiplinan',
  'Kewirausahaan',
  'Lainnya',
] as const;

export const BANTU_DUNIA_KERJA_OPTIONS = [
  'Sangat membantu',
  'Membantu',
  'Kurang membantu',
  'Tidak membantu',
] as const;

// Backward-compatible aliases for legacy imports
export const KOMPETENSI_OPTIONS = KOMPETENSI_BERMANFAAT_OPTIONS;
export const JENJANG_OPTIONS = ['D3', 'D4', 'S1'] as const;
export const KATEGORI_USAHA_OPTIONS = [
  'Jasa',
  'Kuliner',
  'Properti',
  'Ritel',
  'Teknologi',
  'Lainnya',
] as const;
export const SUMBER_INFO_KERJA_OPTIONS = [
  'BKK',
  'Alumni',
  'Website',
  'Mandiri',
  'Lainnya',
] as const;
export const JENIS_SERTIFIKAT_OPTIONS = [
  { value: 'BNSP', label: 'Sertifikat Kompetensi BNSP' },
  { value: 'SEKOLAH', label: 'Sertifikat Keahlian Sekolah / Industri' },
  { value: 'TIDAK_ADA', label: 'Tidak Ada Sertifikat Khusus' },
] as const;
export const KESESUAIAN_JURUSAN_OPTIONS = [
  { value: 'SANGAT_SESUAI', label: 'Sangat Sesuai' },
  { value: 'SESUAI', label: 'Sesuai' },
  { value: 'KURANG', label: 'Kurang Sesuai' },
  { value: 'TIDAK', label: 'Tidak Sesuai' },
] as const;

// Step 1: Identitas Schema (Items 1-8 + Satpen extensions)
export const step1Schema = z
  .object({
    nama_lengkap: z
      .string()
      .min(3, 'Nama lengkap minimal 3 karakter')
      .max(100, 'Nama terlalu panjang'),
    nisn: z
      .string()
      .min(4, 'NIS / NISN wajib diisi'),
    nik: z
      .string()
      .optional(),
    tahun_masuk: z
      .number()
      .min(2000, 'Tahun masuk minimal 2000')
      .max(new Date().getFullYear(), 'Tahun masuk tidak valid'),
    tahun_lulus: z
      .number()
      .min(2003, 'Tahun lulus minimal 2003')
      .max(new Date().getFullYear() + 1, 'Tahun lulus tidak valid'),
    jurusan: z.enum(JURUSAN_OPTIONS),
    no_whatsapp: z
      .string()
      .min(1, 'Nomor WhatsApp wajib diisi')
      .regex(
        /^(\+62|62|0)8[0-9]{7,11}$/,
        'Format nomor WhatsApp tidak valid (contoh: 081234567890)'
      ),
    email: z
      .string()
      .min(1, 'Email wajib diisi')
      .email('Format alamat email tidak valid'),
    jenis_kelamin: z
      .enum(['Laki-laki', 'Perempuan'])
      .optional(),
    status_menikah: z
      .string()
      .optional(),
    usia: z
      .number()
      .optional()
      .nullable(),
    provinsi_domisili: z
      .string()
      .optional(),
    kota_domisili: z
      .string()
      .optional(),
  })
  .refine((data) => data.tahun_lulus >= data.tahun_masuk, {
    message: 'Tahun lulus tidak boleh lebih awal dari tahun masuk',
    path: ['tahun_lulus'],
  });

export type Step1FormData = z.infer<typeof step1Schema>;

// Step 2: Status Kegiatan Schema (Items 9-10)
export const step2Schema = z.object({
  status_kegiatan: z.enum([
    'KERJA',
    'KULIAH',
    'WIRAUSAHA',
    'KERJA_KULIAH',
    'WIRAUSAHA_KULIAH',
    'BELUM_KERJA',
    'LAINNYA',
  ]),
  masa_tunggu: z.string().optional(),
});

// Detail Kerja Schema (Items 11-17 + Satpen extensions)
export const detailKerjaSchema = z.object({
  nama_perusahaan: z.string().min(2, 'Nama perusahaan/instansi wajib diisi'),
  jabatan: z.string().min(2, 'Jabatan/posisi pekerjaan wajib diisi'),
  bidang_pekerjaan: z.string().optional(),
  kota_kabupaten: z.string().optional(),
  status_pekerjaan: z.string().optional(),
  kesesuaian_jurusan: z.string(),
  kisaran_penghasilan: z.string().optional(),
  alamat_perusahaan: z.string().optional(),
  nama_atasan: z.string().optional(),
  kontak_atasan: z.string().optional(),
  sumber_info_kerja: z.string().optional(),
  tanggal_mulai_kerja: z.string().optional(),
  jenis_sertifikat: z.string().optional(),
  nama_sertifikat: z.string().optional(),
  lokasi_pekerjaan: z.string().optional(),
  negara_kerja: z.string().optional(),
  keterangan_kerja: z.string().optional(),
  provinsi_kerja: z.string().optional(),
  kota_kerja: z.string().optional(),
  pendapatan_ump: z.string().optional(),
  pendapatan_umk: z.string().optional(),
});

// Detail Kuliah Schema (Items 18-21 + Satpen extensions)
export const detailKuliahSchema = z.object({
  nama_kampus: z.string().min(2, 'Nama perguruan tinggi wajib diisi'),
  program_studi: z.string().min(2, 'Program studi wajib diisi'),
  jenjang: z.string(),
  status_kuliah: z.string().optional(),
  alamat_kampus: z.string().optional(),
  keselarasan_studi: z.string().optional(),
});

// Detail Usaha Schema (Items 22-26 + Satpen extensions)
export const detailUsahaSchema = z.object({
  nama_usaha: z.string().min(2, 'Nama/usaha yang dijalankan wajib diisi'),
  bidang_usaha: z.string().optional(),
  lama_usaha: z.string().optional(),
  jumlah_karyawan: z.string().optional(),
  kesesuaian_kompetensi: z.string().optional(),
  kategori_usaha: z.string().optional(),
  alamat_usaha: z.string().optional(),
  tanggal_mulai_usaha: z.string().optional(),
  provinsi_usaha: z.string().optional(),
  kota_usaha: z.string().optional(),
  negara_usaha: z.string().optional(),
  jenis_usaha: z.string().optional(),
  nama_produk_usaha: z.string().optional(),
  pendapatan_ump: z.string().optional(),
  pendapatan_umk: z.string().optional(),
});

// Step 4: Evaluasi Schema (Items 27-30)
export const step4Schema = z.object({
  skor_relevansi: z
    .number()
    .min(1, 'Berikan penilaian skala 1-5')
    .max(5, 'Maksimal skor adalah 5'),
  kompetensi_bermanfaat: z
    .array(z.string())
    .min(1, 'Pilih minimal satu kompetensi yang paling bermanfaat'),
  kompetensi_ditingkatkan: z.string().optional(),
  bantu_dunia_kerja: z.string().optional(),
  saran_bkk: z.string().optional(),
  saran_pembelajaran: z.string().optional(),
  saran_industri: z.string().optional(),
  kesediaan_dihubungi: z.boolean().default(true),
});

// Full Combined Form Schema
export const completeTracerFormSchema = z.object({
  identitas: step1Schema,
  status_kegiatan: z.string(),
  masa_tunggu: z.string().optional(),
  detail_kerja: detailKerjaSchema.nullable().optional(),
  detail_kuliah: detailKuliahSchema.nullable().optional(),
  detail_usaha: detailUsahaSchema.nullable().optional(),
  evaluasi: step4Schema,
  agreement: z.boolean().refine((val) => val === true, {
    message: 'Anda harus menyetujui pernyataan kebenaran data',
  }),
});

export type CompleteTracerFormData = z.infer<typeof completeTracerFormSchema>;
