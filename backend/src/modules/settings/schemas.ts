import { z } from 'zod';

export const settingsUpdateSchema = z
  .object({
    targetQuota: z.coerce.number().int().positive().optional(),
    targetYear: z.coerce.number().int().min(1990).max(2100).optional(),
    periodStart: z.string().optional().nullable(),
    periodEnd: z.string().optional().nullable(),
    kepalaSekolah: z.string().max(120).optional().nullable(),
    nipKepalaSekolah: z.string().max(50).optional().nullable(),
    ketuaBkk: z.string().max(120).optional().nullable(),
    nipKetuaBkk: z.string().max(50).optional().nullable(),
    namaSekolah: z.string().max(150).optional().nullable(),
    npsn: z.string().max(20).optional().nullable(),
    alamatSekolah: z.string().optional().nullable(),
    kontakBkk: z.string().max(50).optional().nullable(),
  })
  .passthrough();

export type SettingsUpdateInput = z.infer<typeof settingsUpdateSchema>;
