import { prisma } from '../../config/prisma.js';
import { ReportQueryInput } from './schemas.js';
import { stringifyCsv, TRACER_SUBMISSION_CSV_HEADERS } from '../../core/utils/csv.js';

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