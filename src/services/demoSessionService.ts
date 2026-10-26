/**
 * Demo Session Service:
 * Mengelola penguncian akun demo (user01 - user30) agar tidak dapat digunakan
 * bersamaan oleh audiens yang berbeda secara realtime (Cross-Tab & Cloud Backend Sync).
 */

const STORAGE_KEY = 'alumni_demo_active_locks';
const DEVICE_KEY = 'alumni_demo_device_id';
const LOCK_TIMEOUT_MS = 20 * 60 * 1000; // 20 Menit auto-expire jika tab ditutup tanpa logout

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

/** Ambil seluruh daftar user demo yang sedang terkunci dari Backend & LocalStorage */
export async function fetchActiveDemoLocks(): Promise<DemoLocksMap> {
  const local = getLocalDemoLocks();

  try {
    const res = await fetch('/api/v1/demo/locks', {
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const json = await res.json();
      if (json && json.data && typeof json.data === 'object') {
        const merged: DemoLocksMap = { ...local, ...cleanExpiredLocks(json.data) };
        setLocalDemoLocks(merged);
        return merged;
      }
    }
  } catch {
    // Backend offline / tunnel issue fallback ke local sync
  }

  return local;
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
  const current = getLocalDemoLocks();

  current[clean] = {
    deviceId: myDeviceId,
    lockedAt: Date.now(),
  };

  setLocalDemoLocks(current);

  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'DEMO_LOCK_UPDATED', locks: current });
  }

  try {
    await fetch('/api/v1/demo/lock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: clean, deviceId: myDeviceId }),
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    // local broadcast is sufficient
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

  try {
    await fetch('/api/v1/demo/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: clean, deviceId: myDeviceId }),
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    // local broadcast is sufficient
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
