import React from "react";
import { JobVacancy } from "@/types/tracer";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Lock } from "lucide-react";

interface JobDetailModalProps {
  job: JobVacancy | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (job: JobVacancy) => void;
  isTracerDone: boolean;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  isOpen,
  onClose,
  onApply,
  isTracerDone,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={job?.title}
      subtitle={job?.company}
      maxWidth="lg"
    >
      {job && (
        <div className="space-y-5 text-xs text-slate-700">
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-400 block text-[10px]">
                Tipe Pekerjaan
              </span>
              <span className="font-bold text-slate-800">{job.type}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">
                Estimasi Gaji
              </span>
              <span className="font-bold text-blue-600">{job.salary}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Lokasi</span>
              <span className="font-medium text-slate-800">{job.location}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">
                Batas Pendaftaran
              </span>
              <span className="font-medium text-slate-800">{job.deadline}</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-1.5">
              Deskripsi Pekerjaan
            </h4>
            <p className="text-slate-600 leading-relaxed">{job.description}</p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-1.5">
              Kualifikasi & Persyaratan
            </h4>
            <ul className="space-y-1.5 list-disc pl-4 text-slate-600">
              {job.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <Button
              onClick={() => {
                onClose();
                onApply(job);
              }}
              variant="primary"
              className={`w-full sm:w-auto font-semibold ${
                isTracerDone
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-slate-700 hover:bg-slate-800 text-white"
              }`}
            >
              {!isTracerDone && (
                <Lock className="w-3.5 h-3.5 mr-1 text-amber-300" />
              )}
              <span>Daftar</span>
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
