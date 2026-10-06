import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export const AdminSettingsTabSkeleton: React.FC = () => {
  return (
    <div
      className="space-y-6"
      aria-busy="true"
      aria-label="Memuat pengaturan sistem..."
    >
      {/* Header Banner */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <Skeleton className="h-6 w-56 bg-slate-200" />
          <Skeleton className="h-3.5 w-80 bg-slate-100" />
        </div>
        <Skeleton className="h-9 w-36 rounded-xl bg-slate-200" />
      </div>

      {/* Main Settings Form Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-7 space-y-8">
        {/* Section 1: Target Sasaran & Periode */}
        <div className="space-y-4">
          <div className="space-y-1 pb-2 border-b border-slate-100">
            <Skeleton className="h-5 w-48 bg-slate-200" />
            <Skeleton className="h-3.5 w-72 bg-slate-100" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-36 bg-slate-200" />
              <Skeleton className="h-10 w-full rounded-xl bg-slate-100" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-32 bg-slate-200" />
              <Skeleton className="h-10 w-full rounded-xl bg-slate-100" />
            </div>
          </div>
        </div>

        {/* Section 2: Identitas Sekolah */}
        <div className="space-y-4">
          <div className="space-y-1 pb-2 border-b border-slate-100">
            <Skeleton className="h-5 w-52 bg-slate-200" />
            <Skeleton className="h-3.5 w-80 bg-slate-100" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-36 bg-slate-200" />
              <Skeleton className="h-10 w-full rounded-xl bg-slate-100" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-32 bg-slate-200" />
              <Skeleton className="h-10 w-full rounded-xl bg-slate-100" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-28 bg-slate-200" />
              <Skeleton className="h-10 w-full rounded-xl bg-slate-100" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-36 bg-slate-200" />
              <Skeleton className="h-10 w-full rounded-xl bg-slate-100" />
            </div>
          </div>
        </div>

        {/* Section 3: Pemeliharaan Basis Data */}
        <div className="space-y-4">
          <div className="space-y-1 pb-2 border-b border-slate-100">
            <Skeleton className="h-5 w-44 bg-slate-200" />
            <Skeleton className="h-3.5 w-64 bg-slate-100" />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <Skeleton className="h-4 w-40 bg-slate-200" />
              <Skeleton className="h-3 w-56 bg-slate-100" />
            </div>
            <Skeleton className="h-8 w-28 rounded-lg bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
};
