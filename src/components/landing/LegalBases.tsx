import React from 'react';
import { MOCK_LEGAL_BASES } from '@/lib/mockData';
import { Download } from 'lucide-react';

export const LegalBases: React.FC = () => {
  return (
    <section
      id="dasar-hukum"
      className="scroll-mt-24 sm:scroll-mt-28 pt-10 sm:pt-16 pb-12 sm:pb-16 bg-transparent relative"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching exact attachment typography & text */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#182a4a] tracking-tight">
            Dasar Hukum Tracer Study
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
            Bagian dari amanat Perpres No. 68/2022 tentang <br className="hidden sm:inline" />
            Revitalisasi Pendidikan Vokasi.
          </p>
        </div>

        {/* 4 Cards Grid: Only the 'Unduh File' button triggers the PDF download */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {MOCK_LEGAL_BASES.map((item) => (
            <div
              key={item.id}
              className="relative bg-[#f1f5f9]/90 backdrop-blur-sm rounded-xl pt-6 pb-5 px-5 border border-slate-200/80 shadow-sm transition-all duration-200 flex flex-col justify-between"
            >
              {/* Top Badge: Centered on top border */}
              <div className="absolute -top-3.5 left-0 right-0 flex justify-center pointer-events-none z-10">
                <span className="inline-block px-4 py-1 rounded-full bg-[#1c293d] text-white text-[10px] font-bold tracking-wider uppercase shadow-sm">
                  {item.badge || item.year}
                </span>
              </div>

              {/* Title & Description Centered */}
              <div className="flex-1 flex flex-col items-center justify-center text-center my-3">
                <h3 className="text-sm sm:text-base font-extrabold text-[#182a4a] leading-tight mb-1.5">
                  {item.id === 'sk-4' ? (
                    <>
                      <span className="block text-xs font-bold text-[#182a4a]">Nomor</span>
                      <span className="text-xs sm:text-[13px]">3159/B/D2/DV.06.03/2026</span>
                    </>
                  ) : (
                    item.number
                  )}
                </h3>

                <p className="text-[11px] sm:text-xs text-slate-500 font-normal leading-relaxed max-w-[210px]">
                  {item.title}
                </p>
              </div>

              {/* Bottom Action Button: Unduh File aligned bottom-left - ONLY clicking this triggers download */}
              <div className="w-full flex justify-start pt-3">
                <a
                  href={item.pdfUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg hover:bg-[#111c2c] text-[#111c2c] text-[10px] font-semibold tracking-tight transition-all shadow-xs active:scale-95 cursor-pointer inline-flex items-center gap-1.5 border border-[#111c2c] hover:text-white"
                >
                  <Download className="w-3 h-3" />
                  <span>Unduh File</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
