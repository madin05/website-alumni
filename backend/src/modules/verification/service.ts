import { prisma } from '../../config/prisma.js';
import { HttpError } from '../../core/utils/errors.js';
import { UpdateVerificationInput, ListQueryInput } from './schemas.js';
import { VerificationStatus } from '@prisma/client';

export async function updateVerification(idOrCode: string, input: UpdateVerificationInput, verifiedBy: string) {
  const submission = await prisma.tracerSubmission.findFirst({
    where: { OR: [{ id: idOrCode }, { submissionId: idOrCode }] },
  });
  if (!submission) throw HttpError.notFound('Submission tidak ditemukan');

  const id = submission.id;

  const data: Record<string, unknown> = {
    verificationStatus: input.verificationStatus,
  };

  if (input.verificationNote !== undefined) {
    data.verificationNote = input.verificationNote;
  }

  if (input.verificationStatus === 'PENDING') {
    data.verifiedAt = null;
    data.verifiedBy = null;
  } else if (input.verificationStatus === 'VALID' || input.verificationStatus === 'REVISI') {
    data.verifiedAt = new Date();
    data.verifiedBy = verifiedBy;
  }

  const updated = await prisma.tracerSubmission.update({
    where: { id },
    data,
    include: {
      alumni: {
        select: {
          id: true,
          nisn: true,
          namaLengkap: true,
          email: true,
          jurusan: true,
          tahunLulus: true,
          noWhatsApp: true,
        },
      },
    },
  });

  // Kirim notifikasi/tiket otomatis ke alumni jika status VALID atau REVISI
  if (updated.alumni && (input.verificationStatus === 'VALID' || input.verificationStatus === 'REVISI')) {
    const isVal = input.verificationStatus === 'VALID';
    const noteText = input.verificationNote ? `\n\nCatatan Verifikator: "${input.verificationNote}"` : '';
    await prisma.supportTicket.create({
      data: {
        alumniId: updated.alumni.id,
        nama: 'Sistem Verifikasi BKK',
        email: 'bkk@smksasmitajaya2.sch.id',
        noWhatsApp: updated.alumni.noWhatsApp || '',
        subject: isVal
          ? `[Verifikasi Selesai] Tracer Study Anda Telah Divalidasi (${submission.submissionId})`
          : `[Perlu Revisi] Catatan Verifikasi Tracer Study (${submission.submissionId})`,
        message: isVal
          ? `Selamat! Kuesioner Tracer Study dengan ID ${submission.submissionId} telah berhasil diverifikasi oleh Tim BKK.${noteText}`
          : `Kuesioner Tracer Study Anda dengan ID ${submission.submissionId} memerlukan revisi. Silakan periksa kembali dan kirimkan pembaruan.${noteText}`,
        status: 'UNREAD',
      },
    }).catch(() => {
      // Non-blocking notification
    });
  }

  return {
    ...updated,
    detailKerja: updated.detailKerja as Record<string, unknown> | null,
    detailKuliah: updated.detailKuliah as Record<string, unknown> | null,
    detailUsaha: updated.detailUsaha as Record<string, unknown> | null,
    evaluasi: updated.evaluasi as Record<string, unknown>,
  };
}

export async function listPendingVerifications(query: ListQueryInput) {
  const { page, limit, verificationStatus, statusKegiatan, search, sortBy, sortOrder } = query;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (verificationStatus) where.verificationStatus = verificationStatus;
  if (statusKegiatan) where.statusKegiatan = statusKegiatan;
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
          select: {
            id: true,
            nisn: true,
            namaLengkap: true,
            jurusan: true,
            tahunLulus: true,
            email: true,
            noWhatsApp: true,
          },
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

export async function getVerificationStats() {
  const [total, pending, valid, revisi, byStatus] = await Promise.all([
    prisma.tracerSubmission.count(),
    prisma.tracerSubmission.count({ where: { verificationStatus: 'PENDING' } }),
    prisma.tracerSubmission.count({ where: { verificationStatus: 'VALID' } }),
    prisma.tracerSubmission.count({ where: { verificationStatus: 'REVISI' } }),
    prisma.tracerSubmission.groupBy({ by: ['verificationStatus'], _count: true }),
  ]);

  return {
    total,
    pending,
    valid,
    revisi,
    byStatus: byStatus.map((s) => ({ status: s.verificationStatus, count: s._count })),
  };
}