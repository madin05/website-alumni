import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export const AdminExportReportTabSkeleton: React.FC = () => {
  return (
    <div
      className="space-y-6"
      aria-busy="true"
      aria-label="Memuat laporan rekapitulasi..."
    >
      {/* Header Banner */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <Skeleton className="h-6 w-64 bg-slate-200" />
          <Skeleton className="h-3.5 w-80 bg-slate-100" />
        </div>
      </div>

      {/* 3 Format Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((f) => (
          <div
            key={f}
            className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="w-9 h-9 rounded-lg bg-slate-100" />
              <Skeleton className="w-5 h-5 rounded-full bg-slate-200" />
            </div>
            <Skeleton className="h-4 w-44 bg-slate-200" />
            <Skeleton className="h-3.5 w-full bg-slate-100" />
            <Skeleton className="h-3.5 w-3/4 bg-slate-100" />
          </div>
        ))}
      </div>

      {/* Action Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <Skeleton className="h-4 w-40 bg-slate-200" />
          <Skeleton className="h-3 w-56 bg-slate-100" />
        </div>
        <div className="flex gap-2.5">
          <Skeleton className="h-9 w-36 rounded-xl bg-slate-200" />
          <Skeleton className="h-9 w-36 rounded-xl bg-slate-100" />
        </div>
      </div>

      {/* Preview Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <Skeleton className="h-4 w-36 bg-slate-200" />
          <Skeleton className="h-3 w-28 bg-slate-100" />
        </div>

        <div className="p-3.5 bg-slate-100/70 border-b border-slate-200 flex justify-between">
          <Skeleton className="h-3.5 w-24 bg-slate-200" />
          <Skeleton className="h-3.5 w-36 bg-slate-200" />
          <Skeleton className="h-3.5 w-32 bg-slate-200" />
          <Skeleton className="h-3.5 w-28 bg-slate-200" />
          <Skeleton className="h-3.5 w-24 bg-slate-200" />
        </div>

        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5].map((r) => (
            <div key={r} className="p-3.5 flex justify-between items-center">
              <Skeleton className="h-3.5 w-20 bg-slate-200" />
              <Skeleton className="h-3.5 w-32 bg-slate-200" />
              <Skeleton className="h-3.5 w-40 bg-slate-100" />
              <Skeleton className="h-3.5 w-24 bg-slate-100" />
              <Skeleton className="h-5 w-20 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
