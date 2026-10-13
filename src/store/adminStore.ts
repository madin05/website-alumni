// Auto-purge stale demo localStorage
if (typeof window !== 'undefined') {
  try {
    ['tracer_study_admin_sasmita2', 'tracer_study_admin_store', 'tracer_study_content_store'].forEach((k) => {
      if (localStorage.getItem(k)) localStorage.removeItem(k);
    });
  } catch (e) {}
}

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TracerSubmissionPayload, JurusanSMK, StatusKegiatan } from '@/types/tracer';
import { INITIAL_MASTER_ALUMNI, INITIAL_RESPONDENTS } from '@/data/initialAlumniData';

export interface MasterAlumniRecord {
  id: string;
  nisn: string;
  nik: string;
  nama: string;
  jurusan: JurusanSMK;
  tahunLulus: number;
  noWhatsapp: string;
  email: string;
  statusTracer: 'SUDAH' | 'BELUM';
  submissionId?: string;
  submittedAt?: string;
  createdAt: string;
}

export type VerificationStatus = 'PENDING' | 'VALID' | 'REVISI';

export interface RespondentRecord {
  id: string;
  submissionId: string;
  nisn: string;
  nik: string;
  nama: string;
  jurusan: JurusanSMK;
  tahunLulus: number;
  noWhatsapp: string;
  email: string;
  statusKegiatan: StatusKegiatan;
  instansiKampusUsaha: string;
  jabatanProdiUsaha: string;
  submittedAt: string;
  verificationStatus: VerificationStatus;
  verificationNote?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  fullPayload: TracerSubmissionPayload;
}

export interface AdminSettings {
  targetQuota: number;
  targetYear: number;
  periodStart: string;
  periodEnd: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  ketuaBkk: string;
  nipKetuaBkk: string;
  namaSekolah: string;
  npsn: string;
  alamatSekolah: string;
  kontakBkk: string;
}

interface AdminState {
  masterAlumni: MasterAlumniRecord[];
  respondents: RespondentRecord[];
  settings: AdminSettings;

  // Actions
  importMasterAlumni: (records: Omit<MasterAlumniRecord, 'id' | 'createdAt' | 'statusTracer'>[]) => {
    importedCount: number;
    duplicateCount: number;
  };
  addSingleMasterAlumni: (record: Omit<MasterAlumniRecord, 'id' | 'createdAt' | 'statusTracer'>) => boolean;
  deleteMasterAlumni: (id: string) => void;
  updateMasterAlumni: (id: string, updates: Partial<MasterAlumniRecord>) => void;

  updateVerificationStatus: (
    submissionId: string,
    status: VerificationStatus,
    note?: string,
    verifiedBy?: string
  ) => void;

  addOrUpdateRespondent: (payload: TracerSubmissionPayload, submissionId: string) => void;
  updateSettings: (updates: Partial<AdminSettings>) => void;
  resetToDefaultData: () => void;
}

const DEFAULT_SETTINGS: AdminSettings = {
  targetQuota: 250,
  targetYear: 2025,
  periodStart: '2026-08-01',
  periodEnd: '2026-11-30',
  kepalaSekolah: 'Siti Zubaidah, S.E., S.Pd., M.Pd.I',
  nipKepalaSekolah: '19680514 199303 1 004',
  ketuaBkk: 'Ahmad Fauzi, S.Pd., M.Kom.',
  nipKetuaBkk: '19840219 200902 1 002',
  namaSekolah: 'SMKS SASMITA JAYA 2',
  npsn: '20603287',
  alamatSekolah: 'Jl. Surya Kencana No. 1, Pamulang Barat, Kec. Pamulang, Kota Tangerang Selatan, Banten 15417',
  kontakBkk: '0812-8889-7762',
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      masterAlumni: INITIAL_MASTER_ALUMNI,
      respondents: INITIAL_RESPONDENTS,
      settings: DEFAULT_SETTINGS,

      importMasterAlumni: (records) => {
        const currentList = get().masterAlumni;
        const currentNisns = new Set(currentList.map((a) => a.nisn.trim()));
        let importedCount = 0;
        let duplicateCount = 0;

        const newEntries: MasterAlumniRecord[] = [];

        records.forEach((rec, idx) => {
          const cleanNisn = (rec.nisn || '').trim();
          if (!cleanNisn) return;

          if (currentNisns.has(cleanNisn)) {
            duplicateCount++;
          } else {
            currentNisns.add(cleanNisn);
            importedCount++;
            newEntries.push({
              ...rec,
              id: `mst-imp-${Date.now()}-${idx}`,
              statusTracer: 'BELUM',
              createdAt: new Date().toISOString(),
            });
          }
        });

        if (newEntries.length > 0) {
          set({ masterAlumni: [...newEntries, ...currentList] });
        }

        return { importedCount, duplicateCount };
      },

      addSingleMasterAlumni: (record) => {
        const currentList = get().masterAlumni;
        const cleanNisn = (record.nisn || '').trim();
        if (currentList.some((a) => a.nisn === cleanNisn)) {
          return false;
        }

        const newRecord: MasterAlumniRecord = {
          ...record,
          id: `mst-single-${Date.now()}`,
          statusTracer: 'BELUM',
          createdAt: new Date().toISOString(),
        };

        set({ masterAlumni: [newRecord, ...currentList] });
        return true;
      },

      deleteMasterAlumni: (id) => {
        set((state) => ({
          masterAlumni: state.masterAlumni.filter((a) => a.id !== id),
        }));
      },

      updateMasterAlumni: (id, updates) => {
        set((state) => ({
          masterAlumni: state.masterAlumni.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        }));
      },

      updateVerificationStatus: (submissionId, status, note, verifiedBy = 'Admin BKK Sasmita') => {
        set((state) => {
          const updatedRespondents = state.respondents.map((rsp) => {
            if (rsp.submissionId === submissionId) {
              return {
                ...rsp,
                verificationStatus: status,
                verificationNote: note,
                verifiedAt: new Date().toISOString(),
                verifiedBy,
              };
            }
            return rsp;
          });

          return { respondents: updatedRespondents };
        });
      },

      addOrUpdateRespondent: (payload, submissionId) => {
        set((state) => {
          const existingIdx = state.respondents.findIndex((r) => r.submissionId === submissionId);
          const instansi =
            payload.detail_kerja?.nama_perusahaan ||
            payload.detail_kuliah?.nama_kampus ||
            payload.detail_usaha?.nama_usaha ||
            (payload.status_kegiatan === 'BELUM_KERJA' ? 'Pencari Kerja Aktif' : '-');

          const jabatan =
            payload.detail_kerja?.jabatan ||
            payload.detail_kuliah?.program_studi ||
            payload.detail_usaha?.bidang_usaha ||
            (payload.status_kegiatan === 'BELUM_KERJA' ? 'Pencari Kerja' : '-');

          const newRespondent: RespondentRecord = {
            id: `rsp-${Date.now()}`,
            submissionId,
            nisn: payload.identitas.nisn,
            nik: payload.identitas.nik || '',
            nama: payload.identitas.nama_lengkap,
            jurusan: payload.identitas.jurusan,
            tahunLulus: payload.identitas.tahun_lulus,
            noWhatsapp: payload.identitas.no_whatsapp,
            email: payload.identitas.email,
            statusKegiatan: payload.status_kegiatan,
            instansiKampusUsaha: instansi,
            jabatanProdiUsaha: jabatan,
            submittedAt: new Date().toISOString(),
            verificationStatus: 'VALID',
            fullPayload: payload,
          };

          let updatedRespondents = [...state.respondents];
          if (existingIdx >= 0) {
            updatedRespondents[existingIdx] = {
              ...updatedRespondents[existingIdx],
              ...newRespondent,
            };
          } else {
            updatedRespondents = [newRespondent, ...updatedRespondents];
          }

          // Also update masterAlumni statusTracer to SUDAH
          const updatedMaster = state.masterAlumni.map((m) => {
            if (m.nisn === payload.identitas.nisn) {
              return {
                ...m,
                statusTracer: 'SUDAH' as const,
                submissionId,
                submittedAt: new Date().toISOString(),
              };
            }
            return m;
          });

          return {
            respondents: updatedRespondents,
            masterAlumni: updatedMaster,
          };
        });
      },

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },

      resetToDefaultData: () => {
        set({
          masterAlumni: INITIAL_MASTER_ALUMNI,
          respondents: INITIAL_RESPONDENTS,
          settings: DEFAULT_SETTINGS,
        });
      },
    }),
    {
      name: 'tracer_study_admin_sasmita2_v3',
      version: 7,
      migrate: (persistedState: any, version: number) => {
        if (
          !persistedState ||
          version < 7 ||
          !persistedState.masterAlumni ||
          persistedState.masterAlumni.length < 100 ||
          !persistedState.respondents ||
          persistedState.respondents.length < 100
        ) {
          return {
            masterAlumni: INITIAL_MASTER_ALUMNI,
            respondents: INITIAL_RESPONDENTS,
            settings: DEFAULT_SETTINGS,
          };
        }
        return {
          ...persistedState,
          settings: {
            ...persistedState.settings,
            kepalaSekolah:
              persistedState.settings?.kepalaSekolah === 'Drs. H. Bakri Hadi, M.M.'
                ? 'Siti Zubaidah, S.E., S.Pd., M.Pd.I'
                : persistedState.settings?.kepalaSekolah || 'Siti Zubaidah, S.E., S.Pd., M.Pd.I',
          },
        };
      },
    }
  )
);
