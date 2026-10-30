import React from "react";
import { JobVacancy, JobApplyType } from "@/types/tracer";
import { Modal } from "@/components/ui/Modal";
import {
  Building2,
  MapPin,
  Calendar,
  Clock,
  Eye,
  ShieldCheck,
  Edit3,
  Trash2,
  ExternalLink,
  MessageCircle,
  Mail,
  Navigation,
  User,
  CheckCircle2,
} from "lucide-react";

interface AdminJobDetailModalProps {
  job: JobVacancy | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (job: JobVacancy) => void;
  onDelete: (id: string) => void;
}

export const AdminJobDetailModal: React.FC<AdminJobDetailModalProps> = ({
  job,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!job) return null;

  const getApplyBadge = (type?: JobApplyType) => {
    switch (type) {
      case "walk_in":
        return (
          <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <Navigation className="w-3 h-3" />
            <span>Walk-in Interview</span>
          </span>
        );
      case "whatsapp":
        return (
          <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-green-50 text-green-700 border border-green-200 flex items-center gap-1">
            <MessageCircle className="w-3 h-3" />
            <span>WhatsApp HRD</span>
          </span>
        );
      case "external_url":
        return (
          <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
            <ExternalLink className="w-3 h-3" />
            <span>Portal Web Mitra</span>
          </span>
        );
      case "email":
      default:
        return (
          <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1">
            <Mail className="w-3 h-3" />
            <span>Email Rekrutmen</span>
          </span>
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg font-bold text-slate-900">
            {job.title}
          </span>
        </div>
      }
      subtitle={
        <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5 font-medium">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{job.company}</span>
        </div>
      }
      maxWidth="2xl"
    >
      <div className="space-y-6 text-xs text-slate-700">
        {/* Badges Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {job.type}
            </span>
            {getApplyBadge(job.applyType)}
            {job.isBkkPartner && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Mitra DUDI Resmi</span>
              </span>
            )}
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>{job.clickCount || 0} Kali Dilihat / Berminat</span>
          </span>
        </div>

        {/* 4 Essential Metrics Box */}
        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-0.5">
            <span className="text-slate-400 block text-[11px] font-medium">
              Estimasi Gaji / Penghasilan
            </span>
            <span className="font-bold text-sm text-[#0d2346]">{job.salary}</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-400 block text-[11px] font-medium">
              Lokasi Penempatan
            </span>
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{job.location}</span>
            </span>
          </div>

          <div className="space-y-0.5 pt-2 border-t border-slate-200/60 sm:border-t-0">
            <span className="text-slate-400 block text-[11px] font-medium">
              Tanggal Diposting
            </span>
            <span className="font-medium text-slate-700 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{job.postedAt}</span>
            </span>
          </div>

          <div className="space-y-0.5 pt-2 border-t border-slate-200/60 sm:border-t-0">
            <span className="text-slate-400 block text-[11px] font-medium">
              Batas Akhir Pendaftaran
            </span>
            <span className="font-bold text-rose-600 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{job.deadline}</span>
            </span>
          </div>
        </div>

        {/* Sasaran Program Keahlian */}
        {job.targetMajors && job.targetMajors.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
              Sasaran Program Keahlian (Jurusan)
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {job.targetMajors.map((major) => (
                <span
                  key={major}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-slate-800 border border-slate-200 shadow-2xs"
                >
                  {major}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Deskripsi Pekerjaan */}
        <div className="space-y-2">
          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
            Deskripsi Pekerjaan
          </h4>
          <p className="text-slate-700 leading-relaxed whitespace-pre-line bg-white p-3.5 rounded-xl border border-slate-100">
            {job.description}
          </p>
        </div>

        {/* Kualifikasi & Persyaratan */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
              Kualifikasi & Persyaratan
            </h4>
            <ul className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-100">
              {job.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Informasi Saluran Pendaftaran & Kontak */}
        <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
            Saluran Pendaftaran & Kontak Mitra
          </h4>

          <div className="space-y-2">
            {job.contactPerson && (
              <div className="flex items-center gap-2 text-slate-700">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  <strong>Narahubung / PIC:</strong> {job.contactPerson}
                </span>
              </div>
            )}

            {job.applyType === "whatsapp" && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-700">
                  <MessageCircle className="w-3.5 h-3.5 text-green-600 shrink-0" />
                  <span>
                    <strong>Nomor WhatsApp:</strong> {job.whatsappNumber || "-"}
                  </span>
                </div>
                {job.whatsappTemplate && (
                  <p className="text-[11px] text-slate-500 bg-white p-2.5 rounded border border-slate-200 italic">
                    Template: &quot;{job.whatsappTemplate}&quot;
                  </p>
                )}
              </div>
            )}

            {job.applyType === "email" && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>
                    <strong>Email Tujuan:</strong> {job.emailAddress || "-"}
                  </span>
                </div>
                {job.emailSubject && (
                  <p className="text-[11px] text-slate-500 bg-white p-2.5 rounded border border-slate-200 font-mono">
                    Subjek: {job.emailSubject}
                  </p>
                )}
              </div>
            )}

            {job.applyType === "walk_in" && (
              <div className="space-y-1.5">
                {job.walkInSchedule && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>
                      <strong>Jadwal Walk-in:</strong> {job.walkInSchedule}
                    </span>
                  </div>
                )}
                {job.locationAddress && (
                  <div className="flex items-start gap-2 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Alamat Walk-in:</strong> {job.locationAddress}
                    </span>
                  </div>
                )}
                {job.mapsUrl && (
                  <a
                    href={job.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold text-[11px] mt-1"
                  >
                    <span>Buka Tautan Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}

            {job.applyType === "external_url" && job.externalUrl && (
              <div className="flex items-center gap-2 text-slate-700">
                <ExternalLink className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <a
                  href={job.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-semibold break-all"
                >
                  {job.externalUrl}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="pt-4 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold transition cursor-pointer text-xs"
          >
            Tutup
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onDelete(job.id);
              }}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold transition cursor-pointer text-xs flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Hapus</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(job);
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#0d2346] hover:bg-[#163868] text-white font-semibold shadow-xs transition active:scale-95 cursor-pointer text-xs flex items-center justify-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Lowongan</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

