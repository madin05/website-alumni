import { prisma } from '../../config/prisma.js';
import { HttpError } from '../../core/utils/errors.js';
import { IjazahCreateInput, IjazahUpdateInput, ListQueryInput } from './schemas.js';

export async function createIjazah(input: IjazahCreateInput) {
  const exists = await prisma.ijazah.findFirst({
    where: { OR: [{ nisn: input.nisn }, { nomorIjazah: input.nomorIjazah }, { barcode: input.barcode }] },
  });
  if (exists) throw HttpError.conflict('NISN, Nomor Ijazah, atau Barcode sudah terdaftar');

  return prisma.ijazah.create({
    data: {
      ...input,
      persyaratan: JSON.stringify(input.persyaratan),
      tanggalSiap: input.tanggalSiap ? new Date(input.tanggalSiap) : null,
      tanggalDiambil: input.tanggalDiambil ? new Date(input.tanggalDiambil) : null,
    },
  });
}

export async function getIjazah(id: string) {
  const ijazah = await prisma.ijazah.findUnique({ where: { id } });
  if (!ijazah) throw HttpError.notFound('Data ijazah tidak ditemukan');
  return { ...ijazah, persyaratan: JSON.parse(ijazah.persyaratan) };
}

export async function getIjazahByNisn(nisn: string) {
  const ijazah = await prisma.ijazah.findUnique({ where: { nisn } });
  if (!ijazah) throw HttpError.notFound('Data ijazah tidak ditemukan untuk NISN ini');
  return { ...ijazah, persyaratan: JSON.parse(ijazah.persyaratan) };
}

export async function listIjazah(query: ListQueryInput) {
  const { page, limit, statusPengambilan, tahunLulus, jurusan, search, sortBy, sortOrder } = query;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (statusPengambilan) where.statusPengambilan = statusPengambilan;
  if (tahunLulus) where.tahunLulus = tahunLulus;
  if (jurusan) where.jurusan = jurusan;
  if (search) {
    where.OR = [
      { nama: { contains: search } },
      { nisn: { contains: search } },
      { nomorIjazah: { contains: search } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.ijazah.findMany({ where, skip, take: limit, orderBy: { [sortBy]: sortOrder } }),
    prisma.ijazah.count({ where }),
  ]);

  return { data: data.map((d) => ({ ...d, persyaratan: JSON.parse(d.persyaratan) })), total, page, limit };
}

export async function updateIjazah(id: string, input: IjazahUpdateInput) {
  await getIjazah(id);

  const data: Record<string, unknown> = { ...input };
  if (input.persyaratan) data.persyaratan = JSON.stringify(input.persyaratan);
  if (input.tanggalSiap) data.tanggalSiap = new Date(input.tanggalSiap);
  if (input.tanggalDiambil) data.tanggalDiambil = new Date(input.tanggalDiambil);

  // check unique
  if (input.nisn || input.nomorIjazah || input.barcode) {
    const exists = await prisma.ijazah.findFirst({
      where: { OR: [
        ...(input.nisn ? [{ nisn: input.nisn }] : []),
        ...(input.nomorIjazah ? [{ nomorIjazah: input.nomorIjazah }] : []),
        ...(input.barcode ? [{ barcode: input.barcode }] : []),
      ], NOT: { id } } });
    if (exists) throw HttpError.conflict('NISN, Nomor Ijazah, atau Barcode sudah digunakan');
  }

  return prisma.ijazah.update({ where: { id }, data });
}

export async function deleteIjazah(id: string) {
  await getIjazah(id);
  await prisma.ijazah.delete({ where: { id } });
  return { success: true };
}

export async function getIjazahStats() {
  const [total, siap, diambil, proses, cetak] = await Promise.all([
    prisma.ijazah.count(),
    prisma.ijazah.count({ where: { statusPengambilan: 'SIAP_DIAMBIL' } }),
    prisma.ijazah.count({ where: { statusPengambilan: 'SUDAH_DIAMBIL' } }),
    prisma.ijazah.count({ where: { statusPengambilan: 'PROSES_LEGALISIR' } }),
    prisma.ijazah.count({ where: { statusPengambilan: 'DALAM_PENCETAKAN' } }),
  ]);

  return { total, siapDiambil: siap, sudahDiambil: diambil, prosesLegalisir: proses, dalamPencetakan: cetak };
}