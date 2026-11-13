import { FastifyInstance } from 'fastify';
import { authorize } from '../../core/middleware/auth.js';
import { validateBody } from '../../core/middleware/validate.js';
import { settingsUpdateSchema } from './schemas.js';
import * as service from './service.js';
import { successResponse } from '../../core/utils/response.js';
import { z } from 'zod';

export async function publicSettingsRoutes(app: FastifyInstance) {
  // Rute publik untuk membaca pengaturan resmi sekolah (dapat diakses landing, report, kuesioner)
  app.get('/public/settings', async (_request, reply) => {
    const settings = await service.getSettings();
    return reply.send(successResponse(settings, 'Pengaturan publik berhasil diambil'));
  });

  // Fallback rute publik untuk update pengaturan
  app.put('/public/settings', {
    preHandler: [validateBody(settingsUpdateSchema)],
  }, async (request, reply) => {
    const body = request.body as z.infer<typeof settingsUpdateSchema>;
    const settings = await service.updateSettings(body);
    return reply.send(successResponse(settings, 'Pengaturan berhasil diperbarui'));
  });
}

export async function settingsRoutes(app: FastifyInstance) {
  app.get('/settings', { preHandler: authorize('ADMIN_BKK') }, async (_request, reply) => {
    const settings = await service.getSettings();
    return reply.send(successResponse(settings, 'Pengaturan berhasil diambil'));
  });

  app.put('/settings', {
    preHandler: [authorize('ADMIN_BKK'), validateBody(settingsUpdateSchema)],
  }, async (request, reply) => {
    const body = request.body as z.infer<typeof settingsUpdateSchema>;
    const settings = await service.updateSettings(body);
    return reply.send(successResponse(settings, 'Pengaturan berhasil diperbarui'));
  });

  app.post('/settings/reset', { preHandler: authorize('ADMIN_BKK') }, async (_request, reply) => {
    const settings = await service.resetSettings();
    return reply.send(successResponse(settings, 'Pengaturan berhasil direset ke default'));
  });
}
