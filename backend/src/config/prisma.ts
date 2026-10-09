import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.isProd ? ['error'] : ['error', 'warn'],
    datasources: {
      db: {
        url: env.DATABASE_URL,
      },
    },
  });

if (!env.isProd) {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown
if (typeof process !== 'undefined') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
}