import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContentStore } from "@/store/contentStore";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Pagination } from "@/components/ui/Pagination";
import {
  Search,
  Calendar,
  Clock,
  ChevronRight,
  ArrowRight,
  Newspaper,
  Sparkles,
  Tag,
  BookOpen,
} from "lucide-react";

export const NewsPortalPage: React.FC = () => {
  const navigate = useNavigate();
  const { newsList } = useContentStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Extract unique categories dynamically
  const categories = useMemo(() => {
    const set = new Set<string>();
    newsList.forEach((n) => {
      if (n.category) set.add(n.category);
    });
    return ["ALL", ...Array.from(set)];
  }, [newsList]);

  // Filter news by search query & category
  const filteredNews = useMemo(() => {
    return newsList.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.author &&
          item.author.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory =
        selectedCategory === "ALL" || item.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [newsList, searchQuery, selectedCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const paginatedNews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredNews.slice(start, start + itemsPerPage);
  }, [filteredNews, currentPage, itemsPerPage]);

  // The latest article is featured if on page 1 and no filters
  const featuredArticle =
    searchQuery === "" && selectedCategory === "ALL" && currentPage === 1
      ? newsList[0]
      : null;

  const displayGridNews = featuredArticle
    ? paginatedNews.filter((item) => item.id !== featuredArticle.id)
    : paginatedNews;

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
            <span className="font-semibold text-slate-800">Portal Berita</span>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
        {/* Search & Category Filter Controls */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul berita, topik, atau kata kunci..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d223f]/20 focus:border-[#0d223f] text-xs sm:text-sm bg-slate-50/50"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 border-t border-slate-100 text-xs no-scrollbar">
            <span className="text-slate-400 text-xs font-semibold shrink-0 mr-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              Kategori:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer whitespace-nowrap text-xs ${
                  selectedCategory === cat
                    ? "bg-[#0d223f] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat === "ALL" ? "Semua Kategori" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* News Grid Cards */}
        {filteredNews.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Tidak Ada Berita Ditemukan
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Tidak ada berita yang cocok dengan kata kunci &quot;{searchQuery}
              &quot;. Coba ganti kata kunci pencarian atau pilih kategori lain.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("ALL");
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayGridNews.map((item) => (
              <article
                key={item.id}
                onClick={() => navigate(`/berita/${item.id}`)}
                className="group bg-white rounded-md border border-slate-200/90 shadow-sm  overflow-hidden flex flex-col cursor-pointer"
              >
                {/* Thumbnail Image */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover "
                    loading="lazy"
                  />
                </div>

                {/* Article Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.excerpt}
                    </p>
                  </div>

                  {/* Metadata Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {item.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {item.readTime}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredNews.length}
              itemsPerPage={itemsPerPage}
              itemName="berita"
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
