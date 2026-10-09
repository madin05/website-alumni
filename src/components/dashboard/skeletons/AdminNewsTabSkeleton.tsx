import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export const AdminNewsTabSkeleton: React.FC = () => {
  return (
    <div
      className="space-y-6"
      aria-busy="true"
      aria-label="Memuat kelola berita..."
    >
      {/* Header Banner */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <Skeleton className="h-6 w-48 bg-slate-200" />
          <Skeleton className="h-3.5 w-72 bg-slate-100" />
        </div>
        <Skeleton className="h-9 w-36 rounded-xl bg-slate-200" />
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <Skeleton className="h-10 flex-1 rounded-xl bg-slate-100" />
          <Skeleton className="h-4 w-32 bg-slate-100 hidden sm:block" />
        </div>

        {/* Category Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[1, 2, 3, 4, 5, 6].map((cat) => (
            <Skeleton key={cat} className="h-8 w-24 rounded-lg bg-slate-100" />
          ))}
        </div>
      </div>

      {/* News Grid (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div>
              {/* Image Box */}
              <Skeleton className="h-44 w-full bg-slate-200 rounded-none relative">
                <div className="absolute top-3 left-3">
                  <Skeleton className="h-5 w-20 rounded-full bg-slate-300" />
                </div>
              </Skeleton>

              {/* Body */}
              <div className="p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-24 bg-slate-200" />
                  <Skeleton className="h-3 w-16 bg-slate-100" />
                </div>
                <Skeleton className="h-5 w-full bg-slate-200" />
                <Skeleton className="h-3.5 w-full bg-slate-100" />
                <Skeleton className="h-3.5 w-4/5 bg-slate-100" />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
              <Skeleton className="h-3.5 w-24 bg-slate-200" />
              <div className="flex gap-1.5">
                <Skeleton className="w-8 h-8 rounded-lg bg-slate-200" />
                <Skeleton className="w-8 h-8 rounded-lg bg-slate-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
