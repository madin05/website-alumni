import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TracerSubmissionPayload, JurusanSMK, StatusKegiatan } from '@/types/tracer';
import { useAuthStore } from './authStore';

export interface MasterAlumniRecord {
  id: string;
  nisn: string;
  nik: string;
  nama: string;
  jurusan: JurusanSMK;
  tahunLulus: number;
  noWhatsapp: string;
  email: string;
  statusTracer: 'SUDAH' | 'BELUM';
  submissionId?: string;
  submittedAt?: string;
  createdAt: string;
}

export type VerificationStatus = 'PENDING' | 'VALID' | 'REVISI';

export interface RespondentRecord {
  id: string;
  submissionId: string;
  nisn: string;
  nik: string;
  nama: string;
  jurusan: JurusanSMK;
  tahunLulus: number;
  noWhatsapp: string;
  email: string;
  statusKegiatan: StatusKegiatan;
  instansiKampusUsaha: string;
  jabatanProdiUsaha: string;
  submittedAt: string;
  verificationStatus: VerificationStatus;
  verificationNote?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  fullPayload: TracerSubmissionPayload;
}

export interface AdminSettings {
  targetQuota: number;
  targetYear: number;
  periodStart: string;
  periodEnd: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  ketuaBkk: string;
  nipKetuaBkk: string;
  namaSekolah: string;
  npsn: string;
  alamatSekolah: string;
  kontakBkk: string;
}

interface AdminState {
  masterAlumni: MasterAlumniRecord[];
  respondents: RespondentRecord[];
  settings: AdminSettings;

  // Actions
  importMasterAlumni: (records: Omit<MasterAlumniRecord, 'id' | 'createdAt' | 'statusTracer'>[]) => {
    importedCount: number;
    duplicateCount: number;
  };
  addSingleMasterAlumni: (record: Omit<MasterAlumniRecord, 'id' | 'createdAt' | 'statusTracer'>) => Promise<{ success: boolean; message?: string }>;
  deleteMasterAlumni: (id: string) => void;
  updateMasterAlumni: (id: string, updates: Partial<MasterAlumniRecord>) => void;

  updateVerificationStatus: (
    submissionId: string,
    status: VerificationStatus,
    note?: string,
    verifiedBy?: string
  ) => void;

  addOrUpdateRespondent: (payload: TracerSubmissionPayload, submissionId: string) => void;
  updateSettings: (updates: Partial<AdminSettings>) => void;
  resetToDefaultData: () => void;

  // Backend Sync Actions
  fetchMasterAlumniFromBackend: () => Promise<boolean>;
  fetchRespondentsFromBackend: () => Promise<boolean>;
  fetchSettingsFromBackend: () => Promise<boolean>;
  syncAllFromBackend: () => Promise<void>;
}

const DEFAULT_SETTINGS: AdminSettings = {
  targetQuota: 450,
  targetYear: 2024,
  periodStart: '2026-08-01',
  periodEnd: '2026-11-30',
  kepalaSekolah: 'Siti Zubaidah, S.E., S.Pd., M.Pd.I',
  nipKepalaSekolah: '19680514 199303 1 004',
  ketuaBkk: 'Ahmad Fauzi, S.Pd., M.Kom.',
  nipKetuaBkk: '19840219 200902 1 002',
  namaSekolah: 'SMK Sasmita Jaya 2 Pamulang',
  npsn: '20614758',
  alamatSekolah: 'Jl. Surya Kencana No. 1, Pamulang Barat, Kec. Pamulang, Kota Tangerang Selatan, Banten 15417',
  kontakBkk: '0812-8889-7762',
};

const INITIAL_MASTER_ALUMNI: MasterAlumniRecord[] = [
  {
    id: 'mst-001',
    nisn: '0051234567',
    nik: '3674012345670001',
    nama: 'Ahmad Dani',
    jurusan: 'Teknik Komputer dan Jaringan',
    tahunLulus: 2024,
    noWhatsapp: '081298765432',
    email: 'ahmaddani@example.com',
    statusTracer: 'SUDAH',
    submissionId: '2026100001',
    submittedAt: '2026-09-26T13:38:16Z',
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'mst-002',
    nisn: '0052345678',
    nik: '3674012345670002',
    nama: 'Budi Santoso',
    jurusan: 'Teknik Pemesinan',
    tahunLulus: 2024,
    noWhatsapp: '081311223344',
    email: 'budisantoso@example.com',
    statusTracer: 'SUDAH',
    submissionId: '2026100002',
    submittedAt: '2026-09-27T09:15:22Z',
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'mst-003',
    nisn: '0053456789',
    nik: '3674012345670003',
    nama: 'Citra Dewi Lestari',
    jurusan: 'Teknik Instalasi Tenaga Listrik',
    tahunLulus: 2024,
    noWhatsapp: '081233445566',
    email: 'citradewi@example.com',
    statusTracer: 'SUDAH',
    submissionId: '2026100003',
    submittedAt: '2026-09-28T10:40:00Z',
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'mst-004',
    nisn: '0054567890',
    nik: '3674012345670004',
    nama: 'Dimas Bagus Pratama',
    jurusan: 'Teknik Elektronika Industri',
    tahunLulus: 2024,
    noWhatsapp: '085711229988',
    email: 'dimaspratama@example.com',
    statusTracer: 'SUDAH',
    submissionId: '2026100004',
    submittedAt: '2026-09-29T14:20:10Z',
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'mst-005',
    nisn: '0055678901',
    nik: '3674012345670005',
    nama: 'Eko Wahyudi',
    jurusan: 'Teknik Kendaraan Ringan Otomotif',
    tahunLulus: 2024,
    noWhatsapp: '087811992233',
    email: 'ekowahyudi@example.com',
    statusTracer: 'SUDAH',
    submissionId: '2026100005',
    submittedAt: '2026-09-30T11:05:00Z',
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'mst-006',
    nisn: '0056789012',
    nik: '3674012345670006',
    nama: 'Farhan Rizki Ramadhan',
    jurusan: 'Teknik dan Bisnis Sepeda Motor',
    tahunLulus: 2024,
    noWhatsapp: '081299887766',
    email: 'farhanrizki@example.com',
    statusTracer: 'SUDAH',
    submissionId: '2026100006',
    submittedAt: '2026-10-01T08:30:00Z',
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'mst-007',
    nisn: '0063456780',
    nik: '3674012345670013',
    nama: 'Mega Silvia Putri',
    jurusan: 'Teknik Komputer dan Jaringan',
    tahunLulus: 2024,
    noWhatsapp: '089533221100',
    email: 'megasilvia@example.com',
    statusTracer: 'SUDAH',
    submissionId: '2026100007',
    submittedAt: '2026-10-01T15:45:00Z',
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'mst-008',
    nisn: '0064567891',
    nik: '3674012345670014',
    nama: 'Naufal Aditya Putra',
    jurusan: 'Teknik Pemesinan',
    tahunLulus: 2024,
    noWhatsapp: '081211993388',
    email: 'naufaladitya@example.com',
    statusTracer: 'SUDAH',
    submissionId: '2026100008',
    submittedAt: '2026-10-02T09:10:00Z',
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'mst-009',
    nisn: '0065678902',
    nik: '3674012345670015',
    nama: 'Olivia Zahra Nabila',
    jurusan: 'Teknik Komputer dan Jaringan',
    tahunLulus: 2024,
    noWhatsapp: '081388776655',
    email: 'oliviazahra@example.com',
    statusTracer: 'SUDAH',
    submissionId: '2026100009',
    submittedAt: '2026-10-02T10:15:00Z',
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'mst-010',
    nisn: '0066789013',
    nik: '3674012345670016',
    nama: 'Pandu Wicaksono',
    jurusan: 'Teknik Kendaraan Ringan Otomotif',
    tahunLulus: 2024,
    noWhatsapp: '087711223344',
    email: 'panduwicaksono@example.com',
    statusTracer: 'SUDAH',
    submissionId: '2026100010',
    submittedAt: '2026-10-02T11:00:00Z',
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'mst-011',
    nisn: '0067890124',
    nik: '3674012345670017',
    nama: 'Qori Azzahra',
    jurusan: 'Teknik Elektronika Industri',
    tahunLulus: 2024,
    noWhatsapp: '085812345678',
    email: 'qoriazzahra@example.com',
    statusTracer: 'SUDAH',
    submissionId: '2026100011',
    submittedAt: '2026-10-02T11:45:00Z',
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'mst-012',
    nisn: '0068901235',
    nik: '3674012345670018',
    nama: 'Rizki Ramadhan',
    jurusan: 'Teknik dan Bisnis Sepeda Motor',
    tahunLulus: 2024,
    noWhatsapp: '081234567890',
    email: 'rizkiramadhan@example.com',
    statusTracer: 'SUDAH',
    submissionId: '2026100012',
    submittedAt: '2026-10-02T12:30:00Z',
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'mst-013',
    nisn: '0069012346',
    nik: '3674012345670019',
    nama: 'Siti Nurhaliza',
    jurusan: 'Teknik Instalasi Tenaga Listrik',
    tahunLulus: 2024,
    noWhatsapp: '081398765432',
    email: 'sitinurhaliza@example.com',
    statusTracer: 'SUDAH',
    submissionId: '2026100013',
    submittedAt: '2026-10-02T13:15:00Z',
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'mst-014',
    nisn: '0070123457',
    nik: '3674012345670020',
    nama: 'Taufik Hidayat',
    jurusan: 'Teknik Pemesinan',
    tahunLulus: 2024,
    noWhatsapp: '087855443322',
    email: 'taufikhidayat@example.com',
    statusTracer: 'SUDAH',
    submissionId: '2026100014',
    submittedAt: '2026-10-02T14:00:00Z',
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'mst-015',
    nisn: '0071234568',
    nik: '3674012345670021',
    nama: 'Umar Faruq',
    jurusan: 'Teknik Komputer dan Jaringan',
    tahunLulus: 2024,
    noWhatsapp: '089677889900',
    email: 'umarfaruq@example.com',
    statusTracer: 'SUDAH',
    submissionId: '2026100015',
    submittedAt: '2026-10-02T14:45:00Z',
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'mst-016',
    nisn: '0072345679',
    nik: '3674012345670022',
    nama: 'Vina Melinda',
    jurusan: 'Teknik Elektronika Industri',
    tahunLulus: 2024,
    noWhatsapp: '085799887766',
    email: 'vinamelinda@example.com',
    statusTracer: 'SUDAH',
    submissionId: '2026100016',
    submittedAt: '2026-10-02T15:20:00Z',
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'mst-017',
    nisn: '0073456780',
    nik: '3674012345670023',
    nama: 'Wahyu Prasetyo',
    jurusan: 'Teknik Kendaraan Ringan Otomotif',
    tahunLulus: 2024,
    noWhatsapp: '081266554433',
    email: 'wahyuprasetyo@example.com',
    statusTracer: 'SUDAH',
    submissionId: '2026100017',
    submittedAt: '2026-10-02T16:00:00Z',
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'mst-018',
    nisn: '0074567891',
    nik: '3674012345670024',
    nama: 'Xavier Putra Mahendra',
    jurusan: 'Teknik dan Bisnis Sepeda Motor',
    tahunLulus: 2024,
    noWhatsapp: '081322334455',
    email: 'xavierputra@example.com',
    statusTracer: 'SUDAH',
    submissionId: '2026100018',
    submittedAt: '2026-10-02T16:40:00Z',
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'mst-019',
    nisn: '0075678902',
    nik: '3674012345670025',
    nama: 'Yasmin Aulia',
    jurusan: 'Teknik Komputer dan Jaringan',
    tahunLulus: 2024,
    noWhatsapp: '089511224466',
    email: 'yasminaulia@example.com',
    statusTracer: 'SUDAH',
    submissionId: '2026100019',
    submittedAt: '2026-10-02T17:15:00Z',
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'mst-020',
    nisn: '0076789013',
    nik: '3674012345670026',
    nama: 'Zidan Al-Ghifari',
    jurusan: 'Teknik Instalasi Tenaga Listrik',
    tahunLulus: 2024,
    noWhatsapp: '081288112233',
    email: 'zidanalghifari@example.com',
    statusTracer: 'SUDAH',
    submissionId: '2026100020',
    submittedAt: '2026-10-02T17:50:00Z',
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'mst-021',
    nisn: '0077890124',
    nik: '3674012345670027',
    nama: 'Aditya Pratama Putra',
    jurusan: 'Teknik Pemesinan',
    tahunLulus: 2024,
    noWhatsapp: '087812349876',
    email: 'adityapratama@example.com',
    statusTracer: 'SUDAH',
    submissionId: '2026100021',
    submittedAt: '2026-10-02T18:20:00Z',
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'mst-022',
    nisn: '0078901235',
    nik: '3674012345670028',
    nama: 'Bella Safitri',
    jurusan: 'Teknik Elektronika Industri',
    tahunLulus: 2024,
    noWhatsapp: '085644332211',
    email: 'bellasafitri@example.com',
    statusTracer: 'SUDAH',
    submissionId: '2026100022',
    submittedAt: '2026-10-02T19:00:00Z',
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'mst-023',
    nisn: '0057890123',
    nik: '3674012345670007',
    nama: 'Gita Permata Putri',
    jurusan: 'Teknik Komputer dan Jaringan',
    tahunLulus: 2024,
    noWhatsapp: '089611223344',
    email: 'gitapermata@example.com',
    statusTracer: 'BELUM',
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'mst-024',
    nisn: '0058901234',
    nik: '3674012345670008',
    nama: 'Hendra Setiawan',
    jurusan: 'Teknik Pemesinan',
    tahunLulus: 2024,
    noWhatsapp: '081244556677',
    email: 'hendrasetiawan@example.com',
    statusTracer: 'BELUM',
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'mst-025',
    nisn: '0059012345',
    nik: '3674012345670009',
    nama: 'Indah Kusuma Wardani',
    jurusan: 'Teknik Instalasi Tenaga Listrik',
    tahunLulus: 2024,
    noWhatsapp: '085699881122',
    email: 'indahkusuma@example.com',
    statusTracer: 'BELUM',
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'mst-026',
    nisn: '0060123456',
    nik: '3674012345670010',
    nama: 'Joko Susilo',
    jurusan: 'Teknik Elektronika Industri',
    tahunLulus: 2024,
    noWhatsapp: '087766554433',
    email: 'jokosusilo@example.com',
    statusTracer: 'BELUM',
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'mst-027',
    nisn: '0061234568',
    nik: '3674012345670011',
    nama: 'Kevin Julio Anggara',
    jurusan: 'Teknik Kendaraan Ringan Otomotif',
    tahunLulus: 2024,
    noWhatsapp: '081399881144',
    email: 'kevinjulio@example.com',
    statusTracer: 'BELUM',
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'mst-028',
    nisn: '0062345679',
    nik: '3674012345670012',
    nama: 'Lutfi Hakim',
    jurusan: 'Teknik dan Bisnis Sepeda Motor',
    tahunLulus: 2024,
    noWhatsapp: '081277665544',
    email: 'lutfihakim@example.com',
    statusTracer: 'BELUM',
    createdAt: '2026-08-01T08:00:00Z',
  },
];

const INITIAL_RESPONDENTS: RespondentRecord[] = [
  {
    id: 'rsp-001',
    submissionId: '2026100001',
    nisn: '0051234567',
    nik: '3674012345670001',
    nama: 'Ahmad Dani',
    jurusan: 'Teknik Komputer dan Jaringan',
    tahunLulus: 2024,
    noWhatsapp: '081298765432',
    email: 'ahmaddani@example.com',
    statusKegiatan: 'KERJA_KULIAH',
    instansiKampusUsaha: 'PT Solusi Teknologi Nusantara / Univ. Pamulang',
    jabatanProdiUsaha: 'Technical Support / Teknik Informatika',
    submittedAt: '2026-09-26T13:38:16Z',
    verificationStatus: 'VALID',
    verifiedAt: '2026-09-27T08:00:00Z',
    verifiedBy: 'Admin BKK Sasmita',
    fullPayload: {
      identitas: {
        nama_lengkap: 'Ahmad Dani',
        nisn: '0051234567',
        nik: '3674012345670001',
        tahun_lulus: 2024,
        jurusan: 'Teknik Komputer dan Jaringan',
        tahun_masuk: 2021,
        no_whatsapp: '081298765432',
        email: 'ahmaddani@example.com',
        jenis_kelamin: 'Laki-laki',
      },
      status_kegiatan: 'KERJA_KULIAH',
      masa_tunggu: '< 3 bulan',
      detail_kerja: {
        nama_perusahaan: 'PT Solusi Teknologi Nusantara',
        jabatan: 'Technical Support',
        bidang_pekerjaan: 'Teknologi Informasi & Jaringan',
        kota_kabupaten: 'Tangerang Selatan',
        status_pekerjaan: 'Tetap',
        kesesuaian_jurusan: 'Sangat sesuai',
        kisaran_penghasilan: 'Rp 4.000.000 – Rp 7.000.000',
        alamat_perusahaan: 'Jl. Raya Puspiptek No. 10, Tangerang Selatan',
        nama_atasan: 'Budi Santoso',
        kontak_atasan: '081311223344',
        sumber_info_kerja: 'BKK',
        tanggal_mulai_kerja: '2024-08',
        jenis_sertifikat: 'BNSP',
        nama_sertifikat: 'Junior Network Administrator',
      },
      detail_kuliah: {
        nama_kampus: 'Universitas Pamulang',
        program_studi: 'Teknik Informatika',
        jenjang: 'S1',
        status_kuliah: 'Aktif',
        alamat_kampus: 'Jl. Surya Kencana No. 1, Pamulang',
      },
      detail_usaha: null,
      evaluasi: {
        skor_relevansi: 5,
        kompetensi_bermanfaat: ['Kompetensi teknis', 'Komunikasi', 'Kerja sama'],
        kompetensi_ditingkatkan: 'Bahasa Inggris teknis dan praktik cloud virtualization',
        bantu_dunia_kerja: 'Sangat membantu',
        saran_pembelajaran: 'Perbanyak praktik konfigurasi server dan sertifikasi Mikrotik/Cisco.',
        saran_bkk: 'Lanjutkan program penyaluran kerja cepat dengan mitra BKK.',
        saran_industri: 'Tingkatkan kerja sama magang intensif 6 bulan.',
        kesediaan_dihubungi: true,
      },
    },
  },
  {
    id: 'rsp-002',
    submissionId: '2026100002',
    nisn: '0052345678',
    nik: '3674012345670002',
    nama: 'Budi Santoso',
    jurusan: 'Teknik Pemesinan',
    tahunLulus: 2024,
    noWhatsapp: '081311223344',
    email: 'budisantoso@example.com',
    statusKegiatan: 'KERJA',
    instansiKampusUsaha: 'PT Komatsu Indonesia',
    jabatanProdiUsaha: 'CNC Machine Operator',
    submittedAt: '2026-09-27T09:15:22Z',
    verificationStatus: 'VALID',
    verifiedAt: '2026-09-28T09:00:00Z',
    verifiedBy: 'Admin BKK Sasmita',
    fullPayload: {
      identitas: {
        nama_lengkap: 'Budi Santoso',
        nisn: '0052345678',
        nik: '3674012345670002',
        tahun_lulus: 2024,
        jurusan: 'Teknik Pemesinan',
        tahun_masuk: 2021,
        no_whatsapp: '081311223344',
        email: 'budisantoso@example.com',
        jenis_kelamin: 'Laki-laki',
      },
      status_kegiatan: 'KERJA',
      masa_tunggu: '< 3 bulan',
      detail_kerja: {
        nama_perusahaan: 'PT Komatsu Indonesia',
        jabatan: 'CNC Machine Operator',
        bidang_pekerjaan: 'Manufaktur Alat Berat & Presisi',
        kota_kabupaten: 'Jakarta Timur',
        status_pekerjaan: 'Kontrak',
        kesesuaian_jurusan: 'Sangat sesuai',
        kisaran_penghasilan: 'Rp 5.500.000 – Rp 8.000.000',
        nama_atasan: 'Ir. Hartono',
        kontak_atasan: '081299881122',
        sumber_info_kerja: 'BKK',
        tanggal_mulai_kerja: '2024-07',
        jenis_sertifikat: 'BNSP',
        nama_sertifikat: 'Pemrograman Mesin CNC Milling',
      },
      detail_kuliah: null,
      detail_usaha: null,
      evaluasi: {
        skor_relevansi: 5,
        kompetensi_bermanfaat: ['Kompetensi teknis', 'K3 Industri', 'Disiplin 5R'],
        bantu_dunia_kerja: 'Sangat membantu',
        saran_bkk: 'Sangat baik, MoU dengan industri alat berat mohon ditambah kuotanya.',
        kesediaan_dihubungi: true,
      },
    },
  },
  {
    id: 'rsp-003',
    submissionId: '2026100003',
    nisn: '0053456789',
    nik: '3674012345670003',
    nama: 'Citra Dewi Lestari',
    jurusan: 'Teknik Instalasi Tenaga Listrik',
    tahunLulus: 2024,
    noWhatsapp: '081233445566',
    email: 'citradewi@example.com',
    statusKegiatan: 'KERJA',
    instansiKampusUsaha: 'PT PLN (Persero) Rayon Pamulang',
    jabatanProdiUsaha: 'Teknisi Jaringan & Pemeliharaan',
    submittedAt: '2026-09-28T10:40:00Z',
    verificationStatus: 'VALID',
    verifiedAt: '2026-09-29T08:30:00Z',
    verifiedBy: 'Admin BKK Sasmita',
    fullPayload: {
      identitas: {
        nama_lengkap: 'Citra Dewi Lestari',
        nisn: '0053456789',
        nik: '3674012345670003',
        tahun_lulus: 2024,
        jurusan: 'Teknik Instalasi Tenaga Listrik',
        tahun_masuk: 2021,
        no_whatsapp: '081233445566',
        email: 'citradewi@example.com',
        jenis_kelamin: 'Perempuan',
      },
      status_kegiatan: 'KERJA',
      masa_tunggu: '< 3 bulan',
      detail_kerja: {
        nama_perusahaan: 'PT PLN (Persero) Rayon Pamulang',
        jabatan: 'Teknisi Jaringan & Pemeliharaan',
        bidang_pekerjaan: 'Ketenagalistrikan & Distribusi Daya',
        kota_kabupaten: 'Tangerang Selatan',
        status_pekerjaan: 'Kontrak',
        kesesuaian_jurusan: 'Sangat sesuai',
        kisaran_penghasilan: 'Rp 4.800.000 – Rp 6.500.000',
        nama_atasan: 'Hendra Gunawan, S.T.',
        kontak_atasan: '081377889900',
        sumber_info_kerja: 'BKK',
        jenis_sertifikat: 'BNSP',
      },
      detail_kuliah: null,
      detail_usaha: null,
      evaluasi: {
        skor_relevansi: 5,
        kompetensi_bermanfaat: ['Instalasi Penerangan', 'Panel Daya', 'K3 Listrik'],
        bantu_dunia_kerja: 'Sangat membantu',
        saran_bkk: 'Pertahankan kemitraan rekrutmen PLN.',
        kesediaan_dihubungi: true,
      },
    },
  },
  {
    id: 'rsp-004',
    submissionId: '2026100004',
    nisn: '0054567890',
    nik: '3674012345670004',
    nama: 'Dimas Bagus Pratama',
    jurusan: 'Teknik Elektronika Industri',
    tahunLulus: 2024,
    noWhatsapp: '085711229988',
    email: 'dimaspratama@example.com',
    statusKegiatan: 'KULIAH',
    instansiKampusUsaha: 'Politeknik Negeri Jakarta (PNJ)',
    jabatanProdiUsaha: 'D4 Teknik Otomasi Listrik Industri',
    submittedAt: '2026-09-29T14:20:10Z',
    verificationStatus: 'VALID',
    fullPayload: {
      identitas: {
        nama_lengkap: 'Dimas Bagus Pratama',
        nisn: '0054567890',
        nik: '3674012345670004',
        tahun_lulus: 2024,
        jurusan: 'Teknik Elektronika Industri',
        tahun_masuk: 2021,
        no_whatsapp: '085711229988',
        email: 'dimaspratama@example.com',
        jenis_kelamin: 'Laki-laki',
      },
      status_kegiatan: 'KULIAH',
      detail_kerja: null,
      detail_kuliah: {
        nama_kampus: 'Politeknik Negeri Jakarta (PNJ)',
        program_studi: 'Teknik Otomasi Listrik Industri',
        jenjang: 'D4',
        status_kuliah: 'Aktif',
      },
      detail_usaha: null,
      evaluasi: {
        skor_relevansi: 5,
        kompetensi_bermanfaat: ['PLC & Mikrokontroler', 'Sensor & Transduser'],
        bantu_dunia_kerja: 'Sangat membantu',
        saran_bkk: 'Bimbingan masuk PTN Vokasi perlu diteruskan.',
        kesediaan_dihubungi: true,
      },
    },
  },
  {
    id: 'rsp-005',
    submissionId: '2026100005',
    nisn: '0055678901',
    nik: '3674012345670005',
    nama: 'Eko Wahyudi',
    jurusan: 'Teknik Kendaraan Ringan Otomotif',
    tahunLulus: 2024,
    noWhatsapp: '087811992233',
    email: 'ekowahyudi@example.com',
    statusKegiatan: 'KERJA',
    instansiKampusUsaha: 'Auto 2000 BSD City (Toyota)',
    jabatanProdiUsaha: 'Service Advisor & Teknisi Mesin',
    submittedAt: '2026-09-30T11:05:00Z',
    verificationStatus: 'PENDING',
    fullPayload: {
      identitas: {
        nama_lengkap: 'Eko Wahyudi',
        nisn: '0055678901',
        nik: '3674012345670005',
        tahun_lulus: 2024,
        jurusan: 'Teknik Kendaraan Ringan Otomotif',
        tahun_masuk: 2021,
        no_whatsapp: '087811992233',
        email: 'ekowahyudi@example.com',
        jenis_kelamin: 'Laki-laki',
      },
      status_kegiatan: 'KERJA',
      masa_tunggu: '< 3 bulan',
      detail_kerja: {
        nama_perusahaan: 'Auto 2000 BSD City (Toyota Astra Motor)',
        jabatan: 'Service Advisor & Teknisi Mesin',
        bidang_pekerjaan: 'Perawatan & Servis Berkala Otomotif Roda 4',
        kota_kabupaten: 'Tangerang Selatan',
        status_pekerjaan: 'Tetap',
        kesesuaian_jurusan: 'Sangat sesuai',
        kisaran_penghasilan: 'Rp 4.500.000 – Rp 6.800.000',
        nama_atasan: 'Bambang Irawan',
        kontak_atasan: '081298811223',
        sumber_info_kerja: 'BKK',
      },
      detail_kuliah: null,
      detail_usaha: null,
      evaluasi: {
        skor_relevansi: 5,
        kompetensi_bermanfaat: ['Tune-up EFI', 'Diagnosis Scanner Otomotif', 'K3 Bengkel'],
        bantu_dunia_kerja: 'Sangat membantu',
        saran_bkk: 'Sangat membantu alumni berkarir di dealer resmi.',
        kesediaan_dihubungi: true,
      },
    },
  },
  {
    id: 'rsp-006',
    submissionId: '2026100006',
    nisn: '0056789012',
    nik: '3674012345670006',
    nama: 'Farhan Rizki Ramadhan',
    jurusan: 'Teknik dan Bisnis Sepeda Motor',
    tahunLulus: 2024,
    noWhatsapp: '081299887766',
    email: 'farhanrizki@example.com',
    statusKegiatan: 'WIRAUSAHA',
    instansiKampusUsaha: 'Farhan Motor Speed & Custom Service',
    jabatanProdiUsaha: 'Owner / Kepala Mekanik Bengkel Mandiri',
    submittedAt: '2026-10-01T08:30:00Z',
    verificationStatus: 'PENDING',
    fullPayload: {
      identitas: {
        nama_lengkap: 'Farhan Rizki Ramadhan',
        nisn: '0056789012',
        nik: '3674012345670006',
        tahun_lulus: 2024,
        jurusan: 'Teknik dan Bisnis Sepeda Motor',
        tahun_masuk: 2021,
        no_whatsapp: '081299887766',
        email: 'farhanrizki@example.com',
        jenis_kelamin: 'Laki-laki',
      },
      status_kegiatan: 'WIRAUSAHA',
      detail_kerja: null,
      detail_kuliah: null,
      detail_usaha: {
        nama_usaha: 'Farhan Motor Speed & Custom Service',
        bidang_usaha: 'Servis Injeksi Sepeda Motor, Bore-up, dan Sparepart',
        kategori_usaha: 'Jasa',
        lama_usaha: '6–12 bulan',
        jumlah_karyawan: '1 – 3 orang',
        kesesuaian_kompetensi: 'Sangat berkaitan',
        alamat_usaha: 'Jl. Raya Pajajaran No. 45, Pamulang',
      },
      evaluasi: {
        skor_relevansi: 5,
        kompetensi_bermanfaat: ['Sistem Injeksi PGM-FI', 'Kelistrikan Bodi', 'Manajemen Bengkel'],
        bantu_dunia_kerja: 'Sangat membantu',
        saran_bkk: 'Beri pelatihan kewirausahaan dan pembukuan keuangan bagi alumni wirausaha.',
        kesediaan_dihubungi: true,
      },
    },
  },
  {
    id: 'rsp-007',
    submissionId: '2026100007',
    nisn: '0063456780',
    nik: '3674012345670013',
    nama: 'Mega Silvia Putri',
    jurusan: 'Teknik Komputer dan Jaringan',
    tahunLulus: 2024,
    noWhatsapp: '089533221100',
    email: 'megasilvia@example.com',
    statusKegiatan: 'KERJA',
    instansiKampusUsaha: 'PT Telkom Akses Regional Jabodetabek',
    jabatanProdiUsaha: 'Fiber Optic Provisioning & Maintenance',
    submittedAt: '2026-10-01T15:45:00Z',
    verificationStatus: 'PENDING',
    fullPayload: {
      identitas: {
        nama_lengkap: 'Mega Silvia Putri',
        nisn: '0063456780',
        nik: '3674012345670013',
        tahun_lulus: 2024,
        jurusan: 'Teknik Komputer dan Jaringan',
        tahun_masuk: 2021,
        no_whatsapp: '089533221100',
        email: 'megasilvia@example.com',
        jenis_kelamin: 'Perempuan',
      },
      status_kegiatan: 'KERJA',
      masa_tunggu: '< 3 bulan',
      detail_kerja: {
        nama_perusahaan: 'PT Telkom Akses Regional Jabodetabek',
        jabatan: 'Fiber Optic Provisioning & Maintenance',
        bidang_pekerjaan: 'Telekomunikasi & Jaringan Fiber Optik',
        kota_kabupaten: 'Jakarta Selatan',
        status_pekerjaan: 'Kontrak',
        kesesuaian_jurusan: 'Sangat sesuai',
        kisaran_penghasilan: 'Rp 4.700.000 – Rp 6.200.000',
        nama_atasan: 'Agus Setiawan, S.Kom.',
        kontak_atasan: '081288990011',
        sumber_info_kerja: 'BKK',
        jenis_sertifikat: 'BNSP',
      },
      detail_kuliah: null,
      detail_usaha: null,
      evaluasi: {
        skor_relevansi: 5,
        kompetensi_bermanfaat: ['Fiber Optic Splicing', 'OTDR Measurement', 'Routing Switching'],
        bantu_dunia_kerja: 'Sangat membantu',
        saran_bkk: 'Pertahankan ujian sertifikasi fiber optic.',
        kesediaan_dihubungi: true,
      },
    },
  },
  {
    id: 'rsp-008',
    submissionId: '2026100008',
    nisn: '0064567891',
    nik: '3674012345670014',
    nama: 'Naufal Aditya Putra',
    jurusan: 'Teknik Pemesinan',
    tahunLulus: 2024,
    noWhatsapp: '081211993388',
    email: 'naufaladitya@example.com',
    statusKegiatan: 'BELUM_KERJA',
    instansiKampusUsaha: 'Sedang Proses Seleksi Kerja / Mengikuti Pelatihan',
    jabatanProdiUsaha: 'Pencari Kerja Aktif',
    submittedAt: '2026-10-02T09:10:00Z',
    verificationStatus: 'REVISI',
    verificationNote: 'Mohon lengkapi kota domisili dan bidang loker yang diminati agar BKK dapat memberikan rekomendasi lowongan.',
    fullPayload: {
      identitas: {
        nama_lengkap: 'Naufal Aditya Putra',
        nisn: '0064567891',
        nik: '3674012345670014',
        tahun_lulus: 2024,
        jurusan: 'Teknik Pemesinan',
        tahun_masuk: 2021,
        no_whatsapp: '081211993388',
        email: 'naufaladitya@example.com',
        jenis_kelamin: 'Laki-laki',
      },
      status_kegiatan: 'BELUM_KERJA',
      detail_kerja: null,
      detail_kuliah: null,
      detail_usaha: null,
      evaluasi: {
        skor_relevansi: 4,
        kompetensi_bermanfaat: ['Pengelasan SMAW', 'Bubut Manual'],
        bantu_dunia_kerja: 'Membantu',
        saran_bkk: 'Mohon info loker operator mesin dan las di kawasan industri Cilegon dan Tangerang diperbanyak.',
        kesediaan_dihubungi: true,
      },
    },
  },
  {
    id: 'rsp-009',
    submissionId: '2026100009',
    nisn: '0065678902',
    nik: '3674012345670015',
    nama: 'Olivia Zahra Nabila',
    jurusan: 'Teknik Komputer dan Jaringan',
    tahunLulus: 2024,
    noWhatsapp: '081388776655',
    email: 'oliviazahra@example.com',
    statusKegiatan: 'KERJA',
    instansiKampusUsaha: 'PT Telekomunikasi Selular (Telkomsel)',
    jabatanProdiUsaha: 'Junior NOC Engineer',
    submittedAt: '2026-10-02T10:15:00Z',
    verificationStatus: 'VALID',
    verifiedAt: '2026-10-02T10:45:00Z',
    verifiedBy: 'Admin BKK Sasmita',
    fullPayload: {
      identitas: {
        nama_lengkap: 'Olivia Zahra Nabila',
        nisn: '0065678902',
        nik: '3674012345670015',
        tahun_lulus: 2024,
        jurusan: 'Teknik Komputer dan Jaringan',
        tahun_masuk: 2021,
        no_whatsapp: '081388776655',
        email: 'oliviazahra@example.com',
        jenis_kelamin: 'Perempuan',
      },
      status_kegiatan: 'KERJA',
      masa_tunggu: '< 3 bulan',
      detail_kerja: {
        nama_perusahaan: 'PT Telekomunikasi Selular (Telkomsel)',
        jabatan: 'Junior NOC Engineer',
        bidang_pekerjaan: 'Telekomunikasi & Jaringan',
        kota_kabupaten: 'Jakarta Selatan',
        status_pekerjaan: 'Kontrak',
        kesesuaian_jurusan: 'Sangat sesuai',
        kisaran_penghasilan: 'Rp 4.000.000 – Rp 7.000.000',
        alamat_perusahaan: 'Telkom Landmark Tower, Jl. Gatot Subroto, Jakarta Selatan',
        nama_atasan: 'Bambang Irawan',
        kontak_atasan: '081199887766',
        sumber_info_kerja: 'BKK',
        tanggal_mulai_kerja: '2024-09',
        jenis_sertifikat: 'BNSP',
        nama_sertifikat: 'Teknisi Jaringan Madya',
      },
      detail_kuliah: null,
      detail_usaha: null,
      evaluasi: {
        skor_relevansi: 5,
        kompetensi_bermanfaat: ['Routing Switching', 'Monitoring Server', 'TCP/IP'],
        kompetensi_ditingkatkan: 'Scripting automation Python untuk network',
        bantu_dunia_kerja: 'Sangat membantu',
        saran_pembelajaran: 'Sertifikasi industri sangat membantu saat wawancara teknis.',
        saran_bkk: 'Terima kasih BKK atas pendampingan tes kerja!',
        kesediaan_dihubungi: true,
      },
    },
  },
  {
    id: 'rsp-010',
    submissionId: '2026100010',
    nisn: '0066789013',
    nik: '3674012345670016',
    nama: 'Pandu Wicaksono',
    jurusan: 'Teknik Kendaraan Ringan Otomotif',
    tahunLulus: 2024,
    noWhatsapp: '087711223344',
    email: 'panduwicaksono@example.com',
    statusKegiatan: 'KERJA',
    instansiKampusUsaha: 'Auto2000 BSD City (PT Astra International Tbk)',
    jabatanProdiUsaha: 'Teknisi Express Maintenance',
    submittedAt: '2026-10-02T11:00:00Z',
    verificationStatus: 'VALID',
    verifiedAt: '2026-10-02T11:20:00Z',
    verifiedBy: 'Admin BKK Sasmita',
    fullPayload: {
      identitas: {
        nama_lengkap: 'Pandu Wicaksono',
        nisn: '0066789013',
        nik: '3674012345670016',
        tahun_lulus: 2024,
        jurusan: 'Teknik Kendaraan Ringan Otomotif',
        tahun_masuk: 2021,
        no_whatsapp: '087711223344',
        email: 'panduwicaksono@example.com',
        jenis_kelamin: 'Laki-laki',
      },
      status_kegiatan: 'KERJA',
      masa_tunggu: '< 3 bulan',
      detail_kerja: {
        nama_perusahaan: 'Auto2000 BSD City (PT Astra International Tbk)',
        jabatan: 'Teknisi Express Maintenance',
        bidang_pekerjaan: 'Otomotif & Perawatan Kendaraan',
        kota_kabupaten: 'Tangerang Selatan',
        status_pekerjaan: 'Kontrak',
        kesesuaian_jurusan: 'Sangat sesuai',
        kisaran_penghasilan: 'Rp 4.000.000 – Rp 7.000.000',
        alamat_perusahaan: 'Kawasan BSD Sektor IV, Tangerang Selatan',
        nama_atasan: 'Agus Subekti',
        kontak_atasan: '081233221144',
        sumber_info_kerja: 'BKK',
        tanggal_mulai_kerja: '2024-07',
        jenis_sertifikat: 'BNSP',
        nama_sertifikat: 'Teknisi Pemeliharaan Berkala Kendaraan Ringan',
      },
      detail_kuliah: null,
      detail_usaha: null,
      evaluasi: {
        skor_relevansi: 5,
        kompetensi_bermanfaat: ['Diagnostik Mesin EFI', 'Sistem Rem ABS', 'Tune-Up'],
        bantu_dunia_kerja: 'Sangat membantu',
        saran_bkk: 'Kerja sama BKK dengan Auto2000 agar diteruskan tiap tahun.',
        kesediaan_dihubungi: true,
      },
    },
  },
  {
    id: 'rsp-011',
    submissionId: '2026100011',
    nisn: '0067890124',
    nik: '3674012345670017',
    nama: 'Qori Azzahra',
    jurusan: 'Teknik Elektronika Industri',
    tahunLulus: 2024,
    noWhatsapp: '085812345678',
    email: 'qoriazzahra@example.com',
    statusKegiatan: 'KULIAH',
    instansiKampusUsaha: 'Politeknik Negeri Jakarta (PNJ)',
    jabatanProdiUsaha: 'D4 Teknik Otomasi Listrik Industri',
    submittedAt: '2026-10-02T11:45:00Z',
    verificationStatus: 'VALID',
    verifiedAt: '2026-10-02T12:00:00Z',
    verifiedBy: 'Admin BKK Sasmita',
    fullPayload: {
      identitas: {
        nama_lengkap: 'Qori Azzahra',
        nisn: '0067890124',
        nik: '3674012345670017',
        tahun_lulus: 2024,
        jurusan: 'Teknik Elektronika Industri',
        tahun_masuk: 2021,
        no_whatsapp: '085812345678',
        email: 'qoriazzahra@example.com',
        jenis_kelamin: 'Perempuan',
      },
      status_kegiatan: 'KULIAH',
      masa_tunggu: '< 3 bulan',
      detail_kerja: null,
      detail_kuliah: {
        nama_kampus: 'Politeknik Negeri Jakarta (PNJ)',
        program_studi: 'D4 Teknik Otomasi Listrik Industri',
        jenjang: 'D4',
        status_kuliah: 'Aktif',
        alamat_kampus: 'Kukusan, Beji, Kota Depok, Jawa Barat',
      },
      detail_usaha: null,
      evaluasi: {
        skor_relevansi: 5,
        kompetensi_bermanfaat: ['Mikrokontroler Arduino/ESP32', 'Sensor & Transduser', 'Dasar PLC'],
        bantu_dunia_kerja: 'Sangat membantu',
        saran_pembelajaran: 'Dasar elektronika di SMK sangat membantu transisi kuliah politeknik.',
        saran_bkk: 'Sangat terbantu dengan informasi jalur vokasi dan beasiswa dari BKK.',
        kesediaan_dihubungi: true,
      },
    },
  },
  {
    id: 'rsp-012',
    submissionId: '2026100012',
    nisn: '0068901235',
    nik: '3674012345670018',
    nama: 'Rizki Ramadhan',
    jurusan: 'Teknik dan Bisnis Sepeda Motor',
    tahunLulus: 2024,
    noWhatsapp: '081234567890',
    email: 'rizkiramadhan@example.com',
    statusKegiatan: 'WIRAUSAHA',
    instansiKampusUsaha: 'RR Speed Motor Garage & Detailing',
    jabatanProdiUsaha: 'Owner & Lead Mechanic',
    submittedAt: '2026-10-02T12:30:00Z',
    verificationStatus: 'VALID',
    verifiedAt: '2026-10-02T12:50:00Z',
    verifiedBy: 'Admin BKK Sasmita',
    fullPayload: {
      identitas: {
        nama_lengkap: 'Rizki Ramadhan',
        nisn: '0068901235',
        nik: '3674012345670018',
        tahun_lulus: 2024,
        jurusan: 'Teknik dan Bisnis Sepeda Motor',
        tahun_masuk: 2021,
        no_whatsapp: '081234567890',
        email: 'rizkiramadhan@example.com',
        jenis_kelamin: 'Laki-laki',
      },
      status_kegiatan: 'WIRAUSAHA',
      masa_tunggu: '< 3 bulan',
      detail_kerja: null,
      detail_kuliah: null,
      detail_usaha: {
        nama_usaha: 'RR Speed Motor Garage & Detailing',
        bidang_usaha: 'Jasa Servis, Bore-Up & Coating Motor',
        lama_usaha: '6–12 bulan',
        jumlah_karyawan: '1 – 3 orang',
        kesesuaian_kompetensi: 'Sangat berkaitan',
      },
      evaluasi: {
        skor_relevansi: 5,
        kompetensi_bermanfaat: ['Troubleshooting Injeksi PGM-FI', 'Overhaul Mesin', 'Kelistrikan Body'],
        bantu_dunia_kerja: 'Sangat membantu',
        saran_bkk: 'Adakan seminar kewirausahaan bengkel mandiri untuk alumni baru.',
        kesediaan_dihubungi: true,
      },
    },
  },
  {
    id: 'rsp-013',
    submissionId: '2026100013',
    nisn: '0069012346',
    nik: '3674012345670019',
    nama: 'Siti Nurhaliza',
    jurusan: 'Teknik Instalasi Tenaga Listrik',
    tahunLulus: 2024,
    noWhatsapp: '081398765432',
    email: 'sitinurhaliza@example.com',
    statusKegiatan: 'KERJA_KULIAH',
    instansiKampusUsaha: 'PT Schneider Electric / Institut Teknologi PLN',
    jabatanProdiUsaha: 'QA Technician / S1 Teknik Elektro',
    submittedAt: '2026-10-02T13:15:00Z',
    verificationStatus: 'VALID',
    verifiedAt: '2026-10-02T13:40:00Z',
    verifiedBy: 'Admin BKK Sasmita',
    fullPayload: {
      identitas: {
        nama_lengkap: 'Siti Nurhaliza',
        nisn: '0069012346',
        nik: '3674012345670019',
        tahun_lulus: 2024,
        jurusan: 'Teknik Instalasi Tenaga Listrik',
        tahun_masuk: 2021,
        no_whatsapp: '081398765432',
        email: 'sitinurhaliza@example.com',
        jenis_kelamin: 'Perempuan',
      },
      status_kegiatan: 'KERJA_KULIAH',
      masa_tunggu: '< 3 bulan',
      detail_kerja: {
        nama_perusahaan: 'PT Schneider Electric Manufacturing',
        jabatan: 'QA Technician Panel Listrik',
        bidang_pekerjaan: 'Manufaktur Alat Kelistrikan',
        kota_kabupaten: 'Kota Tangerang',
        status_pekerjaan: 'Tetap',
        kesesuaian_jurusan: 'Sangat sesuai',
        kisaran_penghasilan: 'Rp 4.000.000 – Rp 7.000.000',
        alamat_perusahaan: 'Kawasan Industri Jatake, Tangerang',
        nama_atasan: 'Hartono Wijaya',
        kontak_atasan: '081122334455',
        sumber_info_kerja: 'BKK',
        tanggal_mulai_kerja: '2024-08',
        jenis_sertifikat: 'BNSP',
        nama_sertifikat: 'Teknisi Instalasi Panel Listrik 3 Fasa',
      },
      detail_kuliah: {
        nama_kampus: 'Institut Teknologi PLN',
        program_studi: 'S1 Teknik Elektro',
        jenjang: 'S1',
        status_kuliah: 'Aktif',
        alamat_kampus: 'Menara PLN, Jl. Lingkar Luar Barat, Cengkareng, Jakarta Barat',
      },
      detail_usaha: null,
      evaluasi: {
        skor_relevansi: 5,
        kompetensi_bermanfaat: ['Rangkaian Pengendali Motor', 'Instalasi Penerangan', 'K3 Listrik'],
        bantu_dunia_kerja: 'Sangat membantu',
        saran_bkk: 'Sangat bersyukur dengan program kelas industri kelistrikan.',
        kesediaan_dihubungi: true,
      },
    },
  },
  {
    id: 'rsp-014',
    submissionId: '2026100014',
    nisn: '0070123457',
    nik: '3674012345670020',
    nama: 'Taufik Hidayat',
    jurusan: 'Teknik Pemesinan',
    tahunLulus: 2024,
    noWhatsapp: '087855443322',
    email: 'taufikhidayat@example.com',
    statusKegiatan: 'KERJA',
    instansiKampusUsaha: 'PT Komatsu Undercarriage Indonesia',
    jabatanProdiUsaha: 'CNC Milling Machinist',
    submittedAt: '2026-10-02T14:00:00Z',
    verificationStatus: 'VALID',
    verifiedAt: '2026-10-02T14:30:00Z',
    verifiedBy: 'Admin BKK Sasmita',
    fullPayload: {
      identitas: {
        nama_lengkap: 'Taufik Hidayat',
        nisn: '0070123457',
        nik: '3674012345670020',
        tahun_lulus: 2024,
        jurusan: 'Teknik Pemesinan',
        tahun_masuk: 2021,
        no_whatsapp: '087855443322',
        email: 'taufikhidayat@example.com',
        jenis_kelamin: 'Laki-laki',
      },
      status_kegiatan: 'KERJA',
      masa_tunggu: '< 3 bulan',
      detail_kerja: {
        nama_perusahaan: 'PT Komatsu Undercarriage Indonesia',
        jabatan: 'CNC Milling Machinist',
        bidang_pekerjaan: 'Manufaktur Alat Berat & Komponen Presisi',
        kota_kabupaten: 'Kabupaten Bekasi',
        status_pekerjaan: 'Kontrak',
        kesesuaian_jurusan: 'Sangat sesuai',
        kisaran_penghasilan: 'Rp 4.000.000 – Rp 7.000.000',
        alamat_perusahaan: 'Kawasan Industri Jababeka II, Cikarang',
        nama_atasan: 'Dedi Kurniawan',
        kontak_atasan: '081399001122',
        sumber_info_kerja: 'BKK',
        tanggal_mulai_kerja: '2024-07',
        jenis_sertifikat: 'BNSP',
        nama_sertifikat: 'Operator Mesin CNC Milling',
      },
      detail_kuliah: null,
      detail_usaha: null,
      evaluasi: {
        skor_relevansi: 5,
        kompetensi_bermanfaat: ['G-Code Programming', 'Dial Gauge Setup', 'Toleransi Geometris (GD&T)'],
        bantu_dunia_kerja: 'Sangat membantu',
        saran_pembelajaran: 'Tambahkan simulasi Mastercam di lab komputer SMK.',
        saran_bkk: 'Perluas relasi BKK ke industri manufaktur alat berat di Cikarang.',
        kesediaan_dihubungi: true,
      },
    },
  },
  {
    id: 'rsp-015',
    submissionId: '2026100015',
    nisn: '0071234568',
    nik: '3674012345670021',
    nama: 'Umar Faruq',
    jurusan: 'Teknik Komputer dan Jaringan',
    tahunLulus: 2024,
    noWhatsapp: '089677889900',
    email: 'umarfaruq@example.com',
    statusKegiatan: 'KERJA',
    instansiKampusUsaha: 'PT Cyber Network Indonesia',
    jabatanProdiUsaha: 'Cyber Security Analyst Intern',
    submittedAt: '2026-10-02T14:45:00Z',
    verificationStatus: 'PENDING',
    fullPayload: {
      identitas: {
        nama_lengkap: 'Umar Faruq',
        nisn: '0071234568',
        nik: '3674012345670021',
        tahun_lulus: 2024,
        jurusan: 'Teknik Komputer dan Jaringan',
        tahun_masuk: 2021,
        no_whatsapp: '089677889900',
        email: 'umarfaruq@example.com',
        jenis_kelamin: 'Laki-laki',
      },
      status_kegiatan: 'KERJA',
      masa_tunggu: '< 3 bulan',
      detail_kerja: {
        nama_perusahaan: 'PT Cyber Network Indonesia',
        jabatan: 'Cyber Security Analyst Intern',
        bidang_pekerjaan: 'Keamanan Informasi & Jaringan',
        kota_kabupaten: 'Jakarta Pusat',
        status_pekerjaan: 'Magang Berbayar / Kontrak',
        kesesuaian_jurusan: 'Sangat sesuai',
        kisaran_penghasilan: 'Rp 4.000.000 – Rp 7.000.000',
        alamat_perusahaan: 'Jl. M.H. Thamrin No. 8, Jakarta Pusat',
        nama_atasan: 'Faisal Akbar',
        kontak_atasan: '081299881177',
        sumber_info_kerja: 'BKK',
        tanggal_mulai_kerja: '2024-09',
        jenis_sertifikat: 'BNSP',
        nama_sertifikat: 'CompTIA Security+ / CEH Prep',
      },
      detail_kuliah: null,
      detail_usaha: null,
      evaluasi: {
        skor_relevansi: 5,
        kompetensi_bermanfaat: ['Network Security', 'Firewall Fortinet & Mikrotik', 'Linux Administration'],
        bantu_dunia_kerja: 'Sangat membantu',
        saran_bkk: 'Perbanyak workshop ethical hacking dan sertifikasi cyber security.',
        kesediaan_dihubungi: true,
      },
    },
  },
  {
    id: 'rsp-016',
    submissionId: '2026100016',
    nisn: '0072345679',
    nik: '3674012345670022',
    nama: 'Vina Melinda',
    jurusan: 'Teknik Elektronika Industri',
    tahunLulus: 2024,
    noWhatsapp: '085799887766',
    email: 'vinamelinda@example.com',
    statusKegiatan: 'KERJA',
    instansiKampusUsaha: 'PT Omron Manufacturing of Indonesia',
    jabatanProdiUsaha: 'PLC Programmer Assistant',
    submittedAt: '2026-10-02T15:20:00Z',
    verificationStatus: 'PENDING',
    fullPayload: {
      identitas: {
        nama_lengkap: 'Vina Melinda',
        nisn: '0072345679',
        nik: '3674012345670022',
        tahun_lulus: 2024,
        jurusan: 'Teknik Elektronika Industri',
        tahun_masuk: 2021,
        no_whatsapp: '085799887766',
        email: 'vinamelinda@example.com',
        jenis_kelamin: 'Perempuan',
      },
      status_kegiatan: 'KERJA',
      masa_tunggu: '< 3 bulan',
      detail_kerja: {
        nama_perusahaan: 'PT Omron Manufacturing of Indonesia',
        jabatan: 'PLC Programmer Assistant',
        bidang_pekerjaan: 'Otomasi Industri & Sensorik',
        kota_kabupaten: 'Kabupaten Bekasi',
        status_pekerjaan: 'Kontrak',
        kesesuaian_jurusan: 'Sangat sesuai',
        kisaran_penghasilan: 'Rp 4.000.000 – Rp 7.000.000',
        alamat_perusahaan: 'EJIP Industrial Park Plot 5C, Cikarang Selatan',
        nama_atasan: 'Surya Dharma',
        kontak_atasan: '081377889900',
        sumber_info_kerja: 'BKK',
        tanggal_mulai_kerja: '2024-08',
        jenis_sertifikat: 'BNSP',
        nama_sertifikat: 'Pemrograman Otomasi Industri PLC',
      },
      detail_kuliah: null,
      detail_usaha: null,
      evaluasi: {
        skor_relevansi: 5,
        kompetensi_bermanfaat: ['Ladder Diagram PLC', 'HMI Scada', 'Pneumatik'],
        bantu_dunia_kerja: 'Sangat membantu',
        saran_bkk: 'Fasilitas trainer PLC di SMK sudah sangat oke!',
        kesediaan_dihubungi: true,
      },
    },
  },
  {
    id: 'rsp-017',
    submissionId: '2026100017',
    nisn: '0073456780',
    nik: '3674012345670023',
    nama: 'Wahyu Prasetyo',
    jurusan: 'Teknik Kendaraan Ringan Otomotif',
    tahunLulus: 2024,
    noWhatsapp: '081266554433',
    email: 'wahyuprasetyo@example.com',
    statusKegiatan: 'KERJA',
    instansiKampusUsaha: 'PT Astra Daihatsu Motor',
    jabatanProdiUsaha: 'QC Inspector Assembly Line',
    submittedAt: '2026-10-02T16:00:00Z',
    verificationStatus: 'PENDING',
    fullPayload: {
      identitas: {
        nama_lengkap: 'Wahyu Prasetyo',
        nisn: '0073456780',
        nik: '3674012345670023',
        tahun_lulus: 2024,
        jurusan: 'Teknik Kendaraan Ringan Otomotif',
        tahun_masuk: 2021,
        no_whatsapp: '081266554433',
        email: 'wahyuprasetyo@example.com',
        jenis_kelamin: 'Laki-laki',
      },
      status_kegiatan: 'KERJA',
      masa_tunggu: '< 3 bulan',
      detail_kerja: {
        nama_perusahaan: 'PT Astra Daihatsu Motor',
        jabatan: 'QC Inspector Assembly Line',
        bidang_pekerjaan: 'Perakitan & Manufaktur Otomotif',
        kota_kabupaten: 'Karawang',
        status_pekerjaan: 'Kontrak',
        kesesuaian_jurusan: 'Sangat sesuai',
        kisaran_penghasilan: 'Rp 4.000.000 – Rp 7.000.000',
        alamat_perusahaan: 'Kawasan Industri KIIC, Telukjambe Timur, Karawang',
        nama_atasan: 'Ari Wibowo',
        kontak_atasan: '081288990011',
        sumber_info_kerja: 'BKK',
        tanggal_mulai_kerja: '2024-08',
        jenis_sertifikat: 'BNSP',
        nama_sertifikat: 'Teknisi Perakitan Kendaraan Bermotor',
      },
      detail_kuliah: null,
      detail_usaha: null,
      evaluasi: {
        skor_relevansi: 5,
        kompetensi_bermanfaat: ['Torque Tightening Check', 'Chassis Alignment', '5S Kaizen'],
        bantu_dunia_kerja: 'Sangat membantu',
        saran_bkk: 'Simulasi tes fisik dan psikotes BKK sangat membantu saat seleksi Astra.',
        kesediaan_dihubungi: true,
      },
    },
  },
  {
    id: 'rsp-018',
    submissionId: '2026100018',
    nisn: '0074567891',
    nik: '3674012345670024',
    nama: 'Xavier Putra Mahendra',
    jurusan: 'Teknik dan Bisnis Sepeda Motor',
    tahunLulus: 2024,
    noWhatsapp: '081322334455',
    email: 'xavierputra@example.com',
    statusKegiatan: 'WIRAUSAHA_KULIAH',
    instansiKampusUsaha: 'X-Moto Sparepart Racing / Universitas Budi Luhur',
    jabatanProdiUsaha: 'Founder & S1 Manajemen Bisnis',
    submittedAt: '2026-10-02T16:40:00Z',
    verificationStatus: 'VALID',
    verifiedAt: '2026-10-02T17:00:00Z',
    verifiedBy: 'Admin BKK Sasmita',
    fullPayload: {
      identitas: {
        nama_lengkap: 'Xavier Putra Mahendra',
        nisn: '0074567891',
        nik: '3674012345670024',
        tahun_lulus: 2024,
        jurusan: 'Teknik dan Bisnis Sepeda Motor',
        tahun_masuk: 2021,
        no_whatsapp: '081322334455',
        email: 'xavierputra@example.com',
        jenis_kelamin: 'Laki-laki',
      },
      status_kegiatan: 'WIRAUSAHA_KULIAH',
      masa_tunggu: '< 3 bulan',
      detail_kerja: null,
      detail_kuliah: {
        nama_kampus: 'Universitas Budi Luhur',
        program_studi: 'Manajemen Bisnis',
        jenjang: 'S1',
        status_kuliah: 'Aktif',
        alamat_kampus: 'Jl. Ciledug Raya, Petukangan Utara, Jakarta Selatan',
      },
      detail_usaha: {
        nama_usaha: 'X-Moto Sparepart & Apparel Racing',
        bidang_usaha: 'E-commerce Suku Cadang & Apparel Motor Balap',
        lama_usaha: '6–12 bulan',
        jumlah_karyawan: '1 – 3 orang',
        kesesuaian_kompetensi: 'Sangat berkaitan',
      },
      evaluasi: {
        skor_relevansi: 5,
        kompetensi_bermanfaat: ['Spesifikasi Sparepart Motor', 'Pemasangan Aksesori', 'Customer Handling'],
        bantu_dunia_kerja: 'Sangat membantu',
        saran_bkk: 'Sangat mendukung program wirausaha muda SMK!',
        kesediaan_dihubungi: true,
      },
    },
  },
  {
    id: 'rsp-019',
    submissionId: '2026100019',
    nisn: '0075678902',
    nik: '3674012345670025',
    nama: 'Yasmin Aulia',
    jurusan: 'Teknik Komputer dan Jaringan',
    tahunLulus: 2024,
    noWhatsapp: '089511224466',
    email: 'yasminaulia@example.com',
    statusKegiatan: 'KULIAH',
    instansiKampusUsaha: 'Universitas Indonesia (UI)',
    jabatanProdiUsaha: 'D4 Manajemen Rekayasa Jaringan Telekomunikasi',
    submittedAt: '2026-10-02T17:15:00Z',
    verificationStatus: 'VALID',
    verifiedAt: '2026-10-02T17:35:00Z',
    verifiedBy: 'Admin BKK Sasmita',
    fullPayload: {
      identitas: {
        nama_lengkap: 'Yasmin Aulia',
        nisn: '0075678902',
        nik: '3674012345670025',
        tahun_lulus: 2024,
        jurusan: 'Teknik Komputer dan Jaringan',
        tahun_masuk: 2021,
        no_whatsapp: '089511224466',
        email: 'yasminaulia@example.com',
        jenis_kelamin: 'Perempuan',
      },
      status_kegiatan: 'KULIAH',
      masa_tunggu: '< 3 bulan',
      detail_kerja: null,
      detail_kuliah: {
        nama_kampus: 'Universitas Indonesia (UI)',
        program_studi: 'D4 Manajemen Rekayasa Jaringan Telekomunikasi',
        jenjang: 'D4',
        status_kuliah: 'Aktif',
        alamat_kampus: 'Kampus UI Depok, Pondok Cina, Beji, Depok',
      },
      detail_usaha: null,
      evaluasi: {
        skor_relevansi: 5,
        kompetensi_bermanfaat: ['Subnetting IP CIDR', 'Linux Sysadmin', 'Routing BGP OSPF'],
        bantu_dunia_kerja: 'Sangat membantu',
        saran_pembelajaran: 'Guru-guru TKJ Sasmita 2 sangat inspiratif dalam membimbing kami masuk PTN!',
        saran_bkk: 'Terima kasih atas motivasi dan informasi jalur vokasi lanjutan dari BKK.',
        kesediaan_dihubungi: true,
      },
    },
  },
  {
    id: 'rsp-020',
    submissionId: '2026100020',
    nisn: '0076789013',
    nik: '3674012345670026',
    nama: 'Zidan Al-Ghifari',
    jurusan: 'Teknik Instalasi Tenaga Listrik',
    tahunLulus: 2024,
    noWhatsapp: '081288112233',
    email: 'zidanalghifari@example.com',
    statusKegiatan: 'KERJA',
    instansiKampusUsaha: 'PT PLN Nusantara Power',
    jabatanProdiUsaha: 'Maintenance Teknisi Distribusi',
    submittedAt: '2026-10-02T17:50:00Z',
    verificationStatus: 'VALID',
    verifiedAt: '2026-10-02T18:10:00Z',
    verifiedBy: 'Admin BKK Sasmita',
    fullPayload: {
      identitas: {
        nama_lengkap: 'Zidan Al-Ghifari',
        nisn: '0076789013',
        nik: '3674012345670026',
        tahun_lulus: 2024,
        jurusan: 'Teknik Instalasi Tenaga Listrik',
        tahun_masuk: 2021,
        no_whatsapp: '081288112233',
        email: 'zidanalghifari@example.com',
        jenis_kelamin: 'Laki-laki',
      },
      status_kegiatan: 'KERJA',
      masa_tunggu: '< 3 bulan',
      detail_kerja: {
        nama_perusahaan: 'PT PLN Nusantara Power',
        jabatan: 'Maintenance Teknisi Distribusi',
        bidang_pekerjaan: 'Pembangkitan & Distribusi Listrik',
        kota_kabupaten: 'Tangerang Selatan',
        status_pekerjaan: 'Kontrak',
        kesesuaian_jurusan: 'Sangat sesuai',
        kisaran_penghasilan: 'Rp 4.000.000 – Rp 7.000.000',
        alamat_perusahaan: 'Jl. Raya Serpong No. 50, Tangerang Selatan',
        nama_atasan: 'Bambang Sudarmono',
        kontak_atasan: '081211223399',
        sumber_info_kerja: 'BKK',
        tanggal_mulai_kerja: '2024-08',
        jenis_sertifikat: 'BNSP',
        nama_sertifikat: 'Teknisi Jaringan Distribusi Tenaga Listrik',
      },
      detail_kuliah: null,
      detail_usaha: null,
      evaluasi: {
        skor_relevansi: 5,
        kompetensi_bermanfaat: ['Pemeliharaan Trafo', 'Pengukuran Tahanan Isolasi', 'SOP K3 Gardu'],
        bantu_dunia_kerja: 'Sangat membantu',
        saran_bkk: 'Kerja sama BKK dengan BUMN sektor energi terus ditingkatkan.',
        kesediaan_dihubungi: true,
      },
    },
  },
  {
    id: 'rsp-021',
    submissionId: '2026100021',
    nisn: '0077890124',
    nik: '3674012345670027',
    nama: 'Aditya Pratama Putra',
    jurusan: 'Teknik Pemesinan',
    tahunLulus: 2024,
    noWhatsapp: '087812349876',
    email: 'adityapratama@example.com',
    statusKegiatan: 'BELUM_KERJA',
    instansiKampusUsaha: 'BLK Serpong (Program CAD/CAM Mastercam)',
    jabatanProdiUsaha: 'Peserta Pelatihan & Pencari Kerja',
    submittedAt: '2026-10-02T18:20:00Z',
    verificationStatus: 'PENDING',
    fullPayload: {
      identitas: {
        nama_lengkap: 'Aditya Pratama Putra',
        nisn: '0077890124',
        nik: '3674012345670027',
        tahun_lulus: 2024,
        jurusan: 'Teknik Pemesinan',
        tahun_masuk: 2021,
        no_whatsapp: '087812349876',
        email: 'adityapratama@example.com',
        jenis_kelamin: 'Laki-laki',
      },
      status_kegiatan: 'BELUM_KERJA',
      detail_kerja: null,
      detail_kuliah: null,
      detail_usaha: null,
      evaluasi: {
        skor_relevansi: 4,
        kompetensi_bermanfaat: ['Mesin Bubut & Frais Manual', 'Gambar Teknik AutoCAD'],
        kompetensi_ditingkatkan: 'Pemrograman CAD/CAM CNC 5-Axis',
        bantu_dunia_kerja: 'Membantu',
        saran_bkk: 'Mohon update loker operator mesin kawasan MM2100 Cibitung.',
        kesediaan_dihubungi: true,
      },
    },
  },
  {
    id: 'rsp-022',
    submissionId: '2026100022',
    nisn: '0078901235',
    nik: '3674012345670028',
    nama: 'Bella Safitri',
    jurusan: 'Teknik Elektronika Industri',
    tahunLulus: 2024,
    noWhatsapp: '085644332211',
    email: 'bellasafitri@example.com',
    statusKegiatan: 'KERJA',
    instansiKampusUsaha: 'PT Indonesia Epson Industry',
    jabatanProdiUsaha: 'SMD Line Quality Leader',
    submittedAt: '2026-10-02T19:00:00Z',
    verificationStatus: 'VALID',
    verifiedAt: '2026-10-02T19:25:00Z',
    verifiedBy: 'Admin BKK Sasmita',
    fullPayload: {
      identitas: {
        nama_lengkap: 'Bella Safitri',
        nisn: '0078901235',
        nik: '3674012345670028',
        tahun_lulus: 2024,
        jurusan: 'Teknik Elektronika Industri',
        tahun_masuk: 2021,
        no_whatsapp: '085644332211',
        email: 'bellasafitri@example.com',
        jenis_kelamin: 'Perempuan',
      },
      status_kegiatan: 'KERJA',
      masa_tunggu: '< 3 bulan',
      detail_kerja: {
        nama_perusahaan: 'PT Indonesia Epson Industry',
        jabatan: 'SMD Line Quality Leader',
        bidang_pekerjaan: 'Manufaktur Elektronika Presisi',
        kota_kabupaten: 'Kabupaten Bekasi',
        status_pekerjaan: 'Kontrak',
        kesesuaian_jurusan: 'Sangat sesuai',
        kisaran_penghasilan: 'Rp 4.000.000 – Rp 7.000.000',
        alamat_perusahaan: 'Kawasan EJIP Industrial Park, Cikarang Selatan',
        nama_atasan: 'Indra Gunawan',
        kontak_atasan: '081233445566',
        sumber_info_kerja: 'BKK',
        tanggal_mulai_kerja: '2024-07',
        jenis_sertifikat: 'BNSP',
        nama_sertifikat: 'Teknisi Perakitan dan Soldering Komponen Elektronika',
      },
      detail_kuliah: null,
      detail_usaha: null,
      evaluasi: {
        skor_relevansi: 5,
        kompetensi_bermanfaat: ['Soldering SMD', 'Inspeksi Komponen PCB', 'SOP K3 Industri'],
        bantu_dunia_kerja: 'Sangat membantu',
        saran_bkk: 'Sangat bersyukur bisa langsung bekerja sebelum wisuda melalui BKK.',
        kesediaan_dihubungi: true,
      },
    },
  },
];

export const useAdminStore = create<AdminState>()(
  (set, get) => ({
    masterAlumni: [],
    respondents: [],
    settings: DEFAULT_SETTINGS,

      importMasterAlumni: (records) => {
        const currentList = get().masterAlumni;
        const currentNisns = new Set(currentList.map((a) => a.nisn.trim()));
        let importedCount = 0;
        let duplicateCount = 0;

        const newEntries: MasterAlumniRecord[] = [];

        records.forEach((rec, idx) => {
          const cleanNisn = (rec.nisn || '').trim();
          if (!cleanNisn) return;

          if (currentNisns.has(cleanNisn)) {
            duplicateCount++;
          } else {
            currentNisns.add(cleanNisn);
            importedCount++;
            newEntries.push({
              ...rec,
              id: `mst-imp-${Date.now()}-${idx}`,
              statusTracer: 'BELUM',
              createdAt: new Date().toISOString(),
            });
          }
        });

        if (newEntries.length > 0) {
          set({ masterAlumni: [...newEntries, ...currentList] });
          import('@/services/adminService').then(({ adminMasterAlumniApi }) => {
            adminMasterAlumniApi.importCsv(records, true).catch((err) => {
              console.warn('[AdminStore] Backend import CSV sync fallback:', err);
            });
          });
        }

        return { importedCount, duplicateCount };
      },

addSingleMasterAlumni: async (record) => {
        try {
          const { adminMasterAlumniApi } = await import('@/services/adminService');
          const created = await adminMasterAlumniApi.create({
            nisn: record.nisn,
            nik: record.nik || undefined,
            nama: record.nama.trim(),
            jurusan: record.jurusan,
            tahunLulus: record.tahunLulus,
            noWhatsapp: record.noWhatsapp || undefined,
            email: record.email || undefined,
          });

          if (created.success) {
            const newRecord = {
              id: `mst-single-${Date.now()}`,
              nisn: record.nisn,
              nik: record.nik || '',
              nama: record.nama.trim(),
              jurusan: record.jurusan,
              tahunLulus: record.tahunLulus,
              noWhatsapp: record.noWhatsapp || '',
              email: record.email || '',
              statusTracer: 'BELUM',
              createdAt: new Date().toISOString(),
            };
            set((state) => ({
              masterAlumni: [newRecord as MasterAlumniRecord, ...state.masterAlumni],
            }));
            return { success: true };
          } else {
            return { success: false, message: created.message };
          }
        } catch (err: any) {
          return { success: false, message: err.message || 'Terjadi kesalahan jaringan' };
        }
      },

      deleteMasterAlumni: (id) => {
        import('@/services/adminService').then(({ adminMasterAlumniApi }) => {
          adminMasterAlumniApi.delete(id).then((res) => {
            if (res.success) {
              set((state) => ({
                masterAlumni: state.masterAlumni.filter((a) => a.id !== id),
              }));
            } else {
              console.warn('[AdminStore] Backend delete alumni failed:', res.message);
            }
          }).catch((err) => {
            console.warn('[AdminStore] Backend delete alumni error:', err);
          });
        });
      },

      updateMasterAlumni: (id, updates) => {
        import('@/services/adminService').then(({ adminMasterAlumniApi }) => {
          adminMasterAlumniApi.update(id, updates as any).then((res) => {
            if (res.success) {
              set((state) => ({
                masterAlumni: state.masterAlumni.map((a) =>
                  a.id === id ? { ...a, ...updates } : a
                ),
              }));
            } else {
              console.warn('[AdminStore] Backend update alumni failed:', res.message);
            }
          }).catch((err) => {
            console.warn('[AdminStore] Backend update alumni error:', err);
          });
        });
      },

      updateVerificationStatus: (submissionId, status, note, verifiedBy = 'Admin BKK Sasmita') => {
        set((state) => {
          const updatedRespondents = state.respondents.map((rsp) => {
            if (rsp.submissionId === submissionId) {
              return {
                ...rsp,
                verificationStatus: status,
                verificationNote: note,
                verifiedAt: new Date().toISOString(),
                verifiedBy,
              };
            }
            return rsp;
          });

          return { respondents: updatedRespondents };
        });

        import('@/services/adminService').then(({ adminVerificationApi }) => {
          adminVerificationApi.updateStatus(submissionId, status, note).catch((err) => {
            console.warn('[AdminStore] Backend verification status sync fallback:', err);
          });
        });
      },

      addOrUpdateRespondent: (payload, submissionId) => {
        set((state) => {
          const existingIdx = state.respondents.findIndex((r) => r.submissionId === submissionId);
          const instansi =
            payload.detail_kerja?.nama_perusahaan ||
            payload.detail_kuliah?.nama_kampus ||
            payload.detail_usaha?.nama_usaha ||
            (payload.status_kegiatan === 'BELUM_KERJA' ? 'Pencari Kerja Aktif' : '-');

          const jabatan =
            payload.detail_kerja?.jabatan ||
            payload.detail_kuliah?.program_studi ||
            payload.detail_usaha?.bidang_usaha ||
            (payload.status_kegiatan === 'BELUM_KERJA' ? 'Pencari Kerja' : '-');

          const newRespondent: RespondentRecord = {
            id: `rsp-${Date.now()}`,
            submissionId,
            nisn: payload.identitas.nisn,
            nik: payload.identitas.nik || '',
            nama: payload.identitas.nama_lengkap,
            jurusan: payload.identitas.jurusan,
            tahunLulus: payload.identitas.tahun_lulus,
            noWhatsapp: payload.identitas.no_whatsapp,
            email: payload.identitas.email,
            statusKegiatan: payload.status_kegiatan,
            instansiKampusUsaha: instansi,
            jabatanProdiUsaha: jabatan,
            submittedAt: new Date().toISOString(),
            verificationStatus: 'PENDING',
            fullPayload: payload,
          };

          let updatedRespondents = [...state.respondents];
          if (existingIdx >= 0) {
            updatedRespondents[existingIdx] = {
              ...updatedRespondents[existingIdx],
              ...newRespondent,
            };
          } else {
            updatedRespondents = [newRespondent, ...updatedRespondents];
          }

          // Also update masterAlumni statusTracer to SUDAH
          const updatedMaster = state.masterAlumni.map((m) => {
            if (m.nisn === payload.identitas.nisn) {
              return {
                ...m,
                statusTracer: 'SUDAH' as const,
                submissionId,
                submittedAt: new Date().toISOString(),
              };
            }
            return m;
          });

          return {
            respondents: updatedRespondents,
            masterAlumni: updatedMaster,
          };
        });
      },

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
        import('@/services/adminService').then(({ adminSettingsApi }) => {
          adminSettingsApi.update(updates).catch((err) => {
            console.warn('[AdminStore] Sync settings to backend failed:', err);
          });
        });
      },

      resetToDefaultData: () => {
        set({
          masterAlumni: INITIAL_MASTER_ALUMNI,
          respondents: INITIAL_RESPONDENTS,
          settings: DEFAULT_SETTINGS,
        });
        import('@/services/adminService').then(({ adminSettingsApi }) => {
          adminSettingsApi.reset().catch((err) => {
            console.warn('[AdminStore] Reset settings in backend failed:', err);
          });
        });
      },

fetchMasterAlumniFromBackend: async () => {
        try {
          const { adminMasterAlumniApi } = await import('@/services/adminService');
          const res = await adminMasterAlumniApi.listPublic({ limit: 100 });
          const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? (res as any) : null);
          if (list) {
            const mapped: MasterAlumniRecord[] = list.map((item: any) => ({
              id: item.id || `mst-${item.nisn}`,
              nisn: item.nisn,
              nik: item.nik || '',
              nama: item.namaLengkap || item.nama || '',
              jurusan: item.jurusan,
              tahunLulus: Number(item.tahunLulus) || 2024,
              noWhatsapp: item.noWhatsApp || item.noWhatsApp || '',
              email: item.email || '',
              statusTracer: (item.tracerStatus || item.statusTracer || 'BELUM') as 'SUDAH' | 'BELUM',
              submissionId: item.submissionId || undefined,
              submittedAt: item.submittedAt || undefined,
              createdAt: item.createdAt || new Date().toISOString(),
            }));
            set({ masterAlumni: mapped });
            return true;
          }
        } catch (err) {
          console.warn('[AdminStore] Fetch master alumni from backend fallback:', err);
        }
        return false;
      },

      fetchRespondentsFromBackend: async () => {
        try {
          const { adminVerificationApi } = await import('@/services/adminService');
          const { accessToken } = useAuthStore.getState();
          console.log('[AdminStore] fetchRespondentsFromBackend called, accessToken:', accessToken ? 'present' : 'MISSING');
          console.log('[AdminStore] Fetching respondents from backend...');
          const res = await adminVerificationApi.list({ limit: 100 });
          console.log('[AdminStore] Backend response success:', res?.success, 'data length:', res?.data?.length);
          if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
            const mapped: RespondentRecord[] = res.data.map((item: any) => {
              const alumni = item.alumni || {};
              const detailKerja = item.detailKerja || {};
              const detailKuliah = item.detailKuliah || {};
              const detailUsaha = item.detailUsaha || {};

              const instansi =
                detailKerja.nama_perusahaan ||
                detailKuliah.nama_kampus ||
                detailUsaha.nama_usaha ||
                (item.statusKegiatan === 'BELUM_KERJA' ? 'Pencari Kerja Aktif' : '-');

              const jabatan =
                detailKerja.jabatan ||
                detailKuliah.program_studi ||
                detailUsaha.bidang_usaha ||
                (item.statusKegiatan === 'BELUM_KERJA' ? 'Pencari Kerja' : '-');

              return {
                id: item.id || `rsp-${item.submissionId}`,
                submissionId: item.submissionId,
                nisn: alumni.nisn || '',
                nik: alumni.nik || '',
                nama: alumni.namaLengkap || alumni.nama || '',
                jurusan: alumni.jurusan || 'Teknik Komputer dan Jaringan',
                tahunLulus: Number(alumni.tahunLulus) || 2024,
                noWhatsapp: alumni.noWhatsApp || alumni.noWhatsapp || '',
                email: alumni.email || '',
                statusKegiatan: item.statusKegiatan,
                instansiKampusUsaha: instansi,
                jabatanProdiUsaha: jabatan,
                submittedAt: item.submittedAt || new Date().toISOString(),
                verificationStatus: item.verificationStatus || 'PENDING',
                verificationNote: item.verificationNote || undefined,
                verifiedAt: item.verifiedAt || undefined,
                verifiedBy: item.verifiedBy || undefined,
                fullPayload: {
                  identitas: {
                    nama_lengkap: alumni.namaLengkap || '',
                    nisn: alumni.nisn || '',
                    nik: alumni.nik || '',
                    tahun_lulus: Number(alumni.tahunLulus) || 2024,
                    jurusan: alumni.jurusan,
                    tahun_masuk: (Number(alumni.tahunLulus) || 2024) - 3,
                    no_whatsapp: alumni.noWhatsApp || '',
                    email: alumni.email || '',
                    jenis_kelamin: 'Laki-laki',
                  },
                  status_kegiatan: item.statusKegiatan,
                  masa_tunggu: item.masaTunggu || '< 3 bulan',
                  detail_kerja: item.detailKerja || null,
                  detail_kuliah: item.detailKuliah || null,
                  detail_usaha: item.detailUsaha || null,
                  evaluasi: item.evaluasi || {},
                },
              };
            });
            console.log('[AdminStore] Mapped respondents:', mapped);
            set({ respondents: mapped });
            return true;
          }
        } catch (err) {
          console.warn('[AdminStore] Fetch respondents from backend fallback:', err);
        }
        return false;
      },

      fetchSettingsFromBackend: async () => {
        try {
          const { adminSettingsApi } = await import('@/services/adminService');
          const res = await adminSettingsApi.get();
          const settingsData = res?.data;
          if (settingsData) {
            set((state) => ({
              settings: {
                ...state.settings,
                ...settingsData,
                periodStart: typeof settingsData.periodStart === 'string' ? settingsData.periodStart.split('T')[0] : state.settings.periodStart,
                periodEnd: typeof settingsData.periodEnd === 'string' ? settingsData.periodEnd.split('T')[0] : state.settings.periodEnd,
              },
            }));
            return true;
          }
        } catch (err) {
          console.warn('[AdminStore] Fetch settings from backend fallback:', err);
        }
        return false;
      },

      syncAllFromBackend: async () => {
        await Promise.allSettled([
          get().fetchMasterAlumniFromBackend(),
          get().fetchRespondentsFromBackend(),
          get().fetchSettingsFromBackend(),
        ]);
      },
    })
);
