import { FastifyRequest, FastifyReply } from 'fastify';
import { HttpError } from '../utils/errors.js';
import { Role } from '@prisma/client';

export interface AuthPayload {
  id: string;
  nisn: string;
  email: string;
  role: Role;
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  let token: string | undefined;
  const authHeader = request.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else if ((request as any).cookies?.accessToken) {
    token = (request as any).cookies.accessToken;
  }

  if (!token) {
    throw HttpError.unauthorized('Token akses tidak ditemukan');
  }

  try {
    const payload = request.server.jwt.verify<AuthPayload>(token);
    request.user = payload;
  } catch (err) {
    throw HttpError.unauthorized('Token tidak valid atau kadaluarsa');
  }
}

export function authorize(...allowedRoles: Role[]) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    if (!request.user) {
      throw HttpError.unauthorized('Tidak terautentikasi');
    }
    if (!allowedRoles.includes(request.user.role)) {
      throw HttpError.forbidden('Anda tidak memiliki izin untuk mengakses resource ini');
    }
  };
}

export async function optionalAuth(request: FastifyRequest, reply: FastifyReply) {
  let token: string | undefined;
  const authHeader = request.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else if ((request as any).cookies?.accessToken) {
    token = (request as any).cookies.accessToken;
  }
  if (!token) {
    return;
  }
  try {
    const payload = request.server.jwt.verify<AuthPayload>(token);
    request.user = payload;
  } catch {
    // ignore invalid token for optional auth
  }
}