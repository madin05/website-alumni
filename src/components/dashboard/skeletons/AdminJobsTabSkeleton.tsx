import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export const AdminJobsTabSkeleton: React.FC = () => {
  return (
    <div
      className="space-y-6"
      aria-busy="true"
      aria-label="Memuat kelola lowongan kerja..."
    >
      {/* Header Banner */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <Skeleton className="h-6 w-56 bg-slate-200" />
          <Skeleton className="h-3.5 w-72 bg-slate-100" />
        </div>
        <Skeleton className="h-9 w-44 rounded-xl bg-slate-200" />
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((c) => (
          <div
            key={c}
            className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-2"
          >
            <Skeleton className="h-3.5 w-28 bg-slate-200" />
            <Skeleton className="h-7 w-16 bg-slate-300" />
            <Skeleton className="h-3 w-36 bg-slate-100" />
          </div>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8">
            <Skeleton className="h-10 w-full rounded-xl bg-slate-100" />
          </div>
          <div className="sm:col-span-4">
            <Skeleton className="h-10 w-full rounded-xl bg-slate-100" />
          </div>
        </div>
      </div>

      {/* Job Cards Grid (2 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {[1, 2, 3, 4].map((j) => (
          <div
            key={j}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Skeleton className="w-12 h-12 rounded-xl bg-slate-200 shrink-0" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-5 w-44 bg-slate-200" />
                    <Skeleton className="h-3.5 w-32 bg-slate-100" />
                  </div>
                </div>
                <Skeleton className="h-5 w-16 rounded-full bg-slate-100" />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-3.5 w-24 bg-slate-200" />
                  <Skeleton className="h-3.5 w-28 bg-slate-200" />
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <Skeleton className="h-5 w-16 rounded bg-slate-100" />
                  <Skeleton className="h-5 w-16 rounded bg-slate-100" />
                  <Skeleton className="h-5 w-20 rounded bg-slate-100" />
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <Skeleton className="h-3.5 w-28 bg-slate-100" />
              <div className="flex gap-1.5">
                <Skeleton className="h-8 w-20 rounded-lg bg-slate-100" />
                <Skeleton className="h-8 w-8 rounded-lg bg-slate-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
