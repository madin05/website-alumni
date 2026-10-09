import { z } from 'zod';

const JURUSAN_OPTIONS = [
  'Teknik Pemesinan',
  'Teknik Instalasi Tenaga Listrik',
  'Teknik Elektronika Industri',
  'Teknik Kendaraan Ringan Otomotif',
  'Teknik dan Bisnis Sepeda Motor',
  'Teknik Komputer dan Jaringan',
] as const;

export const masterAlumniCreateSchema = z.object({
  nisn: z.string().length(10, 'NISN harus 10 digit').regex(/^\d{10}$/),
  nik: z.string().length(16, 'NIK harus 16 digit').regex(/^\d{16}$/).optional(),
  nama: z.string().min(3).max(100),
  jurusan: z.enum(JURUSAN_OPTIONS),
  tahunLulus: z.number().int().min(2003).max(new Date().getFullYear() + 1),
  noWhatsapp: z.string().regex(/^(\+62|62|0)8[0-9]{7,11}$/, 'Format WhatsApp tidak valid').optional(),
  email: z.string().email('Format email tidak valid').optional(),
});

export type MasterAlumniCreateInput = z.infer<typeof masterAlumniCreateSchema>;

export const masterAlumniUpdateSchema = masterAlumniCreateSchema.partial();

export type MasterAlumniUpdateInput = z.infer<typeof masterAlumniUpdateSchema>;

export const importCsvSchema = z.object({
  records: z.array(masterAlumniCreateSchema).min(1, 'Minimal 1 record'),
  skipDuplicates: z.boolean().default(true),
});

export type ImportCsvInput = z.infer<typeof importCsvSchema>;

export const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(15),
  search: z.string().optional(),
  jurusan: z.string().optional(),
  statusTracer: z.enum(['SUDAH', 'BELUM']).optional(),
  tahunLulus: z.coerce.number().int().optional(),
  sortBy: z.enum(['nama', 'nisn', 'tahunLulus', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type ListQueryInput = z.infer<typeof listQuerySchema>;