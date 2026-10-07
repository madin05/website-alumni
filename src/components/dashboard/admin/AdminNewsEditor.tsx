import React, { useState, useRef } from "react";
import { NewsItem } from "@/types/tracer";
import {
  ArrowLeft,
  UploadCloud,
  Link as LinkIcon,
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  User,
} from "lucide-react";
import { CustomSelect } from "@/components/ui/CustomSelect";

export const CATEGORIES = [
  "Semua",
  "BKK & Karir",
  "Tracer Study",
  "Kemitraan DUDI",
  "Fasilitas",
  "Panduan Karir",
  "Sertifikasi",
  "Prestasi Alumni",
];

export const SAMPLE_IMAGES = [
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

export interface AdminNewsEditorProps {
  editingNews: NewsItem | null;
  onSave: (data: {
    title: string;
    category: string;
    author: string;
    readTime: string;
    imageUrl: string;
    excerpt: string;
    content: string;
  }) => void;
  onCancel: () => void;
  showToast: (msg: string) => void;
}

export const AdminNewsEditor: React.FC<AdminNewsEditorProps> = ({
  editingNews,
  onSave,
  onCancel,
  showToast,
}) => {
  const [title, setTitle] = useState(editingNews?.title || "");
  const [category, setCategory] = useState(editingNews?.category || "BKK & Karir");
  const [author, setAuthor] = useState(editingNews?.author || "Tim Humas BKK");
  const [readTime, setReadTime] = useState(editingNews?.readTime || "3 min read");
  const [imageUrl, setImageUrl] = useState(editingNews?.imageUrl || SAMPLE_IMAGES[0].url);
  const [excerpt, setExcerpt] = useState(editingNews?.excerpt || "");
  const [content, setContent] = useState(editingNews?.content || "");

  const [imageMode, setImageMode] = useState<"upload" | "url" | "preset">("upload");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith("image/")) {
      showToast("Harap pilih berkas gambar (PNG, JPG, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("Ukuran gambar melebihi batas 5 MB.");
      return;
    }

    const sizeStr =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    setUploadedFileName(file.name);
    setUploadedFileSize(sizeStr);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageUrl(e.target.result as string);
        showToast(`Gambar "${file.name}" berhasil diunggah.`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileProcess(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileProcess(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      showToast("Harap lengkapi judul, ringkasan, dan isi berita.");
      return;
    }

    onSave({
      title,
      category,
      author,
      readTime,
      imageUrl,
      excerpt,
      content,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Editor Top Navigation Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Kembali ke daftar berita"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {editingNews ? "Edit Artikel Berita" : "Tulis Berita / Informasi Baru"}
            </h2>
            <p className="text-xs text-slate-500">
              Publikasikan berita, agenda kemitraan, atau panduan karir untuk alumni dan siswa
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={onCancel}
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
              Judul Berita / Pengumuman <span className="text-rose-500">*</span>
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

          {/* Field 3: Cover Image Selector */}
          <div className="space-y-2.5 pt-1">
            <label className="block text-xs font-bold text-slate-900">
              Gambar Sampul (Cover Image)
            </label>

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

            {imageMode === "upload" && (
              <div>
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
                  Masukkan URL link gambar dari web atau penyimpanan hosting.
                </p>
              </div>
            )}

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

          {/* Field 4: Ringkasan Singkat */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-900">
                Ringkasan Singkat (Excerpt) <span className="text-rose-500">*</span>
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
                Isi Lengkap Berita (Paragraf) <span className="text-rose-500">*</span>
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
              onClick={onCancel}
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
              <div className="relative h-40 overflow-hidden bg-slate-100">
                <img
                  src={imageUrl || SAMPLE_IMAGES[0].url}
                  alt={title || "Preview"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = SAMPLE_IMAGES[0].url;
                  }}
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#0d2346]/90 text-white backdrop-blur-xs shadow-xs">
                    {category}
                  </span>
                </div>
              </div>

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
                  {title || "Judul berita yang Anda tulis akan muncul di sini"}
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
              Perubahan pada form otomatis ter-update pada pratinjau kartu di atas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
