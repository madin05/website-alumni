import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export const AdminMessagesTabSkeleton: React.FC = () => {
  return (
    <div
      className="space-y-5 sm:space-y-6"
      aria-busy="true"
      aria-label="Memuat kotak pesan admin..."
    >
      {/* Header Banner */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <Skeleton className="h-6 w-56 bg-slate-200" />
          <Skeleton className="h-3.5 w-80 bg-slate-100" />
        </div>
        <Skeleton className="h-9 w-36 rounded-xl bg-slate-200" />
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        {[1, 2, 3].map((c) => (
          <div
            key={c}
            className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-2"
          >
            <Skeleton className="h-3.5 w-24 bg-slate-200" />
            <Skeleton className="h-7 w-16 bg-slate-300" />
            <Skeleton className="h-3 w-32 bg-slate-100" />
          </div>
        ))}
      </div>

      {/* Main Mail Center Inbox */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
        {/* Search & Filter Header Bar */}
        <div className="p-4 border-b border-slate-200 space-y-3.5 bg-slate-50/40">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <Skeleton className="h-10 flex-1 rounded-xl bg-white" />
            <div className="flex gap-1.5 shrink-0">
              <Skeleton className="h-9 w-24 rounded-lg bg-slate-200" />
              <Skeleton className="h-9 w-28 rounded-lg bg-slate-100" />
            </div>
          </div>

          <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
            {[1, 2, 3, 4].map((k) => (
              <Skeleton key={k} className="h-7 w-24 rounded-md bg-slate-100" />
            ))}
          </div>
        </div>

        {/* Mail Items List */}
        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5].map((m) => (
            <div
              key={m}
              className="p-4 sm:p-4.5 flex items-start gap-3.5"
            >
              <Skeleton className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-36 bg-slate-200" />
                    <Skeleton className="h-4 w-20 rounded bg-slate-100 hidden sm:block" />
                  </div>
                  <Skeleton className="h-3 w-16 bg-slate-100" />
                </div>
                <Skeleton className="h-4 w-3/4 max-w-md bg-slate-200" />
                <Skeleton className="h-3.5 w-full max-w-xl bg-slate-100" />
                <div className="flex gap-2 pt-1">
                  <Skeleton className="h-5 w-24 rounded bg-slate-100" />
                  <Skeleton className="h-5 w-20 rounded bg-slate-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
