import { FastifyInstance, FastifyRequest } from "fastify";
import { successResponse, errorResponse } from "../../core/utils/response.js";
import * as fs from "fs";
import * as path from "path";

interface DemoLockInfo {
  deviceId: string;
  lockedAt: number;
}

type EnvScope = "production" | "development";

const LOCK_TIMEOUT_MS = 20 * 60 * 1000; // 20 Menit auto-expire jika tidak ada aktivitas/heartbeat

const activeLocks: Record<EnvScope, Record<string, DemoLockInfo>> = {
  production: {},
  development: {},
};

function getLockFilePath(scope: EnvScope): string {
  return path.join(
    process.cwd(),
    scope === "development" ? "active_demo_locks_dev.json" : "active_demo_locks.json"
  );
}

function loadLocksFromDisk(scope: EnvScope) {
  try {
    const file = getLockFilePath(scope);
    if (fs.existsSync(file)) {
      const raw = fs.readFileSync(file, "utf-8");
      const data = JSON.parse(raw);
      if (data && typeof data === "object") {
        Object.assign(activeLocks[scope], data);
      }
    }
  } catch {
    // ignore
  }
}

function saveLocksToDisk(scope: EnvScope) {
  try {
    const file = getLockFilePath(scope);
    fs.writeFileSync(file, JSON.stringify(activeLocks[scope]), "utf-8");
  } catch {
    // ignore
  }
}

// Inisialisasi saat modul dimuat
loadLocksFromDisk("production");
loadLocksFromDisk("development");

function getScope(request: FastifyRequest): EnvScope {
  const envHeader = (request.headers["x-demo-env"] || "").toString().toLowerCase();
  if (envHeader === "development" || envHeader === "dev") return "development";
  const origin = (request.headers["origin"] || request.headers["referer"] || "").toString();
  if (origin.includes("localhost") || origin.includes("127.0.0.1") || origin.includes("192.168.")) {
    return "development";
  }
  return "production";
}

function cleanExpiredLocks(scope: EnvScope) {
  const now = Date.now();
  let changed = false;
  const locks = activeLocks[scope];
  for (const [user, info] of Object.entries(locks)) {
    if (!info || !info.lockedAt || now - info.lockedAt > LOCK_TIMEOUT_MS) {
      delete locks[user];
      changed = true;
    }
  }
  if (changed) {
    saveLocksToDisk(scope);
  }
}

export async function demoRoutes(app: FastifyInstance) {
  // GET /demo/locks
  app.get("/demo/locks", async (request, reply) => {
    const scope = getScope(request);
    cleanExpiredLocks(scope);
    return reply.send(
      successResponse(activeLocks[scope], "Data sesi demo aktif berhasil diambil"),
    );
  });

  // POST /demo/lock
  app.post<{ Body: { username: string; deviceId: string } }>(
    "/demo/lock",
    async (request, reply) => {
      const scope = getScope(request);
      const { username, deviceId } = request.body || {};
      if (!username || !deviceId) {
        return reply
          .status(400)
          .send(errorResponse("Username dan deviceId wajib disertakan"));
      }

      cleanExpiredLocks(scope);
      const cleanUser = username.trim().toLowerCase();
      const existing = activeLocks[scope][cleanUser];

      // Cek jika akun sudah dipakai device lain dalam scope lingkungan yang sama
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

      activeLocks[scope][cleanUser] = {
        deviceId,
        lockedAt: Date.now(),
      };
      saveLocksToDisk(scope);

      return reply.send(
        successResponse(
          activeLocks[scope],
          `Akun ${cleanUser} berhasil dikunci untuk sesi ini`,
        ),
      );
    },
  );

  // POST /demo/heartbeat
  app.post<{ Body: { username: string; deviceId: string } }>(
    "/demo/heartbeat",
    async (request, reply) => {
      const scope = getScope(request);
      const { username, deviceId } = request.body || {};
      if (!username || !deviceId) {
        return reply
          .status(400)
          .send(errorResponse("Username dan deviceId wajib disertakan"));
      }

      cleanExpiredLocks(scope);
      const cleanUser = username.trim().toLowerCase();
      const existing = activeLocks[scope][cleanUser];

      if (existing) {
        if (existing.deviceId === deviceId) {
          existing.lockedAt = Date.now();
          saveLocksToDisk(scope);
          return reply.send(successResponse(activeLocks[scope], "Heartbeat diterima"));
        } else {
          return reply
            .status(409)
            .send(errorResponse(`Akun ${cleanUser} dimiliki oleh perangkat lain`));
        }
      }

      // Jika server sempat restart saat klien masih aktif, pulihkan kunci klien
      activeLocks[scope][cleanUser] = {
        deviceId,
        lockedAt: Date.now(),
      };
      saveLocksToDisk(scope);
      return reply.send(successResponse(activeLocks[scope], "Sesi demo dipulihkan"));
    },
  );

  // POST /demo/unlock
  app.post<{ Body: { username: string; deviceId?: string } }>(
    "/demo/unlock",
    async (request, reply) => {
      const scope = getScope(request);
      const { username } = request.body || {};
      if (!username) {
        return reply
          .status(400)
          .send(errorResponse("Username wajib disertakan"));
      }

      cleanExpiredLocks(scope);
      const cleanUser = username.trim().toLowerCase();
      delete activeLocks[scope][cleanUser];
      saveLocksToDisk(scope);

      return reply.send(
        successResponse(
          activeLocks[scope],
          `Kunci akun ${cleanUser} berhasil dilepas`,
        ),
      );
    },
  );
}
