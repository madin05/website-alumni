import React, { useState, useRef, useEffect } from "react";
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
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  ArrowLeft,
  UploadCloud,
  Link as LinkIcon,
  ChevronDown,
  X,
} from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Pagination } from "@/components/ui/Pagination";

const CATEGORIES = [
  "Semua",
  "BKK & Karir",
  "Tracer Study",
  "Kemitraan DUDI",
  "Fasilitas",
  "Panduan Karir",
  "Sertifikasi",
  "Prestasi Alumni",
];

const SAMPLE_IMAGES = [
  {
    name: "Workshop & Mesin",
    url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Pertemuan Industri",
    url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Lab Jaringan & Komputer",
    url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Kerjasama Korporat",
    url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Konseling & Alumni",
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
  },
];

export const AdminNewsTab: React.FC = () => {
  const { newsList, addNews, updateNews, deleteNews } = useContentStore();

  const [viewMode, setViewMode] = useState<"list" | "editor">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Editor State
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  // Form Fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("BKK & Karir");
  const [author, setAuthor] = useState("Tim Humas BKK");
  const [readTime, setReadTime] = useState("3 min read");
  const [imageUrl, setImageUrl] = useState(SAMPLE_IMAGES[0].url);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  // Image Source Mode: 'upload' | 'url' | 'preset'
  const [imageMode, setImageMode] = useState<"upload" | "url" | "preset">(
    "upload",
  );
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleOpenEditor = (item: NewsItem | null) => {
    if (item) {
      setEditingNews(item);
      setTitle(item.title);
      setCategory(item.category);
      setAuthor(item.author);
      setReadTime(item.readTime);
      setImageUrl(item.imageUrl);
      setExcerpt(item.excerpt);
      setContent(item.content);
      setImageMode("url");
      setUploadedFileName(null);
      setUploadedFileSize(null);
    } else {
      setEditingNews(null);
      setTitle("");
      setCategory("BKK & Karir");
      setAuthor("Tim Humas BKK");
      setReadTime("3 min read");
      setImageUrl(SAMPLE_IMAGES[0].url);
      setExcerpt("");
      setContent("");
      setImageMode("upload");
      setUploadedFileName(null);
      setUploadedFileSize(null);
    }
    setViewMode("editor");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEditor = () => {
    setViewMode("list");
  };

  // Custom File Upload Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const processImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Harap pilih berkas gambar (PNG, JPG, JPEG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran berkas gambar maksimal 5MB.");
      return;
    }

    const sizeFormatted =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    setUploadedFileName(file.name);
    setUploadedFileSize(sizeFormatted);

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setImageUrl(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      alert("Harap lengkapi judul, ringkasan, dan isi lengkap berita.");
      return;
    }

    const todayStr = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    if (editingNews) {
      updateNews(editingNews.id, {
        title: title.trim(),
        category,
        author: author.trim() || "Tim Humas BKK",
        readTime: readTime.trim() || "3 min read",
        imageUrl: imageUrl.trim() || SAMPLE_IMAGES[0].url,
        excerpt: excerpt.trim(),
        content: content.trim(),
      });
      showToast("Berita berhasil diperbarui dan disinkronkan ke Landing Page!");
    } else {
      addNews({
        title: title.trim(),
        category,
        author: author.trim() || "Tim Humas BKK",
        readTime: readTime.trim() || "3 min read",
        imageUrl: imageUrl.trim() || SAMPLE_IMAGES[0].url,
        excerpt: excerpt.trim(),
        content: content.trim(),
        date: todayStr,
      });
      showToast(
        "Berita baru berhasil dibuat dan langsung tampil di Landing Page!",
      );
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

      {/* ========================================================================= */}
      {/* VIEW 1: DEDICATED EDITOR PAGE (FULL FORM VIEW)                           */}
      {/* ========================================================================= */}
      {viewMode === "editor" ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Editor Header Navigation */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCancelEditor}
                className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                title="Kembali ke daftar berita"
              >
                <ArrowLeft className="w-4 h-4 text-slate-600" />
                <span>Kembali</span>
              </button>

              <div>
                <h1 className="text-base sm:text-lg font-bold text-[#0d2346]">
                  {editingNews ? "Edit Berita & Publikasi" : "Buat Berita Baru"}
                </h1>
                <p className="text-xs text-slate-500">
                  Artikel akan langsung dipublikasikan dan ditampilkan pada
                  Landing Page portal alumni.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleCancelEditor}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-5 py-2 rounded-xl bg-[#0d2346] hover:bg-[#163868] text-white text-xs sm:text-sm font-bold shadow-xs transition active:scale-95 cursor-pointer"
              >
                {editingNews ? "Simpan Perubahan" : "Publikasikan Berita"}
              </button>
            </div>
          </div>

          {/* Form and Live Preview 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Form Column (8 cols) */}
            <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5">
              {/* Field 1: Judul Berita */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-900">
                  Judul Berita / Pengumuman{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Kunjungan Industri PT Toyota Motor Manufacturing Indonesia Batch 2"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-[#0d2346] focus:ring-2 focus:ring-[#0d2346]/10 focus:outline-none transition bg-slate-50/50 focus:bg-white"
                  required
                />
              </div>

              {/* Field 2: Kategori, Penulis & Estimasi Baca */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Custom Category Select */}
                <CustomSelect
                  label="Kategori"
                  requiredStar
                  options={CATEGORIES.filter((c) => c !== "Semua").map((c) => ({
                    value: c,
                    label: c,
                  }))}
                  value={category}
                  onChange={(val) => setCategory(val)}
                />

                {/* Penulis / Redaksi */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-900">
                    Penulis / Redaksi
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Contoh: Tim Humas BKK"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-[#0d2346] focus:ring-2 focus:ring-[#0d2346]/10 focus:outline-none transition bg-slate-50/50 focus:bg-white"
                  />
                </div>

                {/* Estimasi Baca */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-900">
                    Estimasi Baca
                  </label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="Contoh: 3 min read"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-[#0d2346] focus:ring-2 focus:ring-[#0d2346]/10 focus:outline-none transition bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Field 3: Cover Image Selector (Custom Upload, URL Input, and Presets) */}
              <div className="space-y-2.5 pt-1">
                <label className="block text-xs font-bold text-slate-900">
                  Gambar Sampul (Cover Image)
                </label>

                {/* Source Selection Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg max-w-md text-xs">
                  <button
                    type="button"
                    onClick={() => setImageMode("upload")}
                    className={`flex-1 py-1.5 px-3 rounded-md font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      imageMode === "upload"
                        ? "bg-white text-[#0d2346] shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload Berkas</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode("url")}
                    className={`flex-1 py-1.5 px-3 rounded-md font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      imageMode === "url"
                        ? "bg-white text-[#0d2346] shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Tautan URL</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode("preset")}
                    className={`flex-1 py-1.5 px-3 rounded-md font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      imageMode === "preset"
                        ? "bg-white text-[#0d2346] shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Siap Pakai</span>
                  </button>
                </div>

                {/* 3A: Custom Drag & Drop File Upload */}
                {imageMode === "upload" && (
                  <div>
                    {/* Hidden native input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
                        isDragging
                          ? "border-[#0d2346] bg-slate-100/80"
                          : "border-slate-300 hover:border-[#0d2346] bg-slate-50/50 hover:bg-slate-50"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-[#0d2346] flex items-center justify-center">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          Klik untuk memilih berkas atau seret gambar ke sini
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Format didukung: PNG, JPG, JPEG, WebP (Maksimal 5 MB)
                        </p>
                      </div>

                      {uploadedFileName && (
                        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>
                            {uploadedFileName} ({uploadedFileSize})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3B: URL Input */}
                {imageMode === "url" && (
                  <div className="space-y-1">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-[#0d2346] focus:ring-2 focus:ring-[#0d2346]/10 focus:outline-none transition bg-slate-50/50 focus:bg-white"
                    />
                    <p className="text-[11px] text-slate-400">
                      Masukkan URL link gambar dari web atau penyimpanan
                      hosting.
                    </p>
                  </div>
                )}

                {/* 3C: Preset Image Choices */}
                {imageMode === "preset" && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {SAMPLE_IMAGES.map((img) => (
                        <button
                          key={img.name}
                          type="button"
                          onClick={() => setImageUrl(img.url)}
                          className={`p-2 rounded-xl border text-left transition cursor-pointer flex items-center gap-2 ${
                            imageUrl === img.url
                              ? "bg-slate-100 border-[#0d2346] ring-1 ring-[#0d2346]"
                              : "bg-white hover:bg-slate-50 border-slate-200"
                          }`}
                        >
                          <img
                            src={img.url}
                            alt={img.name}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                          <span className="text-xs font-semibold text-slate-800 line-clamp-2">
                            {img.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Field 4: Ringkasan Singkat (Excerpt) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-900">
                    Ringkasan Singkat (Excerpt){" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-normal">
                    Tampil pada kartu berita di halaman utama
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Ringkasan 1-2 kalimat untuk preview berita..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-[#0d2346] focus:ring-2 focus:ring-[#0d2346]/10 focus:outline-none transition bg-slate-50/50 focus:bg-white resize-y"
                  required
                />
              </div>

              {/* Field 5: Isi Lengkap Berita */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-900">
                    Isi Lengkap Berita (Paragraf){" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-normal">
                    Tekan Enter dua kali untuk membuat paragraf baru
                  </span>
                </div>
                <textarea
                  rows={9}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tuliskan isi berita lengkap di sini..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-[#0d2346] focus:ring-2 focus:ring-[#0d2346]/10 focus:outline-none transition bg-slate-50/50 focus:bg-white resize-y leading-relaxed"
                  required
                />
              </div>

              {/* Submit & Cancel Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancelEditor}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-2.5 rounded-xl bg-[#0d2346] hover:bg-[#163868] text-white text-xs sm:text-sm font-bold shadow-xs transition active:scale-95 cursor-pointer"
                >
                  {editingNews ? "Simpan Perubahan" : "Publikasikan Berita"}
                </button>
              </div>
            </div>

            {/* Live Preview Column (4 cols) */}
            <div className="lg:col-span-4 sticky top-6 space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <span>Pratinjau Kartu Landing Page</span>
                  </h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    Live
                  </span>
                </div>

                {/* News Card Live Preview */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden bg-slate-100">
                    <img
                      src={imageUrl || SAMPLE_IMAGES[0].url}
                      alt={title || "Preview"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          SAMPLE_IMAGES[0].url;
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#0d2346]/90 text-white backdrop-blur-xs shadow-xs">
                        {category}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2.5 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        Hari ini
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {readTime || "3 min read"}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-[#0d2346] leading-snug line-clamp-2">
                      {title ||
                        "Judul berita yang Anda tulis akan muncul di sini"}
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {excerpt ||
                        "Ringkasan berita akan ditampilkan di bagian ini sebagai pengantar singkat pembaca..."}
                    </p>

                    <div className="pt-2 flex items-center gap-1.5 text-[11px] text-slate-400 border-t border-slate-100">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>
                        Oleh:{" "}
                        <strong className="text-slate-600">
                          {author || "Tim Humas BKK"}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 mt-3 text-center leading-relaxed">
                  Perubahan pada form otomatis ter-update pada pratinjau kartu
                  di atas.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* VIEW 2: NEWS LIST VIEW                                                    */
        /* ========================================================================= */
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
                  Topik informasi BKK
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Update Terakhir
                </p>
                <p className="text-sm font-bold text-[#0d2346] mt-2">
                  {newsList[0]?.date || "-"}
                </p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate max-w-[170px]">
                  {newsList[0]?.title || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari judul, ringkasan, atau penulis berita..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0d2346]/10 focus:border-[#0d2346] focus:bg-white transition"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>
                  Menampilkan <strong>{filteredNews.length}</strong> dari{" "}
                  {newsList.length} berita
                </span>
              </div>
            </div>

            {/* Category Badges */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-semibold text-xs whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-slate-200 text-slate-600 shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* News Grid / Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredNews.length === 0 ? (
              <div className="col-span-full bg-white rounded-xl p-12 text-center border border-slate-200">
                <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <Newspaper className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">
                  Tidak ada berita ditemukan
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Coba gunakan kata kunci pencarian yang berbeda atau pilih
                  kategori lain.
                </p>
              </div>
            ) : (
              paginatedNews.map((news) => (
                <div
                  key={news.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group"
                >
                  <div>
                    {/* Image & Category Overlay */}
                    <div className="relative h-44 overflow-hidden bg-slate-100">
                      <img
                        src={news.imageUrl}
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            SAMPLE_IMAGES[0].url;
                        }}
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#0d2346]/90 text-white backdrop-blur-xs shadow-xs">
                          {news.category}
                        </span>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-4 sm:p-5 space-y-2.5">
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {news.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {news.readTime}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-[#0d2346] leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {news.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                        {news.excerpt}
                      </p>

                      <div className="pt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>
                          Oleh:{" "}
                          <strong className="text-slate-600">
                            {news.author}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                    <a
                      href={`/berita/${news.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                      title="Lihat halaman berita publik"
                    >
                      <span>Lihat di Web</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditor(news)}
                        className="p-2 rounded-lg text-slate-600 hover:text-[#0d2346] hover:bg-slate-100 transition cursor-pointer"
                        title="Edit Berita"
                        aria-label="Edit Berita"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(news.id)}
                        className="p-2 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                        title="Hapus Berita"
                        aria-label="Hapus Berita"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredNews.length}
            itemsPerPage={itemsPerPage}
            itemName="berita"
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => {
          if (deleteConfirmId) {
            handleDelete(deleteConfirmId);
          }
        }}
        title="Hapus Berita Ini?"
        message="Berita yang dihapus tidak akan lagi muncul di Landing Page maupun halaman detail berita."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        type="danger"
      />
    </div>
  );
};
