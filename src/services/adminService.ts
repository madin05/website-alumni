import { MasterAlumniRecord, RespondentRecord, AdminSettings, useAdminStore } from '@/store/adminStore';

export interface DashboardSyncResult {
  source: 'DATABASE_API' | 'LOCAL_STORE';
  isDbConnected: boolean;
  totalMaster: number;
  totalSubmitted: number;
  targetQuota: number;
  responseRate: string;
  countKerja: number;
  countKuliah: number;
  countWirausaha: number;
  countBelumKerja: number;
  lastSyncAt: string;
}

/**
 * Mendapatkan base URL API backend jika dikonfigurasi di environment (.env).
 * Contoh: VITE_API_URL="https://api.domainvps.com" atau "http://localhost:5000"
 */
export function getApiBaseUrl(): string | null {
  const envUrl =
    (import.meta as any).env?.VITE_API_URL ||
    (import.meta as any).env?.VITE_API_BASE_URL ||
    (import.meta as any).env?.VITE_BACKEND_URL;
  return envUrl ? String(envUrl).replace(/\/+$/, '') : null;
}

/**
 * Sinkronisasi data dashboard:
 * 1. SEKARANG (Mode Lokal / Offline / Mock):
 *    Membaca data reaktif dari Zustand Store yang telah terisi 250 master alumni
 *    dan 221 responden riil SMKS Sasmita Jaya 2 dari Excel.
 * 2. NANTI (Saat disambungkan ke Database VPS/Neon/Vercel):
 *    Jika VITE_API_URL aktif, fungsi ini akan otomatis melakukan fetch ke endpoint REST API
 *    backend (GET /api/v1/admin/dashboard) dan menyelaraskan store lokal dengan data database terbaru.
 */
export async function syncDashboardData(): Promise<DashboardSyncResult> {
  const apiBase = getApiBaseUrl();
  const adminState = useAdminStore.getState();

  // Jika API backend di VPS / Vercel sudah aktif:
  if (apiBase) {
    try {
      const response = await fetch(`${apiBase}/api/v1/admin/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        const data = result.data || result;

        // Perbarui store jika backend mengembalikan data master & responden terbaru
        if (Array.isArray(data.masterAlumni) && Array.isArray(data.respondents)) {
          useAdminStore.setState({
            masterAlumni: data.masterAlumni,
            respondents: data.respondents,
            settings: data.settings || adminState.settings,
          });
        }

        const masterList = data.masterAlumni || adminState.masterAlumni;
        const respList = data.respondents || adminState.respondents;
        const quota = data.settings?.targetQuota || adminState.settings.targetQuota || 250;
        const submitted = masterList.filter((a: MasterAlumniRecord) => a.statusTracer === 'SUDAH').length;

        return {
          source: 'DATABASE_API',
          isDbConnected: true,
          totalMaster: masterList.length,
          totalSubmitted: submitted,
          targetQuota: quota,
          responseRate: quota > 0 ? ((submitted / quota) * 100).toFixed(1) : '0',
          countKerja: respList.filter((r: RespondentRecord) => r.statusKegiatan === 'KERJA' || r.statusKegiatan === 'KERJA_KULIAH').length,
          countKuliah: respList.filter((r: RespondentRecord) => r.statusKegiatan === 'KULIAH' || r.statusKegiatan === 'KERJA_KULIAH' || r.statusKegiatan === 'WIRAUSAHA_KULIAH').length,
          countWirausaha: respList.filter((r: RespondentRecord) => r.statusKegiatan === 'WIRAUSAHA' || r.statusKegiatan === 'WIRAUSAHA_KULIAH').length,
          countBelumKerja: respList.filter((r: RespondentRecord) => r.statusKegiatan === 'BELUM_KERJA').length,
          lastSyncAt: new Date().toISOString(),
        };
      }
    } catch (err) {
      console.warn('Backend API belum terhubung atau offline, fallback ke data lokal terpadu:', err);
    }
  }

  // Fallback / Mode Standar: Menggunakan data lokal riil
  const masterList = adminState.masterAlumni;
  const respList = adminState.respondents;
  const quota = adminState.settings.targetQuota || 250;
  const submitted = masterList.filter((a) => a.statusTracer === 'SUDAH').length;

  return {
    source: 'LOCAL_STORE',
    isDbConnected: false,
    totalMaster: masterList.length,
    totalSubmitted: submitted,
    targetQuota: quota,
    responseRate: quota > 0 ? ((submitted / quota) * 100).toFixed(1) : '0',
    countKerja: respList.filter((r) => r.statusKegiatan === 'KERJA' || r.statusKegiatan === 'KERJA_KULIAH').length,
    countKuliah: respList.filter((r) => r.statusKegiatan === 'KULIAH' || r.statusKegiatan === 'KERJA_KULIAH' || r.statusKegiatan === 'WIRAUSAHA_KULIAH').length,
    countWirausaha: respList.filter((r) => r.statusKegiatan === 'WIRAUSAHA' || r.statusKegiatan === 'WIRAUSAHA_KULIAH').length,
    countBelumKerja: respList.filter((r) => r.statusKegiatan === 'BELUM_KERJA').length,
    lastSyncAt: new Date().toISOString(),
  };
}

/**
 * Mengirim pembaruan status verifikasi responden:
 * - Mengupdate store lokal secara instan.
 * - Jika VITE_API_URL aktif, juga mengirim permintaan PATCH ke backend database.
 */
export async function updateVerificationApi(
  submissionId: string,
  status: 'VALID' | 'PENDING' | 'REVISI',
  note?: string,
  verifiedBy = 'Admin BKK Sasmita'
): Promise<boolean> {
  // Update state lokal
  useAdminStore.getState().updateVerificationStatus(submissionId, status, note, verifiedBy);

  const apiBase = getApiBaseUrl();
  if (apiBase) {
    try {
      await fetch(`${apiBase}/api/v1/admin/respondents/${submissionId}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note, verifiedBy }),
      });
      return true;
    } catch (e) {
      console.warn('Gagal sync verifikasi ke backend:', e);
    }
  }
  return true;
}

/**
 * Menyimpan pengaturan admin (kuota target, pejabat, dll.):
 * - Mengupdate store lokal secara instan.
 * - Jika VITE_API_URL aktif, mengirim PUT ke backend database.
 */
export async function saveAdminSettingsApi(updates: Partial<AdminSettings>): Promise<boolean> {
  useAdminStore.getState().updateSettings(updates);

  const apiBase = getApiBaseUrl();
  if (apiBase) {
    try {
      await fetch(`${apiBase}/api/v1/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      return true;
    } catch (e) {
      console.warn('Gagal sync settings ke backend:', e);
    }
  }
  return true;
}
