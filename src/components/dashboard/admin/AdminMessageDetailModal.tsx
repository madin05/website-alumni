import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Clock,
  FileCheck2,
  ChevronRight,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { MailItem } from "@/store/mailStore";
import { UserAvatar } from "@/components/ui/UserAvatar";

const SolidMailIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5 text-[#0d2346]",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

export { SolidMailIcon };

interface AdminMessageDetailModalProps {
  mail: MailItem | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onAction: (mail: MailItem) => void;
}

export const AdminMessageDetailModal: React.FC<AdminMessageDetailModalProps> = ({
  mail,
  onClose,
  onDelete,
  onAction,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (mail) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mail, onClose]);

  if (!mail) return null;

  const getCategoryLabel = (category: MailItem["category"]) => {
    switch (category) {
      case "tracer_submission":
        return "Isian Tracer Baru";
      case "verification_update":
        return "Pembaruan Verifikasi";
      case "inquiry":
        return "Pertanyaan";
      case "feedback":
        return "Saran & Masukan";
      default:
        return "Pemberitahuan";
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog: Full Screen on Mobile, Centered Card on Desktop */}
      <div className="relative z-10 w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-[#0d2346] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
              <SolidMailIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Rincian Pesan Masuk
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {getCategoryLabel(mail.category)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
            aria-label="Tutup pesan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 flex-1 bg-slate-50/60 text-slate-800">
          {/* 1. Sender Info Card */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3.5">
            <div className="flex items-start gap-3.5">
              <UserAvatar
                name={mail.senderName}
                gender={mail.senderAvatarGender}
                className="w-12 h-12 shrink-0 border border-slate-200 text-sm font-bold"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words">
                    {mail.senderName}
                  </h3>
                  {mail.senderMajor && (
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {mail.senderMajor}{" "}
                      {mail.senderGradYear ? `(${mail.senderGradYear})` : ""}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2.5 pt-2.5 border-t border-slate-100 text-xs text-slate-600">
                  {mail.senderEmail && (
                    <div className="flex items-center gap-1.5 break-all">
                      <SolidMailIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{mail.senderEmail}</span>
                    </div>
                  )}
                  {mail.senderNisn && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 font-medium">NISN:</span>
                      <span className="font-mono font-semibold text-slate-800">
                        {mail.senderNisn}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-slate-500 sm:col-span-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {new Date(mail.createdAt).toLocaleString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      WIB
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Subject & Submission Box */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                SUBJEK PESAN
              </span>
              <h4 className="text-base sm:text-lg font-bold text-[#0d2346] leading-snug">
                {mail.subject}
              </h4>
            </div>

            {mail.submissionId && (
              <div className="p-3.5 bg-blue-50/60 border border-blue-200/70 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-[#0d2346] shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-slate-700">
                    Nomor Pengajuan Tracer Study:
                  </span>
                  <strong className="font-mono text-xs sm:text-sm font-bold text-[#0d2346]">
                    {mail.submissionId}
                  </strong>
                </div>
                {mail.actionUrl && (
                  <button
                    type="button"
                    onClick={() => onAction(mail)}
                    className="text-xs font-semibold text-[#0d2346] hover:underline inline-flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                  >
                    <span>
                      {mail.actionUrl.label || "Buka Data Responden"}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 3. Message Body Card */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              ISI PESAN
            </span>
            <div className="p-4 sm:p-5 bg-slate-50/80 rounded-xl border border-slate-100 text-sm sm:text-base text-slate-800 leading-relaxed whitespace-pre-line break-words">
              {mail.body}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-4 border-t border-slate-200 bg-white flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onDelete(mail.id)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Hapus Pesan</span>
          </button>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer text-center"
            >
              Tutup
            </button>

            {mail.actionUrl && (
              <button
                type="button"
                onClick={() => onAction(mail)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#0d2346] hover:bg-[#163868] shadow-xs transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{mail.actionUrl.label}</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

