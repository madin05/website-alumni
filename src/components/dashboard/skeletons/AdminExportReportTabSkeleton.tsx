import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export const AdminExportReportTabSkeleton: React.FC = () => {
  return (
    <div
      className="space-y-6 animate-in fade-in duration-200"
      aria-busy="true"
      aria-label="Memuat laporan rekapitulasi..."
    >
      {/* Header Banner */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Skeleton className="h-6 w-64 sm:w-80 bg-slate-200" />
          <Skeleton className="h-3.5 w-80 sm:w-96 bg-slate-100" />
        </div>
      </div>

      {/* 2 Main Export Cards Grid (Split 2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: Spreadsheet Exports */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div>
              <Skeleton className="h-5 w-56 bg-slate-200" />
              <Skeleton className="h-3.5 w-72 bg-slate-100 mt-1" />
            </div>

            <div className="space-y-2.5 pt-2">
              <Skeleton className="h-3.5 w-32 bg-slate-200" />
              <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
                <div className="p-3.5 flex items-start gap-3 bg-slate-50/50">
                  <Skeleton className="w-4 h-4 rounded-full bg-slate-300 shrink-0 mt-0.5" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-48 bg-slate-200" />
                    <Skeleton className="h-3 w-full bg-slate-100" />
                  </div>
                </div>
                <div className="p-3.5 flex items-start gap-3">
                  <Skeleton className="w-4 h-4 rounded-full bg-slate-200 shrink-0 mt-0.5" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-52 bg-slate-200" />
                    <Skeleton className="h-3 w-3/4 bg-slate-100" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons: 2 Columns */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Skeleton className="h-11 w-full rounded-full bg-[#0d2346]/20" />
            <Skeleton className="h-11 w-full rounded-full bg-slate-100" />
          </div>
        </div>

        {/* Right Card: Direct Download Official Letterhead Summary */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div>
              <Skeleton className="h-5 w-60 bg-slate-200" />
              <Skeleton className="h-3.5 w-64 bg-slate-100 mt-1" />
            </div>

            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-full bg-slate-100" />
              <Skeleton className="h-3.5 w-4/5 bg-slate-100" />
            </div>

            {/* Summary Checklist Points */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2.5">
              {[1, 2, 3, 4].map((pt) => (
                <div key={pt} className="flex items-center gap-2.5">
                  <Skeleton className="w-4 h-4 rounded-full bg-slate-300 shrink-0" />
                  <Skeleton className="h-3.5 w-full max-w-xs bg-slate-200" />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons: 2 Columns */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Skeleton className="h-11 w-full rounded-full bg-[#0d2346]/20" />
            <Skeleton className="h-11 w-full rounded-full bg-slate-100" />
          </div>
        </div>
      </div>

      {/* Bottom Section: Preview Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <Skeleton className="h-4 w-44 bg-slate-200" />
            <Skeleton className="h-3 w-60 bg-slate-100" />
          </div>
          <Skeleton className="h-6 w-32 rounded-full bg-slate-100" />
        </div>

        {/* Table Head */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
          <Skeleton className="h-3.5 w-24 bg-slate-200" />
          <Skeleton className="h-3.5 w-36 bg-slate-200" />
          <Skeleton className="h-3.5 w-32 bg-slate-200" />
          <Skeleton className="h-3.5 w-28 bg-slate-200" />
          <Skeleton className="h-3.5 w-24 bg-slate-200" />
          <Skeleton className="h-3.5 w-20 bg-slate-200" />
        </div>

        {/* Table Body */}
        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5].map((r) => (
            <div key={r} className="p-3.5 flex justify-between items-center gap-3">
              <Skeleton className="h-3.5 w-20 bg-slate-200" />
              <Skeleton className="h-3.5 w-32 bg-slate-200" />
              <Skeleton className="h-3.5 w-40 bg-slate-100" />
              <Skeleton className="h-3.5 w-24 bg-slate-100" />
              <Skeleton className="h-5 w-20 rounded bg-slate-100" />
              <Skeleton className="h-3.5 w-16 bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
