import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NewsItem, JobVacancy } from '@/types/tracer';
import { MOCK_NEWS, MOCK_JOBS } from '@/lib/mockData';

interface ContentState {
  newsList: NewsItem[];
  jobList: JobVacancy[];

  // News Actions
  addNews: (news: Omit<NewsItem, 'id'>) => NewsItem;
  updateNews: (id: string, updates: Partial<NewsItem>) => void;
  deleteNews: (id: string) => void;
  resetNewsToDefault: () => void;
  fetchNewsFromBackend: () => Promise<boolean>;

  // Job Vacancy Actions
  addJob: (job: Omit<JobVacancy, 'id'>) => JobVacancy;
  updateJob: (id: string, updates: Partial<JobVacancy>) => void;
  deleteJob: (id: string) => void;
  resetJobsToDefault: () => void;
  fetchJobsFromBackend: () => Promise<boolean>;

  syncAllContentFromBackend: () => Promise<void>;
}

export const useContentStore = create<ContentState>()(
  (set, get) => ({
    newsList: [],
    jobList: [],

      // News Actions
      addNews: (newsData) => {
        const newNews: NewsItem = {
          ...newsData,
          id: `news-${Date.now()}`,
        };
        set((state) => ({
          newsList: [newNews, ...state.newsList],
        }));

        import('@/services/adminService').then(({ adminNewsApi }) => {
          adminNewsApi.create({
            title: newsData.title,
            excerpt: newsData.excerpt,
            content: newsData.content,
            category: newsData.category,
            date: newsData.date ? new Date(newsData.date).toISOString() : new Date().toISOString(),
            readTime: newsData.readTime || '3 min baca',
            imageUrl: newsData.imageUrl,
            author: newsData.author || 'Admin BKK',
            isPublished: true,
          }).catch((err) => {
            console.warn('[ContentStore] Backend news create sync fallback:', err);
          });
        });

        return newNews;
      },

      updateNews: (id, updates) => {
        set((state) => ({
          newsList: state.newsList.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));

        if (!id.startsWith('news-mock-') && !id.startsWith('news-0')) {
          import('@/services/adminService').then(({ adminNewsApi }) => {
            adminNewsApi.update(id, updates as any).catch((err) => {
              console.warn('[ContentStore] Backend news update sync fallback:', err);
            });
          });
        }
      },

      deleteNews: (id) => {
        set((state) => ({
          newsList: state.newsList.filter((item) => item.id !== id),
        }));

        if (!id.startsWith('news-mock-') && !id.startsWith('news-0')) {
          import('@/services/adminService').then(({ adminNewsApi }) => {
            adminNewsApi.delete(id).catch((err) => {
              console.warn('[ContentStore] Backend news delete sync fallback:', err);
            });
          });
        }
      },

      resetNewsToDefault: () => {
        set({ newsList: MOCK_NEWS });
      },

      fetchNewsFromBackend: async () => {
        try {
          const { adminNewsApi } = await import('@/services/adminService');
          const res = await adminNewsApi.list({ limit: 50 });
          if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
            const mapped: NewsItem[] = res.data.map((item: any) => ({
              id: item.id,
              title: item.title,
              excerpt: item.excerpt,
              content: item.content,
              category: item.category,
              date: typeof item.date === 'string' ? item.date.split('T')[0] : '2026-10-01',
              readTime: item.readTime || '3 min baca',
              imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
              author: item.author || 'Tim BKK Sasmita',
              slug: item.slug || item.id,
            }));
            set({ newsList: mapped });
            return true;
          }
        } catch (err) {
          console.warn('[ContentStore] Fetch news from backend fallback:', err);
        }
        return false;
      },

      // Job Vacancy Actions
      addJob: (jobData) => {
        const newJob: JobVacancy = {
          ...jobData,
          id: `job-${Date.now()}`,
        };
        set((state) => ({
          jobList: [newJob, ...state.jobList],
        }));

        import('@/services/adminService').then(({ adminJobsApi }) => {
          const parseIndonesianDate = (dateStr: string): Date => {
            const monthMap: Record<string, number> = {
              'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'Mei': 4, 'Jun': 5,
              'Jul': 6, 'Agu': 7, 'Sep': 8, 'Okt': 9, 'Nov': 10, 'Des': 11,
              'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
              'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
            };
            const parts = dateStr.trim().split(' ');
            if (parts.length === 3) {
              const day = parseInt(parts[0], 10);
              const month = monthMap[parts[1]] ?? 0;
              const year = parseInt(parts[2], 10);
              return new Date(year, month, day);
            }
            const d = new Date(dateStr);
            return isNaN(d.getTime()) ? new Date(Date.now() + 30 * 86400000) : d;
          };

          adminJobsApi.create({
            title: jobData.title,
            company: jobData.company,
            companyLogo: jobData.companyLogo,
            location: jobData.location,
            type: jobData.type,
            salary: jobData.salary,
            targetMajors: jobData.targetMajors as any,
            deadline: jobData.deadline ? parseIndonesianDate(jobData.deadline).toISOString() : new Date(Date.now() + 30 * 86400000).toISOString(),
            description: jobData.description,
            requirements: jobData.requirements,
            contactPerson: jobData.contactPerson,
            isBkkPartner: jobData.isBkkPartner,
          }).catch((err) => {
            console.warn('[ContentStore] Backend job create sync fallback:', err);
          });
        });

        return newJob;
      },

      updateJob: (id, updates) => {
        set((state) => ({
          jobList: state.jobList.map((job) =>
            job.id === id ? { ...job, ...updates } : job
          ),
        }));

        if (!id.startsWith('job-mock-') && !id.startsWith('job-0')) {
          import('@/services/adminService').then(({ adminJobsApi }) => {
            const parseIndonesianDate = (dateStr: string): Date => {
              const monthMap: Record<string, number> = {
                'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'Mei': 4, 'Jun': 5,
                'Jul': 6, 'Agu': 7, 'Sep': 8, 'Okt': 9, 'Nov': 10, 'Des': 11,
                'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
                'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
              };
              const parts = dateStr.trim().split(' ');
              if (parts.length === 3) {
                const day = parseInt(parts[0], 10);
                const month = monthMap[parts[1]] ?? 0;
                const year = parseInt(parts[2], 10);
                return new Date(year, month, day);
              }
              const d = new Date(dateStr);
              return isNaN(d.getTime()) ? new Date(Date.now() + 30 * 86400000) : d;
            };

            const payload = { ...updates };
            if (payload.deadline) {
              payload.deadline = parseIndonesianDate(payload.deadline as string).toISOString();
            }
            adminJobsApi.update(id, payload as any).catch((err) => {
              console.warn('[ContentStore] Backend job update sync fallback:', err);
            });
          });
        }
      },

      deleteJob: (id) => {
        set((state) => ({
          jobList: state.jobList.filter((job) => job.id !== id),
        }));

        if (!id.startsWith('job-mock-') && !id.startsWith('job-0')) {
          import('@/services/adminService').then(({ adminJobsApi }) => {
            adminJobsApi.delete(id).catch((err) => {
              console.warn('[ContentStore] Backend job delete sync fallback:', err);
            });
          });
        }
      },

      resetJobsToDefault: () => {
        set({ jobList: MOCK_JOBS });
      },

      fetchJobsFromBackend: async () => {
        try {
          const { adminJobsApi } = await import('@/services/adminService');
          const res = await adminJobsApi.listPublic({ limit: 50 });
          if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
            const mapped: JobVacancy[] = res.data.map((item: any) => ({
              id: item.id,
              title: item.title,
              company: item.company,
              companyLogo: item.companyLogo || '',
              location: item.location,
              type: item.type,
              salary: item.salary,
              targetMajors: Array.isArray(item.targetMajors) ? item.targetMajors : [],
              postedAt: typeof item.postedAt === 'string' ? item.postedAt.split('T')[0] : '2026-10-01',
              deadline: typeof item.deadline === 'string' ? item.deadline.split('T')[0] : '2026-11-30',
              description: item.description,
              requirements: Array.isArray(item.requirements) ? item.requirements : [],
              contactPerson: item.contactPerson,
              isBkkPartner: Boolean(item.isBkkPartner),
            }));
            set({ jobList: mapped });
            return true;
          }
        } catch (err) {
          console.warn('[ContentStore] Fetch jobs from backend fallback:', err);
        }
        return false;
      },

      syncAllContentFromBackend: async () => {
        await Promise.allSettled([
          get().fetchNewsFromBackend(),
          get().fetchJobsFromBackend(),
        ]);
      },
    })
);
