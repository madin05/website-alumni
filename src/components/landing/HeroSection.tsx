import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export const HeroSection: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <section id="beranda" className="relative w-full overflow-hidden bg-[#004889]">
      {/* Main Hero Visual Container: Full viewport height on mobile and desktop without any bottom white gap */}
      <div className="relative hero-viewport-height w-full flex items-center pt-4 pb-12 sm:py-0">
        {/* Background Photo Image (Optimized WebP with fetchPriority & async decoding) */}
        <img
          src="/bg-cto2.webp"
          alt="Banner Siswa SMK Sasmita Jaya 2"
          {...({ fetchpriority: "high" } as React.ImgHTMLAttributes<HTMLImageElement>)}
          loading="eager"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-[calc(100%+40px)_center] sm:object-right lg:object-[calc(100%+60px)_center] pointer-events-none select-none"
        />

        {/* Mobile & Tablet Backdrop (< 1024px): Smooth uniform royal blue backdrop so text is 100% crisp without any vertical split cut on the students' faces */}
        <div className="block lg:hidden absolute inset-0 bg-gradient-to-b from-[#004889]/95 via-[#0058a6]/90 to-[#004889]/95" />

        {/* Desktop Gradient Overlay (lg+): Crisp on left 30%, completely 100% transparent by 46% so it NEVER touches or hazes the students on the right */}
        <div className="hidden lg:block absolute inset-y-0 left-0 w-[60%] bg-gradient-to-r from-[#004889] via-[#004889]/80 to-transparent pointer-events-none" />

        {/* Desktop Top Vignette (lg+): Subtle dark blue vignette along top edge for high contrast navigation */}
        <div className="hidden lg:block absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#001733]/85 via-[#00284d]/40 to-transparent pointer-events-none z-[5]" />

        {/* Left Content Area */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl lg:max-w-2xl text-left space-y-4 sm:space-y-5">
            {/* Title matching exact typography and color */}
            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight leading-[1.15]">
              <span className="text-white block">Masa Depan Lulusan,</span>
              <span className="text-[#fdb813] block mt-1">
                Dimulai dari Data yang Tepat
              </span>
            </h1>

            {/* Subtitle paragraph matching exact text */}
            <p className="text-xs sm:text-sm lg:text-[15px] text-white/90 font-normal leading-relaxed max-w-lg">
              Tracer Study SMK Sasmita Jaya 2 merupakan sistem informasi untuk
              melacak keberadaan, aktivitas, dan masa studi lulusan guna
              meningkatkan kualitas pendidikan dan relevansi kompetensi dengan
              dunia kerja.
            </p>

            {/* CTA Button matching exact pill style and text */}
            <div className="pt-2">
              <Link
                to={isAuthenticated ? "/tracer-study" : "/login"}
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#fdb813] hover:bg-[#f5ad07] text-[#0a2540] font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <span>Isi Kuesioner Tracer Study</span>
                <div className="w-5 h-5 rounded-full bg-[#0a2540] text-[#fdb813] flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 stroke-[3]" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
