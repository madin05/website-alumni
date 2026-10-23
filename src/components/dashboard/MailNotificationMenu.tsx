import React, { useState, useRef, useEffect } from "react";
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

  // Close popup when clicking outside
  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
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

      {/* Floating Mail Popover - Clean & Refined */}
      {isOpen && (
        <>
          {/* Mobile backdrop for easy dismissal */}
          <div
            className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-2xs sm:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed sm:absolute left-3 right-3 sm:left-auto sm:right-0 top-16 sm:top-full mt-1.5 sm:mt-2.5 w-auto sm:w-[390px] max-h-[82vh] sm:max-h-none bg-white rounded-xl shadow-2xl sm:shadow-xl border border-slate-200 z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Header - Clean with no solid dark background */}
            <div className="p-3.5 sm:p-4 bg-white border-b border-slate-200 text-[#0d2346] flex items-center justify-between">
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

              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead(role, userNisn)}
                  className="text-[10px] font-semibold px-2 py-1 hover:text-slate-700 transition cursor-pointer flex items-center gap-1"
                  title="Tandai semua sudah dibaca"
                >
                  <CheckCheck className="w-3 h-3 text-slate-600" />
                  <span>Baca Semua</span>
                </button>
              )}
            </div>

            {/* Filter Bar */}
            <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
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
            <div className="max-h-[calc(82vh-130px)] sm:max-h-[340px] overflow-y-auto divide-y divide-slate-100">
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
                      {/* Unread indicator dot */}
                      {!mail.isRead && (
                        <span className="absolute left-1.5 top-5 w-1.5 h-1.5 rounded-full bg-[#0d2346]" />
                      )}

                      {/* Sender Avatar */}
                      <div className="shrink-0 pt-0.5">
                        <UserAvatar
                          name={mail.senderName}
                          gender={mail.senderAvatarGender}
                          className="w-8 h-8 border border-slate-200"
                        />
                      </div>

                      {/* Content */}
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

                        {/* Tag badges - Unified Scheme */}
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

                      {/* Right Chevron */}
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 self-center" />
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer - Direct View All Messages Button */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-200">
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
          </div>
        </>
      )}

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
