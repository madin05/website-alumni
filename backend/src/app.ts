import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import cookie from '@fastify/cookie';
import staticFiles from '@fastify/static';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './core/middleware/errorHandler.js';
import { routes } from './modules/routes';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function buildApp(): Promise<FastifyInstance> {
  const app = fastify({
    logger: {
      level: env.isProd ? 'info' : 'debug',
      transport: !env.isProd ? { target: 'pino-pretty', options: { colorize: true } } : undefined,
    },
    ajv: {
      customOptions: { removeAdditional: 'all' },
    },
  });

  // CORS
  await app.register(cors, {
    origin: env.corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // Helmet
  await app.register(helmet, {
    contentSecurityPolicy: false,
  });

  // Rate limiting
  await app.register(rateLimit, {
    max: 200,
    timeWindow: '1 minute',
    keyGenerator: (req) => req.ip,
  });

  // JWT
  await app.register(jwt, {
    secret: env.JWT_ACCESS_SECRET,
    sign: { expiresIn: env.JWT_ACCESS_EXPIRY },
    cookie: {
      cookieName: 'accessToken',
      signed: false,
    },
  });

  // Cookies
  await app.register(cookie, {
    secret: env.JWT_ACCESS_SECRET,
    parseOptions: { httpOnly: true, secure: env.isProd, sameSite: 'lax' },
  });

  // Static files
  await app.register(staticFiles, {
    root: path.join(__dirname, '..', 'uploads'),
    prefix: '/uploads/',
    decorateReply: false,
  });

  // Health check
  app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  // API routes
  await app.register(routes, { prefix: env.API_PREFIX });

  // Error handlers
  app.setErrorHandler(errorHandler);
  app.setNotFoundHandler(notFoundHandler);

  return app;
}