import { FastifyInstance } from 'fastify';
import { authorize } from '../../core/middleware/auth.js';
import { validateBody, validateQuery, validateParams } from '../../core/middleware/validate.js';
import { newsCreateSchema, newsUpdateSchema, listQuerySchema, idParamSchema } from './schemas.js';
import * as service from './service.js';
import { successResponse, paginatedResponse } from '../../core/utils/response.js';
import { z } from 'zod';

type ListQuery = z.infer<typeof listQuerySchema>;

export async function publicNewsRoutes(app: FastifyInstance) {
  app.get('/public/news', {
    preHandler: validateQuery(listQuerySchema),
  }, async (request, reply) => {
    const query = request.query as ListQuery & { isPublished: true };
    const { data, total, page, limit } = await service.listNews(query);
    return reply.send(paginatedResponse(data, page, limit, total, 'Daftar berita berhasil diambil'));
  });

  app.get('/public/news/:id', {
    preHandler: validateParams(idParamSchema),
  }, async (request, reply) => {
    const params = request.params as { id: string };
    const news = await service.getNews(params.id);
    if (!news.isPublished) throw new Error('Berita tidak dipublikasikan');
    return reply.send(successResponse(news, 'Detail berita berhasil diambil'));
  });
}

export async function newsRoutes(app: FastifyInstance) {
  app.get('/news', {
    preHandler: [authorize('ADMIN_BKK'), validateQuery(listQuerySchema)],
  }, async (request, reply) => {
    const query = request.query as ListQuery;
    const { data, total, page, limit } = await service.listNews(query);
    return reply.send(paginatedResponse(data, page, limit, total, 'Daftar berita berhasil diambil'));
  });

  app.post('/news', {
    preHandler: [authorize('ADMIN_BKK'), validateBody(newsCreateSchema)],
  }, async (request, reply) => {
    const body = request.body as z.infer<typeof newsCreateSchema>;
    const news = await service.createNews(body);
    return reply.status(201).send(successResponse(news, 'Berita berhasil dibuat'));
  });

  app.get('/news/:id', {
    preHandler: [authorize('ADMIN_BKK'), validateParams(idParamSchema)],
  }, async (request, reply) => {
    const params = request.params as { id: string };
    const news = await service.getNews(params.id);
    return reply.send(successResponse(news, 'Detail berita berhasil diambil'));
  });

  app.put('/news/:id', {
    preHandler: [authorize('ADMIN_BKK'), validateParams(idParamSchema), validateBody(newsUpdateSchema)],
  }, async (request, reply) => {
    const params = request.params as { id: string };
    const body = request.body as z.infer<typeof newsUpdateSchema>;
    const news = await service.updateNews(params.id, body);
    return reply.send(successResponse(news, 'Berita berhasil diperbarui'));
  });

  app.delete('/news/:id', {
    preHandler: [authorize('ADMIN_BKK'), validateParams(idParamSchema)],
  }, async (request, reply) => {
    const params = request.params as { id: string };
    await service.deleteNews(params.id);
    return reply.send(successResponse(null, 'Berita berhasil dihapus'));
  });
}