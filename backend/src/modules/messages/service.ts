import { prisma } from '../../config/prisma.js';
import { HttpError } from '../../core/utils/errors.js';
import { MessageCreateInput, MessageReplyInput, ListQueryInput } from './schemas.js';

export async function createMessage(input: MessageCreateInput, alumniId?: string) {
  return prisma.supportTicket.create({
    data: {
      ...input,
      alumniId: alumniId ?? null,
    },
  });
}

export async function getMessage(id: string) {
  const message = await prisma.supportTicket.findUnique({
    where: { id },
    include: {
      alumni: {
        select: { id: true, nisn: true, namaLengkap: true, email: true, jurusan: true, tahunLulus: true },
      },
    },
  });
  if (!message) throw HttpError.notFound('Pesan tidak ditemukan');
  return message;
}

export async function listMessages(query: ListQueryInput, userId?: string, role?: string) {
  const { page, limit, status, search, sortBy, sortOrder } = query;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (role === 'ALUMNI' && userId) {
    where.alumniId = userId;
  }
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { nama: { contains: search } },
      { email: { contains: search } },
      { subject: { contains: search } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.supportTicket.findMany({
      where,
      include: {
        alumni: {
          select: { id: true, nisn: true, namaLengkap: true, jurusan: true, tahunLulus: true },
        },
      },
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.supportTicket.count({ where }),
  ]);

  return { data, total, page, limit };
}

export async function updateMessageStatus(id: string, input: MessageReplyInput) {
  const message = await getMessage(id);

  const data: Record<string, unknown> = { status: input.status };
  if (input.status === 'RESOLVED') {
    data.resolvedAt = new Date();
    data.resolvedBy = input.resolvedBy || 'admin';
  }

  return prisma.supportTicket.update({ where: { id }, data });
}

export async function deleteMessage(id: string) {
  await getMessage(id);
  await prisma.supportTicket.delete({ where: { id } });
  return { success: true };
}

export async function getMessageStats() {
  const [total, unread, followUp, resolved] = await Promise.all([
    prisma.supportTicket.count(),
    prisma.supportTicket.count({ where: { status: 'UNREAD' } }),
    prisma.supportTicket.count({ where: { status: 'FOLLOW_UP' } }),
    prisma.supportTicket.count({ where: { status: 'RESOLVED' } }),
  ]);

  return { total, unread, followUp, resolved };
}