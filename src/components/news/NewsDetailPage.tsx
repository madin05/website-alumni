import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useContentStore } from "@/store/contentStore";
import { useAuthStore } from "@/store/authStore";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  Check,
  Bookmark,
  ChevronRight,
  TrendingUp,
  Tag,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

export const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { newsList } = useContentStore();
  const [copied, setCopied] = useState(false);

  const newsItem = newsList.find((item) => item.id === id) || newsList[0];
  const relatedNews = newsList.filter((item) => item.id !== newsItem?.id).slice(
    0,
    3,
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWa = () => {
    const text = encodeURIComponent(
      `${newsItem.title} - Baca selengkapnya di Portal Berita SMK Sasmita Jaya 2: ${window.location.href}`,
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-800">
      {/* Top Header / Sticky Navbar */}
      <Navbar />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200/60 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link
              to="/berita"
              className="hover:text-blue-600 transition-colors"
            >
              Berita
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-700">
              {newsItem.category}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Article Main Column (8 cols) */}
          <article className="lg:col-span-8 l p-6 sm:p-10 ">
            {/* Category & Metadata */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {newsItem.date}
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {newsItem.readTime}
              </span>
            </div>

            {/* Article Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              {newsItem.title}
            </h1>

            {/* Author & Share Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                  {newsItem.author.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-none">
                    {newsItem.author}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Redaksi SMK Sasmita Jaya 2 Pamulang
                  </p>
                </div>
              </div>

              {/* Share buttons */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium mr-1 hidden sm:inline">
                  Bagikan:
                </span>
                <button
                  onClick={handleShareWa}
                  className="p-2 text-emerald-600 transition-colors"
                  title="Bagikan ke WhatsApp"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </button>
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-slate-700 text-xs font-semibold transition-colors"
                  title="Salin Tautan"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Salin Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Featured Image */}
            <div className="mb-8 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80">
              <img
                src={newsItem.imageUrl}
                alt={newsItem.title}
                className="w-full h-auto max-h-[440px] object-cover"
              />
              <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 italic">
                Dokumentasi Humas & BKK SMK Sasmita Jaya 2 Pamulang.
              </div>
            </div>

            {/* Article Body */}
            <div className="prose max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-5">
              <p className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed border-l-4 border-blue-900 pl-4 py-1 bg-blue-50/40 rounded-r-xl">
                {newsItem.excerpt}
              </p>

              {newsItem.content.split("\n\n").map((para, pIdx) => (
                <p key={pIdx} className="leading-relaxed">
                  {para.trim()}
                </p>
              ))}

              <p className="leading-relaxed">
                Melalui penguatan tracer study dan integrasi data lulusan secara
                berkelanjutan, sekolah memastikan setiap alumni mendapatkan
                ruang bertumbuh dan berkontribusi secara nyata di dunia kerja
                maupun pendidikan lanjutan.
              </p>
            </div>

            {/* Tags & Footer Share */}
            <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="w-4 h-4 text-slate-400 mr-1" />
                <span className="text-xs text-slate-500">Tag:</span>
                {[
                  "Tracer Study",
                  "SMK Sasmita Jaya 2",
                  newsItem.category,
                  "Alumni",
                ].map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </article>

          {/* Sidebar Column (4 cols) */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Tracer Study CTA Box */}
            <div className="bg-[#182945] p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <h3 className="text-xl font-extrabold text-white leading-tight">
                  Sudah Mengisi Kuesioner Tracer Study?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Partisipasi Anda sangat berarti untuk akreditasi sekolah,
                  pengembangan kurikulum, dan penyaluran karir adik kelas.
                </p>
                <div className="pt-2">
                  <Link
                    to={isAuthenticated ? "/tracer-study" : "/login"}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-slate-50 hover:bg-slate-200 text-slate-950 font-bold text-xs transition shadow-md active:scale-95 cursor-pointer"
                  >
                    <span>Mulai Isi Tracer Study</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Related News List */}
            <div className="l p-6 sm:p-7 ">
              <h3 className="text-base font-extrabold text-slate-900 mb-5 flex items-center gap-2">
                <span>Berita Terkait Lainnya</span>
              </h3>

              <div className="space-y-4">
                {relatedNews.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => navigate(`/berita/${rel.id}`)}
                    className="flex gap-3.5 group cursor-pointer pb-4 border-b border-slate-100 last:border-0 last:pb-0"
                  >
                    <img
                      src={rel.imageUrl}
                      alt={rel.title}
                      className="w-20 h-20 rounded-xl object-cover bg-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 leading-snug">
                        {rel.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {rel.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Helpdesk Info */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 text-slate-700">
              <h4 className="font-bold text-sm text-slate-900 mb-2">
                Punya Pertanyaan Seputar Berita?
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Hubungi tim redaksi atau Helpdesk Tracer Study SMK Sasmita Jaya
                2 untuk informasi lebih lanjut.
              </p>
              <a
                href="https://wa.me/6281298765432?text=Halo%20Helpdesk%20SMK%20Sasmita%20Jaya%202"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>Chat WhatsApp Helpdesk</span>
              </a>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
