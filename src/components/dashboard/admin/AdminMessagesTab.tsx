import React, { useState } from "react";
import {
  Mail,
  Search,
  CheckCheck,
  Trash2,
  ExternalLink,
  Clock,
  Inbox,
  ChevronRight,
  FileCheck2,
  CheckCircle2,
  X,
} from "lucide-react";
import { useMailStore, MailItem } from "@/store/mailStore";
import { useAuthStore } from "@/store/authStore";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Modal } from "@/components/ui/Modal";

interface AdminMessagesTabProps {
  onNavigateTab?: (tab: string, respondentId?: string) => void;
}

export const AdminMessagesTab: React.FC<AdminMessagesTabProps> = ({
  onNavigateTab,
}) => {
  const { user } = useAuthStore();
  const {
    getMailsForUser,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteMail,
  } = useMailStore();

  const role = user?.role === "admin_bkk" ? "admin_bkk" : "alumni";
  const userNisn = user?.nisn;

  const mails = getMailsForUser(role, userNisn);
  const unreadCount = getUnreadCount(role, userNisn);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("all");
  const [selectedMailForModal, setSelectedMailForModal] =
    useState<MailItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter logic
  const filteredMails = mails.filter((mail) => {
    const matchSearch =
      mail.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mail.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mail.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (mail.senderNisn && mail.senderNisn.includes(searchQuery)) ||
      (mail.submissionId &&
        mail.submissionId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchRead = activeFilter === "unread" ? !mail.isRead : true;

    const matchCategory =
      selectedCategory === "Semua" ||
      (selectedCategory === "tracer_submission" &&
        mail.category === "tracer_submission") ||
      (selectedCategory === "inquiry" && mail.category === "inquiry") ||
      (selectedCategory === "feedback" && mail.category === "feedback");

    return matchSearch && matchRead && matchCategory;
  });

  const handleOpenMailModal = (mail: MailItem) => {
    setSelectedMailForModal(mail);
    if (!mail.isRead) {
      markAsRead(mail.id);
    }
  };

  const handleMarkAllRead = () => {
    markAllAsRead(role, userNisn);
    showToast("Semua pesan ditandai telah dibaca.");
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      deleteMail(deleteConfirmId);
      showToast("Pesan berhasil dihapus.");
      if (selectedMailForModal?.id === deleteConfirmId) {
        setSelectedMailForModal(null);
      }
      setDeleteConfirmId(null);
    }
  };

  const handleAction = (mail: MailItem) => {
    if (!mail.actionUrl) return;
    setSelectedMailForModal(null);
    if (onNavigateTab) {
      onNavigateTab(mail.actionUrl.tab, mail.actionUrl.respondentId);
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Baru saja";
      if (diffMins < 60) return `${diffMins} mnt lalu`;
      if (diffHours < 24) return `${diffHours} jam lalu`;
      if (diffDays === 1) return "Kemarin";
      return `${diffDays} hari lalu`;
    } catch {
      return dateStr;
    }
  };

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

  const tracerCount = mails.filter(
    (m) => m.category === "tracer_submission",
  ).length;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 p-3 sm:p-4 bg-[#0d2346] text-white rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">
            {toastMessage}
          </span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#0d2346]" />
            <span>Pesan & Kotak Masuk Alumni</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola tanggapan kuesioner baru, pertanyaan helpdesk, dan masukan alumni.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="px-3.5 py-2 rounded-xl bg-[#0d2346] hover:bg-[#163868] text-white text-xs font-semibold shadow-xs transition active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Tandai Semua Dibaca</span>
          </button>
        )}
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Pesan</p>
            <p className="text-2xl font-bold text-[#0d2346] mt-1">
              {mails.length}
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Pesan masuk di sistem
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Belum Dibaca</p>
            <p className="text-2xl font-bold text-[#0d2346] mt-1">
              {unreadCount}
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Perlu perhatian admin
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Tracer Baru</p>
            <p className="text-2xl font-bold text-[#0d2346] mt-1">
              {tracerCount}
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Siap diverifikasi
            </p>
          </div>
        </div>
      </div>

      {/* Main Mail Center: Clean Full-Width Inbox */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
        {/* Search & Filter Header Bar */}
        <div className="p-4 border-b border-slate-200 space-y-3.5 bg-slate-50/40">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama alumni, NISN, atau subjek pesan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0d2346]/10 focus:border-[#0d2346] transition"
              />
            </div>

            {/* Read/Unread Filter */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setActiveFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                  activeFilter === "all"
                    ? "bg-[#0d2346] text-white shadow-xs"
                    : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                Semua ({mails.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("unread")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                  activeFilter === "unread"
                    ? "bg-[#0d2346] text-white shadow-xs"
                    : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                Belum Dibaca ({unreadCount})
              </button>
            </div>
          </div>

          {/* Category Filter Chips & Counter */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
              {[
                { id: "Semua", label: "Semua Kategori" },
                { id: "tracer_submission", label: "Isian Tracer" },
                { id: "inquiry", label: "Pertanyaan" },
                { id: "feedback", label: "Masukan" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-md shrink-0 cursor-pointer transition text-xs font-medium border ${
                    selectedCategory === cat.id
                      ? "bg-slate-800 text-white border-slate-800"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <span className="text-[11px] text-slate-400">
              Menampilkan {filteredMails.length} pesan
            </span>
          </div>
        </div>

        {/* Mail Items List */}
        <div className="divide-y divide-slate-100">
          {filteredMails.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2.5">
                <Inbox className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-700">
                Tidak ada pesan yang cocok
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Coba sesuaikan kata kunci pencarian atau filter kategori.
              </p>
            </div>
          ) : (
            filteredMails.map((mail) => (
              <div
                key={mail.id}
                onClick={() => handleOpenMailModal(mail)}
                className={`p-4 sm:p-4.5 flex items-start gap-3.5 cursor-pointer transition-all relative group ${
                  !mail.isRead
                    ? "bg-blue-50/30 hover:bg-blue-50/60 font-medium"
                    : "bg-white hover:bg-slate-50"
                }`}
              >
                {/* Unread Indicator Bar */}
                {!mail.isRead && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#0d2346]" />
                )}

                {/* Avatar */}
                <div className="shrink-0 pt-0.5">
                  <UserAvatar
                    name={mail.senderName}
                    gender={mail.senderAvatarGender}
                    className="w-10 h-10 border border-slate-200"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs sm:text-sm truncate ${
                          !mail.isRead
                            ? "font-bold text-slate-900"
                            : "font-semibold text-slate-800"
                        }`}
                      >
                        {mail.senderName}
                      </span>
                      {mail.senderMajor && (
                        <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          {mail.senderMajor}{" "}
                          {mail.senderGradYear ? `(${mail.senderGradYear})` : ""}
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] text-slate-400 shrink-0 flex items-center gap-1 font-normal">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(mail.createdAt)}
                    </span>
                  </div>

                  <p
                    className={`text-xs sm:text-sm mb-1 line-clamp-1 ${
                      !mail.isRead
                        ? "font-bold text-[#0d2346]"
                        : "font-semibold text-slate-800"
                    }`}
                  >
                    {mail.subject}
                  </p>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                    {mail.preview || mail.body}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {getCategoryLabel(mail.category)}
                    </span>
                    {mail.submissionId && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-700 bg-white border border-slate-200">
                        <FileCheck2 className="w-2.5 h-2.5 text-[#0d2346]" />
                        <span>{mail.submissionId}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Arrow / Action Hint */}
                <div className="shrink-0 self-center hidden sm:flex items-center text-slate-400 group-hover:text-[#0d2346] group-hover:translate-x-0.5 transition-all">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message Detail Modal (Opens when clicked) */}
      <Modal
        isOpen={Boolean(selectedMailForModal)}
        onClose={() => setSelectedMailForModal(null)}
        maxWidth="2xl"
      >
        {selectedMailForModal && (
          <div className="flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-white flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5 min-w-0">
                <UserAvatar
                  name={selectedMailForModal.senderName}
                  gender={selectedMailForModal.senderAvatarGender}
                  className="w-11 h-11 shrink-0 border border-slate-200"
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                      {selectedMailForModal.senderName}
                    </h2>
                    {selectedMailForModal.senderMajor && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {selectedMailForModal.senderMajor}{" "}
                        {selectedMailForModal.senderGradYear
                          ? `(${selectedMailForModal.senderGradYear})`
                          : ""}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    {selectedMailForModal.senderEmail}
                    {selectedMailForModal.senderNisn
                      ? ` • NISN: ${selectedMailForModal.senderNisn}`
                      : ""}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] text-slate-400 block font-medium">
                  {new Date(selectedMailForModal.createdAt).toLocaleString(
                    "id-ID",
                    {
                      dateStyle: "medium",
                      timeStyle: "short",
                    },
                  )}
                </span>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  {getCategoryLabel(selectedMailForModal.category)}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  SUBJEK PESAN
                </span>
                <h3 className="text-base font-bold text-[#0d2346]">
                  {selectedMailForModal.subject}
                </h3>
              </div>

              {selectedMailForModal.submissionId && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium">
                  <FileCheck2 className="w-3.5 h-3.5 text-[#0d2346]" />
                  <span>
                    Nomor Pengajuan Tracer Study:{" "}
                    <strong className="font-mono text-slate-900">
                      {selectedMailForModal.submissionId}
                    </strong>
                  </span>
                </div>
              )}

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                {selectedMailForModal.body}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleDelete(selectedMailForModal.id)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Pesan</span>
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedMailForModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/70 border border-slate-200 transition cursor-pointer"
                >
                  Tutup
                </button>

                {selectedMailForModal.actionUrl && (
                  <button
                    type="button"
                    onClick={() => handleAction(selectedMailForModal)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0d2346] hover:bg-[#163868] shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{selectedMailForModal.actionUrl.label}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Pesan Masuk?"
        message="Pesan yang dihapus akan dibersihkan dari kotak masuk sistem dan tidak dapat dipulihkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        type="danger"
      />
    </div>
  );
};
