import { z } from 'zod';

export const reportQuerySchema = z.object({
  tahunLulus: z.coerce.number().int().optional(),
  jurusan: z.string().optional(),
  statusKegiatan: z.string().optional(),
  verificationStatus: z.enum(['PENDING', 'VALID', 'REVISI']).optional(),
});

export type ReportQueryInput = z.infer<typeof reportQuerySchema>;

export const publicKeterserapanQuerySchema = z.object({
  tahunLulus: z.coerce.number().int().optional(),
  jurusan: z.string().optional(),
});

export type PublicKeterserapanQuery = z.infer<typeof publicKeterserapanQuerySchema>;