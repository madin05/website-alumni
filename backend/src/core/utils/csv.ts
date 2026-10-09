import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

export interface CsvRow {
  [key: string]: string | number | null | undefined;
}

export function parseCsv(content: string, options: { columns?: string[] } = {}): CsvRow[] {
  return parse(content, {
    columns: options.columns ?? true,
    skip_empty_lines: true,
    trim: true,
    cast: true,
  });
}

export function stringifyCsv(rows: CsvRow[], options: { columns?: string[] } = {}): string {
  return stringify(rows, {
    header: true,
    columns: options.columns,
    cast: { boolean: (v) => (v ? 'YA' : 'TIDAK') },
  });
}

export function validateCsvHeaders(content: string, requiredHeaders: string[]): { valid: boolean; missing: string[]; actual: string[] } {
  const lines = content.trim().split('\n');
  const headerLine = lines[0] || '';
  const actual = headerLine.split(',').map((h) => h.trim());
  const missing = requiredHeaders.filter((h) => !actual.includes(h));
  return { valid: missing.length === 0, missing, actual };
}

export const MASTER_ALUMNI_CSV_HEADERS = [
  'nisn',
  'nik',
  'nama',
  'jurusan',
  'tahun_lulus',
  'no_wa',
  'email',
];

export const TRACER_SUBMISSION_CSV_HEADERS = [
  'No',
  'NISN',
  'NIK',
  'Nama Lengkap',
  'Program Keahlian',
  'Tahun Lulus',
  'No WhatsApp',
  'Email',
  'Status Aktivitas',
  'Nama Instansi/Kampus/Usaha',
  'Jabatan/Prodi',
  'Gaji Bulanan',
  'Linieritas Kejuruan',
  'Nama Atasan/HRD',
  'Kontak Atasan/HRD',
  'Skor Relevansi (1-5)',
  'Tanggal Submit',
  'Status Verifikasi',
];