import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export const AdminJobsTabSkeleton: React.FC = () => {
  return (
    <div
      className="space-y-6 animate-in fade-in duration-200"
      aria-busy="true"
      aria-label="Memuat kelola lowongan kerja..."
    >
      {/* Header Banner */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Skeleton className="h-6 w-64 sm:w-80 bg-slate-200" />
          <Skeleton className="h-3.5 w-72 bg-slate-100" />
        </div>
        <Skeleton className="h-9 w-44 rounded-xl bg-slate-200 shrink-0" />
      </div>

      {/* 3 Quick Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        {[1, 2, 3].map((c) => (
          <div
            key={c}
            className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-1.5"
          >
            <Skeleton className="h-3 w-24 bg-slate-200" />
            <Skeleton className="h-7 w-16 bg-slate-300" />
            <Skeleton className="h-2.5 w-28 bg-slate-100" />
          </div>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Skeleton className="h-10 w-full rounded-xl bg-slate-100" />
          <Skeleton className="h-10 w-full rounded-xl bg-slate-100" />
          <Skeleton className="h-10 w-full rounded-xl bg-slate-100" />
        </div>
      </div>

      {/* Job Cards Grid (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((j) => (
          <div
            key={j}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Skeleton className="h-5 w-16 rounded-md bg-slate-200" />
                  <Skeleton className="h-5 w-20 rounded-md bg-slate-100" />
                </div>
                <Skeleton className="h-5 w-20 rounded-md bg-slate-100" />
              </div>

              <div className="space-y-1.5">
                <Skeleton className="h-5 w-48 bg-slate-200" />
                <Skeleton className="h-3.5 w-36 bg-slate-100" />
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Skeleton className="h-3.5 w-28 bg-slate-200" />
                  <Skeleton className="h-3.5 w-32 bg-slate-200" />
                </div>
                <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-slate-200/50">
                  <Skeleton className="h-3 w-28 bg-slate-100" />
                  <Skeleton className="h-3 w-24 bg-slate-100" />
                </div>
              </div>

              <div className="flex flex-wrap gap-1 pt-0.5">
                <Skeleton className="h-4 w-24 rounded bg-slate-100" />
                <Skeleton className="h-4 w-28 rounded bg-slate-100" />
              </div>
            </div>

            {/* Footer Action */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <Skeleton className="h-3.5 w-20 bg-slate-100" />
              <div className="flex gap-1.5">
                <Skeleton className="h-8 w-14 rounded-lg bg-slate-100" />
                <Skeleton className="h-8 w-14 rounded-lg bg-slate-100" />
                <Skeleton className="h-8 w-14 rounded-lg bg-slate-100" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Bar */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <Skeleton className="h-3.5 w-40 bg-slate-200" />
        <div className="flex gap-1.5">
          <Skeleton className="h-8 w-8 rounded-md bg-slate-200" />
          <Skeleton className="h-8 w-8 rounded-md bg-slate-100" />
        </div>
      </div>
    </div>
  );
};
