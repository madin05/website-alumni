import { FastifyInstance } from 'fastify';
import { authorize } from '../../core/middleware/auth.js';
import { validateQuery } from '../../core/middleware/validate.js';
import { reportQuerySchema, publicKeterserapanQuerySchema } from './schemas.js';
import * as service from './service.js';
import { successResponse } from '../../core/utils/response.js';
import { z } from 'zod';

type ReportQuery = z.infer<typeof reportQuerySchema>;

/** Route publik: statistik keterserapan lulusan untuk halaman laporan (tanpa login). */
export async function publicReportsRoutes(app: FastifyInstance) {
  app.get('/public/reports/keterserapan', {
    preHandler: validateQuery(publicKeterserapanQuerySchema),
  }, async (request, reply) => {
    const query = request.query as z.infer<typeof publicKeterserapanQuerySchema>;
    const data = await service.getKeterserapan(query);
    return reply.send(successResponse(data, 'Statistik keterserapan lulusan berhasil diambil'));
  });
}

export async function reportsRoutes(app: FastifyInstance) {
  app.get('/reports/dashboard', { preHandler: authorize('ADMIN_BKK') }, async (request, reply) => {
    const stats = await service.getDashboardStats();
    return reply.send(successResponse(stats, 'Statistik dashboard berhasil diambil'));
  });

  app.get('/reports/tracer-study', {
    preHandler: [authorize('ADMIN_BKK'), validateQuery(reportQuerySchema)],
  }, async (request, reply) => {
    const query = request.query as ReportQuery;
    const data = await service.getDetailedReport(query);
    return reply.send(successResponse(data, 'Laporan detail berhasil diambil'));
  });

  app.get('/reports/tracer-study/export', {
    preHandler: [authorize('ADMIN_BKK'), validateQuery(reportQuerySchema)],
  }, async (request, reply) => {
    const query = request.query as ReportQuery;
    const csv = await service.exportCsv(query);
    const filename = `tracer-study-export-${new Date().toISOString().split('T')[0]}.csv`;
    reply.header('Content-Type', 'text/csv; charset=utf-8');
    reply.header('Content-Disposition', `attachment; filename="${filename}"`);
    return reply.send(csv);
  });
}