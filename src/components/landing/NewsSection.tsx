import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContentStore } from '@/store/contentStore';
import { Calendar, ChevronRight, Clock } from 'lucide-react';

export const NewsSection: React.FC = () => {
  const navigate = useNavigate();
  const { newsList } = useContentStore();

  return (
    <section id="berita" className="pt-12 sm:pt-16 pb-12 sm:pb-16 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Berita
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Pembaruan informasi dan pengumuman terbaru
          </p>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {newsList.slice(0, 6).map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/berita/${item.id}`)}
              className="bg-white rounded-md overflow-hidden border border-slate-200 shadow-sm flex flex-col cursor-pointer"
            >
              {/* Image thumbnail */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>

                {/* Metadata footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {item.readTime}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Link: Lihat Semua */}
        {newsList.length > 0 && (
          <div className="mt-12 text-right">
            <button
              onClick={() => navigate("/berita")}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
