import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { Mail, X, FileCheck2, Trash2, ExternalLink } from "lucide-react";
import { MailItem } from "@/store/mailStore";
import { UserAvatar } from "@/components/ui/UserAvatar";

interface MailDetailModalProps {
  mail: MailItem;
  onClose: () => void;
  onDelete: (id: string) => void;
  onAction: (mail: MailItem) => void;
}

export const MailDetailModal: React.FC<MailDetailModalProps> = ({
  mail,
  onClose,
  onDelete,
  onAction,
}) => {
  // Lock body scroll and listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-slate-200 text-[#0d2346] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 text-[#0d2346]">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#0d2346]">
                Detail Pesan Masuk
              </h3>
              <p className="text-[11px] text-slate-500">
                Diterima:{" "}
                {new Date(mail.createdAt).toLocaleString("id-ID", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sender Meta Box */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/60">
          <div className="flex items-start gap-3">
            <UserAvatar
              name={mail.senderName}
              gender={mail.senderAvatarGender}
              className="w-10 h-10 border border-slate-200 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">
                  {mail.senderName}
                </h4>
                {mail.senderMajor && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    {mail.senderMajor}{" "}
                    {mail.senderGradYear ? `(${mail.senderGradYear})` : ""}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {mail.senderEmail}
                {mail.senderNisn ? ` • NISN: ${mail.senderNisn}` : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Message Body */}
        <div className="p-4 sm:p-5 space-y-3 max-h-[60vh] overflow-y-auto">
          <div>
            <h2 className="text-base font-bold text-[#0d2346] leading-snug">
              {mail.subject}
            </h2>
          </div>

          {mail.submissionId && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold">
              <FileCheck2 className="w-3.5 h-3.5 text-[#0d2346]" />
              <span>
                ID Pengajuan Tracer: <strong>{mail.submissionId}</strong>
              </span>
            </div>
          )}

          <div className="p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-normal whitespace-pre-line">
            {mail.body}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={() => {
              onDelete(mail.id);
              onClose();
            }}
            className="px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 transition cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Pesan</span>
          </button>

          <div className="flex items-center gap-2">
            {mail.actionUrl && (
              <button
                onClick={() => onAction(mail)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-[#0d2346] hover:bg-[#163868] shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <span>{mail.actionUrl.label}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 transition cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
