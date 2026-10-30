import React from "react";
import { SolidMessageSquareIcon } from "./DrawerIcons";
import { RespondentRecord } from "@/store/adminStore";

interface DrawerEvaluasiSectionProps {
  evaluasi: NonNullable<RespondentRecord["fullPayload"]["evaluasi"]>;
}

export const DrawerEvaluasiSection: React.FC<DrawerEvaluasiSectionProps> = ({
  evaluasi,
}) => {
  if (!evaluasi.saran_pembelajaran && !evaluasi.saran_bkk) return null;

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4 sm:space-y-5">
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-[#0d2346]">
          <SolidMessageSquareIcon className="w-4 h-4 text-[#0d2346]" />
        </div>
        <h3 className="font-bold text-sm sm:text-base text-slate-700">
          Evaluasi Pembelajaran dan Masukan Sekolah
        </h3>
      </div>
      <div className="space-y-4 text-xs">
        {evaluasi.saran_pembelajaran && (
          <div className="space-y-1.5">
            <span className="text-slate-500 block text-xs font-medium">
              Saran untuk Pembelajaran & Kurikulum:
            </span>
            <p className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-slate-800 text-sm italic leading-relaxed">
              "{evaluasi.saran_pembelajaran}"
            </p>
          </div>
        )}
        {evaluasi.saran_bkk && (
          <div className="space-y-1.5">
            <span className="text-slate-500 block text-xs font-medium">
              Saran untuk Layanan Bursa Kerja Khusus (BKK):
            </span>
            <p className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-slate-800 text-sm italic leading-relaxed">
              "{evaluasi.saran_bkk}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

