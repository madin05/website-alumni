/**
 * Demo Session Service:
 * Mengelola penguncian akun demo (user01 - user30) agar tidak dapat digunakan
 * bersamaan oleh audiens yang berbeda secara realtime (Cross-Device, Cross-Tab & Cloud Sync).
 */

const STORAGE_KEY = 'alumni_demo_active_locks';
const DEVICE_KEY = 'alumni_demo_device_id';
const LOCK_TIMEOUT_MS = 20 * 60 * 1000; // 20 Menit auto-expire jika tab ditutup tanpa logout

const API_BASE = (import.meta as any).env?.VITE_API_URL || '';

export interface DemoLockInfo {
  deviceId: string;
  lockedAt: number;
}

export type DemoLocksMap = Record<string, DemoLockInfo>;

export function getDeviceId(): string {
  if (typeof window === 'undefined') return 'server';
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = `dev-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

function cleanExpiredLocks(locks: DemoLocksMap): DemoLocksMap {
  const now = Date.now();
  const cleaned: DemoLocksMap = {};
  for (const [user, info] of Object.entries(locks)) {
    if (info && info.lockedAt && now - info.lockedAt < LOCK_TIMEOUT_MS) {
      cleaned[user] = info;
    }
  }
  return cleaned;
}

export function getLocalDemoLocks(): DemoLocksMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return cleanExpiredLocks(JSON.parse(raw));
  } catch {
    return {};
  }
}

export function setLocalDemoLocks(locks: DemoLocksMap): void {
  if (typeof window === 'undefined') return;
  const cleaned = cleanExpiredLocks(locks);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
  } catch (err) {
    console.warn('[DemoSession] LocalStorage save error:', err);
  }
}

let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel('alumni_demo_session_channel');
  } catch {
    // ignore
  }
}

/**
 * Rekonsiliasi state penguncian:
 * Server backend Fastify adalah sumber kebenaran absolut (Authoritative Source of Truth).
 * Kunci remote yang sudah dilepas/dihapus di server WAJIB langsung terhapus dari localStorage.
 */
function reconcileLocks(serverLocks: DemoLocksMap | null): DemoLocksMap {
  const myDeviceId = getDeviceId();
  const local = getLocalDemoLocks();
  const now = Date.now();

  // Jika server offline / jaringan bermasalah, gunakan cache lokal yang belum expired
  if (!serverLocks) {
    return cleanExpiredLocks(local);
  }

  const cleanedServer = cleanExpiredLocks(serverLocks);
  const result: DemoLocksMap = { ...cleanedServer };

  // Pertahankan kunci lokal milik perangkat ini jika baru saja dibuat (< 15 detik) untuk mencegah race condition
  for (const [user, info] of Object.entries(local)) {
    if (info && info.deviceId === myDeviceId && now - info.lockedAt < 15000) {
      if (!result[user]) {
        result[user] = info;
      }
    }
  }

  setLocalDemoLocks(result);
  return result;
}

/** Ambil seluruh daftar user demo yang sedang terkunci dari Backend Fastify & LocalStorage */
export async function fetchActiveDemoLocks(): Promise<DemoLocksMap> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/demo/locks`, {
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const json = await res.json();
      const serverData = (json && typeof json === 'object' && 'data' in json ? json.data : json) as DemoLocksMap;
      if (serverData && typeof serverData === 'object') {
        return reconcileLocks(serverData);
      }
    }
  } catch {
    // Fallback ke local cache jika koneksi timeout
  }

  return reconcileLocks(null);
}

/** Cek apakah user sedang terkunci oleh audiens di perangkat LAIN */
export function isUserLockedByOther(username: string, locks: DemoLocksMap): boolean {
  const myDeviceId = getDeviceId();
  const lock = locks[username.toLowerCase()];
  if (!lock) return false;

  const isExpired = Date.now() - lock.lockedAt > LOCK_TIMEOUT_MS;
  if (isExpired) return false;

  // Jika dikunci oleh perangkat lain, maka disabled!
  return lock.deviceId !== myDeviceId;
}

/** Kunci username saat audiens login */
export async function lockDemoUser(username: string): Promise<boolean> {
  const clean = username.toLowerCase();
  const myDeviceId = getDeviceId();
  // 1. Validasi atomik langsung ke Backend Fastify
  try {
    const res = await fetch(`${API_BASE}/api/v1/demo/lock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: clean, deviceId: myDeviceId }),
      signal: AbortSignal.timeout(3500),
    });

    if (res.status === 409) {
      const errJson = await res.json().catch(() => null);
      const msg = errJson?.message || `Akun ${clean} sedang aktif digunakan di perangkat lain. Silakan pilih akun demo lain.`;
      if (errJson && errJson.data && typeof errJson.data === 'object') {
        setLocalDemoLocks(errJson.data);
      }
      throw new Error(msg);
    }

    if (res.ok) {
      const okJson = await res.json().catch(() => null);
      if (okJson && okJson.data && typeof okJson.data === 'object') {
        setLocalDemoLocks(okJson.data);
      }
    }
  } catch (err: any) {
    if (
      err?.message?.includes('sedang aktif') ||
      err?.message?.includes('sedang digunakan') ||
      err?.message?.includes('409')
    ) {
      throw err;
    }
    // Fallback jika backend offline / timeout
  }

  // 2. Tandai di penyimpanan lokal & broadcast
  const current = getLocalDemoLocks();
  current[clean] = {
    deviceId: myDeviceId,
    lockedAt: Date.now(),
  };

  setLocalDemoLocks(current);

  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'DEMO_LOCK_UPDATED', locks: current });
  }

  return true;
}

/** Lepas kunci username saat audiens logout */
export async function unlockDemoUser(username: string): Promise<boolean> {
  const clean = username.toLowerCase();
  const myDeviceId = getDeviceId();
  const current = getLocalDemoLocks();

  delete current[clean];
  setLocalDemoLocks(current);

  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'DEMO_LOCK_UPDATED', locks: current });
  }

  // Sync ke Backend Fastify dengan keepalive
  try {
    await fetch(`${API_BASE}/api/v1/demo/unlock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: clean, deviceId: myDeviceId }),
      keepalive: true,
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    // ignore
  }

  return true;
}

/** Berlangganan perubahan status kunci (Multi-Tab / Multi-Window listener) */
export function subscribeDemoLockChanges(onUpdate: (locks: DemoLocksMap) => void): () => void {
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      onUpdate(getLocalDemoLocks());
    }
  };

  const handleBroadcast = (e: MessageEvent) => {
    if (e.data && e.data.type === 'DEMO_LOCK_UPDATED' && e.data.locks) {
      onUpdate(e.data.locks);
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorage);
    if (broadcastChannel) {
      broadcastChannel.addEventListener('message', handleBroadcast);
    }
  }

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorage);
      if (broadcastChannel) {
        broadcastChannel.removeEventListener('message', handleBroadcast);
      }
    }
  };
}
