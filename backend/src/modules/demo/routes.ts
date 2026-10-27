import { FastifyInstance } from "fastify";
import { successResponse, errorResponse } from "../../core/utils/response.js";
import * as fs from "fs";
import * as path from "path";

interface DemoLockInfo {
  deviceId: string;
  lockedAt: number;
}

const LOCK_TIMEOUT_MS = 20 * 60 * 1000; // 20 Menit auto-expire jika tidak ada aktivitas/heartbeat
const activeLocks: Record<string, DemoLockInfo> = {};

const LOCK_FILE = path.join(process.cwd(), "active_demo_locks.json");

function loadLocksFromDisk() {
  try {
    if (fs.existsSync(LOCK_FILE)) {
      const raw = fs.readFileSync(LOCK_FILE, "utf-8");
      const data = JSON.parse(raw);
      if (data && typeof data === "object") {
        Object.assign(activeLocks, data);
      }
    }
  } catch {
    // ignore
  }
}

function saveLocksToDisk() {
  try {
    fs.writeFileSync(LOCK_FILE, JSON.stringify(activeLocks), "utf-8");
  } catch {
    // ignore
  }
}

// Inisialisasi saat modul dimuat
loadLocksFromDisk();

function cleanExpiredLocks() {
  const now = Date.now();
  let changed = false;
  for (const [user, info] of Object.entries(activeLocks)) {
    if (!info || !info.lockedAt || now - info.lockedAt > LOCK_TIMEOUT_MS) {
      delete activeLocks[user];
      changed = true;
    }
  }
  if (changed) {
    saveLocksToDisk();
  }
}

export async function demoRoutes(app: FastifyInstance) {
  // GET /demo/locks
  app.get("/demo/locks", async (_request, reply) => {
    cleanExpiredLocks();
    return reply.send(
      successResponse(activeLocks, "Data sesi demo aktif berhasil diambil"),
    );
  });

  // POST /demo/lock
  app.post<{ Body: { username: string; deviceId: string } }>(
    "/demo/lock",
    async (request, reply) => {
      const { username, deviceId } = request.body || {};
      if (!username || !deviceId) {
        return reply
          .status(400)
          .send(errorResponse("Username dan deviceId wajib disertakan"));
      }

      cleanExpiredLocks();
      const cleanUser = username.trim().toLowerCase();
      const existing = activeLocks[cleanUser];

      // Cek jika akun sudah dipakai device lain
      if (
        existing &&
        existing.deviceId !== deviceId &&
        Date.now() - existing.lockedAt < LOCK_TIMEOUT_MS
      ) {
        return reply
          .status(409)
          .send(
            errorResponse(
              `Akun ${cleanUser} sedang digunakan oleh audiens lain. Silakan pilih user demo lain.`,
            ),
          );
      }

      activeLocks[cleanUser] = {
        deviceId,
        lockedAt: Date.now(),
      };
      saveLocksToDisk();

      return reply.send(
        successResponse(
          activeLocks,
          `Akun ${cleanUser} berhasil dikunci untuk sesi ini`,
        ),
      );
    },
  );

  // POST /demo/heartbeat
  app.post<{ Body: { username: string; deviceId: string } }>(
    "/demo/heartbeat",
    async (request, reply) => {
      const { username, deviceId } = request.body || {};
      if (!username || !deviceId) {
        return reply
          .status(400)
          .send(errorResponse("Username dan deviceId wajib disertakan"));
      }

      cleanExpiredLocks();
      const cleanUser = username.trim().toLowerCase();
      const existing = activeLocks[cleanUser];

      if (existing) {
        if (existing.deviceId === deviceId) {
          existing.lockedAt = Date.now();
          saveLocksToDisk();
          return reply.send(successResponse(activeLocks, "Heartbeat diterima"));
        } else {
          return reply
            .status(409)
            .send(errorResponse(`Akun ${cleanUser} dimiliki oleh perangkat lain`));
        }
      }

      // Jika server sempat restart saat klien masih aktif, pulihkan kunci klien
      activeLocks[cleanUser] = {
        deviceId,
        lockedAt: Date.now(),
      };
      saveLocksToDisk();
      return reply.send(successResponse(activeLocks, "Sesi demo dipulihkan"));
    },
  );

  // POST /demo/unlock
  app.post<{ Body: { username: string; deviceId?: string } }>(
    "/demo/unlock",
    async (request, reply) => {
      const { username } = request.body || {};
      if (!username) {
        return reply
          .status(400)
          .send(errorResponse("Username wajib disertakan"));
      }

      cleanExpiredLocks();
      const cleanUser = username.trim().toLowerCase();
      delete activeLocks[cleanUser];
      saveLocksToDisk();

      return reply.send(
        successResponse(
          activeLocks,
          `Kunci akun ${cleanUser} berhasil dilepas`,
        ),
      );
    },
  );
}
