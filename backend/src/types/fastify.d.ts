import 'fastify';
import { Role } from '@prisma/client';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string;
      nisn: string;
      email: string;
      role: Role;
    };
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      id: string;
      nisn: string;
      email: string;
      role: Role;
    };
    user: {
      id: string;
      nisn: string;
      email: string;
      role: Role;
    };
  }
}

declare module '@fastify/rate-limit' {
  interface FastifyRateLimitOptions {
    max: number;
    timeWindow: string;
  }
}