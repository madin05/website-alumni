import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { HttpError } from '../utils/errors.js';
import { ApiResponse, errorResponse } from '../utils/response.js';
import { env } from '../../config/env.js';

export async function errorHandler(err: Error, request: FastifyRequest, reply: FastifyReply) {
  request.log.error({ err, url: request.url, method: request.method }, 'Request error');

  if (err instanceof HttpError) {
    const response: ApiResponse = {
      success: false,
      message: err.message,
      errors: err.details as Record<string, string[]> | undefined,
    };
    return reply.status(err.statusCode).send(response);
  }

  // Zod validation errors
  if (err.name === 'ZodError' && 'issues' in err) {
    const zodErr = err as { issues: Array<{ path: (string | number)[]; message: string }> };
    const formatted: Record<string, string[]> = {};
    for (const issue of zodErr.issues) {
      const key = issue.path.join('.');
      if (!formatted[key]) formatted[key] = [];
      formatted[key].push(issue.message);
    }
    return reply.status(400).send(errorResponse('Validasi gagal', formatted));
  }

  // Prisma errors
  const prismaErr = err as unknown as { code?: string; meta?: Record<string, unknown> };
  if (prismaErr.code === 'P2002') {
    const field = (prismaErr.meta?.target as string[])?.join(', ') ?? 'field';
    return reply.status(409).send(errorResponse(`${field} sudah digunakan`, { [field]: ['Data sudah terdaftar'] }));
  }
  if (prismaErr.code === 'P2025') {
    return reply.status(404).send(errorResponse('Data tidak ditemukan'));
  }

  // Generic error
  const statusCode = (err as { statusCode?: number }).statusCode ?? 500;
  const message = env.isProd ? 'Kesalahan server internal' : err.message;
  return reply.status(statusCode).send(errorResponse(message));
}

export function notFoundHandler(request: FastifyRequest, reply: FastifyReply) {
  return reply.status(404).send(errorResponse(`Rute ${request.method} ${request.url} tidak ditemukan`));
}