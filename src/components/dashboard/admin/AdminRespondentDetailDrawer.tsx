import React, { useState } from "react";
import { RespondentRecord } from "@/store/adminStore";
import { X, Clock, Layers } from "lucide-react";
import { SolidBuildingIcon } from "./drawer/DrawerIcons";
import { DrawerIdentitySection } from "./drawer/DrawerIdentitySection";
import { DrawerKuliahCard } from "./drawer/DrawerKuliahCard";
import { DrawerKerjaCard } from "./drawer/DrawerKerjaCard";
import { DrawerUsahaCard } from "./drawer/DrawerUsahaCard";
import { DrawerEvaluasiSection } from "./drawer/DrawerEvaluasiSection";

interface AdminRespondentDetailDrawerProps {
  respondent: RespondentRecord | null;
  onClose: () => void;
}

export const AdminRespondentDetailDrawer: React.FC<
  AdminRespondentDetailDrawerProps
> = ({ respondent, onClose }) => {
  if (!respondent) return null;

  const payload = respondent.fullPayload;
  const identitas = payload.identitas;
  const kerja = payload.detail_kerja;
  const kuliah = payload.detail_kuliah;
  const usaha = payload.detail_usaha;
  const evaluasi = payload.evaluasi;

  // Dropdown states for each activity section
  const [openKerja, setOpenKerja] = useState<boolean>(true);
  const [openKuliah, setOpenKuliah] = useState<boolean>(true);
  const [openUsaha, setOpenUsaha] = useState<boolean>(true);
  const [filterTab, setFilterTab] = useState<
    "ALL" | "KERJA" | "KULIAH" | "USAHA"
  >("ALL");

  const hasMultipleActivities =
    (Boolean(kerja) && Boolean(kuliah)) ||
    (Boolean(kuliah) && Boolean(usaha)) ||
    (Boolean(kerja) && Boolean(usaha));

  const formatMasaTunggu = (val?: string | number) => {
    if (val === undefined || val === null || val === "") return "-";
    const strVal = String(val).trim();
    if (
      strVal === "0" ||
      strVal.toLowerCase() === "0 bulan" ||
      strVal.toLowerCase() === "langsung"
    ) {
      return "Langsung / 0 Bulan (Tanpa Jeda)";
    }
    if (!isNaN(Number(strVal))) {
      return `${strVal} Bulan setelah lulus`;
    }
    return strVal;
  };

  const getAktivitasLabel = (status: string) => {
    switch (status) {
      case "KERJA":
        return "Bekerja di Instansi / Perusahaan";
      case "KULIAH":
        return "Melanjutkan Kuliah";
      case "WIRAUSAHA":
        return "Wirausaha Mandiri";
      case "KERJA_KULIAH":
        return "Kuliah & Kerja";
      case "WIRAUSAHA_KULIAH":
        return "Kuliah & Wirausaha";
      default:
        return "Sedang Mencari Kerja";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sliding Sheet / Drawer Panel from Right */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300 rounded-l-xl">
          {/* Header */}
          <div className="p-4 sm:p-5 sm:px-6 border-b border-slate-100 bg-[#0d2346] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                    {respondent.nama}
                  </h2>
                  <span className="px-2.5 py-0.5 text-[10px] sm:text-[11px] font-medium rounded-full bg-white/15 text-white border border-white/20">
                    Kuesioner Masuk
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-normal">
                  Nomor Berkas:{" "}
                  <span className="font-mono text-white">
                    {respondent.submissionId}
                  </span>{" "}
                  | Angkatan {respondent.tahunLulus}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:rounded-full hover:bg-white/20 text-white/80 hover:text-white cursor-pointer"
              title="Tutup"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6 flex-1 text-slate-800 bg-slate-50/60">
            {/* Section 1: Identitas Alumni */}
            <DrawerIdentitySection identitas={identitas} />

            {/* Section 2: Aktivitas Pasca Kelulusan */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4 sm:space-y-5">
              <div className="flex items-center justify-between gap-3 flex-wrap pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-[#0d2346]">
                    <SolidBuildingIcon className="w-4 h-4 text-[#0d2346]" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-700">
                    Aktivitas Setelah Kelulusan
                  </h3>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-800 rounded-md text-xs font-semibold">
                    {getAktivitasLabel(respondent.statusKegiatan)}
                  </span>
                  {payload.masa_tunggu !== undefined &&
                    payload.masa_tunggu !== null && (
                      <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-md text-xs font-medium flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>
                          Waktu Tunggu: {formatMasaTunggu(payload.masa_tunggu)}
                        </span>
                      </span>
                    )}
                </div>
              </div>

              {/* Selector Jika Alumni Memiliki Lebih dari Satu Aktivitas */}
              {hasMultipleActivities && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#0d2346]" />
                    <span className="text-xs font-semibold text-slate-700">
                      Pilihan Tampilan Rincian Data:
                    </span>
                  </div>
                  <select
                    value={filterTab}
                    onChange={(e) =>
                      setFilterTab(
                        e.target.value as "ALL" | "KERJA" | "KULIAH" | "USAHA",
                      )
                    }
                    className="text-xs font-medium bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0d2346] cursor-pointer shadow-2xs"
                  >
                    <option value="ALL">Tampilkan Semua Rincian Data</option>
                    {kuliah && (
                      <option value="KULIAH">Rincian Perguruan Tinggi</option>
                    )}
                    {kerja && (
                      <option value="KERJA">
                        Rincian Instansi / Tempat Kerja
                      </option>
                    )}
                    {usaha && (
                      <option value="USAHA">Rincian Usaha Mandiri</option>
                    )}
                  </select>
                </div>
              )}

              {/* Rincian Dropdown Cards Container */}
              <div className="space-y-4">
                {/* 1. Kuliah Detail */}
                {kuliah && (filterTab === "ALL" || filterTab === "KULIAH") && (
                  <DrawerKuliahCard
                    kuliah={kuliah}
                    isOpen={openKuliah}
                    onToggle={() => setOpenKuliah(!openKuliah)}
                  />
                )}

                {/* 2. Kerja Detail */}
                {kerja && (filterTab === "ALL" || filterTab === "KERJA") && (
                  <DrawerKerjaCard
                    kerja={kerja}
                    isOpen={openKerja}
                    onToggle={() => setOpenKerja(!openKerja)}
                  />
                )}

                {/* 3. Usaha Detail */}
                {usaha && (filterTab === "ALL" || filterTab === "USAHA") && (
                  <DrawerUsahaCard
                    usaha={usaha}
                    isOpen={openUsaha}
                    onToggle={() => setOpenUsaha(!openUsaha)}
                  />
                )}
              </div>
            </div>

            {/* Section 3: Evaluasi Pembelajaran & Masukan */}
            {evaluasi && <DrawerEvaluasiSection evaluasi={evaluasi} />}
          </div>

          {/* Footer Action */}
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-white flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#0d2346] hover:bg-[#163868] text-white text-xs sm:text-sm font-semibold shadow-xs transition active:scale-95 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
