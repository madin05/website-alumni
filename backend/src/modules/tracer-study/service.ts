import { prisma } from '../../config/prisma.js';
import { HttpError } from '../../core/utils/errors.js';
import { TracerSubmitInput, ListQueryInput } from './schemas.js';
import { StatusKegiatan } from '@prisma/client';
import { Prisma } from '@prisma/client';

function generateSubmissionCode(): string {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000).toString();
  return `${year}${month}${random}`;
}

export async function submitTracer(userId: string, input: TracerSubmitInput) {
  const alumni = await prisma.alumni.findUnique({ where: { id: userId } });
  if (!alumni) throw HttpError.notFound('Alumni tidak ditemukan');

  const existing = await prisma.tracerSubmission.findFirst({
    where: { alumniId: userId },
    orderBy: { submittedAt: 'desc' },
  });

  if (existing && existing.verificationStatus !== 'REVISI') {
    throw HttpError.conflict('Anda sudah mengirimkan kuesioner tracer study');
  }

  const submission = await prisma.$transaction(async (tx) => {
    if (existing && existing.verificationStatus === 'REVISI') {
      const sub = await tx.tracerSubmission.update({
        where: { id: existing.id },
        data: {
          statusKegiatan: input.status_kegiatan as StatusKegiatan,
          masaTunggu: input.masa_tunggu ?? null,
          detailKerja: input.detail_kerja ?? Prisma.JsonNull,
          detailKuliah: input.detail_kuliah ?? Prisma.JsonNull,
          detailUsaha: input.detail_usaha ?? Prisma.JsonNull,
          evaluasi: input.evaluasi,
          verificationStatus: 'PENDING',
          verificationNote: null,
          verifiedAt: null,
          verifiedBy: null,
          submittedAt: new Date(),
        },
      });

      await tx.alumni.update({
        where: { id: userId },
        data: {
          tracerStatus: 'SUDAH',
          submissionId: sub.submissionId,
          submittedAt: sub.submittedAt,
        },
      });

      return sub;
    }

    const submissionId = generateSubmissionCode();
    const sub = await tx.tracerSubmission.create({
      data: {
        alumniId: userId,
        statusKegiatan: input.status_kegiatan as StatusKegiatan,
        masaTunggu: input.masa_tunggu ?? null,
        detailKerja: input.detail_kerja ?? Prisma.JsonNull,
        detailKuliah: input.detail_kuliah ?? Prisma.JsonNull,
        detailUsaha: input.detail_usaha ?? Prisma.JsonNull,
        evaluasi: input.evaluasi,
        submissionId,
      },
    });

    await tx.alumni.update({
      where: { id: userId },
      data: {
        tracerStatus: 'SUDAH',
        submissionId,
        submittedAt: new Date(),
      },
    });

    return sub;
  });

  return {
    submissionId: submission.submissionId,
    submittedAt: submission.submittedAt,
    submission_id: submission.submissionId,
    submitted_at: submission.submittedAt,
  };
}

export async function getMySubmission(userId: string) {
  const submission = await prisma.tracerSubmission.findFirst({
    where: { alumniId: userId },
    orderBy: { submittedAt: 'desc' },
  });

  if (!submission) return null;

  return {
    ...submission,
    detailKerja: submission.detailKerja as Record<string, unknown> | null,
    detailKuliah: submission.detailKuliah as Record<string, unknown> | null,
    detailUsaha: submission.detailUsaha as Record<string, unknown> | null,
    evaluasi: submission.evaluasi as Record<string, unknown>,
  };
}

export async function listSubmissions(query: ListQueryInput) {
  const { page, limit, statusKegiatan, verificationStatus, tahunLulus, jurusan, search, sortBy, sortOrder } = query;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (statusKegiatan) where.statusKegiatan = statusKegiatan;
  if (verificationStatus) where.verificationStatus = verificationStatus;
  if (tahunLulus) where.alumni = { tahunLulus };
  if (jurusan) where.alumni = { ...(where.alumni as object), jurusan };
  if (search) {
    where.OR = [
      { alumni: { namaLengkap: { contains: search } } },
      { alumni: { nisn: { contains: search } } },
      { submissionId: { contains: search } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.tracerSubmission.findMany({
      where,
      include: {
        alumni: {
          select: { id: true, nisn: true, namaLengkap: true, jurusan: true, tahunLulus: true, email: true, noWhatsApp: true },
        },
      },
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.tracerSubmission.count({ where }),
  ]);

  return {
    data: data.map((s) => ({
      ...s,
      detailKerja: s.detailKerja as Record<string, unknown> | null,
      detailKuliah: s.detailKuliah as Record<string, unknown> | null,
      detailUsaha: s.detailUsaha as Record<string, unknown> | null,
      evaluasi: s.evaluasi as Record<string, unknown>,
    })),
    total,
    page,
    limit,
  };
}

export async function getSubmissionById(id: string) {
  const submission = await prisma.tracerSubmission.findUnique({
    where: { id },
    include: {
      alumni: {
        select: { id: true, nisn: true, nik: true, namaLengkap: true, email: true, jurusan: true, tahunMasuk: true, tahunLulus: true, noWhatsApp: true, jenisKelamin: true },
      },
    },
  });

  if (!submission) throw HttpError.notFound('Submission tidak ditemukan');

  return {
    ...submission,
    detailKerja: submission.detailKerja as Record<string, unknown> | null,
    detailKuliah: submission.detailKuliah as Record<string, unknown> | null,
    detailUsaha: submission.detailUsaha as Record<string, unknown> | null,
    evaluasi: submission.evaluasi as Record<string, unknown>,
  };
}

export async function getSubmissionByCode(submissionId: string) {
  const submission = await prisma.tracerSubmission.findUnique({
    where: { submissionId },
    include: {
      alumni: {
        select: { id: true, nisn: true, nik: true, namaLengkap: true, email: true, jurusan: true, tahunMasuk: true, tahunLulus: true, noWhatsApp: true, jenisKelamin: true },
      },
    },
  });

  if (!submission) throw HttpError.notFound('Submission tidak ditemukan');

  return {
    ...submission,
    detailKerja: submission.detailKerja as Record<string, unknown> | null,
    detailKuliah: submission.detailKuliah as Record<string, unknown> | null,
    detailUsaha: submission.detailUsaha as Record<string, unknown> | null,
    evaluasi: submission.evaluasi as Record<string, unknown>,
  };
}

export async function getStats() {
  const [total, byStatus, byVerification, byJurusan] = await Promise.all([
    prisma.tracerSubmission.count(),
    prisma.tracerSubmission.groupBy({ by: ['statusKegiatan'], _count: true }),
    prisma.tracerSubmission.groupBy({ by: ['verificationStatus'], _count: true }),
    prisma.tracerSubmission.findMany({ include: { alumni: { select: { jurusan: true } } } }),
  ]);

  const jurusanCount: Record<string, number> = {};
  for (const s of byJurusan) {
    jurusanCount[s.alumni.jurusan] = (jurusanCount[s.alumni.jurusan] || 0) + 1;
  }

  return {
    total,
    byStatus: byStatus.map((s) => ({ status: s.statusKegiatan, count: s._count })),
    byVerification: byVerification.map((v) => ({ status: v.verificationStatus, count: v._count })),
    byJurusan: Object.entries(jurusanCount).map(([jurusan, count]) => ({ jurusan, count })),
  };
}