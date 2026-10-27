import { FastifyInstance } from 'fastify';
import { successResponse, errorResponse } from '../../core/utils/response.js';

interface DemoLockInfo {
  deviceId: string;
  lockedAt: number;
}

const LOCK_TIMEOUT_MS = 20 * 60 * 1000; // 20 Menit auto-expire
const activeLocks: Record<string, DemoLockInfo> = {};

function cleanExpiredLocks() {
  const now = Date.now();
  for (const [user, info] of Object.entries(activeLocks)) {
    if (!info || !info.lockedAt || now - info.lockedAt > LOCK_TIMEOUT_MS) {
      delete activeLocks[user];
    }
  }
}

export async function demoRoutes(app: FastifyInstance) {
  // GET /demo/locks
  app.get('/demo/locks', async (_request, reply) => {
    cleanExpiredLocks();
    return reply.send(successResponse(activeLocks, 'Data sesi demo aktif berhasil diambil'));
  });

  // POST /demo/lock
  app.post<{ Body: { username: string; deviceId: string } }>('/demo/lock', async (request, reply) => {
    const { username, deviceId } = request.body || {};
    if (!username || !deviceId) {
      return reply.status(400).send(errorResponse('Username dan deviceId wajib disertakan'));
    }

    cleanExpiredLocks();
    const cleanUser = username.trim().toLowerCase();
    const existing = activeLocks[cleanUser];

    // Cek jika akun sudah dipakai device lain
    if (existing && existing.deviceId !== deviceId && Date.now() - existing.lockedAt < LOCK_TIMEOUT_MS) {
      return reply.status(409).send(
        errorResponse(`Akun ${cleanUser} sedang digunakan oleh audiens lain. Silakan pilih user demo lain.`)
      );
    }

    activeLocks[cleanUser] = {
      deviceId,
      lockedAt: Date.now(),
    };

    return reply.send(successResponse(activeLocks, `Akun ${cleanUser} berhasil dikunci untuk sesi ini`));
  });

  // POST /demo/unlock
  app.post<{ Body: { username: string; deviceId?: string } }>('/demo/unlock', async (request, reply) => {
    const { username } = request.body || {};
    if (!username) {
      return reply.status(400).send(errorResponse('Username wajib disertakan'));
    }

    cleanExpiredLocks();
    const cleanUser = username.trim().toLowerCase();
    delete activeLocks[cleanUser];

    return reply.send(successResponse(activeLocks, `Kunci akun ${cleanUser} berhasil dilepas`));
  });
}

