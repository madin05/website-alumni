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
  | 'Lebih dari 6 bulan';

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
}

export interface DetailKerja {
  nama_perusahaan: string; // 11
  jabatan: string; // 12
  bidang_pekerjaan?: string; // 13
  kota_kabupaten?: string; // 14
  status_pekerjaan?: 'Tetap' | 'Kontrak' | 'Freelance' | 'Magang' | string; // 15
  kesesuaian_jurusan: KesesuaianJurusan; // 16
  kisaran_penghasilan?: string; // 17 (opsional)
  // Optional backward-compatible fields:
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
  namaLengkap?: string;
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
  statusKegiatan?: StatusKegiatan;
  instansi?: string;
  jabatan?: string;
  verificationStatus?: 'PENDING' | 'VALID' | 'REVISI';
  verificationNote?: string;
  detailKerja?: any;
  detailKuliah?: any;
  detailUsaha?: any;
}

// Loker & Magang
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

