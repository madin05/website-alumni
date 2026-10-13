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

  // Job Vacancy Actions
  addJob: (job: Omit<JobVacancy, 'id'>) => JobVacancy;
  updateJob: (id: string, updates: Partial<JobVacancy>) => void;
  deleteJob: (id: string) => void;
  resetJobsToDefault: () => void;
}

export const useContentStore = create<ContentState>()(
  persist(
    (set, get) => ({
      newsList: MOCK_NEWS,
      jobList: MOCK_JOBS,

      // News Actions
      addNews: (newsData) => {
        const newNews: NewsItem = {
          ...newsData,
          id: `news-${Date.now()}`,
        };
        set((state) => ({
          newsList: [newNews, ...state.newsList],
        }));
        return newNews;
      },

      updateNews: (id, updates) => {
        set((state) => ({
          newsList: state.newsList.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
      },

      deleteNews: (id) => {
        set((state) => ({
          newsList: state.newsList.filter((item) => item.id !== id),
        }));
      },

      resetNewsToDefault: () => {
        set({ newsList: MOCK_NEWS });
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
        return newJob;
      },

      updateJob: (id, updates) => {
        set((state) => ({
          jobList: state.jobList.map((job) =>
            job.id === id ? { ...job, ...updates } : job
          ),
        }));
      },

      deleteJob: (id) => {
        set((state) => ({
          jobList: state.jobList.filter((job) => job.id !== id),
        }));
      },

      resetJobsToDefault: () => {
        set({ jobList: MOCK_JOBS });
      },
    }),
    {
      name: 'tracer_study_content_store_v3',
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (!persistedState || version < 2) {
          return {
            newsList: MOCK_NEWS,
            jobList: MOCK_JOBS,
          };
        }
        return persistedState;
      },
    }
  )
);
