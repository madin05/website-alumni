import React, { useState } from 'react';
import { useTracerStore } from '@/store/tracerStore';
import { StatusKegiatan, MasaTunggu } from '@/types/tracer';
import {
  STATUS_KEGIATAN_OPTIONS,
  MASA_TUNGGU_OPTIONS,
} from '@/schemas/tracerSchema';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { ArrowLeft } from "lucide-react";

interface Step2Props {
  onNext: () => void;
  onPrev: () => void;
}

export const Step2Status: React.FC<Step2Props> = ({ onNext, onPrev }) => {
  const { status_kegiatan, masa_tunggu, updateStatusKegiatan } = useTracerStore();
  const [showWarningModal, setShowWarningModal] = useState<string | null>(null);

  const handleSelectStatus = (status: StatusKegiatan) => {
    updateStatusKegiatan(status, masa_tunggu || '< 3 bulan');
  };

  const handleSelectMasaTunggu = (val: string) => {
    updateStatusKegiatan(
      (status_kegiatan as StatusKegiatan) || 'KERJA',
      val as MasaTunggu
    );
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!status_kegiatan) {
      setShowWarningModal('Silakan pilih salah satu opsi status/kegiatan utama Anda saat ini.');
      return;
    }
    if (!masa_tunggu) {
      setShowWarningModal('Silakan pilih salah satu opsi waktu tunggu.');
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleContinue} className="space-y-6 sm:space-y-8">
      {/* Blue Section Header Bar matching Dapodik screenshot */}
      <div className="bg-[#1d4ed8] text-white px-4 py-2.5 font-medium text-xs sm:text-sm rounded-t-sm">
        Aktifitas Lulusan
      </div>

      {/* Status / Kegiatan Utama Saat Ini */}
      <div className="space-y-4 px-1">
        <label className="block text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
          Status/kegiatan utama saat ini: <span className="text-rose-500">*</span>
        </label>

        <div className="space-y-3.5 pt-1 pl-1">
          {STATUS_KEGIATAN_OPTIONS.map((item) => {
            const isLainnyaOption = item.value === 'LAINNYA';
            const currentStatus = (status_kegiatan as string) || '';
            const isSelected = isLainnyaOption
              ? currentStatus === 'LAINNYA' || (currentStatus !== '' && !STATUS_KEGIATAN_OPTIONS.some(o => o.value === currentStatus && o.value !== 'LAINNYA'))
              : currentStatus === item.value;

            return (
              <div key={item.value} className="flex flex-col gap-2.5">
                <label className="flex items-center gap-3 cursor-pointer text-sm text-slate-800 hover:text-blue-600 transition-colors leading-relaxed">
                  <input
                    type="radio"
                    name="status_kegiatan"
                    value={item.value}
                    checked={isSelected}
                    onChange={() => handleSelectStatus(item.value as StatusKegiatan)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer shrink-0"
                  />
                  <span>{item.label}</span>
                </label>
                
                {isLainnyaOption && isSelected && (
                  <div className="ml-7 mt-1.5">
                    <input
                      type="text"
                      placeholder="Sebutkan kegiatan lainnya..."
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      value={status_kegiatan === 'LAINNYA' ? '' : status_kegiatan}
                      onChange={(e) => updateStatusKegiatan((e.target.value || 'LAINNYA') as StatusKegiatan, masa_tunggu || '< 3 bulan')}
                      required
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="my-6 sm:my-8 border-t border-slate-200/90" />

      {/* Masa Tunggu */}
      <div className="space-y-4 px-1">
        <label className="block text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
          Berapa lama setelah lulus sampai mendapatkan kegiatan/pekerjaan pertama? <span className="text-rose-500">*</span>
        </label>

        <div className="space-y-3.5 pt-1 pl-1">
          {MASA_TUNGGU_OPTIONS.map((mt) => {
            const isSelected = masa_tunggu === mt;
            return (
              <label
                key={mt}
                className="flex items-center gap-3 cursor-pointer text-sm text-slate-800 hover:text-blue-600 transition-colors leading-relaxed"
              >
                <input
                  type="radio"
                  name="masa_tunggu"
                  value={mt}
                  checked={isSelected}
                  onChange={() => handleSelectMasaTunggu(mt)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer shrink-0"
                />
                <span>{mt}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Bottom Bar with 'Simpan dan lanjut' matching screenshot */}
      <div className="pt-6 mt-8 border-t border-slate-200 flex items-center justify-between">
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
          className="bg-blue-600 hover:bg-blue-700 font-medium text-xs sm:text-sm px-6 py-2.5 rounded-lg shadow-none transition"
        >
          Simpan dan lanjut
        </Button>
      </div>

      {/* Warning Modal */}
      <ConfirmModal
        isOpen={!!showWarningModal}
        onClose={() => setShowWarningModal(null)}
        title="Lengkapi Pertanyaan"
        message={showWarningModal || ''}
        confirmText="Mengerti"
        type="warning"
      />
    </form>
  );
};
