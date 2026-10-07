import React, { useState, useEffect } from "react";
import { useContentStore } from "@/store/contentStore";
import { NewsItem } from "@/types/tracer";
import {
  Newspaper,
  Plus,
  Search,
  Edit3,
  Trash2,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Pagination } from "@/components/ui/Pagination";
import { AdminNewsEditor, CATEGORIES } from "./AdminNewsEditor";

export const AdminNewsTab: React.FC = () => {
  const { newsList, addNews, updateNews, deleteNews } = useContentStore();

  const [viewMode, setViewMode] = useState<"list" | "editor">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Editor & Delete State
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleOpenEditor = (item: NewsItem | null) => {
    setEditingNews(item);
    setViewMode("editor");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveNews = (data: {
    title: string;
    category: string;
    author: string;
    readTime: string;
    imageUrl: string;
    excerpt: string;
    content: string;
  }) => {
    const today = new Date();
    const months = [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
      "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
    ];
    const todayStr = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

    if (editingNews) {
      updateNews(editingNews.id, {
        title: data.title.trim(),
        category: data.category,
        author: data.author.trim() || "Tim Humas BKK",
        readTime: data.readTime.trim() || "3 min read",
        imageUrl: data.imageUrl.trim(),
        excerpt: data.excerpt.trim(),
        content: data.content.trim(),
      });
      showToast("Berita berhasil diperbarui dan disinkronkan ke Landing Page!");
    } else {
      addNews({
        title: data.title.trim(),
        category: data.category,
        author: data.author.trim() || "Tim Humas BKK",
        readTime: data.readTime.trim() || "3 min read",
        imageUrl: data.imageUrl.trim(),
        excerpt: data.excerpt.trim(),
        content: data.content.trim(),
        date: todayStr,
      });
      showToast("Berita baru berhasil dibuat dan langsung tampil di Landing Page!");
    }

    setViewMode("list");
  };

  const handleDelete = (id: string) => {
    deleteNews(id);
    setDeleteConfirmId(null);
    showToast("Berita berhasil dihapus dari sistem.");
  };

  // Reset pagination when search query or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // Filtered News
  const filteredNews = newsList.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat =
      selectedCategory === "Semua" || item.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-[#0d2346] text-white rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">
            {toastMessage}
          </span>
        </div>
      )}

      {/* VIEW 1: DEDICATED EDITOR PAGE */}
      {viewMode === "editor" ? (
        <AdminNewsEditor
          editingNews={editingNews}
          onSave={handleSaveNews}
          onCancel={() => setViewMode("list")}
          showToast={showToast}
        />
      ) : (
        /* VIEW 2: NEWS LIST VIEW */
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header Banner */}
          <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-[#0d2346]" />
                <span>Kelola Berita & Informasi BKK</span>
              </h1>
            </div>

            <button
              type="button"
              onClick={() => handleOpenEditor(null)}
              className="px-4 py-2 rounded-xl bg-[#0d2346] hover:bg-[#163868] text-white text-xs font-semibold shadow-xs transition active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Berita Baru</span>
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Total Berita Publish
                </p>
                <p className="text-2xl font-bold text-[#0d2346] mt-1">
                  {newsList.length}
                </p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Tayang di Landing Page
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Kategori Aktif
                </p>
                <p className="text-2xl font-bold text-[#0d2346] mt-1">
                  {new Set(newsList.map((n) => n.category)).size}
                </p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Topik Informasi
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Status Sinkronisasi
                </p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  Real-time
                </p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Live di Portal Publik
                </p>
              </div>
            </div>
          </div>

          {/* Search, Filter & Action Bar */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari judul, topik, penulis..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0d2346]/10 focus:border-[#0d2346] transition"
                />
              </div>

              <div className="w-full sm:w-48">
                <CustomSelect
                  options={CATEGORIES.map((cat) => ({
                    value: cat,
                    label: cat,
                  }))}
                  value={selectedCategory}
                  onChange={(val) => setSelectedCategory(val)}
                />
              </div>
            </div>

            <div className="text-xs text-slate-500 font-medium self-end md:self-center">
              Menampilkan{" "}
              <strong className="text-slate-800">{filteredNews.length}</strong>{" "}
              artikel berita
            </div>
          </div>

          {/* News Card Grid */}
          {filteredNews.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">
                Tidak ada berita ditemukan
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Coba ubah kata kunci pencarian atau filter kategori untuk melihat
                berita lainnya.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 content-start min-h-[520px]">
              {paginatedNews.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between group"
                >
                  {/* Card Cover Image */}
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#0d2346]/90 text-white backdrop-blur-xs shadow-xs">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {item.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {item.readTime}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-[#0d2346] transition">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {item.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1.5 truncate max-w-[150px]">
                        <User className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate font-medium">
                          {item.author}
                        </span>
                      </div>

                      <a
                        href={`/berita/${item.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#0d2346] hover:underline font-semibold flex items-center gap-1 shrink-0"
                      >
                        <span>Lihat</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="px-4 sm:px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500 font-medium">
                      Aksi Pengelola:
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEditor(item)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 transition shadow-2xs cursor-pointer"
                        title="Edit Berita"
                      >
                        <Edit3 className="w-3 h-3 text-blue-600" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50/50 hover:bg-rose-100/80 text-rose-700 text-xs font-semibold flex items-center gap-1 transition shadow-2xs cursor-pointer"
                        title="Hapus Berita"
                      >
                        <Trash2 className="w-3 h-3 text-rose-600" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => setCurrentPage(p)}
            totalItems={filteredNews.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteConfirmId}
        title="Konfirmasi Hapus Berita"
        message="Apakah Anda yakin ingin menghapus artikel berita ini? Artikel yang dihapus tidak akan lagi ditampilkan pada Landing Page."
        confirmText="Hapus Berita"
        cancelText="Batal"
        type="danger"
        onConfirm={() => deleteConfirmId && handleDelete(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
      />
    </div>
  );
};
