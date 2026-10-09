import { FastifyInstance } from 'fastify';
import { prisma } from '../../config/prisma.js';
import { hashPassword, verifyPassword } from '../../core/utils/password.js';
import { HttpError } from '../../core/utils/errors.js';
import { LoginInput, RegisterInput, ChangePasswordInput } from './schemas.js';

function sanitizeAlumni(alumni: any) {
  const { passwordHash: _, ...safe } = alumni;
  return {
    ...safe,
    nama: safe.namaLengkap,
    tahun_lulus: safe.tahunLulus,
    noWhatsapp: safe.noWhatsApp,
    tracerStatus: safe.tracerStatus,
    submissionId: safe.submissionId,
    submittedAt: safe.submittedAt,
    nik: safe.nik,
    jurusan: safe.jurusan,
    tahunMasuk: safe.tahunMasuk,
    email: safe.email,
    noWhatsApp: safe.noWhatsApp,
    jenisKelamin: safe.jenisKelamin,
    avatarUrl: safe.avatarUrl,
    pekerjaan: safe.pekerjaan,
    kota: safe.kota,
    kampus: safe.kampus,
  };
}

function generateDefaultPassword(nisn: string): string {
  const lastThree = nisn.slice(-3);
  return `alumni${lastThree}`;
}

export async function login(app: FastifyInstance, input: LoginInput) {
  const { identifier, password } = input;

  // Find by NISN or email or NIK
  const alumni = await prisma.alumni.findFirst({
    where: {
      OR: [
        { nisn: identifier },
        { email: identifier },
        { nik: identifier },
      ],
    },
  });

  if (!alumni) {
    throw HttpError.unauthorized('NISN/Email atau password salah');
  }

  // Check password: try stored hash first, then default pattern (alumni + last 3 digits of NISN)
  let valid = await verifyPassword(password, alumni.passwordHash);
  if (!valid) {
    const defaultPassword = generateDefaultPassword(alumni.nisn);
    valid = password === defaultPassword;
  }
  if (!valid) {
    throw HttpError.unauthorized('NISN/Email atau password salah');
  }

  const payload = {
    id: alumni.id,
    nisn: alumni.nisn,
    email: alumni.email,
    role: alumni.role,
  };

  const accessToken = app.jwt.sign(payload, { expiresIn: '15m' });
  const refreshToken = app.jwt.sign(payload, { expiresIn: '7d' });

  return { alumni: sanitizeAlumni(alumni), accessToken, refreshToken };
}

export async function register(app: FastifyInstance, input: RegisterInput) {
  const exists = await prisma.alumni.findFirst({
    where: {
      OR: [
        { nisn: input.nisn },
        { email: input.email },
        ...(input.nik ? [{ nik: input.nik }] : []),
      ],
    },
  });

  if (exists) {
    throw HttpError.conflict('NISN, NIK, atau Email sudah terdaftar');
  }

  const passwordHash = await hashPassword(input.password);

  const alumni = await prisma.alumni.create({
    data: {
      nisn: input.nisn,
      nik: input.nik || '',
      namaLengkap: input.namaLengkap,
      email: input.email,
      passwordHash,
      jurusan: input.jurusan,
      tahunMasuk: input.tahunMasuk,
      tahunLulus: input.tahunLulus,
      noWhatsApp: input.noWhatsApp,
      jenisKelamin: input.jenisKelamin,
      role: 'ALUMNI',
    },
  });

  const payload = {
    id: alumni.id,
    nisn: alumni.nisn,
    email: alumni.email,
    role: alumni.role,
  };

  const accessToken = app.jwt.sign(payload, { expiresIn: '15m' });
  const refreshToken = app.jwt.sign(payload, { expiresIn: '7d' });

  return { alumni: sanitizeAlumni(alumni), accessToken, refreshToken };
}

export async function refreshAccessToken(app: FastifyInstance, refreshToken: string) {
  try {
    const payload = app.jwt.verify<{ id: string; nisn: string; email: string; role: string }>(refreshToken);
    const alumni = await prisma.alumni.findUnique({ where: { id: payload.id } });
    if (!alumni) throw HttpError.unauthorized('User tidak ditemukan');

    const newPayload = {
      id: alumni.id,
      nisn: alumni.nisn,
      email: alumni.email,
      role: alumni.role,
    };

    const accessToken = app.jwt.sign(newPayload, { expiresIn: '15m' });
    const newRefreshToken = app.jwt.sign(newPayload, { expiresIn: '7d' });

    return { accessToken, refreshToken: newRefreshToken };
  } catch {
    throw HttpError.unauthorized('Refresh token tidak valid');
  }
}

export async function getMe(userId: string) {
  const alumni = await prisma.alumni.findUnique({
    where: { id: userId },
    select: {
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
    },
  });

  if (!alumni) {
    throw HttpError.notFound('User tidak ditemukan');
  }

  return sanitizeAlumni(alumni);
}

export async function changePassword(userId: string, input: ChangePasswordInput) {
  const alumni = await prisma.alumni.findUnique({ where: { id: userId } });
  if (!alumni) throw HttpError.notFound('User tidak ditemukan');

  const valid = await verifyPassword(input.currentPassword, alumni.passwordHash);
  if (!valid) throw HttpError.unauthorized('Password saat ini salah');

  const newHash = await hashPassword(input.newPassword);
  await prisma.alumni.update({
    where: { id: userId },
    data: { passwordHash: newHash },
  });

  return { success: true };
}