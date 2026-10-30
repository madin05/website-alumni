import React from "react";
import { GraduationCap, ChevronDown } from "lucide-react";
import { RespondentRecord } from "@/store/adminStore";

interface DrawerKuliahCardProps {
  kuliah: NonNullable<RespondentRecord["fullPayload"]["detail_kuliah"]>;
  isOpen: boolean;
  onToggle: () => void;
}

export const DrawerKuliahCard: React.FC<DrawerKuliahCardProps> = ({
  kuliah,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="rounded-xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs transition">
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-3.5 sm:p-4 bg-slate-50/70 hover:bg-slate-100/70 flex items-center justify-between gap-3 text-left transition cursor-pointer border-b border-transparent data-[open=true]:border-slate-100"
        data-open={isOpen}
      >
        <div className="flex items-center gap-3 min-w-0">
          <GraduationCap className="w-5 h-5 text-[#0d2346] shrink-0" />
          <div className="min-w-0">
            <span className="font-bold text-xs sm:text-sm text-slate-700 leading-snug block">
              Rincian Perguruan Tinggi
            </span>
            <p className="text-xs text-slate-500 truncate mt-0.5">
              {kuliah.nama_kampus} • {kuliah.program_studi} ({kuliah.jenjang})
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
          <span className="hidden sm:inline">
            {isOpen ? "Tutup Rincian" : "Buka Rincian"}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="p-4 sm:p-5 space-y-4 text-xs animate-in fade-in duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-slate-500 block font-medium">
                Nama Kampus / Perguruan Tinggi:
              </span>
              <span className="font-semibold text-slate-700 text-sm block leading-relaxed">
                {kuliah.nama_kampus}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 block font-medium">
                Program Studi & Jenjang:
              </span>
              <span className="font-semibold text-slate-700 text-sm block leading-relaxed">
                {kuliah.program_studi} ({kuliah.jenjang})
              </span>
            </div>
            {kuliah.keselarasan_studi && (
              <div className="space-y-1 sm:col-span-2 pt-2 border-t border-slate-100">
                <span className="text-slate-500 block font-medium">
                  Keselarasan Program Studi dengan SMK:
                </span>
                <span className="font-semibold text-slate-700 text-sm block leading-relaxed">
                  {kuliah.keselarasan_studi}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

