import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  IdentitasAlumni,
  StatusKegiatan,
  MasaTunggu,
  DetailKerja,
  DetailKuliah,
  DetailUsaha,
  EvaluasiPembelajaran,
  TracerSubmissionPayload,
  SubmissionResponse,
} from '@/types/tracer';
import { submitTracerStudy } from '@/services/tracerService';

interface TracerFormState {
  currentStep: number;
  hasStartedSurvey: boolean;
  identitas: Partial<IdentitasAlumni>;
  status_kegiatan: StatusKegiatan | '';
  masa_tunggu?: MasaTunggu;
  detail_kerja: Partial<DetailKerja> | null;
  detail_kuliah: Partial<DetailKuliah> | null;
  detail_usaha: Partial<DetailUsaha> | null;
  evaluasi: Partial<EvaluasiPembelajaran>;
  agreement: boolean;
  
  // Submission result
  isSubmitted: boolean;
  lastSubmissionId: string | null;
  lastSubmittedAt: string | null;
  submissionHistory: Array<{
    id: string;
    submittedAt: string;
    payload: TracerSubmissionPayload;
  }>;

  // Actions
  setStep: (step: number) => void;
  setHasStartedSurvey: (started: boolean) => void;
  updateIdentitas: (data: Partial<IdentitasAlumni>) => void;
  updateStatusKegiatan: (status: StatusKegiatan, masaTunggu?: MasaTunggu) => void;
  updateDetailKerja: (data: Partial<DetailKerja> | null) => void;
  updateDetailKuliah: (data: Partial<DetailKuliah> | null) => void;
  updateDetailUsaha: (data: Partial<DetailUsaha> | null) => void;
  updateEvaluasi: (data: Partial<EvaluasiPembelajaran>) => void;
  setAgreement: (agreed: boolean) => void;
  submitTracer: (payload: TracerSubmissionPayload, customSubmissionId?: string, customSubmittedAt?: string) => Promise<SubmissionResponse>;
  resetForm: () => void;
  loadSampleData: () => void;
}

const initialIdentitas: Partial<IdentitasAlumni> = {
  nama_lengkap: '',
  nisn: '',
  nik: '',
  tahun_masuk: 2021,
  tahun_lulus: 2024,
  jurusan: 'Teknik Komputer dan Jaringan',
  no_whatsapp: '',
  email: '',
  jenis_kelamin: 'Laki-laki',
};

const initialEvaluasi: Partial<EvaluasiPembelajaran> = {
  skor_relevansi: 5,
  kompetensi_bermanfaat: ['Kompetensi teknis', 'Komunikasi', 'Kerja sama'],
  kompetensi_ditingkatkan: '',
  bantu_dunia_kerja: 'Sangat membantu',
  saran_pembelajaran: '',
  saran_bkk: '',
  saran_industri: '',
  kesediaan_dihubungi: true,
};

export const useTracerStore = create<TracerFormState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      hasStartedSurvey: false,
      identitas: initialIdentitas,
      status_kegiatan: 'KERJA',
      masa_tunggu: '< 3 bulan',
      detail_kerja: {
        nama_perusahaan: 'PT Solusi Teknologi Nusantara',
        jabatan: 'Technical Support',
        bidang_pekerjaan: 'Teknologi Informasi & Jaringan',
        kota_kabupaten: 'Tangerang Selatan',
        status_pekerjaan: 'Tetap',
        kesesuaian_jurusan: 'Sangat sesuai',
        kisaran_penghasilan: 'Rp 4.000.000 – Rp 7.000.000',
        alamat_perusahaan: 'Jl. Raya Puspiptek No. 10, Tangerang Selatan',
        nama_atasan: 'Budi Santoso',
        kontak_atasan: '081311223344',
        sumber_info_kerja: 'BKK',
        tanggal_mulai_kerja: '2024-08',
        jenis_sertifikat: 'BNSP',
        nama_sertifikat: 'Junior Network Administrator',
      },
      detail_kuliah: {
        nama_kampus: 'Universitas Pamulang',
        program_studi: 'Teknik Informatika',
        jenjang: 'S1',
        status_kuliah: 'Aktif',
        alamat_kampus: 'Jl. Surya Kencana No. 1, Pamulang',
      },
      detail_usaha: null,
      evaluasi: initialEvaluasi,
      agreement: false,

      isSubmitted: false,
      lastSubmissionId: null,
      lastSubmittedAt: null,
      submissionHistory: [],

      setStep: (step) => set({ currentStep: Math.min(Math.max(step, 1), 5) }),
      setHasStartedSurvey: (started) => set({ hasStartedSurvey: started }),

      updateIdentitas: (data) =>
        set((state) => ({ identitas: { ...state.identitas, ...data } })),

      updateStatusKegiatan: (status, masaTunggu) =>
        set({
          status_kegiatan: status,
          masa_tunggu: masaTunggu,
          // Initialize or reset child forms based on new status
          detail_kerja:
            status === 'KERJA' || status === 'KERJA_KULIAH'
              ? get().detail_kerja || {
                  nama_perusahaan: '',
                  jabatan: '',
                  alamat_perusahaan: '',
                  nama_atasan: '',
                  kontak_atasan: '',
                  sumber_info_kerja: 'BKK',
                  tanggal_mulai_kerja: '',
                  jenis_sertifikat: 'BNSP',
                  kesesuaian_jurusan: 'SANGAT_SESUAI',
                }
              : null,
          detail_kuliah:
            status === 'KULIAH' ||
            status === 'KERJA_KULIAH' ||
            status === 'WIRAUSAHA_KULIAH'
              ? get().detail_kuliah || {
                  nama_kampus: '',
                  alamat_kampus: '',
                  jenjang: 'S1',
                  program_studi: '',
                }
              : null,
          detail_usaha:
            status === 'WIRAUSAHA' || status === 'WIRAUSAHA_KULIAH'
              ? get().detail_usaha || {
                  nama_usaha: '',
                  kategori_usaha: 'Jasa',
                  alamat_usaha: '',
                  tanggal_mulai_usaha: '',
                }
              : null,
        }),

      updateDetailKerja: (data) =>
        set((state) => ({
          detail_kerja: data ? { ...state.detail_kerja, ...data } as DetailKerja : null,
        })),

      updateDetailKuliah: (data) =>
        set((state) => ({
          detail_kuliah: data ? { ...state.detail_kuliah, ...data } as DetailKuliah : null,
        })),

      updateDetailUsaha: (data) =>
        set((state) => ({
          detail_usaha: data ? { ...state.detail_usaha, ...data } as DetailUsaha : null,
        })),

      updateEvaluasi: (data) =>
        set((state) => ({ evaluasi: { ...state.evaluasi, ...data } })),

      setAgreement: (agreed) => set({ agreement: agreed }),

      submitTracer: async (payload: TracerSubmissionPayload, customSubmissionId?: string, customSubmittedAt?: string) => {
        const response = await submitTracerStudy({ ...payload, agreement: true });

        if (response.success && response.data) {
          const submissionId = response.data.submission_id;
          const submittedAt = response.data.submitted_at || new Date().toISOString();

          set((state) => ({
            isSubmitted: true,
            lastSubmissionId: submissionId,
            lastSubmittedAt: submittedAt,
            submissionHistory: [
              { id: submissionId, submittedAt, payload },
              ...state.submissionHistory,
            ],
          }));

          // Seamlessly sync with Admin Store, Auth Store & Mail Store
          try {
            const { useAdminStore } = await import('./adminStore');
            useAdminStore.getState().addOrUpdateRespondent(payload, submissionId);
            const { useAuthStore } = await import('./authStore');
            useAuthStore.getState().updateUserTracerStatus('SUDAH', submissionId);
            const { useMailStore } = await import('./mailStore');
            useMailStore.getState().addMail({
              senderName: payload.identitas.nama_lengkap,
              senderRole: 'alumni',
              senderEmail: payload.identitas.email,
              senderNisn: payload.identitas.nisn,
              senderMajor: payload.identitas.jurusan,
              senderGradYear: payload.identitas.tahun_lulus,
              senderAvatarGender: payload.identitas.jenis_kelamin === 'Perempuan' ? 'P' : 'L',
              recipientRole: 'admin_bkk',
              subject: `Pengajuan Tracer Study Baru (${submissionId})`,
              preview: `${payload.identitas.nama_lengkap} (${payload.identitas.jurusan}) telah menyelesaikan pengisian kuesioner tracer study.`,
              body: `Alumni ${payload.identitas.nama_lengkap} (NISN: ${payload.identitas.nisn}) telah mengirimkan formulir Tracer Study dengan ID ${submissionId}. Status kegiatan: ${payload.status_kegiatan}. Silakan periksa kelengkapan data di menu Verifikasi Isian.`,
              category: 'tracer_submission',
              submissionId,
              actionUrl: {
                tab: 'verifikasi',
                label: 'Buka di Verifikasi Isian',
              },
            });
          } catch {
            // Ignore if stores are not available
          }

          return { success: true, message: 'Data tracer study berhasil disimpan.', data: response.data };
        }

        return response;
      },

      resetForm: () =>
        set({
          currentStep: 1,
          hasStartedSurvey: false,
          identitas: {
            nama_lengkap: '',
            nisn: '',
            nik: '',
            tahun_masuk: 2021,
            tahun_lulus: 2024,
            jurusan: 'Teknik Komputer dan Jaringan',
            no_whatsapp: '',
            email: '',
            jenis_kelamin: 'Laki-laki',
          },
          status_kegiatan: 'KERJA',
          masa_tunggu: '< 3 bulan',
          detail_kerja: null,
          detail_kuliah: null,
          detail_usaha: null,
          evaluasi: initialEvaluasi,
          agreement: false,
          isSubmitted: false,
        }),

      loadSampleData: () =>
        set({
          hasStartedSurvey: true,
          identitas: {
            nama_lengkap: 'Ahmad Dani',
            nisn: '0051234567',
            nik: '3674012345670001',
            tahun_masuk: 2021,
            tahun_lulus: 2024,
            jurusan: 'Teknik Komputer dan Jaringan',
            no_whatsapp: '081298765432',
            email: 'ahmaddani@example.com',
            jenis_kelamin: 'Laki-laki',
          },
          status_kegiatan: 'KERJA_KULIAH',
          masa_tunggu: '< 3 bulan',
          detail_kerja: {
            nama_perusahaan: 'PT Solusi Teknologi Nusantara',
            jabatan: 'Technical Support',
            bidang_pekerjaan: 'Teknologi Informasi & Jaringan',
            kota_kabupaten: 'Tangerang Selatan',
            status_pekerjaan: 'Tetap',
            kesesuaian_jurusan: 'Sangat sesuai',
            kisaran_penghasilan: 'Rp 4.000.000 – Rp 7.000.000',
            alamat_perusahaan: 'Jl. Raya Puspiptek No. 10, Tangerang Selatan',
            nama_atasan: 'Budi Santoso',
            kontak_atasan: '081311223344',
            sumber_info_kerja: 'BKK',
            tanggal_mulai_kerja: '2024-08',
            jenis_sertifikat: 'BNSP',
            nama_sertifikat: 'Junior Network Administrator',
          },
          detail_kuliah: {
            nama_kampus: 'Universitas Pamulang',
            program_studi: 'Teknik Informatika',
            jenjang: 'S1',
            status_kuliah: 'Aktif',
            alamat_kampus: 'Jl. Surya Kencana No. 1, Pamulang',
          },
          detail_usaha: {
            nama_usaha: 'Dani Tech Repair & Service',
            bidang_usaha: 'Jasa Servis Komputer & Jaringan',
            lama_usaha: '6–12 bulan',
            jumlah_karyawan: '1 – 3 orang',
            kesesuaian_kompetensi: 'Sangat berkaitan',
          },
          evaluasi: {
            skor_relevansi: 5,
            kompetensi_bermanfaat: ['Kompetensi teknis', 'Komunikasi', 'Kerja sama'],
            kompetensi_ditingkatkan: 'Bahasa Inggris dan praktik cloud computing',
            bantu_dunia_kerja: 'Sangat membantu',
            saran_pembelajaran: 'Perbanyak jam praktik industri dan sertifikasi kejuruan.',
            saran_bkk: 'Perluas kemitraan rekrutmen kampus dan industri Jabodetabek.',
            saran_industri: 'Tingkatkan program guru tamu dari praktisi industri.',
            kesediaan_dihubungi: true,
          },
          agreement: true,
        }),
    }),
    {
      name: 'tracer_study_sasmita2_store',
    }
  )
);
