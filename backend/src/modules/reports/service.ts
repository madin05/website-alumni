import { prisma } from '../../config/prisma.js';
import { ReportQueryInput, PublicKeterserapanQuery } from './schemas.js';
import { stringifyCsv, TRACER_SUBMISSION_CSV_HEADERS } from '../../core/utils/csv.js';

// Kata kunci perusahaan multinasional / global
const MULTINATIONAL_KEYWORDS = [
  'international',
  'inter national',
  'global',
  'multinasional',
  'worldwide',
  'corporation',
  'corp',
  'asia pacific',
  'toyota',
  'suzuki',
  'honda',
  'yamaha',
  'komatsu',
  'daikin',
  'panasonic',
  'sharp',
  'epson',
  'omron',
  'schneider',
  'siemens',
  'samsung',
  'lg electronics',
  'toshiba',
  'hyundai',
  'mitsubishi',
  'nissan',
  'isuzu',
  'hino',
  'unilever',
  'oto multiartha',
];

// Kata kunci perusahaan nasional / BUMN
const NASIONAL_KEYWORDS = [
  'bumn',
  'persero',
  'pt pln',
  'pln',
  'telkom',
  'telkomsel',
  'pt. bri',
  'bank rakyat',
  'bni',
  'mandiri',
  'pertamina',
  'pupuk',
  'pelindo',
  'pos indonesia',
  'pt pos',
  'kereta api',
  'kai',
  'jasa marga',
  'angkasa pura',
  'damri',
  'bpjs',
  'djp',
  'antar group',
  'tkdn',
  'tbk',
  'pt kereta',
];

type SkalaKerja = 'lokal' | 'nasional' | 'multinasional';

/** Klasifikasi skala perusahaan berdasarkan nama instansi (heuristic). */
function classifySkalaKerja(namaPerusahaan: string | undefined): SkalaKerja | null {
  if (!namaPerusahaan) return null;
  const lower = namaPerusahaan.toLowerCase();
  if (MULTINATIONAL_KEYWORDS.some((kw) => lower.includes(kw))) return 'multinasional';
  if (NASIONAL_KEYWORDS.some((kw) => lower.includes(kw))) return 'nasional';
  return 'lokal';
}

/** Normalisasi nilai kesesuaian jurusan (mendukung format lama & baru). */
function normalizeKesesuaian(raw: unknown): 'sangatSesuai' | 'sesuai' | 'kurangSesuai' | 'tidakSesuai' | null {
  if (typeof raw !== 'string' || !raw.trim()) return null;
  const lower = raw.toLowerCase();
  if (lower.includes('sangat')) return 'sangatSesuai';
  if (lower.includes('tidak')) return 'tidakSesuai';
  if (lower.includes('kurang')) return 'kurangSesuai';
  if (lower.includes('sesuai')) return 'sesuai';
  return null;
}

/** Status kegiatan dikelompokkan secara eksklusif (bekerja > kuliah > wirausaha > belum). */
type AktivitasKey = 'bekerja' | 'kuliah' | 'wirausaha' | 'belumKerja' | 'lainnya';

function classifyAktivitas(statusKegiatan: string): AktivitasKey {
  const s = statusKegiatan.toUpperCase();
  if (s.includes('KERJA')) return 'bekerja';
  if (s.includes('WIRAUSAHA')) return 'wirausaha';
  if (s.includes('KULIAH')) return 'kuliah';
  if (s === 'BELUM_KERJA') return 'belumKerja';
  return 'lainnya';
}

/**
 * Statistik keterserapan lulusan untuk halaman publik.
 * Semua angka dihitung langsung dari basis data (bukan data contoh).
 */
export async function getKeterserapan(query: PublicKeterserapanQuery) {
  const alumniFilter: Record<string, unknown> = { role: 'ALUMNI' };
  if (query.jurusan) alumniFilter.jurusan = query.jurusan;
  if (query.tahunLulus) alumniFilter.tahunLulus = query.tahunLulus;

  const [totalAlumni, alumniList, allSubmissions] = await Promise.all([
    prisma.alumni.count({ where: alumniFilter }),
    prisma.alumni.findMany({
      where: alumniFilter,
      select: { jurusan: true, tahunLulus: true },
    }),
    prisma.tracerSubmission.findMany({
      where: { alumni: alumniFilter },
      select: {
        alumniId: true,
        statusKegiatan: true,
        detailKerja: true,
        submittedAt: true,
        alumni: { select: { jurusan: true, tahunLulus: true } },
      },
      orderBy: { submittedAt: 'desc' },
    }),
  ]);

  // Satu alumni dihitung satu kali (ambil submisi terbaru bila alumni
  // pernah mengisi kuesioner lebih dari sekali).
  const latestByAlumni = new Map<string, (typeof allSubmissions)[number]>();
  for (const s of allSubmissions) {
    if (!latestByAlumni.has(s.alumniId)) latestByAlumni.set(s.alumniId, s);
  }
  const submissions = Array.from(latestByAlumni.values());

  const aktivitas: Record<AktivitasKey, number> = {
    bekerja: 0,
    kuliah: 0,
    wirausaha: 0,
    belumKerja: 0,
    lainnya: 0,
  };
  const kesesuaian = { sangatSesuai: 0, sesuai: 0, kurangSesuai: 0, tidakSesuai: 0 };
  const skalaKerja = { lokal: 0, nasional: 0, multinasional: 0, wirausaha: 0 };

  for (const s of submissions) {
    aktivitas[classifyAktivitas(s.statusKegiatan)]++;

    const detailKerja = (s.detailKerja || {}) as Record<string, unknown>;
    const isWirausaha = s.statusKegiatan.toUpperCase().includes('WIRAUSAHA');

    if (isWirausaha) {
      skalaKerja.wirausaha++;
    } else if (classifyAktivitas(s.statusKegiatan) === 'bekerja') {
      const skala = classifySkalaKerja(detailKerja.nama_perusahaan as string | undefined);
      if (skala) skalaKerja[skala]++;
    }

    const kesesuaianKey = normalizeKesesuaian(detailKerja.kesesuaian_jurusan);
    if (kesesuaianKey) kesesuaian[kesesuaianKey]++;
  }

  interface JurusanAccumulator {
    jurusan: string;
    tahunLulus: number;
    totalAlumni: number;
    mengisiTracer: number;
    bekerja: number;
    kuliah: number;
    wirausaha: number;
    belumKerja: number;
    lainnya: number;
    kesesuaian: { sangatSesuai: number; sesuai: number; kurangSesuai: number; tidakSesuai: number };
    skalaKerja: { lokal: number; nasional: number; multinasional: number; wirausaha: number };
  }

  const emptyAccumulator = (jurusan: string, tahunLulus: number): JurusanAccumulator => ({
    jurusan,
    tahunLulus,
    totalAlumni: 0,
    mengisiTracer: 0,
    bekerja: 0,
    kuliah: 0,
    wirausaha: 0,
    belumKerja: 0,
    lainnya: 0,
    kesesuaian: { sangatSesuai: 0, sesuai: 0, kurangSesuai: 0, tidakSesuai: 0 },
    skalaKerja: { lokal: 0, nasional: 0, multinasional: 0, wirausaha: 0 },
  });

  const jurusanMap = new Map<string, JurusanAccumulator>();
  const keyOf = (jurusan: string, tahunLulus: number) => `${jurusan}|${tahunLulus}`;

  for (const a of alumniList) {
    const key = keyOf(a.jurusan, a.tahunLulus);
    const current = jurusanMap.get(key) || emptyAccumulator(a.jurusan, a.tahunLulus);
    current.totalAlumni++;
    jurusanMap.set(key, current);
  }

  for (const s of submissions) {
    const key = keyOf(s.alumni.jurusan, s.alumni.tahunLulus);
    const current = jurusanMap.get(key) || emptyAccumulator(s.alumni.jurusan, s.alumni.tahunLulus);
    current.mengisiTracer++;

    const aktivitasKey = classifyAktivitas(s.statusKegiatan);
    if (aktivitasKey === 'lainnya') current.lainnya++;
    else current[aktivitasKey]++;

    const detailKerja = (s.detailKerja || {}) as Record<string, unknown>;
    const isWirausaha = s.statusKegiatan.toUpperCase().includes('WIRAUSAHA');
    if (isWirausaha) current.skalaKerja.wirausaha++;
    else if (aktivitasKey === 'bekerja') {
      const skala = classifySkalaKerja(detailKerja.nama_perusahaan as string | undefined);
      if (skala) current.skalaKerja[skala]++;
    }
    const kesesuaianKey = normalizeKesesuaian(detailKerja.kesesuaian_jurusan);
    if (kesesuaianKey) current.kesesuaian[kesesuaianKey]++;

    jurusanMap.set(key, current);
  }

  const byJurusan = Array.from(jurusanMap.values()).sort((a, b) => {
    if (a.jurusan !== b.jurusan) return a.jurusan.localeCompare(b.jurusan);
    return b.tahunLulus - a.tahunLulus;
  });

  const totalResponden = submissions.length;

  return {
    totalAlumni,
    totalResponden,
    responseRate: totalAlumni > 0 ? Math.round((totalResponden / totalAlumni) * 1000) / 10 : 0,
    aktivitas,
    kesesuaian,
    skalaKerja,
    byJurusan,
    perbaruPada: new Date().toISOString(),
  };
}

export async function getDashboardStats() {
  const [totalAlumni, totalSubmissions, pendingVerif, validVerif, revisiVerif] = await Promise.all([
    prisma.alumni.count({ where: { role: 'ALUMNI' } }),
    prisma.tracerSubmission.count(),
    prisma.tracerSubmission.count({ where: { verificationStatus: 'PENDING' } }),
    prisma.tracerSubmission.count({ where: { verificationStatus: 'VALID' } }),
    prisma.tracerSubmission.count({ where: { verificationStatus: 'REVISI' } }),
  ]);

  const bmwData = await prisma.tracerSubmission.groupBy({ by: ['statusKegiatan'], _count: true });
  const bmw: Record<string, number> = {};
  for (const d of bmwData) bmw[d.statusKegiatan] = d._count;

  const jurusanData = await prisma.tracerSubmission.findMany({
    include: { alumni: { select: { jurusan: true } } },
  });
  const byJurusan: Record<string, { total: number; kerja: number; kuliah: number; wirausaha: number }> = {};
  for (const s of jurusanData) {
    if (!byJurusan[s.alumni.jurusan]) byJurusan[s.alumni.jurusan] = { total: 0, kerja: 0, kuliah: 0, wirausaha: 0 };
    byJurusan[s.alumni.jurusan].total++;
    if (s.statusKegiatan.includes('KERJA')) byJurusan[s.alumni.jurusan].kerja++;
    if (s.statusKegiatan.includes('KULIAH')) byJurusan[s.alumni.jurusan].kuliah++;
    if (s.statusKegiatan.includes('WIRAUSAHA')) byJurusan[s.alumni.jurusan].wirausaha++;
  }

  const sudah = await prisma.alumni.count({ where: { role: 'ALUMNI', tracerStatus: 'SUDAH' } });
  const responseRate = totalAlumni > 0 ? Math.round((sudah / totalAlumni) * 100) : 0;

  return {
    totalAlumni,
    totalSubmissions,
    responseRate,
    verification: { pending: pendingVerif, valid: validVerif, revisi: revisiVerif },
    bmw,
    byJurusan,
  };
}

export async function getDetailedReport(query: ReportQueryInput) {
  const where: Record<string, unknown> = {};
  if (query.tahunLulus) where.alumni = { ...(where.alumni as object), tahunLulus: query.tahunLulus };
  if (query.jurusan) where.alumni = { ...(where.alumni as object), jurusan: query.jurusan };
  if (query.statusKegiatan) where.statusKegiatan = query.statusKegiatan;
  if (query.verificationStatus) where.verificationStatus = query.verificationStatus;

  const submissions = await prisma.tracerSubmission.findMany({
    where,
    include: {
      alumni: {
        select: {
          nisn: true,
          nik: true,
          namaLengkap: true,
          jurusan: true,
          tahunLulus: true,
          noWhatsApp: true,
          email: true,
        },
      },
    },
    orderBy: { submittedAt: 'desc' },
  });

  return submissions.map((s) => ({
    submissionId: s.submissionId,
    nisn: s.alumni.nisn,
    nik: s.alumni.nik,
    nama: s.alumni.namaLengkap,
    jurusan: s.alumni.jurusan,
    tahunLulus: s.alumni.tahunLulus,
    noWhatsApp: s.alumni.noWhatsApp,
    email: s.alumni.email,
    statusKegiatan: s.statusKegiatan,
    instansi: extractInstansi(s),
    jabatan: extractJabatan(s),
    gaji: extractGaji(s),
    linieritas: extractLinieritas(s),
    atasan: extractAtasan(s),
    kontakAtasan: extractKontakAtasan(s),
    skorRelevansi: (s.evaluasi as Record<string, unknown>)?.skor_relevansi ?? '-',
    submittedAt: s.submittedAt.toISOString().split('T')[0],
    verificationStatus: s.verificationStatus,
  }));
}

export async function exportCsv(query: ReportQueryInput): Promise<string> {
  const data = await getDetailedReport(query);
  const rows: Array<Record<string, unknown>> = data.map((d, idx) => ({
    No: idx + 1,
    NISN: d.nisn,
    NIK: d.nik,
    'Nama Lengkap': d.nama,
    'Program Keahlian': d.jurusan,
    'Tahun Lulus': d.tahunLulus,
    'No WhatsApp': d.noWhatsApp,
    Email: d.email,
    'Status Aktivitas': d.statusKegiatan,
    'Nama Instansi/Kampus/Usaha': d.instansi,
    'Jabatan/Prodi': d.jabatan,
    'Gaji Bulanan': d.gaji,
    'Linieritas Kejuruan': d.linieritas,
    'Nama Atasan/HRD': d.atasan,
    'Kontak Atasan/HRD': d.kontakAtasan,
    'Skor Relevansi (1-5)': d.skorRelevansi,
    'Tanggal Submit': d.submittedAt,
    'Status Verifikasi': d.verificationStatus,
  }));
  return stringifyCsv(rows as Array<Record<string, string | number | null | undefined>>, { columns: TRACER_SUBMISSION_CSV_HEADERS });
}

function extractInstansi(s: { statusKegiatan: string; detailKerja: unknown; detailKuliah: unknown; detailUsaha: unknown }): string {
  if (s.statusKegiatan.includes('KERJA') && s.detailKerja) {
    return (s.detailKerja as Record<string, unknown>)?.nama_perusahaan as string ?? '-';
  }
  if (s.statusKegiatan.includes('KULIAH') && s.detailKuliah) {
    return (s.detailKuliah as Record<string, unknown>)?.nama_kampus as string ?? '-';
  }
  if (s.statusKegiatan.includes('WIRAUSAHA') && s.detailUsaha) {
    return (s.detailUsaha as Record<string, unknown>)?.nama_usaha as string ?? '-';
  }
  return '-';
}

function extractJabatan(s: { statusKegiatan: string; detailKerja: unknown; detailKuliah: unknown; detailUsaha: unknown }): string {
  if (s.statusKegiatan.includes('KERJA') && s.detailKerja) {
    return (s.detailKerja as Record<string, unknown>)?.jabatan as string ?? '-';
  }
  if (s.statusKegiatan.includes('KULIAH') && s.detailKuliah) {
    return (s.detailKuliah as Record<string, unknown>)?.program_studi as string ?? '-';
  }
  if (s.statusKegiatan.includes('WIRAUSAHA') && s.detailUsaha) {
    return (s.detailUsaha as Record<string, unknown>)?.bidang_usaha as string ?? '-';
  }
  return '-';
}

function extractGaji(s: { detailKerja: unknown }): string {
  if (s.detailKerja) return (s.detailKerja as Record<string, unknown>)?.kisaran_penghasilan as string ?? '-';
  return '-';
}

function extractLinieritas(s: { detailKerja: unknown }): string {
  if (s.detailKerja) return (s.detailKerja as Record<string, unknown>)?.kesesuaian_jurusan as string ?? '-';
  return '-';
}

function extractAtasan(s: { detailKerja: unknown }): string {
  if (s.detailKerja) return (s.detailKerja as Record<string, unknown>)?.nama_atasan as string ?? '-';
  return '-';
}

function extractKontakAtasan(s: { detailKerja: unknown }): string {
  if (s.detailKerja) return (s.detailKerja as Record<string, unknown>)?.kontak_atasan as string ?? '-';
  return '-';
}