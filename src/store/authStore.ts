import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserSession } from '@/types/tracer';
import { detectGenderFromName } from '@/components/ui/UserAvatar';

export const DASHBOARD_SESSION_TIMEOUT_MS = 60 * 60 * 1000;

interface AuthState {
  isAuthenticated: boolean;
  user: UserSession | null;
  accessToken: string | null;
  refreshToken: string | null;
  lastDashboardActivity: number | null;
  login: (identifier: string, password?: string, roleHint?: string) => Promise<boolean>;
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
    jenisKelamin: detectGenderFromName(
      rawUser.nama || rawUser.namaLengkap,
      rawUser.jenisKelamin || rawUser.gender
    ),
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
      // User baru (termasuk akun demo user01-user30): Form survey benar-benar fresh & kosong tanpa data sample mock
      useTracerStore.setState({
        isSubmitted: false,
        lastSubmissionId: null,
        lastSubmittedAt: null,
        hasStartedSurvey: false,
        currentStep: 1,
        status_kegiatan: '',
        masa_tunggu: undefined,
        detail_kerja: null,
        detail_kuliah: null,
        detail_usaha: null,
        agreement: false,
        identitas: {
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

      login: async (identifier: string, password?: string, roleHint?: string) => {
        const cleanIdent = identifier.trim();
        let pwd = password?.trim() || cleanIdent;
        let loginIdentifier = cleanIdent;

        // Auto-map demo credentials if user entered legacy demo password
        if (cleanIdent.toLowerCase() === 'admin@smksasmitajaya2.sch.id' && (pwd === 'admin123' || pwd === 'admin')) {
          pwd = 'Admin#12345';
        }
        if (cleanIdent === '0051234567') {
          loginIdentifier = '3079145847';
          pwd = '3079145847';
        }

        // Demo Audiens (user01 - user30) Special Handler & Device Session Lock
        try {
          const { findDemoUser } = await import('@/data/demoUsers');
          const demoUser = findDemoUser(cleanIdent);

          if (demoUser) {
            const { fetchActiveDemoLocks, isUserLockedByOther, lockDemoUser } = await import('@/services/demoSessionService');
            const locks = await fetchActiveDemoLocks();

            if (isUserLockedByOther(demoUser.username, locks)) {
              throw new Error(`Akun ${demoUser.username} (${demoUser.nama}) sedang digunakan oleh audiens lain. Silakan pilih user demo lain.`);
            }

            const pad3 = demoUser.password.replace('alumni#', '');
            const allowedPwds = [
              demoUser.password,
              `alumni${pad3}`,
              demoUser.username,
              `${demoUser.username}#demo`,
              demoUser.nisn,
            ];

            if (allowedPwds.includes(pwd)) {
              await lockDemoUser(demoUser.username);

              const alumniUser: UserSession = {
                id: demoUser.id,
                nisn: demoUser.nisn,
                nik: demoUser.nik,
                nama: demoUser.nama,
                email: demoUser.email,
                noWhatsapp: demoUser.noWhatsapp,
                role: 'alumni',
                jurusan: demoUser.jurusan,
                tahun_lulus: demoUser.tahunLulus,
                tracerStatus: demoUser.statusTracer,
                submissionId: demoUser.statusTracer === 'SUDAH' ? `DEMO-${demoUser.username.toUpperCase()}` : undefined,
                submittedAt: demoUser.statusTracer === 'SUDAH' ? '2026-10-24T10:00:00.000Z' : undefined,
                jenisKelamin: demoUser.jenisKelamin,
              };

              set({
                isAuthenticated: true,
                user: alumniUser,
                accessToken: `mock-access-token-${demoUser.username}`,
                refreshToken: `mock-refresh-token-${demoUser.username}`,
                lastDashboardActivity: Date.now(),
              });
              await syncWithTracerStore(alumniUser);
              return true;
            } else {
              throw new Error(`Password tidak sesuai untuk akun demo ${demoUser.username}.`);
            }
          }
        } catch (demoErr: any) {
          if (demoErr?.message?.includes('sedang digunakan') || demoErr?.message?.includes('Password tidak sesuai')) {
            throw demoErr;
          }
          console.warn('[AuthStore] Demo user check skipped:', demoErr);
        }

        try {
          let data: any = null;
          try {
            data = await apiFetch<{
              user: any;
              accessToken: string;
              refreshToken: string;
            }>('/api/v1/auth/login', {
              method: 'POST',
              body: JSON.stringify({ identifier: loginIdentifier, password: pwd }),
            });
          } catch (err: any) {
            // Jika login pertama gagal dan identifier berupa 10-digit NISN, coba password = NISN
            if (cleanIdent.match(/^\d{10}$/) && pwd !== cleanIdent) {
              try {
                data = await apiFetch<{
                  user: any;
                  accessToken: string;
                  refreshToken: string;
                }>('/api/v1/auth/login', {
                  method: 'POST',
                  body: JSON.stringify({ identifier: cleanIdent, password: cleanIdent }),
                });
              } catch {
                throw err;
              }
            } else {
              throw err;
            }
          }

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
        } catch (err: any) {
          console.warn('[AuthStore] Backend login unfulfilled, attempting local fallback:', err);
        }

        // Local / Mock fallback when backend is unreachable or user is mock alumni/admin
        try {
          const lowerIdent = cleanIdent.toLowerCase();
          const isAdmin =
            lowerIdent === 'admin@smksasmitajaya2.sch.id' ||
            lowerIdent.includes('admin') ||
            roleHint === 'admin_bkk';

          if (isAdmin) {
            if (pwd === 'Admin#12345' || pwd === 'admin123' || pwd === 'admin') {
              const adminUser: UserSession = {
                id: 'adm-001',
                nisn: '0000000000',
                nama: 'Admin BKK Sasmita',
                email: 'admin@smksasmitajaya2.sch.id',
                role: 'admin_bkk',
                jurusan: 'Pengelola BKK & Tracer Study',
                tahun_lulus: 2020,
                tracerStatus: 'SUDAH',
                jenisKelamin: 'L',
              };
              set({
                isAuthenticated: true,
                user: adminUser,
                accessToken: 'mock-access-token-admin',
                refreshToken: 'mock-refresh-token-admin',
                lastDashboardActivity: Date.now(),
              });
              await syncWithTracerStore(adminUser);
              return true;
            }
          }

          // Check mock alumni in masterAlumni (including 3079145847)
          const { useAdminStore } = await import('./adminStore');
          const adminState = useAdminStore.getState();
          const masterList = adminState.masterAlumni || [];
          const found = masterList.find(
            (a) => a.nisn === cleanIdent || (a.email && a.email.toLowerCase() === lowerIdent)
          );

          if (found || cleanIdent === '3079145847' || cleanIdent === '0051234567') {
            const actualAlumni = found || {
              id: 'usr-3079145847',
              nisn: '3079145847',
              nik: '3674012000000999',
              nama: 'Alumni Demo Sasmita',
              email: 'alumni.demo@example.com',
              noWhatsapp: '081234567890',
              jurusan: 'Teknik Komputer dan Jaringan',
              tahunLulus: 2024,
              statusTracer: 'BELUM',
              submissionId: undefined,
              submittedAt: undefined,
            };

            const last3 = actualAlumni.nisn.slice(-3);
            const validPasswords = [
              `alumni#${last3}`,
              `alumni${last3}`,
              actualAlumni.nisn,
              'alumni#847',
              'alumni847',
            ];

            if (validPasswords.includes(pwd)) {
              const alumniUser: UserSession = {
                id: actualAlumni.id || `usr-${actualAlumni.nisn}`,
                nisn: actualAlumni.nisn,
                nik: actualAlumni.nik,
                nama: actualAlumni.nama,
                email: actualAlumni.email,
                noWhatsapp: actualAlumni.noWhatsapp,
                role: 'alumni',
                jurusan: actualAlumni.jurusan,
                tahun_lulus: actualAlumni.tahunLulus,
                tracerStatus: actualAlumni.statusTracer || 'BELUM',
                submissionId: actualAlumni.submissionId,
                submittedAt: actualAlumni.submittedAt,
                jenisKelamin: detectGenderFromName(actualAlumni.nama, (actualAlumni as any).jenisKelamin),
              };
              set({
                isAuthenticated: true,
                user: alumniUser,
                accessToken: `mock-access-token-${actualAlumni.nisn}`,
                refreshToken: `mock-refresh-token-${actualAlumni.nisn}`,
                lastDashboardActivity: Date.now(),
              });
              await syncWithTracerStore(alumniUser);
              return true;
            }
          }
        } catch (fallbackErr) {
          console.warn('[AuthStore] Fallback login error:', fallbackErr);
        }

        return false;
      },

      logout: async () => {
        const { accessToken, user } = get();

        // Release demo session lock if current session is demo user
        if (user) {
          try {
            const { findDemoUser } = await import('@/data/demoUsers');
            const { unlockDemoUser } = await import('@/services/demoSessionService');
            const demo = findDemoUser(user.nisn) || findDemoUser(user.email);
            if (demo) {
              await unlockDemoUser(demo.username);
            }
          } catch (unlockErr) {
            console.warn('[AuthStore] Error releasing demo lock on logout:', unlockErr);
          }
        }

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

        // Mock / local session tidak memerlukan refresh JWT dari backend
        if (refreshToken.startsWith('mock-')) {
          return true;
        }

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
      onRehydrateStorage: () => (state) => {
        if (state && state.user) {
          state.user.jenisKelamin = detectGenderFromName(state.user.nama, state.user.jenisKelamin);
        }
      },
    }
  )
);