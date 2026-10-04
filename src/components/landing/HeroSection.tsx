import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface StatCounterProps {
  end: number;
  decimals?: number;
  suffix?: string;
  trigger: boolean;
}

const StatCounter: React.FC<StatCounterProps> = ({ end, decimals = 1, suffix = '', trigger }) => {
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (!trigger) return;
    let startTime: number | null = null;
    let frameId: number;
    const duration = 1800; // ms

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      // easeOutCubic curve
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = ease * end;

      if (decimals > 0) {
        setDisplayValue(current.toFixed(decimals).replace('.', ','));
      } else {
        setDisplayValue(Math.round(current).toString());
      }

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(end.toFixed(decimals).replace('.', ','));
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [end, decimals, trigger]);

  return (
    <span>
      {displayValue} {suffix}
    </span>
  );
};

export const HeroSection: React.FC = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const el = statsRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  return (
    <section id="beranda" className="relative w-full overflow-hidden">
      
      {/* Main Hero Visual Container: Extended height on mobile to seamlessly wrap the content & stats bar */}
      <div className="relative h-[700px] sm:h-[620px] lg:h-[660px] w-full flex items-center pt-4 pb-20 sm:py-0">
        
        {/* Background Photo Image (Stable anchor) */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-no-repeat bg-[position:calc(100%+40px)_center] sm:bg-[position:right_center] lg:bg-[position:calc(100%+60px)_center]"
          style={{ backgroundImage: `url('/bg-cto.png')` }}
        />

        {/* Mobile & Tablet Backdrop (< 1024px): Smooth uniform royal blue backdrop so text is 100% crisp without any vertical split cut on the students' faces */}
        <div className="block lg:hidden absolute inset-0 bg-gradient-to-b from-[#004889]/95 via-[#0058a6]/90 to-[#004889]/95" />

        {/* Desktop Gradient Overlay (lg+): Crisp on left 30%, completely 100% transparent by 46% so it NEVER touches or hazes the students on the right */}
        <div className="hidden lg:block absolute inset-y-0 left-0 w-[60%] bg-gradient-to-r from-[#004889] via-[#004889]/80 to-transparent pointer-events-none" />

        {/* Left Content Area */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl lg:max-w-2xl text-left space-y-4 sm:space-y-5">
            
            {/* Top Tracer Study Line Badge matching exact screenshot */}
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold tracking-wider text-white/90 uppercase">
              <span className="w-8 h-0.5 bg-white/70 inline-block" />
              <span>TRACER STUDY</span>
            </div>

            {/* Title matching exact typography and color */}
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight leading-[1.15]">
              <span className="text-white block">Masa Depan Lulusan,</span>
              <span className="text-[#fdb813] block mt-1">
                Dimulai dari Data yang Tepat
              </span>
            </h1>

            {/* Subtitle paragraph matching exact text */}
            <p className="text-xs sm:text-sm lg:text-[15px] text-white/90 font-normal leading-relaxed max-w-lg">
              Tracer Study SMK Sasmita Jaya 2 merupakan sistem informasi untuk melacak keberadaan,
              aktivitas, dan masa studi lulusan guna meningkatkan kualitas pendidikan dan relevansi
              kompetensi dengan dunia kerja.
            </p>

            {/* CTA Button matching exact pill style and text */}
            <div className="pt-2">
              <Link
                to={isAuthenticated ? '/tracer-study' : '/login'}
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

      {/* Floating Statistics Bar with subtle geometric ornament & count up animation */}
      <div
        ref={statsRef}
        className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 -mt-20 sm:-mt-16 mb-12 sm:mb-20"
      >
        <div className="relative bg-gradient-to-r from-[#142e5c] via-[#1a3c75] to-[#142e5c] rounded-xl p-5 sm:p-7 shadow-2xl border border-white/15 overflow-hidden">
          
          {/* Seigaiha Japanese Wave Pattern Illustration from example */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.16] pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="seigaiha-pattern" width="60" height="30" patternUnits="userSpaceOnUse">
                <g stroke="#ffffff" strokeWidth="1.2" fill="none">
                  {/* Top center arcs */}
                  <circle cx="30" cy="0" r="30" />
                  <circle cx="30" cy="0" r="24" />
                  <circle cx="30" cy="0" r="18" />
                  <circle cx="30" cy="0" r="12" />
                  <circle cx="30" cy="0" r="6" />

                  {/* Bottom left arcs */}
                  <circle cx="0" cy="30" r="30" />
                  <circle cx="0" cy="30" r="24" />
                  <circle cx="0" cy="30" r="18" />
                  <circle cx="0" cy="30" r="12" />
                  <circle cx="0" cy="30" r="6" />

                  {/* Bottom right arcs */}
                  <circle cx="60" cy="30" r="30" />
                  <circle cx="60" cy="30" r="24" />
                  <circle cx="60" cy="30" r="18" />
                  <circle cx="60" cy="30" r="12" />
                  <circle cx="60" cy="30" r="6" />
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#seigaiha-pattern)" />
          </svg>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/20">
            
            {/* Stat 1: Alumni Terdaftar with Count-Up Animation */}
            <div className="py-3.5 md:py-1 px-4">
              <div className="w-full max-w-[210px] md:max-w-none mx-auto flex items-center justify-start md:justify-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center shrink-0">
                  <img
                    src="/Group.svg"
                    alt="Alumni Terdaftar"
                    className="w-10 h-10 object-contain invert brightness-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/Student.svg';
                    }}
                  />
                </div>
                <div className="text-left">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none">
                    <StatCounter end={3.5} decimals={1} suffix="Ribu" trigger={statsVisible} />
                  </div>
                  <div className="text-xs text-slate-300 font-medium mt-1">
                    Alumni Terdaftar
                  </div>
                </div>
              </div>
            </div>

            {/* Stat 2: Bekerja with Count-Up Animation */}
            <div className="py-3.5 md:py-1 px-4">
              <div className="w-full max-w-[210px] md:max-w-none mx-auto flex items-center justify-start md:justify-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center shrink-0">
                  <img
                    src="/Portfolio.svg"
                    alt="Bekerja"
                    className="w-10 h-10 object-contain invert brightness-200"
                  />
                </div>
                <div className="text-left">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none">
                    <StatCounter end={87.5} decimals={1} suffix="%" trigger={statsVisible} />
                  </div>
                  <div className="text-xs text-slate-300 font-medium mt-1">
                    Bekerja
                  </div>
                </div>
              </div>
            </div>

            {/* Stat 3: Melanjutkan Studi with Count-Up Animation */}
            <div className="py-3.5 md:py-1 px-4">
              <div className="w-full max-w-[210px] md:max-w-none mx-auto flex items-center justify-start md:justify-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center shrink-0">
                  <img
                    src="/Graduation.svg"
                    alt="Melanjutkan Studi"
                    className="w-12 h-12 max-w-none object-contain invert brightness-200 scale-110"
                  />
                </div>
                <div className="text-left">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none">
                    <StatCounter end={12.5} decimals={1} suffix="%" trigger={statsVisible} />
                  </div>
                  <div className="text-xs text-slate-300 font-medium mt-1">
                    Melanjutkan Studi
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
};
