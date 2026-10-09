import { z } from 'zod';

export const settingsUpdateSchema = z.object({
  targetQuota: z.number().int().positive().optional(),
  targetYear: z.number().int().min(2020).max(2030).optional(),
  periodStart: z.string().datetime().optional(),
  periodEnd: z.string().datetime().optional(),
  kepalaSekolah: z.string().min(3).max(120).optional(),
  nipKepalaSekolah: z.string().min(5).max(50).optional(),
  ketuaBkk: z.string().min(3).max(120).optional(),
  nipKetuaBkk: z.string().min(5).max(50).optional(),
  namaSekolah: z.string().min(3).max(150).optional(),
  npsn: z.string().min(5).max(20).optional(),
  alamatSekolah: z.string().min(10).optional(),
  kontakBkk: z.string().min(5).max(50).optional(),
});

export type SettingsUpdateInput = z.infer<typeof settingsUpdateSchema>;