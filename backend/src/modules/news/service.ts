import { prisma } from '../../config/prisma.js';
import { HttpError } from '../../core/utils/errors.js';
import { NewsCreateInput, NewsUpdateInput, ListQueryInput } from './schemas.js';

export async function createNews(input: NewsCreateInput) {
  return prisma.newsItem.create({
    data: {
      ...input,
      date: input.date ? new Date(input.date) : new Date(),
    },
  });
}

export async function getNews(id: string) {
  const news = await prisma.newsItem.findUnique({ where: { id } });
  if (!news) throw HttpError.notFound('Berita tidak ditemukan');
  return news;
}

export async function listNews(query: ListQueryInput) {
  const { page, limit, category, isPublished, search, sortBy, sortOrder } = query;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (category) where.category = category;
  if (isPublished !== undefined) where.isPublished = isPublished;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { excerpt: { contains: search } },
      { content: { contains: search } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.newsItem.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.newsItem.count({ where }),
  ]);

  return { data, total, page, limit };
}

export async function updateNews(id: string, input: NewsUpdateInput) {
  await getNews(id);
  const data: Record<string, unknown> = { ...input };
  if (input.date) data.date = new Date(input.date);
  return prisma.newsItem.update({ where: { id }, data });
}

export async function deleteNews(id: string) {
  await getNews(id);
  await prisma.newsItem.delete({ where: { id } });
  return { success: true };
}