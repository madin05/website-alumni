import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserSession } from '@/types/tracer';

// 1 jam session timeout jika user tidak berada di dashboard (3.600.000 ms)
export const DASHBOARD_SESSION_TIMEOUT_MS = 60 * 60 * 1000;

interface AuthState {
  isAuthenticated: boolean;
  user: UserSession | null;
  lastDashboardActivity: number | null;
  login: (nisnOrEmail: string, role?: 'alumni' | 'admin_bkk') => Promise<boolean>;
  logout: () => void;
  recordDashboardActivity: () => void;
  checkSessionExpiry: (currentPathname: string) => boolean;
  updateUserTracerStatus: (status: 'SUDAH' | 'BELUM' | 'DRAFT', submissionId?: string) => void;
}

const DEFAULT_MOCK_USER: UserSession = {
  id: 'usr-001',
  nisn: '0077935331',
  nama: 'Abil Alfad Jaelani',
  email: 'abil12@gmail.com',
  role: 'alumni',
  jurusan: 'Teknik Instalasi Tenaga Listrik',
  tahun_lulus: 2025,
  tracerStatus: 'SUDAH',
  submissionId: '2026101001',
  submittedAt: '2026-09-01T08:00:00Z',
  jenisKelamin: 'L',
};

const DEFAULT_MOCK_ADMIN: UserSession = {
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

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      lastDashboardActivity: null,

      login: async (identifier: string, role = 'alumni') => {
        // Quick delay to simulate authentic authentication
        await new Promise((resolve) => setTimeout(resolve, 400));

        const cleanIdent = identifier.trim();
        const lowerIdent = cleanIdent.toLowerCase();
        const isAdmin = lowerIdent.includes('admin') || role === 'admin_bkk';

        if (isAdmin) {
          const user: UserSession = {
            ...DEFAULT_MOCK_ADMIN,
            role: 'admin_bkk',
            email: identifier.includes('@') ? identifier : DEFAULT_MOCK_ADMIN.email,
          };
          const now = Date.now();
          set({
            isAuthenticated: true,
            user,
            lastDashboardActivity: now,
          });
          return true;
        }

        // Dynamic lookup in Admin Store's master alumni list and respondents
        let foundAlumni: any = null;
        let foundRespondent: any = null;
        try {
          const { useAdminStore } = await import('./adminStore');
          const adminState = useAdminStore.getState();
          const masterList = adminState.masterAlumni || [];
          const respondentsList = adminState.respondents || [];

          foundAlumni = masterList.find(
            (a) =>
              a.nisn.trim() === cleanIdent ||
              a.nik.trim() === cleanIdent ||
              a.email.toLowerCase() === lowerIdent ||
              a.nama.toLowerCase() === lowerIdent
          );

          foundRespondent = respondentsList.find(
            (r) =>
              r.nisn.trim() === cleanIdent ||
              r.nik.trim() === cleanIdent ||
              r.email.toLowerCase() === lowerIdent ||
              r.nama.toLowerCase() === lowerIdent ||
              (foundAlumni && (r.nisn === foundAlumni.nisn || r.nik === foundAlumni.nik))
          );

          // If not found directly, check by ending digits (e.g. 1234567)
          if (!foundAlumni && !foundRespondent && cleanIdent.length >= 7) {
            const suffix = cleanIdent.slice(-7);
            foundAlumni = masterList.find(
              (a) => a.nisn.endsWith(suffix) || a.nik.endsWith(suffix)
            );
            if (foundAlumni) {
              foundRespondent = respondentsList.find(
                (r) => r.nisn === foundAlumni.nisn || r.nik === foundAlumni.nik
              );
            }
          }

          if (!foundAlumni && foundRespondent) {
            foundAlumni = {
              id: foundRespondent.id,
              nisn: foundRespondent.nisn,
              nik: foundRespondent.nik,
              nama: foundRespondent.nama,
              email: foundRespondent.email,
              noWhatsapp: foundRespondent.noWhatsapp,
              jurusan: foundRespondent.jurusan,
              tahunLulus: foundRespondent.tahunLulus,
              statusTracer: 'SUDAH' as const,
              submissionId: foundRespondent.submissionId,
              submittedAt: foundRespondent.submittedAt,
            };
          }
        } catch {
          // Ignore if adminStore is not available
        }

        const alumniName = foundAlumni?.nama || foundRespondent?.nama || '';
        const isFemale =
          alumniName &&
          /^(citra|mega|olivia|qori|siti|vina|yasmin|bella|gita|indah|dwi|ani|nur|rina)/i.test(
            alumniName
          );

        let user: UserSession;
        if (foundAlumni || foundRespondent) {
          const matched = foundAlumni || foundRespondent;
          const statusTracer = (foundRespondent ? 'SUDAH' : matched.statusTracer) || 'BELUM';
          const subId = matched.submissionId || foundRespondent?.submissionId;
          const subAt = matched.submittedAt || foundRespondent?.submittedAt;

          user = {
            id: matched.id,
            nisn: matched.nisn,
            nik: matched.nik,
            nama: matched.nama,
            email: matched.email,
            noWhatsapp: matched.noWhatsapp,
            role: 'alumni',
            jurusan: matched.jurusan,
            tahun_lulus: matched.tahunLulus,
            tracerStatus: statusTracer,
            submissionId: subId,
            submittedAt: subAt,
            jenisKelamin: isFemale ? 'P' : 'L',
          };

          // Synchronize tracerStore with admin respondent data
          try {
            const { useTracerStore } = await import('./tracerStore');
            const tracerStore = useTracerStore.getState();

            if (statusTracer === 'SUDAH' && foundRespondent?.fullPayload) {
              useTracerStore.setState({
                isSubmitted: true,
                lastSubmissionId: subId || '2026102498',
                lastSubmittedAt: subAt || new Date().toISOString(),
                identitas: foundRespondent.fullPayload.identitas || {
                  nama_lengkap: user.nama,
                  nisn: user.nisn,
                  nik: user.nik,
                  tahun_lulus: user.tahun_lulus,
                  jurusan: user.jurusan,
                  email: user.email,
                  no_whatsapp: user.noWhatsapp,
                },
                status_kegiatan: foundRespondent.fullPayload.status_kegiatan || foundRespondent.statusKegiatan || 'KERJA',
                masa_tunggu: foundRespondent.fullPayload.masa_tunggu || '< 3 bulan',
                detail_kerja: foundRespondent.fullPayload.detail_kerja || null,
                detail_kuliah: foundRespondent.fullPayload.detail_kuliah || null,
                detail_usaha: foundRespondent.fullPayload.detail_usaha || null,
                evaluasi: foundRespondent.fullPayload.evaluasi || tracerStore.evaluasi,
                agreement: true,
              });
            } else if (statusTracer === 'SUDAH') {
              useTracerStore.setState({
                isSubmitted: true,
                lastSubmissionId: subId || '2026102498',
                lastSubmittedAt: subAt || new Date().toISOString(),
                identitas: {
                  nama_lengkap: user.nama,
                  nisn: user.nisn,
                  nik: user.nik,
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
                lastSubmissionId: null,
                lastSubmittedAt: null,
                hasStartedSurvey: false,
                currentStep: 1,
                identitas: {
                  nama_lengkap: user.nama,
                  nisn: user.nisn,
                  nik: user.nik,
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
            // Ignore if tracerStore sync fails
          }
        } else {
          // Dynamic fallback for arbitrary NISN / Email
          const isNisn = /^\d{10}$/.test(cleanIdent);
          const isNik = /^\d{16}$/.test(cleanIdent);
          user = {
            ...DEFAULT_MOCK_USER,
            id: `usr-${Date.now()}`,
            nisn: isNisn ? cleanIdent : DEFAULT_MOCK_USER.nisn,
            nik: isNik ? cleanIdent : DEFAULT_MOCK_USER.nik,
            email: cleanIdent.includes('@') ? cleanIdent : DEFAULT_MOCK_USER.email,
            nama: DEFAULT_MOCK_USER.nama,
            role: 'alumni',
            tracerStatus: 'BELUM',
            submissionId: undefined,
            submittedAt: undefined,
          };
        }

        const now = Date.now();
        set({
          isAuthenticated: true,
          user,
          lastDashboardActivity: now,
        });
        return true;
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          lastDashboardActivity: null,
        });
      },

      recordDashboardActivity: () => {
        set({ lastDashboardActivity: Date.now() });
      },

      checkSessionExpiry: (currentPathname: string) => {
        const state = get();
        if (!state.isAuthenticated) return false;

        const now = Date.now();

        // Jika user sedang berada di halaman dashboard, perbarui waktu aktivitas dashboard
        if (currentPathname.startsWith('/dashboard')) {
          set({ lastDashboardActivity: now });
          return false;
        }

        // Jika user berada di luar dashboard:
        // Cek apakah sudah lebih dari 1 jam (DASHBOARD_SESSION_TIMEOUT_MS) sejak terakhir di dashboard
        if (state.lastDashboardActivity) {
          const elapsed = now - state.lastDashboardActivity;
          if (elapsed > DASHBOARD_SESSION_TIMEOUT_MS) {
            // Sesi kedaluwarsa karena tidak berada di dashboard selama 1 jam
            set({
              isAuthenticated: false,
              user: null,
              lastDashboardActivity: null,
            });
            return true; // Expired
          }
        } else {
          // Inisialisasi timestamp jika belum tersimpan
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
    }),
    {
      name: 'alumni_auth_session',
    }
  )
);

