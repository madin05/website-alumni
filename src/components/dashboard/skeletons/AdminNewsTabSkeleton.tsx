import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export const AdminNewsTabSkeleton: React.FC = () => {
  return (
    <div
      className="space-y-6 animate-in fade-in duration-200"
      aria-busy="true"
      aria-label="Memuat kelola berita..."
    >
      {/* Header Banner */}
      <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Skeleton className="h-6 w-56 bg-slate-200" />
        </div>
        <Skeleton className="h-9 w-36 rounded-full bg-slate-200 shrink-0" />
      </div>

      {/* Statistics Cards (3 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((card) => (
          <div
            key={card}
            className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-2"
          >
            <Skeleton className="h-3.5 w-28 bg-slate-200" />
            <Skeleton className="h-7 w-20 bg-slate-300" />
            <Skeleton className="h-3 w-40 bg-slate-100" />
          </div>
        ))}
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1">
          <Skeleton className="h-9 w-full sm:w-72 rounded-lg bg-slate-100" />
          <Skeleton className="h-9 w-full sm:w-48 rounded-lg bg-slate-100" />
        </div>
        <Skeleton className="h-4 w-32 bg-slate-100 self-end sm:self-center" />
      </div>

      {/* News Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div>
              {/* Image Box */}
              <div className="h-44 w-full bg-slate-200 relative overflow-hidden">
                <div className="absolute top-3 left-3">
                  <Skeleton className="h-5 w-20 rounded-md bg-slate-300" />
                </div>
              </div>

              {/* Body */}
              <div className="p-4.5 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-20 bg-slate-200" />
                  <span className="text-slate-300">•</span>
                  <Skeleton className="h-3 w-16 bg-slate-100" />
                </div>
                <Skeleton className="h-5 w-full bg-slate-200" />
                <Skeleton className="h-5 w-4/5 bg-slate-200" />
                <Skeleton className="h-3.5 w-full bg-slate-100 pt-1" />
                <Skeleton className="h-3.5 w-3/4 bg-slate-100" />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-4.5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between mt-4">
              <Skeleton className="h-3.5 w-24 bg-slate-200" />
              <div className="flex gap-1.5">
                <Skeleton className="w-14 h-7 rounded-lg bg-slate-200" />
                <Skeleton className="w-14 h-7 rounded-lg bg-slate-200" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Footer */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <Skeleton className="h-4 w-48 bg-slate-100" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20 rounded-lg bg-slate-100" />
          <Skeleton className="h-8 w-8 rounded-lg bg-slate-200" />
          <Skeleton className="h-8 w-8 rounded-lg bg-slate-100" />
          <Skeleton className="h-8 w-20 rounded-lg bg-slate-100" />
        </div>
      </div>
    </div>
  );
};
