import React from "react";
import { Info } from "lucide-react";
import { RespondentRecord } from "@/store/adminStore";

interface OverviewRecentSubmissionsProps {
  recentSubmissions: RespondentRecord[];
  onNavigateTab: (tabId: string) => void;
  onOpenRespondentDetail?: (submissionId: string) => void;
}

export const OverviewRecentSubmissions: React.FC<
  OverviewRecentSubmissionsProps
> = ({ recentSubmissions, onNavigateTab, onOpenRespondentDetail }) => {
  return (
    <div className="lg:col-span-5 bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-xs sm:text-sm text-slate-900">
              Kuesioner Masuk Terbaru
            </h3>
            <div
              className="relative inline-flex items-center group cursor-help"
              tabIndex={0}
              aria-label="5 alumni terakhir yang mengirimkan data penelusuran."
            >
              <Info className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
              <div
                role="tooltip"
                className="absolute right-0 sm:left-1/2 sm:-translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block group-focus:block z-30 w-52 sm:w-60 p-2 bg-slate-900 text-white text-[11px] font-normal leading-relaxed rounded-lg shadow-lg pointer-events-none"
              >
                5 alumni terakhir yang mengirimkan data penelusuran.
                <div className="absolute right-2.5 sm:left-1/2 sm:-translate-x-1/2 top-full -mt-1 w-2 h-2 bg-slate-900 rotate-45" />
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab("verifikasi")}
            className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer shrink-0"
          >
            Lihat Semua
          </button>
        </div>

        <div className="divide-y divide-slate-100 mt-1">
          {recentSubmissions.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Belum ada kuesioner masuk untuk periode ini.
            </div>
          ) : (
            recentSubmissions.map((sub) => (
              <div
                key={sub.submissionId}
                onClick={() =>
                  onOpenRespondentDetail &&
                  onOpenRespondentDetail(sub.submissionId)
                }
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 rounded-lg px-2 -mx-2 transition cursor-pointer"
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {sub.nama}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {sub.jurusan}
                  </p>
                </div>
                <div className="shrink-0 flex flex-col items-end">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                    {sub.statusKegiatan === "KERJA"
                      ? "Bekerja"
                      : sub.statusKegiatan === "KULIAH"
                        ? "Kuliah"
                        : sub.statusKegiatan === "WIRAUSAHA"
                          ? "Wirausaha"
                          : sub.statusKegiatan === "KERJA_KULIAH"
                            ? "Kerja & Kuliah"
                            : "Mencari Kerja"}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {new Date(sub.submittedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 bg-slate-50 -mx-5 -mb-5 p-4 rounded-b-xl flex items-center justify-between text-xs">
        <span className="text-slate-600">
          Perlu mencetak rekapitulasi data?
        </span>
        <button
          onClick={() => onNavigateTab("laporan")}
          className="px-3 py-1.5 rounded-full bg-[#0d2346] hover:bg-[#163868] text-white font-semibold transition cursor-pointer"
        >
          Buka Laporan
        </button>
      </div>
    </div>
  );
};

