import { z } from 'zod';

export const messageCreateSchema = z.object({
  nama: z.string().min(2).max(120),
  email: z.string().email(),
  noWhatsApp: z.string().regex(/^(\+62|62|0)8[0-9]{7,11}$/).optional().or(z.literal('')),
  subject: z.string().min(3).max(150),
  message: z.string().min(10),
});

export type MessageCreateInput = z.infer<typeof messageCreateSchema>;

export const messageReplySchema = z.object({
  status: z.enum(['UNREAD', 'FOLLOW_UP', 'RESOLVED']),
  resolvedBy: z.string().optional(),
});

export type MessageReplyInput = z.infer<typeof messageReplySchema>;

export const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(15),
  status: z.enum(['UNREAD', 'FOLLOW_UP', 'RESOLVED']).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'subject', 'nama']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type ListQueryInput = z.infer<typeof listQuerySchema>;

export const idParamSchema = z.object({ id: z.string().cuid() });