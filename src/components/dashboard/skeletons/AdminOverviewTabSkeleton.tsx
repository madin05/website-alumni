import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export const AdminOverviewTabSkeleton: React.FC = () => {
  return (
    <div
      className="space-y-6 animate-in fade-in duration-200"
      aria-busy="true"
      aria-label="Memuat ringkasan dashboard admin..."
    >
      {/* 1. Header Banner Skeleton */}
      <div className="bg-[#0d2346] rounded-t-md p-6 sm:p-7 border border-[#163868] shadow-sm relative overflow-hidden">
        <div className="space-y-3 max-w-3xl">
          <Skeleton className="h-4 w-44 bg-white/20" />
          <Skeleton className="h-7 sm:h-8 w-72 sm:w-96 bg-white/30" />
          <Skeleton className="h-4 w-full max-w-xl bg-white/15" />
          <Skeleton className="h-4 w-3/4 max-w-md bg-white/10" />

          <div className="mt-6 pt-2 flex flex-wrap items-center gap-3">
            <Skeleton className="h-10 w-44 rounded-xl bg-white/20" />
            <Skeleton className="h-10 w-52 rounded-xl bg-white/10" />
          </div>
        </div>
      </div>

      {/* 2. 4 Quick Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-32 bg-slate-200" />
              <Skeleton className="w-8 h-8 rounded-lg bg-slate-100" />
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              <Skeleton className="h-8 w-20 bg-slate-200" />
              <Skeleton className="h-3.5 w-16 bg-slate-100" />
            </div>
            <Skeleton className="h-2 w-full bg-slate-100 rounded-full" />
            <Skeleton className="h-3 w-36 bg-slate-100" />
          </div>
        ))}
      </div>

      {/* 3. Split 2 Columns Layout (7 cols left, 5 cols right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Distribusi Status & Progress Kejuruan */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-6">
          <div className="space-y-1.5 border-b border-slate-100 pb-3">
            <Skeleton className="h-5 w-52 bg-slate-200" />
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
                <Skeleton className="h-7 w-12 mx-auto bg-slate-300" />
                <Skeleton className="h-2.5 w-10 mx-auto bg-slate-200" />
              </div>
            ))}
          </div>

          {/* Progress Bars per Jurusan */}
          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-52 bg-slate-200" />
              <Skeleton className="h-3 w-24 bg-slate-100" />
            </div>
            {[1, 2, 3, 4, 5, 6].map((j) => (
              <div key={j} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <Skeleton className="h-3.5 w-44 bg-slate-200" />
                  <Skeleton className="h-3.5 w-24 bg-slate-200" />
                </div>
                <Skeleton className="h-2 w-full rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Respon Kuesioner Terbaru */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="space-y-1">
              <Skeleton className="h-5 w-44 bg-slate-200" />
              <Skeleton className="h-3 w-32 bg-slate-100" />
            </div>
            <Skeleton className="h-4 w-24 bg-slate-100" />
          </div>

          {/* List Responden */}
          <div className="divide-y divide-slate-100">
            {[1, 2, 3, 4, 5].map((r) => (
              <div key={r} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Skeleton className="w-9 h-9 rounded-full bg-slate-200 shrink-0" />
                  <div className="space-y-1 min-w-0">
                    <Skeleton className="h-4 w-32 bg-slate-200" />
                    <Skeleton className="h-3 w-24 bg-slate-100" />
                  </div>
                </div>
                <div className="text-right space-y-1 shrink-0">
                  <Skeleton className="h-5 w-16 rounded-full bg-slate-100 ml-auto" />
                  <Skeleton className="h-2.5 w-12 bg-slate-100 ml-auto" />
                </div>
              </div>
            ))}
          </div>

          {/* Callout Box Rekapitulasi Laporan */}
          <div className="pt-3 border-t border-slate-100">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <Skeleton className="h-4 w-40 bg-slate-200" />
              <Skeleton className="h-3 w-full bg-slate-100" />
              <Skeleton className="h-8 w-32 rounded-lg bg-slate-200 mt-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
