import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Lock, ArrowRight } from "lucide-react";

interface JobGatekeeperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTracer?: () => void;
}

export const JobGatekeeperModal: React.FC<JobGatekeeperModalProps> = ({
  isOpen,
  onClose,
  onNavigateTracer,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Akses Pendaftaran Terkunci"
      subtitle="Khusus Alumni yang Telah Mengisi Tracer Study"
      maxWidth="md"
    >
      <div className="space-y-4 text-xs">
        <div className="p-4 rounded-xl  flex items-center gap-3">
          <Lock className="w-5 h-5 text-slate-700 shrink-0" />
          <div className="text-base text-slate-900 space-y-1">
            <p className="font-bold">Mohon Lengkapi Tracer Study Terlebih Dahulu</p>
          </div>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-600 space-y-1.5">
          <p className="font-semibold text-slate-800">
            Mengapa kuesioner ini wajib?
          </p>
          <p className="leading-relaxed">
            Data kelulusan Anda memvalidasi status alumni resmi SMK Sasmita Jaya
            2 kepada mitra industri kami serta membantu penyaluran kerja yang
            selaras dengan kompetensi kejuruan Anda.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Nanti Saja
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 font-semibold"
            onClick={() => {
              onClose();
              if (onNavigateTracer) {
                onNavigateTracer();
              }
            }}
          >
            <span>Isi Tracer Study Sekarang</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>
      </div>
    </Modal>
  );
};
