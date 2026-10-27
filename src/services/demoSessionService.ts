/**
 * Demo Session Service:
 * Mengelola penguncian akun demo (user01 - user30) secara terpusat (Server-Authoritative)
 * dengan proteksi anti-race condition saat jaringan lambat (lag).
 */

const STORAGE_KEY = 'alumni_demo_active_locks';
const DEVICE_KEY = 'alumni_demo_device_id';
const LOCK_TIMEOUT_MS = 20 * 60 * 1000; // 20 Menit auto-expire jika tidak ada aktivitas/heartbeat

const API_BASE = (import.meta as any).env?.VITE_API_URL || '';

export interface DemoLockInfo {
  deviceId: string;
  lockedAt: number;
}

export type DemoLocksMap = Record<string, DemoLockInfo>;

// Cache in-memory untuk mencegah flicker/reset ke kosong saat jaringan mengalami lag spike
let memoryLocksCache: DemoLocksMap = {};

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
  memoryLocksCache = { ...cleaned };
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
 * Kunci remote yang sudah dilepas di server WAJIB langsung terhapus dari client.
 */
function reconcileLocks(serverLocks: DemoLocksMap | null): DemoLocksMap {
  const myDeviceId = getDeviceId();
  const local = getLocalDemoLocks();
  const now = Date.now();

  // Jika server offline / jaringan bermasalah, gunakan cache terakhir yang belum expired
  if (!serverLocks) {
    const fallback = Object.keys(memoryLocksCache).length > 0 ? memoryLocksCache : local;
    return cleanExpiredLocks(fallback);
  }

  const cleanedServer = cleanExpiredLocks(serverLocks);
  const result: DemoLocksMap = { ...cleanedServer };

  // Pertahankan kunci lokal milik perangkat ini jika baru dibuat (< 15 detik) untuk mencegah race condition in-flight
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

/**
 * Ambil seluruh daftar user demo yang sedang terkunci dari Backend Fastify.
 * Jika terjadi lag/timeout jaringan, sistem TETAP mempertahankan kunci terakhir
 * agar akun yang sedang aktif TIDAK mendadak berubah menjadi 'Tersedia'.
 */
export async function fetchActiveDemoLocks(): Promise<DemoLocksMap> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/demo/locks`, {
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(6000), // 6 Detik untuk toleransi koneksi mobile 3G/4G
    });

    if (res.ok) {
      const json = await res.json();
      const serverData = (json && typeof json === 'object' && 'data' in json ? json.data : json) as DemoLocksMap;
      if (serverData && typeof serverData === 'object') {
        const reconciled = reconcileLocks(serverData);
        memoryLocksCache = { ...reconciled };
        return reconciled;
      }
    }
  } catch (netErr) {
    // Saat koneksi lag / timeout: pertahankan data kunci terakhir yang diketahui
    console.warn('[DemoSession] Fetch locks timeout/error, maintaining last known state:', netErr);
  }

  // Gunakan cache memori terakhir yang diketahui agar tidak mereset UI ke status kosong
  const fallback = Object.keys(memoryLocksCache).length > 0
    ? memoryLocksCache
    : getLocalDemoLocks();

  return cleanExpiredLocks(fallback);
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

/**
 * Kunci username saat audiens login:
 * WAJIB MENDAPATKAN PERSETUJUAN OTORITATIF DARI SERVER FASTIFY.
 * JANGAN PERNAH meloloskan login jika server menolak (409) atau jaringan timeout!
 */
export async function lockDemoUser(username: string): Promise<boolean> {
  const clean = username.toLowerCase();
  const myDeviceId = getDeviceId();

  // 1. Kirim permintaan kunci atomik ke server Fastify dengan batas toleransi 8 detik
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/v1/demo/lock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: clean, deviceId: myDeviceId }),
      signal: AbortSignal.timeout(8000),
    });
  } catch (netErr: any) {
    const isTimeout =
      netErr?.name === 'TimeoutError' ||
      netErr?.message?.includes('timeout') ||
      netErr?.message?.includes('aborted');

    if (isTimeout) {
      throw new Error(
        `Koneksi internet Anda lambat (timeout 8 detik). Server belum mengonfirmasi status akun ${clean}. Demi mencegah tabrakan sesi, silakan coba login kembali.`
      );
    }
    throw new Error(
      `Gagal terhubung ke server untuk mengamankan akun ${clean}. Pastikan koneksi internet stabil lalu coba lagi.`
    );
  }

  // 2. Evaluasi respons penolakan dari server
  if (res.status === 409) {
    const errJson = await res.json().catch(() => null);
    const msg =
      errJson?.message ||
      `Akun ${clean} sedang aktif digunakan di perangkat lain. Silakan pilih akun demo lain.`;

    // Segera perbarui daftar kunci di lokal jika server mengembalikan daftar kunci aktif
    if (errJson && errJson.data && typeof errJson.data === 'object') {
      setLocalDemoLocks(errJson.data);
    }
    throw new Error(msg);
  }

  if (!res.ok) {
    throw new Error(`Server menolak penguncian akun ${clean} (HTTP ${res.status}). Silakan coba lagi.`);
  }

  const okJson = await res.json().catch(() => null);
  const serverLocks =
    okJson && okJson.data && typeof okJson.data === 'object' ? okJson.data : {};

  // 3. Hanya setelah server resmi mencatat penguncian: simpan di lokal & broadcast
  const current = { ...serverLocks };
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

/**
 * Mengirimkan sinyal detak jantung (Heartbeat) setiap 25-30 detik dari sesi dashboard yang aktif
 * untuk memperbarui timestamp penguncian di server sehingga sesi tidak kedaluwarsa.
 */
export async function sendDemoHeartbeat(username: string): Promise<boolean> {
  const clean = username.toLowerCase();
  const myDeviceId = getDeviceId();

  try {
    const res = await fetch(`${API_BASE}/api/v1/demo/heartbeat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: clean, deviceId: myDeviceId }),
      signal: AbortSignal.timeout(5000),
    });

    if (res.ok) {
      const okJson = await res.json().catch(() => null);
      if (okJson && okJson.data && typeof okJson.data === 'object') {
        memoryLocksCache = { ...okJson.data };
      }
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/** Lepas kunci username saat audiens logout */
export async function unlockDemoUser(username: string): Promise<boolean> {
  const clean = username.toLowerCase();
  const myDeviceId = getDeviceId();
  const current = getLocalDemoLocks();

  delete current[clean];
  delete memoryLocksCache[clean];
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
      signal: AbortSignal.timeout(4000),
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
