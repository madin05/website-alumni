import { FastifyInstance } from 'fastify';
import { authenticate, authorize } from '../../core/middleware/auth.js';
import { validateBody, validateQuery, validateParams } from '../../core/middleware/validate.js';
import { ijazahCreateSchema, ijazahUpdateSchema, listQuerySchema, idParamSchema, nisnParamSchema } from './schemas.js';
import * as service from './service.js';
import { successResponse, paginatedResponse } from '../../core/utils/response.js';
import { z } from 'zod';

type ListQuery = z.infer<typeof listQuerySchema>;

export async function publicIjazahRoutes(app: FastifyInstance) {
  app.get('/ijazah/me', { preHandler: authenticate }, async (request, reply) => {
    const user = (request as any).user;
    const ijazah = await service.getIjazahByNisn(user.nisn);
    return reply.send(successResponse(ijazah, 'Data ijazah berhasil diambil'));
  });

  app.get('/ijazah/nisn/:nisn', {
    preHandler: validateParams(nisnParamSchema),
  }, async (request, reply) => {
    const params = request.params as { nisn: string };
    const ijazah = await service.getIjazahByNisn(params.nisn);
    return reply.send(successResponse(ijazah, 'Detail ijazah berhasil diambil'));
  });
}

export async function ijazahRoutes(app: FastifyInstance) {
  app.get('/ijazah/stats', { preHandler: authorize('ADMIN_BKK') }, async (request, reply) => {
    const stats = await service.getIjazahStats();
    return reply.send(successResponse(stats, 'Statistik ijazah berhasil diambil'));
  });

  app.get('/ijazah', {
    preHandler: [authorize('ADMIN_BKK'), validateQuery(listQuerySchema)],
  }, async (request, reply) => {
    const query = request.query as ListQuery;
    const { data, total, page, limit } = await service.listIjazah(query);
    return reply.send(paginatedResponse(data, page, limit, total, 'Daftar ijazah berhasil diambil'));
  });

  app.post('/ijazah', {
    preHandler: [authorize('ADMIN_BKK'), validateBody(ijazahCreateSchema)],
  }, async (request, reply) => {
    const body = request.body as z.infer<typeof ijazahCreateSchema>;
    const ijazah = await service.createIjazah(body);
    return reply.status(201).send(successResponse(ijazah, 'Data ijazah berhasil ditambahkan'));
  });

  app.get('/ijazah/:id', {
    preHandler: [authorize('ADMIN_BKK'), validateParams(idParamSchema)],
  }, async (request, reply) => {
    const params = request.params as { id: string };
    const ijazah = await service.getIjazah(params.id);
    return reply.send(successResponse(ijazah, 'Detail ijazah berhasil diambil'));
  });

  app.put('/ijazah/:id', {
    preHandler: [authorize('ADMIN_BKK'), validateParams(idParamSchema), validateBody(ijazahUpdateSchema)],
  }, async (request, reply) => {
    const params = request.params as { id: string };
    const body = request.body as z.infer<typeof ijazahUpdateSchema>;
    const ijazah = await service.updateIjazah(params.id, body);
    return reply.send(successResponse(ijazah, 'Data ijazah berhasil diperbarui'));
  });

  app.delete('/ijazah/:id', {
    preHandler: [authorize('ADMIN_BKK'), validateParams(idParamSchema)],
  }, async (request, reply) => {
    const params = request.params as { id: string };
    await service.deleteIjazah(params.id);
    return reply.send(successResponse(null, 'Data ijazah berhasil dihapus'));
  });
}