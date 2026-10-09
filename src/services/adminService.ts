import { useAuthStore } from '@/store/authStore';
import { MasterAlumniRecord, RespondentRecord, VerificationStatus, AdminSettings } from '@/store/adminStore';
import { NewsItem, JobVacancy } from '@/types/tracer';
import { MailItem } from '@/store/mailStore';

const API_BASE = (import.meta as any).env?.VITE_API_URL || '';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  errors?: Record<string, string[]>;
}

async function fetchWithAuth<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const { accessToken } = useAuthStore.getState();
  const base = API_BASE || '';

  const isDeleteNoBody = options.method === 'DELETE' && (!options.body || options.body === '');

  const headers: Record<string, string> = {
    ...(isDeleteNoBody ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers as Record<string, string>),
  };

  if (accessToken && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${accessToken}`;
    console.log('[AdminService] fetchWithAuth - Authorization header set');
  } else {
    console.log('[AdminService] fetchWithAuth - NO accessToken or already has Authorization');
  }

  const res = await fetch(`${base}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({ message: `HTTP ${res.status}: ${res.statusText}` }));
    console.error('[AdminService] fetchWithAuth error:', res.status, errorJson);
    throw new Error(errorJson.message || `Request failed with status ${res.status}`);
  }

  // Handle 204 No Content
  if (res.status === 204) return { success: true } as T;

  return await res.json();
}

// ----------------------------------------------------
// 1. Master Alumni API
// ----------------------------------------------------
export const adminMasterAlumniApi = {
  async list(params?: {
    page?: number;
    limit?: number;
    search?: string;
    jurusan?: string;
    statusTracer?: 'SUDAH' | 'BELUM';
    tahunLulus?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.search) query.append('search', params.search);
    if (params?.jurusan && params.jurusan !== 'ALL') query.append('jurusan', params.jurusan);
    if (params?.statusTracer && params.statusTracer !== 'ALL' as any) query.append('statusTracer', params.statusTracer);
    if (params?.tahunLulus) query.append('tahunLulus', params.tahunLulus.toString());
    if (params?.sortBy) query.append('sortBy', params.sortBy);
    if (params?.sortOrder) query.append('sortOrder', params.sortOrder);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchWithAuth<ApiResponse<any[]>>(`/api/v1/master-alumni${queryString}`);
  },

  async listPublic(params?: {
    page?: number;
    limit?: number;
    search?: string;
    jurusan?: string;
    statusTracer?: 'SUDAH' | 'BELUM';
    tahunLulus?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.search) query.append('search', params.search);
    if (params?.jurusan && params.jurusan !== 'ALL') query.append('jurusan', params.jurusan);
    if (params?.statusTracer && params.statusTracer !== 'ALL' as any) query.append('statusTracer', params.statusTracer);
    if (params?.tahunLulus) query.append('tahunLulus', params.tahunLulus.toString());
    if (params?.sortBy) query.append('sortBy', params.sortBy);
    if (params?.sortOrder) query.append('sortOrder', params.sortOrder);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const base = API_BASE || '';
    const res = await fetch(`${base}/api/v1/public/alumni${queryString}`);
    return await res.json();
  },

  async getById(id: string) {
    return fetchWithAuth<ApiResponse<any>>(`/api/v1/master-alumni/${id}`);
  },

  async create(data: {
    nisn: string;
    nik?: string;
    nama: string;
    jurusan: string;
    tahunLulus: number;
    noWhatsapp?: string;
    email?: string;
  }) {
    return fetchWithAuth<ApiResponse<any>>('/api/v1/master-alumni', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, updates: Partial<{
    nisn: string;
    nik: string;
    nama: string;
    jurusan: string;
    tahunLulus: number;
    noWhatsapp: string;
    email: string;
  }>) {
    return fetchWithAuth<ApiResponse<any>>(`/api/v1/master-alumni/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async delete(id: string) {
    return fetchWithAuth<ApiResponse<null>>(`/api/v1/master-alumni/${id}`, {
      method: 'DELETE',
    });
  },

  async importCsv(records: any[], skipDuplicates = true) {
    return fetchWithAuth<ApiResponse<{ importedCount: number; duplicateCount: number; errors: any[] }>>('/api/v1/master-alumni/import', {
      method: 'POST',
      body: JSON.stringify({ records, skipDuplicates }),
    });
  },

  async getStats() {
    return fetchWithAuth<ApiResponse<{
      total: number;
      sudah: number;
      belum: number;
      responseRate: number;
      byJurusan: Record<string, { total: number; sudah: number; belum: number }>;
    }>>('/api/v1/master-alumni/stats');
  },
};

// ----------------------------------------------------
// 2. Verification API
// ----------------------------------------------------
export const adminVerificationApi = {
  async list(params?: {
    page?: number;
    limit?: number;
    verificationStatus?: VerificationStatus;
    statusKegiatan?: string;
    search?: string;
    sortBy?: 'submittedAt' | 'submissionId';
    sortOrder?: 'asc' | 'desc';
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.verificationStatus && params.verificationStatus !== 'ALL' as any) query.append('verificationStatus', params.verificationStatus);
    if (params?.statusKegiatan && params.statusKegiatan !== 'ALL') query.append('statusKegiatan', params.statusKegiatan);
    if (params?.search) query.append('search', params.search);
    if (params?.sortBy) query.append('sortBy', params.sortBy);
    if (params?.sortOrder) query.append('sortOrder', params.sortOrder);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchWithAuth<ApiResponse<any[]>>(`/api/v1/verification${queryString}`);
  },

  async updateStatus(submissionIdOrId: string, status: VerificationStatus, note?: string) {
    return fetchWithAuth<ApiResponse<any>>(`/api/v1/verification/${submissionIdOrId}`, {
      method: 'PUT',
      body: JSON.stringify({
        verificationStatus: status,
        verificationNote: note || '',
      }),
    });
  },

  async getStats() {
    return fetchWithAuth<ApiResponse<{
      total: number;
      pending: number;
      valid: number;
      revisi: number;
      byStatus: Array<{ status: string; count: number }>;
    }>>('/api/v1/verification/stats');
  },
};

// ----------------------------------------------------
// 3. News Management API
// ----------------------------------------------------
export const adminNewsApi = {
  async list(params?: {
    page?: number;
    limit?: number;
    category?: string;
    isPublished?: boolean;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.category && params.category !== 'Semua') query.append('category', params.category);
    if (params?.isPublished !== undefined) query.append('isPublished', String(params.isPublished));
    if (params?.search) query.append('search', params.search);
    if (params?.sortBy) query.append('sortBy', params.sortBy);
    if (params?.sortOrder) query.append('sortOrder', params.sortOrder);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchWithAuth<ApiResponse<any[]>>(`/api/v1/news${queryString}`);
  },

  async getById(id: string) {
    return fetchWithAuth<ApiResponse<any>>(`/api/v1/news/${id}`);
  },

  async create(data: {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    date?: string;
    readTime: string;
    imageUrl?: string;
    author: string;
    isPublished?: boolean;
  }) {
    return fetchWithAuth<ApiResponse<any>>('/api/v1/news', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, updates: Partial<{
    title: string;
    excerpt: string;
    content: string;
    category: string;
    date: string;
    readTime: string;
    imageUrl: string;
    author: string;
    isPublished: boolean;
  }>) {
    return fetchWithAuth<ApiResponse<any>>(`/api/v1/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async delete(id: string) {
    return fetchWithAuth<ApiResponse<null>>(`/api/v1/news/${id}`, {
      method: 'DELETE',
    });
  },
};

// ----------------------------------------------------
// 4. Jobs Management API
// ----------------------------------------------------
export const adminJobsApi = {
  async list(params?: {
    page?: number;
    limit?: number;
    type?: string;
    location?: string;
    targetMajor?: string;
    isActive?: boolean;
    isBkkPartner?: boolean;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.type && params.type !== 'Semua') query.append('type', params.type);
    if (params?.location) query.append('location', params.location);
    if (params?.targetMajor && params.targetMajor !== 'Semua') query.append('targetMajor', params.targetMajor);
    if (params?.isActive !== undefined) query.append('isActive', String(params.isActive));
    if (params?.isBkkPartner !== undefined) query.append('isBkkPartner', String(params.isBkkPartner));
    if (params?.search) query.append('search', params.search);
    if (params?.sortBy) query.append('sortBy', params.sortBy);
    if (params?.sortOrder) query.append('sortOrder', params.sortOrder);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchWithAuth<ApiResponse<any[]>>(`/api/v1/jobs${queryString}`);
  },

  async listPublic(params?: {
    page?: number;
    limit?: number;
    type?: string;
    location?: string;
    targetMajor?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.type && params.type !== 'Semua') query.append('type', params.type);
    if (params?.location) query.append('location', params.location);
    if (params?.targetMajor && params.targetMajor !== 'Semua') query.append('targetMajor', params.targetMajor);
    if (params?.search) query.append('search', params.search);
    if (params?.sortBy) query.append('sortBy', params.sortBy);
    if (params?.sortOrder) query.append('sortOrder', params.sortOrder);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const base = API_BASE || '';
    const res = await fetch(`${base}/api/v1/public/jobs${queryString}`);
    return await res.json();
  },

  async getById(id: string) {
    return fetchWithAuth<ApiResponse<any>>(`/api/v1/jobs/${id}`);
  },

  async create(data: {
    title: string;
    company: string;
    companyLogo?: string;
    location: string;
    type: string;
    salary: string;
    targetMajors: string[];
    deadline: string;
    description: string;
    requirements: string[];
    contactPerson: string;
    isBkkPartner?: boolean;
  }) {
    return fetchWithAuth<ApiResponse<any>>('/api/v1/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, updates: Partial<{
    title: string;
    company: string;
    companyLogo: string;
    location: string;
    type: string;
    salary: string;
    targetMajors: string[];
    deadline: string;
    description: string;
    requirements: string[];
    contactPerson: string;
    isBkkPartner: boolean;
    isActive: boolean;
  }>) {
    return fetchWithAuth<ApiResponse<any>>(`/api/v1/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async delete(id: string) {
    return fetchWithAuth<ApiResponse<null>>(`/api/v1/jobs/${id}`, {
      method: 'DELETE',
    });
  },
};

// ----------------------------------------------------
// 5. Messages / Inbox API
// ----------------------------------------------------
export const adminMessagesApi = {
  async list(params?: {
    page?: number;
    limit?: number;
    status?: 'UNREAD' | 'FOLLOW_UP' | 'RESOLVED';
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    if (params?.sortBy) query.append('sortBy', params.sortBy);
    if (params?.sortOrder) query.append('sortOrder', params.sortOrder);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchWithAuth<ApiResponse<any[]>>(`/api/v1/messages${queryString}`);
  },

  async getById(id: string) {
    return fetchWithAuth<ApiResponse<any>>(`/api/v1/messages/${id}`);
  },

  async updateStatus(id: string, status: 'UNREAD' | 'FOLLOW_UP' | 'RESOLVED', resolvedBy?: string) {
    return fetchWithAuth<ApiResponse<any>>(`/api/v1/messages/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, resolvedBy }),
    });
  },

  async delete(id: string) {
    return fetchWithAuth<ApiResponse<null>>(`/api/v1/messages/${id}`, {
      method: 'DELETE',
    });
  },

  async getStats() {
    return fetchWithAuth<ApiResponse<{
      total: number;
      unread: number;
      followUp: number;
      resolved: number;
    }>>('/api/v1/messages/stats');
  },
};

// ----------------------------------------------------
// 6. Settings API
// ----------------------------------------------------
export const adminSettingsApi = {
  async get() {
    return fetchWithAuth<ApiResponse<AdminSettings>>('/api/v1/settings');
  },

  async update(settings: Partial<AdminSettings>) {
    return fetchWithAuth<ApiResponse<AdminSettings>>('/api/v1/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  async reset() {
    return fetchWithAuth<ApiResponse<AdminSettings>>('/api/v1/settings/reset', {
      method: 'POST',
    });
  },
};

// ----------------------------------------------------
// 7. Reports & Overview Dashboard API
// ----------------------------------------------------
export const adminReportsApi = {
  async getDashboardStats() {
    return fetchWithAuth<ApiResponse<{
      totalAlumni: number;
      totalSubmissions: number;
      responseRate: number;
      verification: { pending: number; valid: number; revisi: number };
      bmw: Record<string, number>;
      byJurusan: Record<string, { total: number; kerja: number; kuliah: number; wirausaha: number }>;
    }>>('/api/v1/reports/dashboard');
  },

  async getTracerStudyReport(params?: {
    tahunLulus?: number;
    jurusan?: string;
    statusKegiatan?: string;
    verificationStatus?: VerificationStatus;
  }) {
    const query = new URLSearchParams();
    if (params?.tahunLulus) query.append('tahunLulus', params.tahunLulus.toString());
    if (params?.jurusan && params.jurusan !== 'ALL') query.append('jurusan', params.jurusan);
    if (params?.statusKegiatan && params.statusKegiatan !== 'ALL') query.append('statusKegiatan', params.statusKegiatan);
    if (params?.verificationStatus && params.verificationStatus !== 'ALL' as any) query.append('verificationStatus', params.verificationStatus);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchWithAuth<ApiResponse<any>>(`/api/v1/reports/tracer-study${queryString}`);
  },

  async exportCsvUrl(params?: {
    tahunLulus?: number;
    jurusan?: string;
    statusKegiatan?: string;
    verificationStatus?: VerificationStatus;
  }) {
    const query = new URLSearchParams();
    if (params?.tahunLulus) query.append('tahunLulus', params.tahunLulus.toString());
    if (params?.jurusan && params.jurusan !== 'ALL') query.append('jurusan', params.jurusan);
    if (params?.statusKegiatan && params.statusKegiatan !== 'ALL') query.append('statusKegiatan', params.statusKegiatan);
    if (params?.verificationStatus && params.verificationStatus !== 'ALL' as any) query.append('verificationStatus', params.verificationStatus);

    const base = API_BASE || '';
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return `${base}/api/v1/reports/tracer-study/export${queryString}`;
  },
};
