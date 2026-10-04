import React, { useState } from "react";
import { useTracerStore } from "@/store/tracerStore";
import {
  KOMPETENSI_BERMANFAAT_OPTIONS,
  BANTU_DUNIA_KERJA_OPTIONS,
} from "@/schemas/tracerSchema";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ArrowLeft } from "lucide-react";

interface Step4Props {
  onNext: () => void;
  onPrev: () => void;
}

const RATING_OPTIONS = [
  { score: 1, label: "1 - Sangat Tidak Relevan" },
  { score: 2, label: "2 - Kurang Relevan" },
  { score: 3, label: "3 - Cukup Relevan" },
  { score: 4, label: "4 - Relevan" },
  { score: 5, label: "5 - Sangat Relevan" },
];

export const Step4Evaluation: React.FC<Step4Props> = ({ onNext, onPrev }) => {
  const { evaluasi, updateEvaluasi } = useTracerStore();
  const [warningModal, setWarningModal] = useState<string | null>(null);

  const handleRating = (score: number) => {
    updateEvaluasi({ skor_relevansi: score });
  };

  const handleToggleKompetensi = (item: string) => {
    const current = evaluasi.kompetensi_bermanfaat || [];
    if (current.includes(item)) {
      updateEvaluasi({
        kompetensi_bermanfaat: current.filter((k) => k !== item),
      });
    } else {
      updateEvaluasi({
        kompetensi_bermanfaat: [...current, item],
      });
    }
  };

  const handleBantuDuniaKerja = (val: string) => {
    updateEvaluasi({ bantu_dunia_kerja: val });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluasi.skor_relevansi) {
      setWarningModal("Silakan tentukan penilaian relevansi kompetensi.");
      return;
    }
    if (
      !evaluasi.kompetensi_bermanfaat ||
      evaluasi.kompetensi_bermanfaat.length === 0
    ) {
      setWarningModal("Pilih minimal 1 kompetensi yang paling bermanfaat.");
      return;
    }
    if (!evaluasi.bantu_dunia_kerja) {
      setWarningModal(
        "Silakan pilih salah satu opsi manfaat pembelajaran di dunia kerja.",
      );
      return;
    }
    onNext();
  };

  const currentScore = evaluasi.skor_relevansi || 5;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Blue Section Header Bar matching Dapodik screenshot */}
      <div className="bg-[#1d4ed8] text-white px-4 py-2 font-medium text-xs rounded-t-sm">
        Penilaian Terhadap SMK
      </div>

      {/* Seberapa relevan kompetensi yang dipelajari di SMK */}
      <div className="space-y-2.5">
        <label className="block text-xs sm:text-sm font-semibold text-slate-800">
          Seberapa relevan kompetensi yang dipelajari di SMK dengan kegiatan
          Anda saat ini? <span className="text-rose-500">*</span>
        </label>
        <div className="space-y-2 pt-1 pl-1">
          {RATING_OPTIONS.map((item) => (
            <label
              key={item.score}
              className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm text-slate-800 hover:text-blue-600"
            >
              <input
                type="radio"
                name="skor_relevansi"
                value={item.score}
                checked={currentScore === item.score}
                onChange={() => handleRating(item.score)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-200" />

      {/* Kompetensi yang paling bermanfaat setelah lulus */}
      <div className="space-y-2.5">
        <label className="block text-xs sm:text-sm font-semibold text-slate-800">
          Kompetensi yang paling bermanfaat setelah lulus:{" "}
          <span className="text-rose-500">*</span>
          <span className="text-slate-400 font-normal ml-1">
            (dapat memilih lebih dari satu)
          </span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 pl-1">
          {KOMPETENSI_BERMANFAAT_OPTIONS.map((item) => {
            const isChecked = (evaluasi.kompetensi_bermanfaat || []).includes(
              item,
            );
            return (
              <label
                key={item}
                className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm text-slate-800 hover:text-blue-600"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggleKompetensi(item)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span>{item}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-200" />

      {/* Kompetensi yang masih perlu ditingkatkan oleh sekolah */}
      <div className="space-y-1.5">
        <label className="block text-xs sm:text-sm font-semibold text-slate-800">
          Kompetensi yang masih perlu ditingkatkan oleh sekolah
        </label>
        <textarea
          rows={3}
          value={evaluasi.kompetensi_ditingkatkan || ""}
          onChange={(e) =>
            updateEvaluasi({ kompetensi_ditingkatkan: e.target.value })
          }
          placeholder="Contoh : Bahasa Inggris, sertifikasi industri, kurikulum terkini..."
          className="w-full rounded border border-slate-300 bg-white p-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
        />
      </div>

      {/* Divider */}
      <div className="border-t border-slate-200" />

      {/* Apakah pembelajaran di SMK membantu Anda menghadapi dunia kerja? */}
      <div className="space-y-2.5">
        <label className="block text-xs sm:text-sm font-semibold text-slate-800">
          Apakah pembelajaran di SMK membantu Anda menghadapi dunia kerja?{" "}
          <span className="text-rose-500">*</span>
        </label>
        <div className="flex flex-wrap items-center gap-5 pt-1 pl-1">
          {BANTU_DUNIA_KERJA_OPTIONS.map((opsi) => {
            const isSelected =
              (evaluasi.bantu_dunia_kerja || "Sangat membantu") === opsi;
            return (
              <label
                key={opsi}
                className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-slate-800"
              >
                <input
                  type="radio"
                  name="bantu_dunia_kerja"
                  value={opsi}
                  checked={isSelected}
                  onChange={() => handleBantuDuniaKerja(opsi)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                />
                <span>{opsi}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Bottom Bar with 'Simpan dan lanjut' matching screenshot */}
      <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
        <Button
          type="button"
          onClick={onPrev}
          variant="ghost"
          size="md"
          className="text-xs sm:text-sm"
        >
          <ArrowLeft size={16} className="mr-1" />
          Kembali
        </Button>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="bg-blue-600 hover:bg-blue-700 font-medium text-xs sm:text-sm px-6 py-2 rounded shadow-none"
        >
          Simpan dan lanjut
        </Button>
      </div>

      {/* Warning Modal */}
      <ConfirmModal
        isOpen={!!warningModal}
        onClose={() => setWarningModal(null)}
        title="Lengkapi Penilaian SMK"
        message={warningModal || ""}
        confirmText="Mengerti"
        type="warning"
      />
    </form>
  );
};
