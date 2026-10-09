import { FastifyInstance } from 'fastify';
import { authenticate, authorize } from '../../core/middleware/auth.js';
import { validateBody, validateQuery, validateParams } from '../../core/middleware/validate.js';
import { messageCreateSchema, messageReplySchema, listQuerySchema, idParamSchema } from './schemas.js';
import * as service from './service.js';
import { successResponse, paginatedResponse } from '../../core/utils/response.js';
import { z } from 'zod';

type ListQuery = z.infer<typeof listQuerySchema>;

export async function publicMessagesRoutes(app: FastifyInstance) {
  app.post('/messages', {
    preHandler: validateBody(messageCreateSchema),
  }, async (request, reply) => {
    let alumniId: string | undefined;
    try {
      await request.jwtVerify();
      alumniId = (request as any).user?.id;
    } catch {
      // not authenticated
    }

    const body = request.body as z.infer<typeof messageCreateSchema>;
    const message = await service.createMessage(body, alumniId);
    return reply.status(201).send(successResponse(message, 'Pesan berhasil dikirim'));
  });
}

export async function messagesRoutes(app: FastifyInstance) {
  app.get('/messages/me', {
    preHandler: [authenticate, validateQuery(listQuerySchema)],
  }, async (request, reply) => {
    const query = request.query as ListQuery;
    const user = (request as any).user;
    const { data, total, page, limit } = await service.listMessages(query, user?.id, user?.role);
    return reply.send(paginatedResponse(data, page, limit, total, 'Daftar pesan Anda'));
  });

  app.get('/messages/me/:id', {
    preHandler: [authenticate, validateParams(idParamSchema)],
  }, async (request, reply) => {
    const params = request.params as { id: string };
    const user = (request as any).user;
    const message = await service.getMessage(params.id);
    if (message.alumniId !== user?.id && user?.role !== 'ADMIN_BKK') {
      throw new Error('Akses ditolak');
    }
    return reply.send(successResponse(message, 'Detail pesan'));
  });

  app.get('/messages', {
    preHandler: [authorize('ADMIN_BKK'), validateQuery(listQuerySchema)],
  }, async (request, reply) => {
    const query = request.query as ListQuery;
    const { data, total, page, limit } = await service.listMessages(query);
    return reply.send(paginatedResponse(data, page, limit, total, 'Daftar pesan berhasil diambil'));
  });

  app.get('/messages/stats', { preHandler: authorize('ADMIN_BKK') }, async (request, reply) => {
    const stats = await service.getMessageStats();
    return reply.send(successResponse(stats, 'Statistik pesan berhasil diambil'));
  });

  app.get('/messages/:id', {
    preHandler: [authorize('ADMIN_BKK'), validateParams(idParamSchema)],
  }, async (request, reply) => {
    const params = request.params as { id: string };
    const message = await service.getMessage(params.id);
    return reply.send(successResponse(message, 'Detail pesan berhasil diambil'));
  });

  app.put('/messages/:id', {
    preHandler: [authorize('ADMIN_BKK'), validateParams(idParamSchema), validateBody(messageReplySchema)],
  }, async (request, reply) => {
    const params = request.params as { id: string };
    const body = request.body as z.infer<typeof messageReplySchema>;
    const message = await service.updateMessageStatus(params.id, body);
    return reply.send(successResponse(message, 'Status pesan berhasil diperbarui'));
  });

  app.delete('/messages/:id', {
    preHandler: [authorize('ADMIN_BKK'), validateParams(idParamSchema)],
  }, async (request, reply) => {
    const params = request.params as { id: string };
    await service.deleteMessage(params.id);
    return reply.send(successResponse(null, 'Pesan berhasil dihapus'));
  });
}