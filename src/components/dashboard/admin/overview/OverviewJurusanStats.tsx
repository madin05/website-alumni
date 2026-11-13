import React from "react";
import { ArrowRight, Info } from "lucide-react";

export interface JurusanStatItem {
  code: string;
  name: string;
  total: number;
  filled: number;
  percent: number;
}

interface OverviewJurusanStatsProps {
  jurusanStats: JurusanStatItem[];
  isAllYears: boolean;
  selectedYear: string;
  onNavigateTab: (tabId: string) => void;
}

export const OverviewJurusanStats: React.FC<OverviewJurusanStatsProps> = ({
  jurusanStats,
  isAllYears,
  selectedYear,
  onNavigateTab,
}) => {
  return (
    <div className="lg:col-span-7 bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-xs sm:text-sm text-slate-900">
              Pengisian per Program Keahlian
            </h3>
            <div
              className="relative inline-flex items-center group cursor-help"
              tabIndex={0}
              aria-label="Jumlah data kuesioner yang telah terisi pada setiap jurusan."
            >
              <Info className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
              <div
                role="tooltip"
                className="absolute right-0 sm:left-1/2 sm:-translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block group-focus:block z-30 w-52 sm:w-60 p-2 bg-slate-900 text-white text-[11px] font-normal leading-relaxed rounded-lg shadow-lg pointer-events-none"
              >
                Jumlah data kuesioner yang telah terisi pada setiap jurusan.
                <div className="absolute right-2.5 sm:left-1/2 sm:-translate-x-1/2 top-full -mt-1 w-2 h-2 bg-slate-900 rotate-45" />
              </div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium shrink-0">
            {isAllYears ? "Semua Angkatan" : `Angkatan ${selectedYear}`}
          </span>
        </div>

        <div className="space-y-3 pt-3">
          {jurusanStats.map((item) => (
            <div key={item.code} className="space-y-1">
              <div className="flex items-center justify-between text-[11px] sm:text-xs">
                <span className="font-medium text-slate-800">
                  {item.name}
                </span>
                <span className="text-[11px] text-slate-500 font-normal shrink-0">
                  {item.filled} dari {item.total} Siswa ({item.percent}%)
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(item.percent, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <button
          onClick={() => onNavigateTab("master_alumni")}
          className="text-[#0d2346] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Buka Data Alumni</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

