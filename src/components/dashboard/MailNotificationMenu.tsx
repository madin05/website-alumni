import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Mail,
  CheckCheck,
  MessageSquare,
  FileCheck2,
  HelpCircle,
  Clock,
  ChevronRight,
  Inbox,
  ArrowRight,
  X,
} from "lucide-react";
import { useMailStore, MailItem } from "@/store/mailStore";
import { useAuthStore } from "@/store/authStore";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { useNavigate } from "react-router-dom";
import { formatTimeAgo } from "@/lib/utils";
import { MailDetailModal } from "./mail/MailDetailModal";

interface MailNotificationMenuProps {
  onNavigateTab?: (tab: string, respondentId?: string) => void;
  onOpenReceipt?: () => void;
}

const getCategoryBadge = (category: MailItem["category"]) => {
  switch (category) {
    case "tracer_submission":
      return {
        label: "Isian Baru",
        icon: FileCheck2,
      };
    case "verification_update":
      return {
        label: "Verifikasi",
        icon: CheckCheck,
      };
    case "inquiry":
      return {
        label: "Pertanyaan",
        icon: HelpCircle,
      };
    case "feedback":
      return {
        label: "Saran & Masukan",
        icon: MessageSquare,
      };
    default:
      return {
        label: "Pemberitahuan",
        icon: Mail,
      };
  }
};

export const MailNotificationMenu: React.FC<MailNotificationMenuProps> = ({
  onNavigateTab,
  onOpenReceipt,
}) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("all");
  const [selectedMail, setSelectedMail] = useState<MailItem | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth < 640 : false,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const role = user?.role === "admin_bkk" ? "admin_bkk" : "alumni";
  const userNisn = user?.nisn;

  const {
    getMailsForUser,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteMail,
  } = useMailStore();

  const mails = getMailsForUser(role, userNisn);
  const unreadCount = getUnreadCount(role, userNisn);

  const filteredMails = mails.filter((m) =>
    activeFilter === "unread" ? !m.isRead : true,
  );

  // Close popup when clicking outside (checked against both button and portal)
  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (menuRef.current && menuRef.current.contains(target)) {
        return;
      }
      if (portalRef.current && portalRef.current.contains(target)) {
        return;
      }
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handlePointerDown);
      document.addEventListener("touchstart", handlePointerDown);
    }
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [isOpen]);

  // Lock body scroll on mobile when bottom sheet is open
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen, isMobile]);

  const handleOpenMail = (mail: MailItem) => {
    markAsRead(mail.id);
    setIsOpen(false);
    setSelectedMail(mail);
  };

  const handleActionClick = (mail: MailItem) => {
    if (!mail.actionUrl) return;
    setIsOpen(false);
    setSelectedMail(null);

    if (mail.actionUrl.label.toLowerCase().includes("bukti") && onOpenReceipt) {
      onOpenReceipt();
      return;
    }

    if (onNavigateTab) {
      onNavigateTab(mail.actionUrl.tab, mail.actionUrl.respondentId);
    } else {
      if (role === "admin_bkk") {
        navigate(`/admin?tab=${mail.actionUrl.tab}`);
      } else {
        navigate(`/dashboard?tab=${mail.actionUrl.tab}`);
      }
    }
  };

  const handleViewAllMessages = () => {
    setIsOpen(false);
    if (role === "admin_bkk") {
      if (onNavigateTab) {
        onNavigateTab("pesan");
      } else {
        navigate("/admin?tab=pesan");
      }
    } else {
      if (onNavigateTab) {
        onNavigateTab("helpdesk");
      } else {
        navigate("/dashboard?tab=helpdesk");
      }
    }
  };

  const renderPopupContent = () => (
    <>
      {/* Header - Clean with no solid dark background */}
      <div className="p-3.5 sm:p-4 bg-white border-b border-slate-200 text-[#0d2346] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="text-[#0d2346]">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#0d2346]">
              {role === "admin_bkk"
                ? "Pesan & Isian Alumni"
                : "Kotak Masuk BKK"}
            </h3>
            <p className="text-[10px] text-slate-500">
              {unreadCount > 0
                ? `${unreadCount} pesan belum dibaca`
                : "Semua pesan sudah dibaca"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead(role, userNisn)}
              className="text-[10px] font-semibold px-2 py-1 text-slate-600 hover:text-[#0d2346] hover:bg-slate-100 rounded-md transition cursor-pointer flex items-center gap-1"
              title="Tandai semua sudah dibaca"
            >
              <CheckCheck className="w-3 h-3 text-slate-600" />
              <span>Baca Semua</span>
            </button>
          )}
          {isMobile && (
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-2.5 py-1 rounded-md font-semibold text-[11px] cursor-pointer transition ${
              activeFilter === "all"
                ? "bg-slate-200/70 text-slate-600"
                : "text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            Semua ({mails.length})
          </button>
          <button
            onClick={() => setActiveFilter("unread")}
            className={`px-2.5 py-1 rounded-md font-semibold text-[11px] cursor-pointer transition ${
              activeFilter === "unread"
                ? "bg-slate-200/70 text-slate-600"
                : "text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            Belum Dibaca ({unreadCount})
          </button>
        </div>

        <span className="text-[10px] text-slate-400">
          {filteredMails.length} Pesan
        </span>
      </div>

      {/* Mail List Body */}
      <div className="flex-1 overflow-y-auto overscroll-contain max-h-[calc(85vh-180px)] sm:max-h-[340px] divide-y divide-slate-100">
        {filteredMails.length === 0 ? (
          <div className="py-10 text-center px-4">
            <div className="w-10 h-10 mx-auto flex items-center justify-center text-slate-400 mb-2">
              <Inbox className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-700">
              Tidak ada pesan{" "}
              {activeFilter === "unread" ? "belum dibaca" : ""}
            </p>
          </div>
        ) : (
          filteredMails.map((mail) => {
            const badge = getCategoryBadge(mail.category);
            const BadgeIcon = badge.icon;
            const isSelected = selectedMail?.id === mail.id;

            return (
              <div
                key={mail.id}
                onClick={() => handleOpenMail(mail)}
                className={`p-3 sm:p-3.5 flex items-start gap-3 cursor-pointer transition-all relative border-l-4 ${
                  isSelected
                    ? "bg-slate-100/90 border-[#0d2346]"
                    : !mail.isRead
                      ? "bg-slate-50/80 border-transparent hover:bg-slate-100/80 hover:border-slate-300 font-medium"
                      : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                {!mail.isRead && (
                  <span className="absolute left-1.5 top-5 w-1.5 h-1.5 rounded-full bg-[#0d2346]" />
                )}

                <div className="shrink-0 pt-0.5">
                  <UserAvatar
                    name={mail.senderName}
                    gender={mail.senderAvatarGender}
                    className="w-8 h-8 border border-slate-200"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span
                      className={`text-xs truncate ${
                        !mail.isRead
                          ? "font-bold text-slate-900"
                          : "font-semibold text-slate-700"
                      }`}
                    >
                      {mail.senderName}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-1 font-normal">
                      <Clock className="w-2.5 h-2.5" />
                      {formatTimeAgo(mail.createdAt)}
                    </span>
                  </div>

                  <p
                    className={`text-xs line-clamp-1 mb-1 ${
                      !mail.isRead
                        ? "font-bold text-[#0d2346]"
                        : "font-medium text-slate-800"
                    }`}
                  >
                    {mail.subject}
                  </p>

                  <p className="text-[11px] text-slate-500 line-clamp-1 leading-relaxed font-normal">
                    {mail.preview}
                  </p>

                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      <BadgeIcon className="w-2.5 h-2.5 text-slate-600" />
                      {badge.label}
                    </span>

                    {mail.submissionId && (
                      <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-white text-slate-600 border border-slate-200">
                        {mail.submissionId}
                      </span>
                    )}
                  </div>
                </div>

                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 self-center" />
              </div>
            );
          })
        )}
      </div>

      {/* Footer - Direct View All Messages Button */}
      <div className="shrink-0 p-3 sm:p-2.5 bg-slate-50 border-t border-slate-200 pb-6 sm:pb-2.5">
        <button
          onClick={handleViewAllMessages}
          className="w-full py-2 px-3 rounded-lg bg-white hover:bg-slate-100 text-[#0d2346] text-xs font-bold border border-slate-200 transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs active:scale-98"
        >
          <span>
            {role === "admin_bkk"
              ? "Lihat Semua Pesan"
              : "Buka Pusat Bantuan BKK"}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-[#0d2346]" />
        </button>
      </div>
    </>
  );

  return (
    <div className="relative" ref={menuRef}>
      {/* Mail Button with Unread Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
          isOpen
            ? "bg-[#0d2346] text-white shadow-md"
            : "bg-slate-100 hover:bg-slate-200 text-[#0d2346]"
        }`}
        aria-label="Pesan & Notifikasi"
        title="Kotak Masuk & Pesan Alumni"
      >
        <Mail
          className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${isOpen ? "fill-white/20" : ""}`}
        />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#0d2346] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white shadow-xs">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Mail Popover - Mobile Bottom Sheet (Portaled to document.body) vs Desktop/Tablet Anchored Dropdown */}
      {isOpen &&
        (isMobile
          ? createPortal(
              <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
                {/* Mobile Backdrop */}
                <div
                  className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs pointer-events-auto transition-opacity"
                  onClick={() => setIsOpen(false)}
                  aria-hidden="true"
                />

                {/* Mobile Bottom Sheet Modal */}
                <div
                  ref={portalRef}
                  className="relative z-10 w-full max-h-[85vh] bg-white rounded-t-3xl border-t border-slate-200 shadow-2xl flex flex-col overflow-hidden pointer-events-auto animate-in slide-in-from-bottom duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Mobile Pull Bar Indicator */}
                  <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mt-2.5 -mb-1 shrink-0" />
                  {renderPopupContent()}
                </div>
              </div>,
              document.body,
            )
          : (
              <div
                ref={portalRef}
                className="absolute right-0 top-full mt-2.5 w-[390px] max-h-[520px] bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
              >
                {renderPopupContent()}
              </div>
            ))}

      {/* Mail Detail Modal */}
      {selectedMail && (
        <MailDetailModal
          mail={selectedMail}
          onClose={() => setSelectedMail(null)}
          onDelete={deleteMail}
          onAction={handleActionClick}
        />
      )}
    </div>
  );
};
