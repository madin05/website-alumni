// Types definition for Tracer Study & Alumni Portal SMK Sasmita Jaya 2
// Conforms to PRD v1.0.0

export type StatusKegiatan =
  | 'KERJA'
  | 'KULIAH'
  | 'WIRAUSAHA'
  | 'KERJA_KULIAH'
  | 'WIRAUSAHA_KULIAH'
  | 'BELUM_KERJA'
  | 'LAINNYA';

export type JurusanSMK =
  | 'Teknik Pemesinan'
  | 'Teknik Instalasi Tenaga Listrik'
  | 'Teknik Elektronika Industri'
  | 'Teknik Kendaraan Ringan Otomotif'
  | 'Teknik dan Bisnis Sepeda Motor'
  | 'Teknik Komputer dan Jaringan';

export type JenjangKuliah = 'D3' | 'D4' | 'S1' | 'S2' | 'S3' | 'Lainnya';

export type KategoriUsaha =
  | 'Jasa'
  | 'Kuliner'
  | 'Properti'
  | 'Ritel'
  | 'Teknologi'
  | 'Lainnya';

export type SumberInfoKerja =
  | 'BKK'
  | 'Alumni'
  | 'Website'
  | 'Mandiri'
  | 'Lainnya';

export type JenisSertifikat = 'BNSP' | 'SEKOLAH' | 'TIDAK_ADA';

export type KesesuaianJurusan =
  | 'SANGAT_SESUAI'
  | 'SESUAI'
  | 'KURANG'
  | 'TIDAK'
  | 'Sangat sesuai'
  | 'Sesuai'
  | 'Kurang sesuai'
  | 'Tidak sesuai';

export type MasaTunggu =
  | '< 3 bulan'
  | '3–6 bulan'
  | '6–12 bulan'
  | '> 12 bulan'
  | 'Belum mendapatkan pekerjaan'
  | 'Kurang dari 1 bulan'
  | '1 - 3 bulan'
  | '3 - 6 bulan'
  | 'Lebih dari 6 bulan'
  | string;

export interface IdentitasAlumni {
  nama_lengkap: string; // 1
  nisn: string; // 2 (NIS / NISN)
  nik?: string;
  tahun_lulus: number; // 3
  jurusan: JurusanSMK; // 4
  tahun_masuk: number; // 5
  no_whatsapp: string; // 6
  email: string; // 7
  jenis_kelamin?: 'Laki-laki' | 'Perempuan'; // 8
  status_menikah?: 'Belum Menikah' | 'Menikah' | string;
  usia?: number;
  provinsi_domisili?: string;
  kota_domisili?: string;
}

export interface DetailKerja {
  nama_perusahaan: string; // 11
  jabatan: string; // 12
  bidang_pekerjaan?: string; // 13
  kota_kabupaten?: string; // 14
  status_pekerjaan?: 'Tetap' | 'Kontrak' | 'Freelance' | 'Magang' | string; // 15
  kesesuaian_jurusan: KesesuaianJurusan; // 16
  kisaran_penghasilan?: string; // 17 (opsional)
  // Optional backward-compatible & Satpen fields:
  lokasi_pekerjaan?: 'DALAM_NEGERI' | 'LUAR_NEGERI' | string;
  negara_kerja?: string;
  keterangan_kerja?: string;
  provinsi_kerja?: string;
  kota_kerja?: string;
  pendapatan_ump?: 'Kurang dari UMP' | 'Sama dengan atau lebih dari UMP' | string;
  pendapatan_umk?: 'Kurang dari UMK' | 'Sama dengan atau lebih dari UMK' | string;
  alamat_perusahaan?: string;
  nama_atasan?: string;
  kontak_atasan?: string;
  sumber_info_kerja?: SumberInfoKerja;
  tanggal_mulai_kerja?: string; // YYYY-MM
  jenis_sertifikat?: JenisSertifikat;
  nama_sertifikat?: string;
}

export interface DetailKuliah {
  nama_kampus: string; // 18
  program_studi: string; // 19
  jenjang: JenjangKuliah | 'D3' | 'D4' | 'S1' | 'Lainnya'; // 20
  status_kuliah?: 'Aktif' | 'Lulus' | 'Tidak melanjutkan' | string; // 21
  alamat_kampus?: string;
  keselarasan_studi?: 'Selaras' | 'Tidak Selaras' | 'Sangat sesuai' | 'Sesuai' | 'Kurang sesuai' | 'Tidak sesuai' | string;
}

export interface DetailUsaha {
  nama_usaha: string; // 22
  bidang_usaha?: string; // 23
  kategori_usaha?: KategoriUsaha;
  lama_usaha?: string; // 24
  jumlah_karyawan?: string; // 25
  kesesuaian_kompetensi?: 'Sangat berkaitan' | 'Berkaitan' | 'Kurang berkaitan' | 'Tidak berkaitan' | string; // 26
  alamat_usaha?: string;
  tanggal_mulai_usaha?: string; // YYYY-MM
  provinsi_usaha?: string;
  kota_usaha?: string;
  negara_usaha?: string;
  jenis_usaha?: 'Barang' | 'Jasa' | 'Barang Dan Jasa' | string;
  nama_produk_usaha?: string;
  pendapatan_ump?: 'Kurang dari UMP' | 'Sama dengan atau lebih dari UMP' | string;
  pendapatan_umk?: 'Kurang dari UMK' | 'Sama dengan atau lebih dari UMK' | string;
}

export interface EvaluasiPembelajaran {
  skor_relevansi: number; // 27 (1 - 5)
  kompetensi_bermanfaat: string[]; // 28
  kompetensi_ditingkatkan?: string; // 29
  bantu_dunia_kerja?: 'Sangat membantu' | 'Membantu' | 'Kurang membantu' | 'Tidak membantu' | string; // 30
  saran_pembelajaran?: string; // 31
  saran_bkk: string; // 32
  saran_industri?: string; // 33
  kesediaan_dihubungi: boolean; // 34
}

// Full Tracer Study Submission Payload as specified in PRD Section 5.1
export interface TracerSubmissionPayload {
  identitas: IdentitasAlumni;
  status_kegiatan: StatusKegiatan;
  masa_tunggu?: MasaTunggu;
  detail_kerja: DetailKerja | null;
  detail_kuliah: DetailKuliah | null;
  detail_usaha: DetailUsaha | null;
  evaluasi: EvaluasiPembelajaran;
}

export interface SubmissionResponse {
  success: boolean;
  message: string;
  data?: {
    submission_id: string;
    submitted_at: string;
  };
  errors?: Record<string, string[]>;
}

// User Profile & Authentication
export interface UserSession {
  id: string;
  nisn: string;
  nik?: string;
  nama: string;
  email: string;
  noWhatsapp?: string;
  role: 'alumni' | 'admin_bkk';
  jurusan: string;
  tahun_lulus: number;
  tracerStatus: 'SUDAH' | 'BELUM' | 'DRAFT';
  submissionId?: string;
  submittedAt?: string;
  jenisKelamin?: 'L' | 'P' | 'Laki-laki' | 'Perempuan';
  avatarUrl?: string;
}

// Loker & Magang (Model: Information Hub & Direct Referral)
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
  // Field dinamis untuk metode pendaftaran langsung ke mitra
  applyType?: JobApplyType;
  locationAddress?: string;     // Alamat lengkap / rute walk-in
  walkInSchedule?: string;      // Hari dan jam kedatangan walk-in
  mapsUrl?: string;             // Tautan Google Maps
  whatsappNumber?: string;      // Nomor WhatsApp HRD (628...)
  whatsappTemplate?: string;    // Template pesan WhatsApp
  emailAddress?: string;        // Alamat email rekrutmen mitra
  emailSubject?: string;        // Subjek email terformat
  externalUrl?: string;         // Link formulir / portal karir resmi mitra
  clickCount?: number;          // Metrik jumlah alumni yang berminat / klik
}

// Ijazah Tracking
export interface IjazahStatus {
  nisn: string;
  nama: string;
  jurusan: string;
  tahunLulus: number;
  statusPengambilan: 'SIAP_DIAMBIL' | 'SUDAH_DIAMBIL' | 'PROSES_LEGALISIR' | 'DALAM_PENCETAKAN';
  nomorIjazah: string;
  nomorSertifikatBnsp?: string;
  tanggalSiap?: string;
  tanggalDiambil?: string;
  lokasiPengambilan: string;
  persyaratan: string[];
  barcode: string;
}

// News
export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  imageUrl: string;
  author: string;
}

// Legal Basis SK
export interface LegalBasis {
  id: string;
  number: string;
  year: string;
  title: string;
  description: string;
  badge: string;
  pdfUrl?: string;
}

// Jurusan Tracer Report
export interface JurusanReportData {
  id: 'all' | 'tpm' | 'titl' | 'el' | 'tkro' | 'tbsm' | 'tkj';
  tabLabel: string;
  name: string;
  fullName: string;
  totalResponden: number;
  bmw: {
    bekerja: { percent: number; count: number; note: string };
    kuliah: { percent: number; count: number; note: string };
    wirausaha: { percent: number; count: number; note: string };
  };
  linearityRate: number;
  linearityDescription: string;
  avgWaitingTime: string;
  avgStartingSalary: string;
  topPartners: {
    name: string;
    sector: string;
    badge: string;
    description: string;
  }[];
  keyCompetencies: string[];
}

// Yearly Tracer Statistics Matrix
export interface JurusanYearlyStat {
  year: number;
  jurusanId: 'tpm' | 'titl' | 'el' | 'tkro' | 'tbsm' | 'tkj';
  jurusanCode: string;
  jurusanName: string;
  totalAlumni: number;
  mengisiTracer: number;
  bekerja: number;
  kuliah: number;
  wirausaha: number;
  belumKerja: number;
  kesesuaian: {
    sangatSesuai: number;
    sesuai: number;
    kurangSesuai: number;
    tidakSesuai: number;
  };
  skalaKerja: {
    lokal: number;
    nasional: number;
    multinasional: number;
    wirausaha: number;
  };
}

