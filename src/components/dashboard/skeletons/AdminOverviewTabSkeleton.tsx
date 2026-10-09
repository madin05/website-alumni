import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export const AdminOverviewTabSkeleton: React.FC = () => {
  return (
    <div
      className="space-y-6"
      aria-busy="true"
      aria-label="Memuat ringkasan dashboard admin..."
    >
      {/* 1. Header Banner Skeleton */}
      <div className="bg-[#0d2346] rounded-t-md p-6 sm:p-7 border border-[#163868] shadow-sm relative overflow-hidden">
        <div className="space-y-3 max-w-3xl">
          <Skeleton className="h-7 w-72 sm:w-96 bg-white/20" />
          <Skeleton className="h-4 w-full max-w-2xl bg-white/10" />
          <Skeleton className="h-4 w-3/4 max-w-lg bg-white/10" />

          <div className="mt-5 pt-2 flex flex-wrap items-center gap-3">
            <Skeleton className="h-9 w-44 rounded-xl bg-white/15" />
            <Skeleton className="h-9 w-52 rounded-xl bg-white/10" />
          </div>
        </div>
      </div>

      {/* 2. Notification Box Skeleton */}
      <div className="bg-amber-50/70 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <Skeleton className="w-9 h-9 rounded-full bg-slate-300 shrink-0" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-4 w-64 bg-amber-200/80" />
            <Skeleton className="h-3 w-80 bg-amber-200/50" />
          </div>
        </div>
        <Skeleton className="h-8 w-28 rounded-lg bg-slate-300 shrink-0" />
      </div>

      {/* 3. 4 Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-28 bg-slate-200" />
              <Skeleton className="w-7 h-7 rounded-lg bg-slate-100" />
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              <Skeleton className="h-8 w-20 bg-slate-200" />
              <Skeleton className="h-3 w-14 bg-slate-100" />
            </div>
            <Skeleton className="h-2.5 w-full bg-slate-100 rounded-full" />
            <Skeleton className="h-3 w-32 bg-slate-100" />
          </div>
        ))}
      </div>

      {/* 4. Split 2 Columns Layout (7 cols left, 5 cols right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Distribusi & Progress Kejuruan */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-3">
            <Skeleton className="h-5 w-56 bg-slate-200" />
            <Skeleton className="h-3.5 w-72 bg-slate-100" />
          </div>

          {/* 4 Status Boxes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-center"
              >
                <Skeleton className="h-3 w-16 mx-auto bg-slate-200" />
                <Skeleton className="h-6 w-12 mx-auto bg-slate-300" />
                <Skeleton className="h-2.5 w-10 mx-auto bg-slate-200" />
              </div>
            ))}
          </div>

          {/* Progress Bars per Jurusan */}
          <div className="space-y-4 pt-2">
            <Skeleton className="h-4 w-48 bg-slate-200" />
            {[1, 2, 3, 4, 5, 6].map((j) => (
              <div key={j} className="space-y-1.5">
                <div className="flex justify-between">
                  <Skeleton className="h-3.5 w-44 bg-slate-200" />
                  <Skeleton className="h-3.5 w-28 bg-slate-200" />
                </div>
                <Skeleton className="h-2.5 w-full rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Respon Kuesioner Terbaru */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="space-y-1">
              <Skeleton className="h-5 w-44 bg-slate-200" />
              <Skeleton className="h-3 w-32 bg-slate-100" />
            </div>
            <Skeleton className="h-7 w-20 rounded-lg bg-slate-100" />
          </div>

          {/* Respondent List Cards */}
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((r) => (
              <div
                key={r}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Skeleton className="w-9 h-9 rounded-full bg-slate-200 shrink-0" />
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <Skeleton className="h-4 w-32 bg-slate-200" />
                    <Skeleton className="h-3 w-40 bg-slate-100" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-full bg-slate-200 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
