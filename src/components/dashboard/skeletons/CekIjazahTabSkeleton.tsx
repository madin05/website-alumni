import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export const CekIjazahTabSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 sm:space-y-6" aria-busy="true" aria-label="Memuat data ijazah...">
      {/* Header */}
      <div className="space-y-1.5">
        <Skeleton className="h-6 sm:h-7 w-64 sm:w-80 bg-slate-200" />
        <Skeleton className="h-3.5 w-80 sm:w-96 bg-slate-100" />
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <Skeleton className="h-10 flex-1 bg-slate-100 rounded-xl" />
        <Skeleton className="h-10 w-full sm:w-28 bg-slate-200 rounded-xl" />
      </div>

      {/* Main Credential Verification Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl bg-slate-200 shrink-0" />
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-40 bg-slate-200/70" />
              <Skeleton className="h-5 sm:h-6 w-52 bg-slate-200" />
            </div>
          </div>
          <Skeleton className="h-8 w-36 rounded-lg bg-slate-200 shrink-0" />
        </div>

        {/* 6 Grid Items */}
        <div className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2.5"
              >
                <Skeleton className="h-3 w-28 bg-slate-200/70" />
                <Skeleton className="h-5 w-44 bg-slate-200" />
              </div>
            ))}
          </div>

          {/* Footer Verification Bar */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl bg-slate-100 shrink-0" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-48 bg-slate-200" />
                <Skeleton className="h-2.5 w-64 bg-slate-200/60" />
              </div>
            </div>
            <Skeleton className="h-8 w-28 rounded-xl bg-slate-200 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
};

