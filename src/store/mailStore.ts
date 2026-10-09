import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { JurusanSMK } from '@/types/tracer';

export interface MailItem {
  id: string;
  senderName: string;
  senderRole: 'alumni' | 'admin' | 'system';
  senderEmail: string;
  senderNisn?: string;
  senderMajor?: JurusanSMK | string;
  senderGradYear?: number;
  senderAvatarGender?: 'L' | 'P';
  recipientRole: 'admin_bkk' | 'alumni' | 'all';
  recipientNisn?: string;
  subject: string;
  preview: string;
  body: string;
  category: 'tracer_submission' | 'verification_update' | 'inquiry' | 'feedback' | 'job_alert';
  submissionId?: string;
  createdAt: string;
  isRead: boolean;
  actionUrl?: {
    tab: string;
    respondentId?: string;
    label: string;
  };
}

interface MailState {
  mails: MailItem[];
  markAsRead: (id: string) => void;
  markAllAsRead: (role: 'admin_bkk' | 'alumni', userNisn?: string) => void;
  deleteMail: (id: string) => void;
  addMail: (mail: Omit<MailItem, 'id' | 'createdAt' | 'isRead'>) => void;
  getMailsForUser: (role: 'admin_bkk' | 'alumni', userNisn?: string) => MailItem[];
  getUnreadCount: (role: 'admin_bkk' | 'alumni', userNisn?: string) => number;
  fetchMailsFromBackend: () => Promise<boolean>;
}

const INITIAL_MAILS: MailItem[] = [
  {
    id: 'mail-001',
    senderName: 'Ahmad Dani',
    senderRole: 'alumni',
    senderEmail: 'ahmaddani@example.com',
    senderNisn: '0051234567',
    senderMajor: 'Teknik Komputer dan Jaringan',
    senderGradYear: 2024,
    senderAvatarGender: 'L',
    recipientRole: 'admin_bkk',
    subject: 'Pengajuan Tracer Study Baru (2026100001)',
    preview: 'Halo Admin BKK, saya telah mengirimkan pengisian tracer study untuk status Bekerja & Kuliah.',
    body: 'Selamat siang Bapak/Ibu Pengelola BKK SMK Sasmita Jaya 2. Saya Ahmad Dani (TKJ 2024) ingin mengonfirmasi bahwa saya telah menyelesaikan pengisian kuesioner Tracer Study dengan nomor pengajuan 2026100001. Saat ini saya bekerja sebagai Technical Support di PT Solusi Teknologi Nusantara dan melanjutkan kuliah S1 Teknik Informatika di Universitas Pamulang. Mohon untuk diverifikasi. Terima kasih.',
    category: 'tracer_submission',
    submissionId: '2026100001',
    createdAt: '2026-10-02T19:30:00Z',
    isRead: false,
    actionUrl: {
      tab: 'verifikasi',
      respondentId: 'rsp-001',
      label: 'Buka di Verifikasi Isian',
    },
  },
  {
    id: 'mail-002',
    senderName: 'Naufal Aditya Putra',
    senderRole: 'alumni',
    senderEmail: 'naufaladitya@example.com',
    senderNisn: '0064567891',
    senderMajor: 'Teknik Pemesinan',
    senderGradYear: 2024,
    senderAvatarGender: 'L',
    recipientRole: 'admin_bkk',
    subject: 'Pembaruan Berkas Kuesioner (2026100008)',
    preview: 'Saya sudah melengkapi catatan domisili dan bidang loker yang diminta untuk revisi verifikasi.',
    body: 'Yth. Admin BKK Sasmita, menindaklanjuti status REVISI pada kuesioner saya, saya telah memperbarui informasi domisili (Kota Tangerang Selatan) dan minat lowongan operator mesin CNC/Bubut di kawasan industri Cilegon & Tangerang. Mohon bantuannya untuk peninjauan kembali. Terima kasih banyak atas arahan BKK.',
    category: 'inquiry',
    submissionId: '2026100008',
    createdAt: '2026-10-02T18:45:00Z',
    isRead: false,
    actionUrl: {
      tab: 'verifikasi',
      respondentId: 'rsp-008',
      label: 'Buka di Verifikasi Isian',
    },
  },
  {
    id: 'mail-003',
    senderName: 'Bella Safitri',
    senderRole: 'alumni',
    senderEmail: 'bellasafitri@example.com',
    senderNisn: '0078901235',
    senderMajor: 'Teknik Elektronika Industri',
    senderGradYear: 2024,
    senderAvatarGender: 'P',
    recipientRole: 'admin_bkk',
    subject: 'Saran Kurikulum & Kemitraan PT Epson Industry',
    preview: 'Terima kasih banyak BKK atas bimbingan tes kerja hingga diterima di PT Indonesia Epson Industry.',
    body: 'Kepada Yth. Tim BKK SMK Sasmita Jaya 2, saya Bella Safitri ingin mengucapkan terima kasih yang sebesar-besarnya. Berkat pembekalan materi soldering presisi dan simulasi wawancara dari BKK, saya berhasil lolos dan kini bertugas sebagai SMD Line Quality Leader. Saya juga memberikan masukan pada kuesioner agar modul PLC dan K3 manufaktur Jepang terus dipertahankan untuk adik-adik kelas.',
    category: 'feedback',
    submissionId: '2026100022',
    createdAt: '2026-10-02T17:20:00Z',
    isRead: false,
    actionUrl: {
      tab: 'verifikasi',
      respondentId: 'rsp-022',
      label: 'Buka di Verifikasi Isian',
    },
  },
  {
    id: 'mail-004',
    senderName: 'Rizki Ramadhan',
    senderRole: 'alumni',
    senderEmail: 'rizkiramadhan@example.com',
    senderNisn: '0068901235',
    senderMajor: 'Teknik dan Bisnis Sepeda Motor',
    senderGradYear: 2024,
    senderAvatarGender: 'L',
    recipientRole: 'admin_bkk',
    subject: 'Pemberitahuan Wirausaha Mandiri RR Speed Motor',
    preview: 'Salam BKK, usaha bengkel servis dan coating motor kami sudah berjalan 8 bulan dengan omset stabil.',
    body: 'Halo Bapak/Ibu Guru BKK, kuesioner wirausaha mandiri saya sudah diisi lengkap (2026100012). Bengkel RR Speed Motor Garage saat ini sudah mempekerjakan 2 orang teknisi junior. Jika ada program pameran karya wirausaha alumni atau kunjungan adik kelas SMK, bengkel kami sangat terbuka untuk bekerja sama.',
    category: 'feedback',
    submissionId: '2026100012',
    createdAt: '2026-10-02T14:10:00Z',
    isRead: true,
    actionUrl: {
      tab: 'verifikasi',
      respondentId: 'rsp-012',
      label: 'Buka di Verifikasi Isian',
    },
  },
  {
    id: 'mail-005',
    senderName: 'Citra Dewi Lestari',
    senderRole: 'alumni',
    senderEmail: 'citradewi@example.com',
    senderNisn: '0053456789',
    senderMajor: 'Teknik Instalasi Tenaga Listrik',
    senderGradYear: 2024,
    senderAvatarGender: 'P',
    recipientRole: 'admin_bkk',
    subject: 'Konfirmasi Pengisian Tracer Lanjut Studi S1 PLN',
    preview: 'Data tracer study saya untuk program S1 Teknik Elektro Institut Teknologi PLN telah terkirim.',
    body: 'Assalamu alaikum Wr. Wb. Data pengajuan 2026100003 saya sudah saya kirimkan melalui portal. Pembelajaran dasar instalasi tenaga listrik di Sasmita 2 sangat mempermudah praktikum saya di kampus. Terima kasih untuk seluruh bapak/ibu guru BKK.',
    category: 'tracer_submission',
    submissionId: '2026100003',
    createdAt: '2026-10-01T11:00:00Z',
    isRead: true,
    actionUrl: {
      tab: 'verifikasi',
      respondentId: 'rsp-003',
      label: 'Buka di Verifikasi Isian',
    },
  },
  {
    id: 'mail-usr-001',
    senderName: 'BKK SMK Sasmita Jaya 2',
    senderRole: 'admin',
    senderEmail: 'admin@smksasmitajaya2.sch.id',
    recipientRole: 'all',
    subject: 'Selamat Datang di Portal Tracer Study 2026',
    preview: 'Partisipasi Anda sangat berharga untuk peningkatan mutu pendidikan kejuruan dan akreditasi sekolah.',
    body: 'Halo Rekan Alumni SMK Sasmita Jaya 2! Terima kasih telah berkunjung ke portal resmi Tracer Study. Data yang Anda masukkan digunakan untuk pemetaan rekam jejak lulusan, pengembangan kurikulum link & match industri, serta evaluasi program BKK. Pastikan data diisi secara akurat dan lengkap.',
    category: 'inquiry',
    createdAt: '2026-08-01T08:00:00Z',
    isRead: false,
    actionUrl: {
      tab: 'tracer_study',
      label: 'Isi Kuesioner Sekarang',
    },
  },
  {
    id: 'mail-usr-002',
    senderName: 'Admin BKK Sasmita',
    senderRole: 'admin',
    senderEmail: 'admin@smksasmitajaya2.sch.id',
    recipientRole: 'alumni',
    recipientNisn: '0051234567',
    subject: 'Verifikasi Berkas Kuesioner Disetujui (VALID)',
    preview: 'Kuesioner Tracer Study Anda (2026100001) telah berhasil diverifikasi oleh Tim BKK.',
    body: 'Selamat Ahmad Dani, pengajuan kuesioner Tracer Study Anda dengan nomor 2026100001 telah dinyatakan VALID dan lengkap oleh Admin BKK. Anda dapat mengunduh dan mencetak Bukti Tanda Terima Tracer Study resmi melalui menu profil akun Anda.',
    category: 'verification_update',
    submissionId: '2026100001',
    createdAt: '2026-09-27T08:00:00Z',
    isRead: false,
    actionUrl: {
      tab: 'beranda',
      label: 'Lihat Bukti Pengisian',
    },
  },
];

export const useMailStore = create<MailState>()(
  (set, get) => ({
    mails: [],

      markAsRead: (id: string) => {
        set((state) => ({
          mails: state.mails.map((m) =>
            m.id === id ? { ...m, isRead: true } : m
          ),
        }));

        if (!id.startsWith('mail-0') && !id.startsWith('mail-usr-')) {
          import('@/services/adminService').then(({ adminMessagesApi }) => {
            adminMessagesApi.updateStatus(id, 'RESOLVED').catch((err) => {
              console.warn('[MailStore] Backend mark read sync fallback:', err);
            });
          });
        }
      },

      markAllAsRead: (role: 'admin_bkk' | 'alumni', userNisn?: string) => {
        set((state) => ({
          mails: state.mails.map((m) => {
            if (role === 'admin_bkk' && m.recipientRole === 'admin_bkk') {
              return { ...m, isRead: true };
            }
            if (
              role === 'alumni' &&
              (m.recipientRole === 'all' ||
                (m.recipientRole === 'alumni' &&
                  (!m.recipientNisn || m.recipientNisn === userNisn)))
            ) {
              return { ...m, isRead: true };
            }
            return m;
          }),
        }));
      },

      deleteMail: (id: string) => {
        set((state) => ({
          mails: state.mails.filter((m) => m.id !== id),
        }));

        if (!id.startsWith('mail-0') && !id.startsWith('mail-usr-')) {
          import('@/services/adminService').then(({ adminMessagesApi }) => {
            adminMessagesApi.delete(id).catch((err) => {
              console.warn('[MailStore] Backend delete message sync fallback:', err);
            });
          });
        }
      },

      addMail: (mailData) => {
        const newMail: MailItem = {
          ...mailData,
          id: `mail-${Date.now()}`,
          createdAt: new Date().toISOString(),
          isRead: false,
        };
        set((state) => ({
          mails: [newMail, ...state.mails],
        }));
      },

      getMailsForUser: (role: 'admin_bkk' | 'alumni', userNisn?: string) => {
        const allMails = get().mails;
        if (role === 'admin_bkk') {
          return allMails.filter((m) => m.recipientRole === 'admin_bkk');
        }
        return allMails.filter(
          (m) =>
            m.recipientRole === 'all' ||
            (m.recipientRole === 'alumni' &&
              (!m.recipientNisn || m.recipientNisn === userNisn))
        );
      },

      getUnreadCount: (role: 'admin_bkk' | 'alumni', userNisn?: string) => {
        const userMails = get().getMailsForUser(role, userNisn);
        return userMails.filter((m) => !m.isRead).length;
      },

      fetchMailsFromBackend: async () => {
        try {
          const { adminMessagesApi } = await import('@/services/adminService');
          const res = await adminMessagesApi.list({ limit: 50 });
          if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
            const mapped: MailItem[] = res.data.map((item: any) => ({
              id: item.id,
              senderName: item.nama || item.alumni?.namaLengkap || 'Pengirim',
              senderRole: item.alumniId ? 'alumni' : 'system',
              senderEmail: item.email || '',
              senderNisn: item.alumni?.nisn,
              senderMajor: item.alumni?.jurusan,
              senderGradYear: item.alumni?.tahunLulus,
              senderAvatarGender: /^(citra|mega|olivia|qori|siti|vina|yasmin|bella|gita|indah|dwi|ani|nur|rina)/i.test(item.nama) ? 'P' : 'L',
              recipientRole: 'admin_bkk',
              subject: item.subject,
              preview: item.message?.slice(0, 90) + (item.message?.length > 90 ? '...' : ''),
              body: item.message,
              category: 'inquiry',
              createdAt: item.createdAt || new Date().toISOString(),
              isRead: item.status !== 'UNREAD',
            }));

            set({ mails: mapped });
            return true;
          }
        } catch (err) {
          console.warn('[MailStore] Fetch messages from backend fallback:', err);
        }
        return false;
      },
    })
);
