import { prisma } from '../../config/prisma.js';
import { HttpError } from '../../core/utils/errors.js';
import { SettingsUpdateInput } from './schemas.js';

const SINGLETON_ID = 1;

export async function getSettings() {
  let settings = await prisma.adminSettings.findUnique({ where: { id: SINGLETON_ID } });
  if (!settings) {
    settings = await prisma.adminSettings.create({
      data: {
        id: SINGLETON_ID,
        targetQuota: 450,
        targetYear: 2024,
        periodStart: new Date('2026-08-01'),
        periodEnd: new Date('2026-11-30'),
        kepalaSekolah: 'Siti Zubaidah, S.E., S.Pd., M.Pd.I',
        nipKepalaSekolah: '19680514 199303 1 004',
        ketuaBkk: 'Ahmad Fauzi, S.Pd., M.Kom.',
        nipKetuaBkk: '19840219 200902 1 002',
        namaSekolah: 'SMK Sasmita Jaya 2 Pamulang',
        npsn: '20614758',
        alamatSekolah: 'Jl. Surya Kencana No. 1, Pamulang Barat, Kec. Pamulang, Kota Tangerang Selatan, Banten 15417',
        kontakBkk: '0812-8889-7762',
      },
    });
  }
  return settings;
}

export async function updateSettings(input: SettingsUpdateInput) {
  const data: Record<string, unknown> = { ...input };
  if (input.periodStart) data.periodStart = new Date(input.periodStart);
  if (input.periodEnd) data.periodEnd = new Date(input.periodEnd);

  return prisma.adminSettings.update({
    where: { id: SINGLETON_ID },
    data,
  });
}

export async function resetSettings() {
  await prisma.adminSettings.delete({ where: { id: SINGLETON_ID } });
  return getSettings();
}