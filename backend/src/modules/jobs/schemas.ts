import { z } from 'zod';

export const jobCreateSchema = z.object({
  title: z.string().min(3).max(100),
  company: z.string().min(2).max(100),
  companyLogo: z.string().url().optional().or(z.literal('')),
  location: z.string().min(2).max(100),
  type: z.enum(['Full-time', 'Internship / Magang', 'Kontrak', 'Part-time']),
  salary: z.string().min(1),
  targetMajors: z.array(z.string()).min(1),
  deadline: z.string().datetime(),
  description: z.string().min(10),
  requirements: z.array(z.string()).min(1),
  contactPerson: z.string().min(2).max(100),
  isBkkPartner: z.boolean().default(false),
});

export type JobCreateInput = z.infer<typeof jobCreateSchema>;

export const jobUpdateSchema = jobCreateSchema.partial();

export type JobUpdateInput = z.infer<typeof jobUpdateSchema>;

export const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(6),
  type: z.string().optional(),
  location: z.string().optional(),
  targetMajor: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  isBkkPartner: z.coerce.boolean().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['postedAt', 'deadline', 'title']).default('postedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type ListQueryInput = z.infer<typeof listQuerySchema>;

export const idParamSchema = z.object({ id: z.string().cuid() });