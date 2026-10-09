import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserSession } from '@/types/tracer';

export const DASHBOARD_SESSION_TIMEOUT_MS = 60 * 60 * 1000;

interface AuthState {
  isAuthenticated: boolean;
  user: UserSession | null;
  accessToken: string | null;
  refreshToken: string | null;
  lastDashboardActivity: number | null;
  login: (identifier: string, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  recordDashboardActivity: () => void;
  checkSessionExpiry: (currentPathname: string) => Promise<boolean>;
  updateUserTracerStatus: (status: 'SUDAH' | 'BELUM' | 'DRAFT', submissionId?: string) => void;
  refreshAccessToken: () => Promise<boolean>;
}

const API_BASE = (import.meta as any).env?.VITE_API_URL || '';

function normalizeRole(role: string): 'alumni' | 'admin_bkk' {
  const lower = (role || '').toLowerCase();
  return lower.includes('admin') ? 'admin_bkk' : 'alumni';
}

function normalizeUser(rawUser: any): UserSession {
  return {
    id: rawUser.id || `usr-${Date.now()}`,
    nisn: rawUser.nisn || '',
    nik: rawUser.nik || '',
    nama: rawUser.nama || rawUser.namaLengkap || 'Alumni Sasmita',
    email: rawUser.email || '',
    noWhatsapp: rawUser.noWhatsapp || rawUser.noWhatsApp || '',
    role: normalizeRole(rawUser.role),
    jurusan: rawUser.jurusan || 'Teknik Komputer dan Jaringan',
    tahun_lulus: Number(rawUser.tahun_lulus || rawUser.tahunLulus || 2024),
    tracerStatus: (rawUser.tracerStatus || 'BELUM') as 'SUDAH' | 'BELUM' | 'DRAFT',
    submissionId: rawUser.submissionId || undefined,
    submittedAt: rawUser.submittedAt || undefined,
    jenisKelamin: rawUser.jenisKelamin || 'L',
    avatarUrl: rawUser.avatarUrl || undefined,
  };
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const base = API_BASE || '';
  const res = await fetch(`${base}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'include',
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  const json = await res.json();
  return (json && typeof json === 'object' && 'data' in json ? json.data : json) as T;
}

function generateDefaultPassword(nisn: string): string {
  return `alumni${nisn.slice(-3)}`;
}

async function syncWithTracerStore(user: UserSession) {
  try {
    const { useTracerStore } = await import('./tracerStore');
    const tracerStore = useTracerStore.getState();
    const isFemale = user.jenisKelamin === 'P' || user.jenisKelamin === 'Perempuan';

    if (user.tracerStatus === 'SUDAH') {
      useTracerStore.setState({
        isSubmitted: true,
        lastSubmissionId: user.submissionId || '2026102498',
        lastSubmittedAt: user.submittedAt || new Date().toISOString(),
        identitas: {
          ...tracerStore.identitas,
          nama_lengkap: user.nama,
          nisn: user.nisn,
          nik: user.nik || '',
          tahun_lulus: user.tahun_lulus,
          jurusan: user.jurusan as any,
          email: user.email,
          no_whatsapp: user.noWhatsapp,
          tahun_masuk: user.tahun_lulus - 3,
          jenis_kelamin: isFemale ? 'Perempuan' : 'Laki-laki',
        },
      });
    } else {
      useTracerStore.setState({
        isSubmitted: false,
        lastSubmissionId: undefined,
        lastSubmittedAt: undefined,
        identitas: {
          ...tracerStore.identitas,
          nama_lengkap: user.nama,
          nisn: user.nisn,
          nik: user.nik || '',
          tahun_lulus: user.tahun_lulus,
          jurusan: user.jurusan as any,
          email: user.email,
          no_whatsapp: user.noWhatsapp,
          tahun_masuk: user.tahun_lulus - 3,
          jenis_kelamin: isFemale ? 'Perempuan' : 'Laki-laki',
        },
      });
    }
  } catch {
    // ignore sync if tracerStore is not yet initialized
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      lastDashboardActivity: null,

      login: async (identifier: string, password?: string) => {
        const cleanIdent = identifier.trim();
        const pwd = password || (cleanIdent.match(/^\d{10}$/) ? generateDefaultPassword(cleanIdent) : 'alumni123');

        const data = await apiFetch<{
          user: any;
          accessToken: string;
          refreshToken: string;
        }>('/api/v1/auth/login', {
          method: 'POST',
          body: JSON.stringify({ identifier: cleanIdent, password: pwd }),
        });

        if (data && data.user) {
          const user = normalizeUser(data.user);
          set({
            isAuthenticated: true,
            user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            lastDashboardActivity: Date.now(),
          });
          await syncWithTracerStore(user);
          return true;
        }
        return false;
      },

      logout: async () => {
        const { accessToken } = get();
        try {
          if (accessToken) {
            await apiFetch('/api/v1/auth/logout', {
              method: 'POST',
              headers: { Authorization: `Bearer ${accessToken}` },
            });
          }
        } catch {
          // ignore logout errors
        }

        try {
          const { useTracerStore } = await import('./tracerStore');
          useTracerStore.setState({
            isSubmitted: false,
            lastSubmissionId: undefined,
            lastSubmittedAt: undefined,
          });
        } catch {
          // ignore
        }

        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
          lastDashboardActivity: null,
        });
      },

      recordDashboardActivity: () => {
        set({ lastDashboardActivity: Date.now() });
      },

      checkSessionExpiry: async (currentPathname: string) => {
        const state = get();
        if (!state.isAuthenticated) return false;

        const now = Date.now();

        if (currentPathname.startsWith('/dashboard')) {
          set({ lastDashboardActivity: now });
          return false;
        }

        if (state.lastDashboardActivity) {
          const elapsed = now - state.lastDashboardActivity;
          if (elapsed > DASHBOARD_SESSION_TIMEOUT_MS) {
            const refreshed = await get().refreshAccessToken();
            if (!refreshed) {
              set({
                isAuthenticated: false,
                user: null,
                accessToken: null,
                refreshToken: null,
                lastDashboardActivity: null,
              });
              return true;
            }
            set({ lastDashboardActivity: now });
            return false;
          }
        } else {
          set({ lastDashboardActivity: now });
        }
        return false;
      },

      updateUserTracerStatus: (status, submissionId) => {
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              tracerStatus: status,
              submissionId: submissionId || state.user.submissionId,
              submittedAt: new Date().toISOString(),
            },
          };
        });
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return false;

        try {
          const data = await apiFetch<{
            accessToken: string;
            refreshToken: string;
            user?: any;
          }>('/api/v1/auth/refresh', {
            method: 'POST',
            body: JSON.stringify({ refreshToken }),
          });

          set((state) => ({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            user: data.user ? normalizeUser(data.user) : state.user,
          }));
          return true;
        } catch {
          set({
            isAuthenticated: false,
            user: null,
            accessToken: null,
            refreshToken: null,
            lastDashboardActivity: null,
          });
          return false;
        }
      },
    }),
    {
      name: 'alumni_auth_session',
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (version < 2) {
          return {
            isAuthenticated: false,
            user: null,
            accessToken: null,
            refreshToken: null,
            lastDashboardActivity: null,
          };
        }
        return persistedState;
      },
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        lastDashboardActivity: state.lastDashboardActivity,
      }),
    }
  )
);