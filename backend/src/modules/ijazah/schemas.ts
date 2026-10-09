import { z } from 'zod';

export const ijazahCreateSchema = z.object({
  nisn: z.string().length(10).regex(/^\d{10}$/),
  nama: z.string().min(3).max(100),
  jurusan: z.string().min(2).max(50),
  tahunLulus: z.number().int().min(2003).max(new Date().getFullYear() + 1),
  statusPengambilan: z.enum(['SIAP_DIAMBIL', 'SUDAH_DIAMBIL', 'PROSES_LEGALISIR', 'DALAM_PENCETAKAN']),
  nomorIjazah: z.string().min(5).max(50),
  nomorSertifikatBnsp: z.string().optional(),
  tanggalSiap: z.string().datetime().optional(),
  tanggalDiambil: z.string().datetime().optional(),
  lokasiPengambilan: z.string().min(3).max(100),
  persyaratan: z.array(z.string()).default([]),
  barcode: z.string().min(5).max(50),
});

export type IjazahCreateInput = z.infer<typeof ijazahCreateSchema>;

export const ijazahUpdateSchema = ijazahCreateSchema.partial();

export type IjazahUpdateInput = z.infer<typeof ijazahUpdateSchema>;

export const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(15),
  statusPengambilan: z.string().optional(),
  tahunLulus: z.coerce.number().int().optional(),
  jurusan: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'tahunLulus', 'nama']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type ListQueryInput = z.infer<typeof listQuerySchema>;

export const idParamSchema = z.object({ id: z.string().cuid() });
export const nisnParamSchema = z.object({ nisn: z.string().length(10).regex(/^\d{10}$/) });