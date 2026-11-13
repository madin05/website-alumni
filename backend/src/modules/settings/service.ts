import { prisma } from '../../config/prisma.js';
import { SettingsUpdateInput } from './schemas.js';

const SINGLETON_ID = 1;

const DEFAULT_SETTINGS_DATA = {
  id: SINGLETON_ID,
  targetQuota: 450,
  targetYear: 2024,
  periodStart: new Date('2026-08-01T00:00:00.000Z'),
  periodEnd: new Date('2026-11-30T23:59:59.999Z'),
  kepalaSekolah: 'Siti Zubaidah, S.E., S.Pd., M.Pd.I',
  nipKepalaSekolah: '19680514 199303 1 004',
  ketuaBkk: 'Ahmad Fauzi, S.Pd., M.Kom.',
  nipKetuaBkk: '19840219 200902 1 002',
  namaSekolah: 'SMKS Sasmita Jaya 2',
  npsn: '20603287',
  alamatSekolah: 'Jl. Surya Kencana No. 1, Pamulang Barat, Kec. Pamulang, Kota Tangerang Selatan, Banten 15417',
  kontakBkk: '0812-8889-7762',
};

export async function getSettings() {
  let settings = await prisma.adminSettings.findUnique({ where: { id: SINGLETON_ID } });
  if (!settings) {
    settings = await prisma.adminSettings.create({
      data: DEFAULT_SETTINGS_DATA,
    });
  }
  return settings;
}

export async function updateSettings(input: SettingsUpdateInput) {
  const updateData: Record<string, any> = {};

  if (input.targetQuota !== undefined) updateData.targetQuota = Number(input.targetQuota);
  if (input.targetYear !== undefined) updateData.targetYear = Number(input.targetYear);

  if (input.periodStart) {
    const d = new Date(input.periodStart);
    if (!isNaN(d.getTime())) updateData.periodStart = d;
  }
  if (input.periodEnd) {
    const d = new Date(input.periodEnd);
    if (!isNaN(d.getTime())) updateData.periodEnd = d;
  }

  if (typeof input.kepalaSekolah === 'string') updateData.kepalaSekolah = input.kepalaSekolah.trim();
  if (typeof input.nipKepalaSekolah === 'string') updateData.nipKepalaSekolah = input.nipKepalaSekolah.trim();
  if (typeof input.ketuaBkk === 'string') updateData.ketuaBkk = input.ketuaBkk.trim();
  if (typeof input.nipKetuaBkk === 'string') updateData.nipKetuaBkk = input.nipKetuaBkk.trim();
  if (typeof input.namaSekolah === 'string') updateData.namaSekolah = input.namaSekolah.trim();
  if (typeof input.npsn === 'string') updateData.npsn = input.npsn.trim();
  if (typeof input.alamatSekolah === 'string') updateData.alamatSekolah = input.alamatSekolah.trim();
  if (typeof input.kontakBkk === 'string') updateData.kontakBkk = input.kontakBkk.trim();

  return prisma.adminSettings.upsert({
    where: { id: SINGLETON_ID },
    update: updateData,
    create: {
      ...DEFAULT_SETTINGS_DATA,
      ...updateData,
    },
  });
}

export async function resetSettings() {
  await prisma.adminSettings.upsert({
    where: { id: SINGLETON_ID },
    update: DEFAULT_SETTINGS_DATA,
    create: DEFAULT_SETTINGS_DATA,
  });
  return getSettings();
}
