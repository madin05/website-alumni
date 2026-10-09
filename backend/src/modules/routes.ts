import { FastifyInstance } from 'fastify';
import { authRoutes } from './auth/routes';
import { masterAlumniRoutes, publicMasterAlumniRoutes } from './master-alumni/routes';
import { tracerStudyRoutes } from './tracer-study/routes';
import { verificationRoutes } from './verification/routes';
import { jobsRoutes, publicJobsRoutes } from './jobs/routes';
import { newsRoutes, publicNewsRoutes } from './news/routes';
import { messagesRoutes, publicMessagesRoutes } from './messages/routes';
import { ijazahRoutes, publicIjazahRoutes } from './ijazah/routes';
import { settingsRoutes } from './settings/routes';
import { reportsRoutes } from './reports/routes';
import { AuthPayload } from '../core/middleware/auth.js';

export async function routes(app: FastifyInstance) {
  // Auth (public)
  await app.register(authRoutes);

  // Public routes (no auth required)
  await app.register(publicMasterAlumniRoutes);
  await app.register(publicJobsRoutes);
  await app.register(publicNewsRoutes);
  await app.register(publicMessagesRoutes);
  await app.register(publicIjazahRoutes);

  // Protected routes (require authentication)
  await app.register(async function (protectedApp) {
    protectedApp.addHook('preHandler', async (request) => {
      // Check Authorization header first
      const authHeader = request.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7);
        try {
          const payload = protectedApp.jwt.verify<AuthPayload>(token);
          request.user = payload;
          return;
        } catch {
          // Fall through to cookie check
        }
      }
      // Fallback to cookie
      await request.jwtVerify();
    });

    protectedApp.register(masterAlumniRoutes);
    protectedApp.register(tracerStudyRoutes);
    protectedApp.register(verificationRoutes);
    protectedApp.register(jobsRoutes);
    protectedApp.register(newsRoutes);
    protectedApp.register(messagesRoutes);
    protectedApp.register(ijazahRoutes);
    protectedApp.register(settingsRoutes);
    protectedApp.register(reportsRoutes);
  });
}