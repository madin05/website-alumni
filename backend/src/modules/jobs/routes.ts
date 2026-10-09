import { FastifyInstance } from 'fastify';
import { authorize } from '../../core/middleware/auth.js';
import { validateBody, validateQuery, validateParams } from '../../core/middleware/validate.js';
import { jobCreateSchema, jobUpdateSchema, listQuerySchema, idParamSchema } from './schemas.js';
import * as service from './service.js';
import { successResponse, paginatedResponse } from '../../core/utils/response.js';
import { z } from 'zod';

type ListQuery = z.infer<typeof listQuerySchema>;

export async function publicJobsRoutes(app: FastifyInstance) {
  app.get('/public/jobs', {
    preHandler: validateQuery(listQuerySchema),
  }, async (request, reply) => {
    const query = request.query as ListQuery & { isActive: true };
    const { data, total, page, limit } = await service.listJobs(query);
    return reply.send(paginatedResponse(data, page, limit, total, 'Daftar lowongan berhasil diambil'));
  });

  app.get('/public/jobs/:id', {
    preHandler: validateParams(idParamSchema),
  }, async (request, reply) => {
    const params = request.params as { id: string };
    const job = await service.getJob(params.id);
    if (!job.isActive) throw new Error('Lowongan tidak aktif');
    return reply.send(successResponse(job, 'Detail lowongan berhasil diambil'));
  });
}

export async function jobsRoutes(app: FastifyInstance) {
  app.get('/jobs', {
    preHandler: [authorize('ADMIN_BKK'), validateQuery(listQuerySchema)],
  }, async (request, reply) => {
    const query = request.query as ListQuery;
    const { data, total, page, limit } = await service.listJobs(query);
    return reply.send(paginatedResponse(data, page, limit, total, 'Daftar lowongan berhasil diambil'));
  });

  app.post('/jobs', {
    preHandler: [authorize('ADMIN_BKK'), validateBody(jobCreateSchema)],
  }, async (request, reply) => {
    const body = request.body as z.infer<typeof jobCreateSchema>;
    const job = await service.createJob(body);
    return reply.status(201).send(successResponse(job, 'Lowongan berhasil dibuat'));
  });

  app.get('/jobs/:id', {
    preHandler: [authorize('ADMIN_BKK'), validateParams(idParamSchema)],
  }, async (request, reply) => {
    const params = request.params as { id: string };
    const job = await service.getJob(params.id);
    return reply.send(successResponse(job, 'Detail lowongan berhasil diambil'));
  });

  app.put('/jobs/:id', {
    preHandler: [authorize('ADMIN_BKK'), validateParams(idParamSchema), validateBody(jobUpdateSchema)],
  }, async (request, reply) => {
    const params = request.params as { id: string };
    const body = request.body as z.infer<typeof jobUpdateSchema>;
    const job = await service.updateJob(params.id, body);
    return reply.send(successResponse(job, 'Lowongan berhasil diperbarui'));
  });

  app.delete('/jobs/:id', {
    preHandler: [authorize('ADMIN_BKK'), validateParams(idParamSchema)],
  }, async (request, reply) => {
    const params = request.params as { id: string };
    await service.deleteJob(params.id);
    return reply.send(successResponse(null, 'Lowongan berhasil dihapus'));
  });
}