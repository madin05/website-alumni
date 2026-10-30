import React from "react";
import { MasterAlumniRecord } from "@/store/adminStore";
import {
  GraduationCap,
  X,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
} from "lucide-react";
import {
  WhatsAppIcon,
  generateAlumniWaLink,
} from "./MasterAlumniIcons";

interface MasterAlumniPreviewModalProps {
  alumni: MasterAlumniRecord | null;
  onClose: () => void;
}

export const MasterAlumniPreviewModal: React.FC<
  MasterAlumniPreviewModalProps
> = ({ alumni, onClose }) => {
  if (!alumni) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white sm:bg-slate-950/60 sm:backdrop-blur-xs sm:flex sm:items-center sm:justify-center sm:p-4 md:sm:p-6 animate-in fade-in duration-150 overflow-hidden">
      <div className="bg-white w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-2xl rounded-none shadow-none sm:shadow-2xl sm:border sm:border-slate-200/90 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-4 py-3.5 sm:px-6 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-slate-700 flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-lg text-slate-900 leading-snug tracking-tight">
                Preview Data Lengkap Siswa
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 leading-normal mt-0.5">
                Data pokok alumni SMKS Sasmita Jaya 2
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            title="Tutup"
            aria-label="Tutup Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 p-4 sm:p-6 space-y-3.5 sm:space-y-5 overflow-y-auto overscroll-contain">
          {/* Profile Card Header */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-slate-900 text-base sm:text-xl leading-snug tracking-tight">
                {alumni.nama}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mt-0.5">
                {alumni.jurusan}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <span className="text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-200/80 text-slate-700 tracking-wide">
                Angkatan {alumni.tahunLulus}
              </span>
              {alumni.statusTracer === "SUDAH" ? (
                <span className="text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 flex items-center gap-1.5 border border-emerald-200/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sudah Mengisi Tracer</span>
                </span>
              ) : (
                <span className="text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 flex items-center gap-1.5 border border-amber-200/60">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Belum Mengisi Tracer</span>
                </span>
              )}
            </div>
          </div>

          {/* Section 1: Identitas Pokok Siswa */}
          <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-3.5 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
              {/* NISN */}
              <div className="space-y-0.5">
                <span className="text-xs font-medium text-slate-500 block leading-normal">
                  Nomor Induk Siswa (NISN)
                </span>
                <span className="font-mono font-bold text-slate-900 text-sm sm:text-base tracking-wide block leading-snug">
                  {alumni.nisn}
                </span>
              </div>

              {/* NIK */}
              <div className="space-y-0.5">
                <span className="text-xs font-medium text-slate-500 block leading-normal">
                  Nomor Induk Kependudukan (NIK)
                </span>
                <span className="font-mono font-bold text-slate-900 text-sm sm:text-base tracking-wide block leading-snug">
                  {alumni.nik || "-"}
                </span>
              </div>

              {/* Program Keahlian */}
              <div className="sm:col-span-2 pt-2.5 border-t border-slate-100 space-y-0.5">
                <span className="text-xs font-medium text-slate-500 block leading-normal">
                  Program Keahlian / Jurusan
                </span>
                <span className="font-semibold text-slate-900 text-sm sm:text-base leading-relaxed block tracking-normal">
                  {alumni.jurusan}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Kontak & Komunikasi */}
          <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-3.5 sm:space-y-4">
            {/* Nomor WhatsApp */}
            <div className="flex items-center justify-between gap-3 pt-0.5">
              <div className="min-w-0 flex-1 pr-2 space-y-0.5">
                <span className="text-xs font-medium text-slate-500 block leading-normal">
                  Nomor WhatsApp
                </span>
                <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm tracking-wide flex items-center gap-1.5 leading-snug">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{alumni.noWhatsapp || "-"}</span>
                </span>
              </div>
              {alumni.noWhatsapp && (
                <a
                  href={`https://wa.me/${
                    alumni.noWhatsapp.replace(/\D/g, "").startsWith("0")
                      ? "62" + alumni.noWhatsapp.replace(/\D/g, "").slice(1)
                      : alumni.noWhatsapp.replace(/\D/g, "")
                  }`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs border border-emerald-200/80 transition active:scale-95 shadow-2xs shrink-0"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Chat WA</span>
                </a>
              )}
            </div>

            {/* Email */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="min-w-0 flex-1 pr-2 space-y-0.5">
                <span className="text-xs font-medium text-slate-500 block leading-normal">
                  Alamat Email
                </span>
                <span className="font-semibold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5 leading-snug tracking-normal break-all">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{alumni.email || "-"}</span>
                </span>
              </div>
              {alumni.email && (
                <a
                  href={`mailto:${alumni.email}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition shrink-0 active:scale-95"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>Kirim Email</span>
                </a>
              )}
            </div>
          </div>

          {/* Section 3: Informasi Tracer Study */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5 sm:space-y-3">
            {alumni.statusTracer === "SUDAH" ? (
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 leading-relaxed">
                  <span className="text-slate-500 font-medium">
                    No. Registrasi / Submisi:
                  </span>
                  <span className="font-mono font-bold text-slate-900 tracking-wide">
                    {alumni.submissionId || "-"}
                  </span>
                </div>
                {alumni.submittedAt && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 leading-relaxed pt-2 border-t border-slate-200/60">
                    <span className="text-slate-500 font-medium">
                      Waktu Pengisian:
                    </span>
                    <span className="text-slate-800 font-medium">
                      {new Date(alumni.submittedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-start gap-2.5 text-slate-600 text-xs sm:text-sm leading-relaxed">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p>
                  Alumni ini belum menyelesaikan pengisian kuesioner penelusuran
                  tamatan.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-6 sm:py-4 border-t border-slate-200 bg-white sm:bg-slate-50 shrink-0">
          <div className="flex items-center justify-end gap-2.5 sm:gap-3">
            {alumni.statusTracer === "BELUM" && (
              <a
                href={generateAlumniWaLink(alumni)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition active:scale-95 text-center cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Kirim Pengingat WA</span>
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-[#0d2346] hover:bg-[#163868] text-white text-xs sm:text-sm font-semibold tracking-wide transition active:scale-95 cursor-pointer shadow-xs text-center"
            >
              Tutup Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

