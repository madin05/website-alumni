import * as XLSX from 'xlsx';
import { JurusanSMK } from '@/types/tracer';

/**
 * Format kolom CSV data siswa lulusan (format ekspor Dapodik).
 * Digunakan bersama oleh modal impor dan tombol unduh format.
 */
export const ALUMNI_CSV_HEADERS = [
  'No',
  'NISN',
  'Nama',
  'Nama Sekolah',
  'NPSN',
  'Status Sekolah',
  'Tahun Lulus',
  'Komp. Keahlian',
  'Prog. Keahlian',
  'Bid. Keahlian',
  'Lama Program (Tahun)',
  'Prov. SMK',
  'Kab/Kota',
  'Usia',
  'Jenis Kelamin',
  'Status Menikah',
  'Prov. Dimisili',
  'Kota Domisili',
  'E-mail',
  'No HP',
  'Status Aktifitas Lulusan',
  'Keterangan',
  'Masa Tunggu Bekerja(bulan)',
  'Sertifikat Komp.',
  'Jabatan (Bekerja)',
  'Nama Tempat Kerja',
  'Provinsi Kerja',
  'Kota Kerja',
  'Negara Kerja',
  'Keselarasan Kerja',
  'Provinsi Usaha',
  'Kota Usaha',
  'Negara Usaha',
  'Bidang Usaha',
  'Jenis Usaha',
  'Keselarasan Usaha',
  'Nama Produk Usaha',
  'Jenjang Pendidikan',
  'Nama Perguruan Tinggi',
  'Nama Prodi',
  'Keselarasan Studi Lanjut',
  'Pendapatan Bekerja (UMP)',
  'Pendapatan Bekerja (UMK)',
  'Pendapatan Wirausaha (UMP)',
  'Pendapatan Wirausaha (UMK)',
  'Pendapatan Studi Sambil Bekerja (UMP)',
  'Pendapatan Studi Sambil Bekerja (UMK)',
  'Pendapatan Studi Sambil Berwirausaha (UMP)',
  'Pendapatan Studi Sambil Berwirausaha (UMK)',
] as const;

export interface ParsedAlumniRow {
  // Field utama untuk tampilan tabel
  nisn: string;
  nama: string;
  jurusan: JurusanSMK;
  tahunLulus: number;
  noWhatsapp: string;
  email: string;
  // Seluruh field siap kirim ke basis data
  dbFields: Record<string, unknown>;
}

export interface ParseAlumniCsvResult {
  rows: ParsedAlumniRow[];
  skipped: number;
  headerRecognized: boolean;
  message?: string;
}

const JURUSAN_EXACT: Record<string, JurusanSMK> = {
  TEKNIKKOMPUTERDANJARINGAN: 'Teknik Komputer dan Jaringan',
  TEKNIKPEMESINAN: 'Teknik Pemesinan',
  TEKNIKINSTALASITENAGALISTRIK: 'Teknik Instalasi Tenaga Listrik',
  TEKNIKELEKTRONIKAINDUSTRI: 'Teknik Elektronika Industri',
  TEKNIKKENDARAANRINGANOTOMOTIF: 'Teknik Kendaraan Ringan Otomotif',
  TEKNIKDANBISNISSEPEDAMOTOR: 'Teknik dan Bisnis Sepeda Motor',
};

/** Kata kunci diurutkan dari yang paling spesifik agar tidak salah cocok antar jurusan. */
const JURUSAN_KEYWORDS: Array<{ jurusan: JurusanSMK; keywords: string[] }> = [
  { jurusan: 'Teknik dan Bisnis Sepeda Motor', keywords: ['TBSM', 'SEPEDAMOTOR', 'BISNISMOTOR'] },
  { jurusan: 'Teknik Instalasi Tenaga Listrik', keywords: ['TITL', 'INSTALASI', 'TENAGALISTRIK', 'LISTRIK'] },
  { jurusan: 'Teknik Kendaraan Ringan Otomotif', keywords: ['TKRO', 'TKR', 'OTOMOTIF', 'KENDARAAN', 'MOBIL'] },
  { jurusan: 'Teknik Elektronika Industri', keywords: ['TEI', 'ELEKTRONIKA'] },
  { jurusan: 'Teknik Pemesinan', keywords: ['TPM', 'PEMESINAN', 'MESIN'] },
  { jurusan: 'Teknik Komputer dan Jaringan', keywords: ['TKJ', 'KOMPUTER', 'JARINGAN'] },
];

/** Normalisasi header: huruf kecil, hanya karakter alfanumerik. */
function normalizeHeader(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Petakan header Dapodik ke field basis data.
 * Mengembalikan '__skip__' untuk kolom yang tidak dipakai.
 */
function mapHeaderToField(header: string): string {
  const n = normalizeHeader(header);

  if (n === 'no' || n === '' || n.startsWith('nomorurutan')) return '__skip__';
  if (n.includes('nisn')) return 'nisn';
  if (n === 'nama' || n.startsWith('namalengkap') || n.startsWith('namasiswa')) return 'nama';
  if (n.startsWith('namasekolah')) return 'namaSekolah';
  if (n === 'npsn') return 'npsn';
  if (n.startsWith('statussekolah')) return 'statusSekolah';
  if (n.includes('tahunlulus')) return 'tahunLulus';
  if (n.startsWith('kompkeahlian')) return 'kompKeahlian';
  if (n.startsWith('progkeahlian') || n.startsWith('programkeahlian')) return 'jurusan';
  if (n.startsWith('bidkeahlian') || n.startsWith('bidangkeahlian')) return 'bidKeahlian';
  if (n.includes('lamaprogram')) return 'lamaProgram';
  if ((n.startsWith('prov') && n.includes('smk')) || n.includes('provinsismk')) return 'provinsiSmk';
  if (n.startsWith('kab')) return 'kabKotaSmk';
  if (n === 'usia' || n === 'umur') return 'usia';
  if (n.includes('kelamin')) return 'jenisKelamin';
  if (n.includes('menikah')) return 'statusMenikah';
  if (n.startsWith('prov') && n.includes('milisili')) return 'provinsiDomisili';
  if (n.startsWith('kota') && n.includes('milisili')) return 'kotaDomisili';
  if (n.includes('email') || n.startsWith('sure')) return 'email';
  if (n.startsWith('nohp') || n.includes('whatsapp') || n.startsWith('nowa') || n.startsWith('nomorhp')) return 'noHp';
  if (n.includes('aktifitas') || n.includes('aktivitas')) return 'statusAktivitas';
  if (n.includes('keterangan')) return 'keterangan';
  if (n.includes('masatunggu') || n.includes('tunggubekerja')) return 'masaTungguKerja';
  if (n.includes('sertifikat')) return 'sertifikatKompetensi';
  if (n.startsWith('jabatan')) return 'jabatanKerja';
  if (n.startsWith('namatempatkerja')) return 'namaTempatKerja';
  if (n.startsWith('provinsi') && n.includes('usaha')) return 'provinsiUsaha';
  if (n.startsWith('kota') && n.includes('usaha')) return 'kotaUsaha';
  if (n.startsWith('negara') && n.includes('usaha')) return 'negaraUsaha';
  if (n.startsWith('bidangusaha')) return 'bidangUsaha';
  if (n.startsWith('jenisusaha')) return 'jenisUsaha';
  if (n.startsWith('keselarasan') && n.includes('usaha')) return 'keselarasanUsaha';
  if (n.startsWith('namaproduk')) return 'namaProdukUsaha';
  if (n.startsWith('jenjang')) return 'jenjangPendidikan';
  if (n.startsWith('namaperguruan') || n.startsWith('namakampus')) return 'namaPerguruanTinggi';
  if (n.startsWith('namaprodi') || n === 'prodi') return 'namaProdi';
  if (n.startsWith('keselarasan') && n.includes('studi')) return 'keselarasanStudi';
  if (n.startsWith('provinsi') && n.includes('kerja')) return 'provinsiKerja';
  if (n.startsWith('kota') && n.includes('kerja')) return 'kotaKerja';
  if (n.startsWith('negara') && n.includes('kerja')) return 'negaraKerja';
  if (n.startsWith('keselarasan') && n.includes('kerja')) return 'keselarasanKerja';

  if (n.startsWith('pendapatan')) {
    const isSambil = n.includes('sambil');
    const isUsaha = n.includes('wirausaha');
    const isUmp = n.endsWith('ump');
    if (isSambil && isUsaha) return isUmp ? 'pendapatanStudiSambilBerwirausahaUmp' : 'pendapatanStudiSambilBerwirausahaUmk';
    if (isSambil) return isUmp ? 'pendapatanStudiSambilBekerjaUmp' : 'pendapatanStudiSambilBekerjaUmk';
    if (isUsaha) return isUmp ? 'pendapatanWirausahaUmp' : 'pendapatanWirausahaUmk';
    return isUmp ? 'pendapatanBekerjaUmp' : 'pendapatanBekerjaUmk';
  }

  return '__skip__';
}

const WA_REGEX = /^(\+62|62|0)8[0-9]{7,11}$/;
// Validasi email mengikuti skema basis data (tanpa titik berurutan, domain wajib TLD)
const EMAIL_REGEX = /^(?!.*\.\.)[a-zA-Z0-9._%+'-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;

/**
 * Panjang maksimum setiap field opsional mengikuti skema basis data
 * agar data dari Dapodik yang terlalu panjang tidak membuat impor gagal.
 */
const FIELD_MAX_LENGTH: Record<string, number> = {
  nama: 100,
  namaSekolah: 150,
  npsn: 20,
  statusSekolah: 20,
  kompKeahlian: 100,
  progKeahlian: 100,
  bidKeahlian: 100,
  provinsiSmk: 100,
  kabKotaSmk: 100,
  statusMenikah: 30,
  provinsiDomisili: 100,
  kotaDomisili: 100,
  noHp: 20,
  statusAktivitas: 50,
  keterangan: 2000,
  sertifikatKompetensi: 50,
  jabatanKerja: 100,
  namaTempatKerja: 150,
  provinsiKerja: 100,
  kotaKerja: 100,
  negaraKerja: 100,
  keselarasanKerja: 50,
  provinsiUsaha: 100,
  kotaUsaha: 100,
  negaraUsaha: 100,
  bidangUsaha: 100,
  jenisUsaha: 50,
  keselarasanUsaha: 50,
  namaProdukUsaha: 150,
  jenjangPendidikan: 20,
  namaPerguruanTinggi: 150,
  namaProdi: 100,
  keselarasanStudi: 50,
  pendapatanBekerjaUmp: 50,
  pendapatanBekerjaUmk: 50,
  pendapatanWirausahaUmp: 50,
  pendapatanWirausahaUmk: 50,
  pendapatanStudiSambilBekerjaUmp: 50,
  pendapatanStudiSambilBekerjaUmk: 50,
  pendapatanStudiSambilBerwirausahaUmp: 50,
  pendapatanStudiSambilBerwirausahaUmk: 50,
};

/** Potong nilai agar sesuai panjang kolom basis data. */
function clamp(value: string, field: string): string {
  const max = FIELD_MAX_LENGTH[field];
  if (!max) return value;
  return value.length > max ? value.slice(0, max) : value;
}

function detectDelimiter(firstLine: string): string {
  if (firstLine.includes(';') && !firstLine.includes(',')) return ';';
  if (firstLine.includes('\t')) return '\t';
  return ',';
}

function splitLine(line: string, delimiter: string): string[] {
  // Pecah sederhana dengan dukungan tanda kutip ("...,...")
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);

  return result.map((p) => p.trim());
}

/** Bersihkan nomor HP agar hanya angka (mendukung format ekspor 0812-1234-5678). */
function normalizePhone(raw: string): string {
  const trimmed = raw.trim();
  const plusPrefixed = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '');
  if (!digits) return '';
  return plusPrefixed ? `+${digits}` : digits;
}

function matchJurusan(raw: string): JurusanSMK {
  const upper = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!upper) return 'Teknik Komputer dan Jaringan';
  if (JURUSAN_EXACT[upper]) return JURUSAN_EXACT[upper];
  for (const entry of JURUSAN_KEYWORDS) {
    if (entry.keywords.some((kw) => upper.includes(kw))) return entry.jurusan;
  }
  return 'Teknik Komputer dan Jaringan';
}

function normalizeJenisKelamin(raw: string): string {
  const compact = raw.toLowerCase().replace(/[^a-z]/g, '');
  if (!compact) return '';
  if (compact.startsWith('l')) return 'L';
  if (compact.startsWith('p') || compact.includes('perempuan')) return 'P';
  return raw.trim();
}

function normalizeStatusMenikah(raw: string): string {
  const lower = raw.toLowerCase();
  if (!lower) return '';
  if (lower.includes('belum')) return 'BELUM_MENIKAH';
  if (lower.includes('menikah') || lower.includes('kawin')) return 'MENIKAH';
  return raw.trim();
}

function normalizeStatusSekolah(raw: string): string {
  const lower = raw.toLowerCase();
  if (!lower) return '';
  if (lower.includes('negeri')) return 'NEGERI';
  if (lower.includes('swasta')) return 'SWASTA';
  return raw.trim();
}

function normalizeStatusAktivitas(raw: string): string {
  const lower = raw.toLowerCase();
  if (!lower) return '';
  const sambilStudi = lower.includes('sambil') && (lower.includes('studi') || lower.includes('kuliah'));
  if (sambilStudi && lower.includes('wirausaha')) return 'WIRAUSAHA_SAMBIL_STUDI';
  if (sambilStudi && lower.includes('kerja')) return 'BEKERJA_SAMBIL_STUDI';
  if (lower.includes('wirausaha')) return 'WIRAUSAHA';
  if (lower.includes('belum')) return 'BELUM_BEKERJA';
  if (lower.includes('studi') || lower.includes('kuliah')) return 'LANJUT_STUDI';
  if (lower.includes('kerja')) return 'BEKERJA';
  if (lower.includes('lainnya')) return 'LAINNYA';
  return raw.trim();
}

function normalizeKeselarasan(raw: string): string {
  const lower = raw.toLowerCase();
  if (!lower) return '';
  if (lower.includes('sangat')) return 'SANGAT_SESUAI';
  if (lower.includes('kurang')) return 'KURANG_SESUAI';
  if (lower.includes('tidak')) return 'TIDAK_SESUAI';
  if (lower.includes('sesuai')) return 'SESUAI';
  if (lower.includes('berkaitan')) return 'SANGAT_SESUAI';
  return raw.trim();
}

function normalizeSertifikat(raw: string): string {
  const lower = raw.toLowerCase();
  if (!lower) return '';
  if (lower.includes('tidak')) return 'TIDAK_ADA';
  if (lower.includes('bnsp')) return 'BNSP';
  if (lower.includes('sekolah')) return 'SEKOLAH';
  return raw.trim();
}

function normalizeJenjang(raw: string): string {
  const upper = raw.trim().toUpperCase();
  if (!upper) return '';
  if (['D3', 'D4', 'S1', 'S2', 'S3'].includes(upper)) return upper;
  return upper;
}

function parseNumber(raw: string): number | null {
  const digits = raw.replace(/[^0-9.-]/g, '');
  if (!digits) return null;
  const num = Number(digits);
  return Number.isNaN(num) ? null : num;
}

/**
 * Parse isi berkas CSV/TXT berformat kolom Dapodik.
 * Baris dengan NISN invalid dilewati (dihitung pada `skipped`).
 */
export function parseAlumniCsv(content: string): ParseAlumniCsvResult {
  const lines = content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length <= 1) {
    return {
      rows: [],
      skipped: 0,
      headerRecognized: false,
      message: 'Berkas tidak memiliki data atau isi berkas kosong.',
    };
  }

  const delimiter = detectDelimiter(lines[0]);
  const headerKeys = splitLine(lines[0], delimiter).map(mapHeaderToField);
  const headerRecognized = headerKeys.filter((k) => k !== '__skip__').length >= 4;

  // Format lama (tanpa header Dapodik): nisn,nik,nama,jurusan,tahun_lulus,no_wa,email
  const legacyHeaderLine = !headerRecognized && /^\s*nisn\s*[,;\t]/i.test(lines[0]);
  const dataLines = headerRecognized || legacyHeaderLine ? lines.slice(1) : lines;
  const rows: ParsedAlumniRow[] = [];
  let skipped = 0;

  dataLines.forEach((line) => {
    const parts = splitLine(line, delimiter);

    if (!headerRecognized) {
      // Format lama: nisn,nik,nama,jurusan,tahun_lulus,no_wa,email
      const nisn = (parts[0] || '').trim();
      const nama = (parts[2] || '').trim();
      if (!/^\d{10}$/.test(nisn) || !nama) {
        skipped++;
        return;
      }
      const tahunLulus = parseInt(parts[4], 10) || new Date().getFullYear();
      const noHp = (parts[5] || '').trim();
      const email = (parts[6] || '').trim();
      rows.push({
        nisn,
        nama,
        jurusan: matchJurusan(parts[3] || ''),
        tahunLulus,
        noWhatsapp: noHp,
        email,
        dbFields: buildDbFields({
          nisn,
          nama,
          tahunLulus,
          jurusan: matchJurusan(parts[3] || ''),
          noHp,
          email,
        }),
      });
      return;
    }

    const valueByField = new Map<string, string>();
    headerKeys.forEach((key, idx) => {
      if (key === '__skip__') return;
      const value = (parts[idx] || '').trim();
      if (value) valueByField.set(key, value);
    });

    const nisn = valueByField.get('nisn') || '';
    const nama = valueByField.get('nama') || '';
    if (!/^\d{10}$/.test(nisn) || !nama) {
      skipped++;
      return;
    }

    const rawTahun = valueByField.get('tahunLulus') || '';
    const tahunLulus = parseInt(rawTahun, 10);
    const maxTahun = new Date().getFullYear() + 1;
    if (!tahunLulus || tahunLulus < 2003 || tahunLulus > maxTahun) {
      skipped++;
      return;
    }

    const jurusanRaw = valueByField.get('jurusan') || '';
    const jurusan = matchJurusan(jurusanRaw);
    const noHp = valueByField.get('noHp') || '';
    const email = valueByField.get('email') || '';

    rows.push({
      nisn,
      nama,
      jurusan,
      tahunLulus,
      noWhatsapp: noHp,
      email,
      dbFields: buildDbFields({
        nisn,
        nama,
        tahunLulus,
        jurusan,
        jurusanRaw,
        noHp,
        email,
        values: valueByField,
      }),
    });
  });

  if (rows.length === 0) {
    return {
      rows: [],
      skipped,
      headerRecognized,
      message: headerRecognized
        ? 'Tidak ditemukan baris data yang valid. Pastikan kolom NISN (10 digit) dan Nama terisi.'
        : 'Format kolom tidak dikenali. Gunakan berkas dengan header kolom Dapodik (lihat format CSV yang tersedia).',
    };
  }

  return {
    rows,
    skipped,
    headerRecognized,
    message: skipped > 0 ? `${skipped} baris dilewati karena data wajib (NISN/Tahun Lulus) tidak valid.` : undefined,
  };
}

interface BuildDbFieldsInput {
  nisn: string;
  nama: string;
  tahunLulus: number;
  jurusan: JurusanSMK;
  jurusanRaw?: string;
  noHp: string;
  email: string;
  values?: Map<string, string>;
}

/** Susun payload sesuai skema basis data, hanya field yang valid yang dikirim. */
function buildDbFields(input: BuildDbFieldsInput): Record<string, unknown> {
  const { nisn, nama, tahunLulus, jurusan, jurusanRaw, noHp, email } = input;
  const values = input.values || new Map<string, string>();

  const data: Record<string, unknown> = {
    nisn,
    nama: clamp(nama, 'nama'),
    jurusan,
    tahunLulus,
  };

  const text = (field: string) => (values.get(field) || '').trim();

  // No. HP dipakai sebagai nomor WhatsApp untuk pengingat tracer study
  const phone = normalizePhone(noHp);
  if (phone && WA_REGEX.test(phone)) {
    data.noWhatsapp = phone;
    data.noHp = phone;
  }
  if (email && EMAIL_REGEX.test(email) && email.length <= 100) data.email = email;

  const rawText: Array<[string, string]> = [
    ['namaSekolah', text('namaSekolah')],
    ['npsn', text('npsn')],
    ['statusSekolah', normalizeStatusSekolah(text('statusSekolah'))],
    ['kompKeahlian', text('kompKeahlian')],
    ['progKeahlian', (jurusanRaw || text('kompKeahlian')).trim()],
    ['bidKeahlian', text('bidKeahlian')],
    ['statusMenikah', normalizeStatusMenikah(text('statusMenikah'))],
    ['provinsiSmk', text('provinsiSmk')],
    ['kabKotaSmk', text('kabKotaSmk')],
    ['jenisKelamin', normalizeJenisKelamin(text('jenisKelamin'))],
    ['provinsiDomisili', text('provinsiDomisili')],
    ['kotaDomisili', text('kotaDomisili')],
    ['statusAktivitas', normalizeStatusAktivitas(text('statusAktivitas'))],
    ['keterangan', text('keterangan')],
    ['sertifikatKompetensi', normalizeSertifikat(text('sertifikatKompetensi'))],
    ['jabatanKerja', text('jabatanKerja')],
    ['namaTempatKerja', text('namaTempatKerja')],
    ['provinsiKerja', text('provinsiKerja')],
    ['kotaKerja', text('kotaKerja')],
    ['negaraKerja', text('negaraKerja')],
    ['keselarasanKerja', normalizeKeselarasan(text('keselarasanKerja'))],
    ['provinsiUsaha', text('provinsiUsaha')],
    ['kotaUsaha', text('kotaUsaha')],
    ['negaraUsaha', text('negaraUsaha')],
    ['bidangUsaha', text('bidangUsaha')],
    ['jenisUsaha', text('jenisUsaha')],
    ['keselarasanUsaha', normalizeKeselarasan(text('keselarasanUsaha'))],
    ['namaProdukUsaha', text('namaProdukUsaha')],
    ['jenjangPendidikan', normalizeJenjang(text('jenjangPendidikan'))],
    ['namaPerguruanTinggi', text('namaPerguruanTinggi')],
    ['namaProdi', text('namaProdi')],
    ['keselarasanStudi', normalizeKeselarasan(text('keselarasanStudi'))],
    ['pendapatanBekerjaUmp', text('pendapatanBekerjaUmp')],
    ['pendapatanBekerjaUmk', text('pendapatanBekerjaUmk')],
    ['pendapatanWirausahaUmp', text('pendapatanWirausahaUmp')],
    ['pendapatanWirausahaUmk', text('pendapatanWirausahaUmk')],
    ['pendapatanStudiSambilBekerjaUmp', text('pendapatanStudiSambilBekerjaUmp')],
    ['pendapatanStudiSambilBekerjaUmk', text('pendapatanStudiSambilBekerjaUmk')],
    ['pendapatanStudiSambilBerwirausahaUmp', text('pendapatanStudiSambilBerwirausahaUmp')],
    ['pendapatanStudiSambilBerwirausahaUmk', text('pendapatanStudiSambilBerwirausahaUmk')],
  ];

  for (const [field, value] of rawText) {
    if (value) data[field] = clamp(value, field);
  }

  // Field numerik
  const numeric: Array<[string, number | null, number, number]> = [
    ['usia', parseNumber(text('usia')), 15, 100],
    ['lamaProgram', parseNumber(text('lamaProgram')), 1, 6],
    ['masaTungguKerja', parseNumber(text('masaTungguKerja')), 0, 120],
  ];

  for (const [field, parsed, min, max] of numeric) {
    if (parsed !== null && parsed >= min && parsed <= max) {
      data[field] = Math.round(parsed);
    }
  }

  return data;
}

/** Baris contoh data untuk template (urutan sama dengan ALUMNI_CSV_HEADERS). */
const ALUMNI_TEMPLATE_SAMPLE_ROW: string[] = [
  '1',
  '0051234567',
  'Ahmad Dani',
  'SMK Sasmita Jaya 2 Pamulang',
  '20614758',
  'SWASTA',
  '2024',
  'Teknik Komputer Jaringan',
  'Teknik Komputer dan Jaringan',
  'Teknologi Informasi',
  '3',
  'Banten',
  'Tangerang Selatan',
  '18',
  'L',
  'BELUM_MENIKAH',
  'Banten',
  'Tangerang Selatan',
  'ahmaddani@example.com',
  '081298765432',
  'BEKERJA',
  'Bekerja di bidang jaringan komputer',
  '3',
  'BNSP',
  'Technical Support',
  'PT Solusi Teknologi Nusantara',
  'Banten',
  'Tangerang Selatan',
  'Indonesia',
  'SANGAT_SESUAI',
  '', // Provinsi Usaha
  '', // Kota Usaha
  '', // Negara Usaha
  '', // Bidang Usaha
  '', // Jenis Usaha
  '', // Keselarasan Usaha
  '', // Nama Produk Usaha
  '', // Jenjang Pendidikan
  '', // Nama Perguruan Tinggi
  '', // Nama Prodi
  '', // Keselarasan Studi Lanjut
  '1.5', // Pendapatan Bekerja (UMP)
  '2', // Pendapatan Bekerja (UMK)
  '', // Pendapatan Wirausaha (UMP)
  '', // Pendapatan Wirausaha (UMK)
  '', // Pendapatan Studi Sambil Bekerja (UMP)
  '', // Pendapatan Studi Sambil Bekerja (UMK)
  '', // Pendapatan Studi Sambil Berwirausaha (UMP)
  '', // Pendapatan Studi Sambil Berwirausaha (UMK)
];

/** Isi berkas template CSV sesuai format kolom Dapodik. */
export function buildAlumniCsvTemplate(): string {
  const escapeCsv = (value: string) =>
    value.includes(',') ? `"${value.replace(/"/g, '""')}"` : value;

  return [
    ALUMNI_CSV_HEADERS.map(escapeCsv).join(','),
    ALUMNI_TEMPLATE_SAMPLE_ROW.map(escapeCsv).join(','),
  ].join('\n');
}

/** Isi berkas template XLSX (49 kolom Dapodik + 1 baris contoh). */
export function buildAlumniXlsxTemplate(): Blob {
  const aoa: (string)[][] = [
    ALUMNI_CSV_HEADERS.map((h) => h as string),
    ALUMNI_TEMPLATE_SAMPLE_ROW,
  ];
  const worksheet = XLSX.utils.aoa_to_sheet(aoa);
  worksheet['!cols'] = ALUMNI_CSV_HEADERS.map(() => ({ wch: 18 }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Alumni');
  const buffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
  return new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

/**
 * Baca berkas impor (CSV/TXT/XLSX/XLS) menjadi teks CSV.
 * Lembar pertama pada berkas Excel yang diproses.
 */
export async function readAlumniSpreadsheet(file: File): Promise<string> {
  const isExcel = /\.(xlsx|xls)$/i.test(file.name);

  if (!isExcel) {
    return await file.text();
  }

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    throw new Error('Berkas Excel tidak memiliki lembar kerja.');
  }

  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    throw new Error('Berkas Excel tidak memiliki lembar data.');
  }

  const csv = XLSX.utils.sheet_to_csv(sheet, { blankrows: false });
  if (!csv.trim()) {
    throw new Error('Lembar pertama berkas Excel masih kosong.');
  }

  return csv;
}

/** Unduh template data siswa dalam format CSV atau XLSX. */
export function downloadAlumniTemplate(format: 'csv' | 'xlsx', fileName = 'template_data_alumni_smk_sasmita2'): void {
  const blob =
    format === 'xlsx'
      ? buildAlumniXlsxTemplate()
      : new Blob([buildAlumniCsvTemplate()], { type: 'text/csv;charset=utf-8;' });
  const fullName = `${fileName}.${format}`;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fullName);
  link.style.position = 'fixed';
  link.style.top = '-9999px';
  link.style.left = '-9999px';
  link.style.opacity = '0';
  link.style.pointerEvents = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
