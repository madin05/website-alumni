import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export const AdminRespondentsTabSkeleton: React.FC = () => {
  return (
    <div
      className="space-y-5"
      aria-busy="true"
      aria-label="Memuat verifikasi kuesioner..."
    >
      {/* Header Banner */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <Skeleton className="h-6 w-56 bg-slate-200" />
          <Skeleton className="h-3.5 w-72 bg-slate-100" />
        </div>
        <Skeleton className="h-9 w-32 rounded-xl bg-slate-100" />
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        {/* Verification Status Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-100">
          <Skeleton className="h-8 w-28 rounded-lg bg-slate-200" />
          <Skeleton className="h-8 w-44 rounded-lg bg-slate-100" />
          <Skeleton className="h-8 w-32 rounded-lg bg-slate-100" />
          <Skeleton className="h-8 w-36 rounded-lg bg-slate-100" />
        </div>

        {/* Search & Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <Skeleton className="h-10 w-full rounded-xl bg-slate-100" />
          </div>
          <div className="sm:col-span-6">
            <Skeleton className="h-10 w-full rounded-xl bg-slate-100" />
          </div>
        </div>
      </div>

      {/* Data Table Skeleton */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-3.5 bg-slate-100/70 border-b border-slate-200 flex justify-between">
          <Skeleton className="h-4 w-28 bg-slate-200" />
          <Skeleton className="h-4 w-44 bg-slate-200" />
          <Skeleton className="h-4 w-32 bg-slate-200" />
          <Skeleton className="h-4 w-28 bg-slate-200" />
          <Skeleton className="h-4 w-20 bg-slate-200" />
        </div>

        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5, 6].map((row) => (
            <div
              key={row}
              className="p-3.5 flex items-center justify-between gap-4"
            >
              <div className="space-y-1 w-32">
                <Skeleton className="h-4 w-20 bg-slate-200" />
                <Skeleton className="h-3 w-28 bg-slate-100" />
              </div>

              <div className="flex items-center gap-2.5 flex-1 min-w-0 max-w-xs">
                <Skeleton className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-36 bg-slate-200" />
                  <Skeleton className="h-3 w-28 bg-slate-100" />
                </div>
              </div>

              <div className="w-36 hidden md:block">
                <Skeleton className="h-6 w-28 rounded-full bg-slate-100" />
              </div>

              <div className="w-32">
                <Skeleton className="h-6 w-24 rounded-md bg-slate-200" />
              </div>

              <div className="w-24 shrink-0 text-right">
                <Skeleton className="h-8 w-20 rounded-xl bg-slate-200 ml-auto" />
              </div>
            </div>
          ))}
        </div>

        {/* Table Footer / Pagination */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <Skeleton className="h-4 w-40 bg-slate-200" />
          <div className="flex gap-1.5">
            <Skeleton className="h-8 w-8 rounded-md bg-slate-200" />
            <Skeleton className="h-8 w-8 rounded-md bg-slate-100" />
            <Skeleton className="h-8 w-8 rounded-md bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
};
