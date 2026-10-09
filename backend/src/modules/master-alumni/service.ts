import { prisma } from '../../config/prisma.js';
import { HttpError } from '../../core/utils/errors.js';
import { MasterAlumniCreateInput, MasterAlumniUpdateInput, ImportCsvInput, ListQueryInput } from './schemas.js';
import { TracerStatus } from '@prisma/client';
import { hashPassword } from '../../core/utils/password.js';

async function mapCreateInput(input: MasterAlumniCreateInput) {
  const defaultPassword = input.nisn || 'alumni123';
  const passwordHash = await hashPassword(defaultPassword);

  const data: Record<string, any> = {
    nisn: input.nisn,
    namaLengkap: input.nama,
    jurusan: input.jurusan,
    tahunMasuk: input.tahunLulus - 3,
    tahunLulus: input.tahunLulus,
    passwordHash,
    role: 'ALUMNI' as const,
    tracerStatus: 'BELUM' as TracerStatus,
  };

  if (input.nik && input.nik.trim()) data.nik = input.nik.trim();
  if (input.noWhatsapp && input.noWhatsapp.trim()) data.noWhatsApp = input.noWhatsapp.trim();
  if (input.email && input.email.trim()) data.email = input.email.trim();

  return data;
}

function mapUpdateInput(input: MasterAlumniUpdateInput) {
  const data: Record<string, unknown> = {};
  if (input.nisn) data.nisn = input.nisn;
  if (input.nik) data.nik = input.nik;
  if (input.nama) data.namaLengkap = input.nama;
  if (input.email) data.email = input.email;
  if (input.jurusan) data.jurusan = input.jurusan;
  if (input.tahunLulus) data.tahunLulus = input.tahunLulus;
  if (input.noWhatsapp) data.noWhatsApp = input.noWhatsapp;
  return data;
}

export async function createMasterAlumni(input: MasterAlumniCreateInput) {
  const orConditions: Array<Record<string, string>> = [
    { nisn: input.nisn },
  ];

  if (input.nik && input.nik.trim() !== '') {
    orConditions.push({ nik: input.nik });
  }

  if (input.email && input.email.trim() !== '') {
    orConditions.push({ email: input.email });
  }

  const exists = await prisma.alumni.findFirst({
    where: { OR: orConditions },
  });

  if (exists) {
    const conflictingFields = [];
    if (exists.nisn === input.nisn) conflictingFields.push('NISN');
    if (input.nik && exists.nik === input.nik) conflictingFields.push('NIK');
    if (input.email && exists.email === input.email) conflictingFields.push('Email');
    
    throw HttpError.conflict(`${conflictingFields.join(', ')} sudah terdaftar`);
  }

  return prisma.alumni.create({
    data: await mapCreateInput(input),
    select: selectFields(),
  });
}

export async function getMasterAlumni(id: string) {
  const alumni = await prisma.alumni.findUnique({
    where: { id },
    select: selectFields(),
  });

  if (!alumni) throw HttpError.notFound('Data alumni tidak ditemukan');
  return alumni;
}

export async function listMasterAlumni(query: ListQueryInput) {
  const { page, limit, search, jurusan, statusTracer, tahunLulus, sortBy, sortOrder } = query;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {
    role: 'ALUMNI',
  };

  if (search) {
    where.OR = [
      { namaLengkap: { contains: search } },
      { nisn: { contains: search } },
      { nik: { contains: search } },
      { email: { contains: search } },
    ];
  }
  if (jurusan) where.jurusan = jurusan;
  if (statusTracer) where.tracerStatus = statusTracer as TracerStatus;
  if (tahunLulus) where.tahunLulus = tahunLulus;

  const [data, total] = await Promise.all([
    prisma.alumni.findMany({
      where,
      select: selectFields(),
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.alumni.count({ where }),
  ]);

  return { data, total, page, limit };
}

export async function updateMasterAlumni(id: string, input: MasterAlumniUpdateInput) {
  await getMasterAlumni(id);

  const orConditions: Array<Record<string, string>> = [];

  if (input.nisn && input.nisn.trim() !== '') {
    orConditions.push({ nisn: input.nisn });
  }
  if (input.nik && input.nik.trim() !== '') {
    orConditions.push({ nik: input.nik });
  }
  if (input.email && input.email.trim() !== '') {
    orConditions.push({ email: input.email });
  }

  if (orConditions.length > 0) {
    const exists = await prisma.alumni.findFirst({
      where: {
        OR: orConditions,
        NOT: { id },
      },
    });
    if (exists) {
      const conflictingFields = [];
      if (input.nisn && exists.nisn === input.nisn) conflictingFields.push('NISN');
      if (input.nik && exists.nik === input.nik) conflictingFields.push('NIK');
      if (input.email && exists.email === input.email) conflictingFields.push('Email');
      throw HttpError.conflict(`${conflictingFields.join(', ')} sudah digunakan`);
    }
  }

  return prisma.alumni.update({
    where: { id },
    data: mapUpdateInput(input),
    select: selectFields(),
  });
}

export async function deleteMasterAlumni(id: string) {
  await getMasterAlumni(id);
  await prisma.alumni.delete({ where: { id } });
  return { success: true };
}

export async function importMasterAlumni(input: ImportCsvInput) {
  const { records, skipDuplicates } = input;
  let imported = 0;
  let duplicates = 0;

  for (const record of records) {
    try {
      await createMasterAlumni(record);
      imported++;
    } catch (err) {
      if (err instanceof HttpError && err.code === 'CONFLICT') {
        duplicates++;
        if (!skipDuplicates) throw err;
      } else {
        throw err;
      }
    }
  }

  return { importedCount: imported, duplicateCount: duplicates };
}

export async function getStats() {
  const [total, sudah, belum, byJurusan, byTahun] = await Promise.all([
    prisma.alumni.count({ where: { role: 'ALUMNI' } }),
    prisma.alumni.count({ where: { role: 'ALUMNI', tracerStatus: 'SUDAH' } }),
    prisma.alumni.count({ where: { role: 'ALUMNI', tracerStatus: 'BELUM' } }),
    prisma.alumni.groupBy({
      by: ['jurusan'],
      where: { role: 'ALUMNI' },
      _count: true,
    }),
    prisma.alumni.groupBy({
      by: ['tahunLulus'],
      where: { role: 'ALUMNI' },
      _count: true,
    }),
  ]);

  return {
    total,
    sudahMengisi: sudah,
    belumMengisi: belum,
    responseRate: total > 0 ? Math.round((sudah / total) * 100) : 0,
    byJurusan: byJurusan.map((j) => ({ jurusan: j.jurusan, count: j._count })),
    byTahun: byTahun.map((t) => ({ tahun: t.tahunLulus, count: t._count })),
  };
}

function selectFields() {
  return {
    id: true,
    nisn: true,
    nik: true,
    namaLengkap: true,
    email: true,
    jurusan: true,
    tahunMasuk: true,
    tahunLulus: true,
    noWhatsApp: true,
    role: true,
    tracerStatus: true,
    submissionId: true,
    submittedAt: true,
    jenisKelamin: true,
    avatarUrl: true,
    pekerjaan: true,
    kota: true,
    kampus: true,
    createdAt: true,
    updatedAt: true,
  };
}