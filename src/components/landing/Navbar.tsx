import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  LayoutDashboard,
  Home,
  Info,
  GraduationCap,
  Newspaper,
  FileText,
  PhoneCall,
  LogIn,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

interface NavbarProps {
  onOpenLogin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  // Lock scroll when mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs py-1 sm:py-1.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Crisp Official Logo Image */}
          <Link
            to="/"
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center cursor-pointer"
          >
            <img
              src="/logo-smk.png"
              alt="SMK Sasmita Jaya 2"
              className="h-11 sm:h-16 lg:h-[78px] w-auto max-w-[210px] sm:max-w-[340px] object-contain select-none"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo smk sasmita.png';
              }}
            />
          </Link>

          {/* Desktop Navigation Links (Visible on Large Screens 1024px+) */}
          <nav className="hidden lg:flex items-center gap-7 lg:gap-9 text-sm sm:text-[15px] font-medium text-slate-800">
            <Link
              to="/#beranda"
              className="hover:text-blue-600 transition-colors"
            >
              Beranda
            </Link>
            <Link
              to="/#tentang"
              className="hover:text-blue-600 transition-colors"
            >
              Tentang
            </Link>
            <Link
              to={isAuthenticated ? '/tracer-study' : '/login'}
              className="hover:text-blue-600 transition-colors"
            >
              Tracer Study
            </Link>
            <Link
              to="/#berita"
              className="hover:text-blue-600 transition-colors"
            >
              Berita
            </Link>
            <Link
              to="/laporan"
              className="hover:text-blue-600 transition-colors"
            >
              Hasil & Laporan
            </Link>
            <Link
              to="/#kontak"
              className="hover:text-blue-600 transition-colors"
            >
              Kontak Kami
            </Link>
          </nav>

          {/* Action Button: Show Dashboard when authenticated, Login when not authenticated */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated && user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#132238] hover:bg-[#1a3050] text-white text-sm font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4 text-amber-400" />
                <span>Dashboard ({user.nama.split(' ')[0]})</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-[#132238] hover:bg-[#1c3355] text-white text-sm font-semibold tracking-wide shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <img
                  src="/icon-login-btn.svg"
                  alt="Login"
                  className="w-5 h-5 object-contain invert opacity-95"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span>Login</span>
              </button>
            )}
          </div>

          {/* Mobile & Tablet menu toggle button (Visible on < 1024px) */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              aria-label="Buka Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Standard Mobile & Tablet Sidebar Drawer & Dimmed Backdrop (Visible on < 1024px) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden touch-none select-none overscroll-none">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 touch-none select-none"
            onClick={() => setMobileMenuOpen(false)}
            onTouchMove={(e) => e.preventDefault()}
            onWheel={(e) => e.preventDefault()}
            aria-hidden="true"
          />

          {/* Slide-in Sidebar Panel from Right */}
          <aside className="fixed inset-y-0 right-0 z-50 w-[300px] max-w-[85vw] bg-white shadow-2xl flex flex-col justify-between p-5 sm:p-6 border-l border-slate-100 transform transition-transform duration-300 ease-in-out overflow-y-auto overscroll-contain">
            
            {/* Top Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <Link
                  to="/"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (window.location.pathname === '/') {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="flex items-center"
                >
                  <img
                    src="/logo-smk.png"
                    alt="Logo SMK Sasmita Jaya 2"
                    className="h-12 w-auto object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/logo smk sasmita.png';
                    }}
                  />
                </Link>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                  aria-label="Tutup Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="mt-5 space-y-1.5">
                <Link
                  to="/#beranda"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-blue-100  transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Home className="w-4 h-4 text-slate-400" />
                    <span>Beranda</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </Link>

                <Link
                  to="/#tentang"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-blue-100  transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Info className="w-4 h-4 text-slate-400" />
                    <span>Tentang</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </Link>

                <Link
                  to={isAuthenticated ? '/tracer-study' : '/login'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                    <span>Tracer Study</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </Link>

                <Link
                  to="/#berita"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-blue-100  transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Newspaper className="w-4 h-4 text-slate-400" />
                    <span>Berita</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </Link>

                <Link
                  to="/laporan"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>Hasil & Laporan</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </Link>

                <Link
                  to="/#kontak"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-blue-100  transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <PhoneCall className="w-4 h-4 text-slate-400" />
                    <span>Kontak Kami</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </Link>
              </nav>
            </div>

            {/* Bottom Action Area: Show Buka Dashboard when authenticated, Login Alumni when not authenticated */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/dashboard');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#132238] text-white text-sm font-bold shadow-md hover:bg-[#1c3355] transition active:scale-95 cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-400" />
                  <span>Buka Dashboard</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-[#132238] hover:bg-[#1c3355] text-white text-sm font-semibold tracking-wide shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <img
                    src="/icon-login-btn.svg"
                    alt="Login"
                    className="w-5 h-5 object-contain invert opacity-95"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span>Login Alumni</span>
                </button>
              )}

              <p className="text-center text-[11px] text-slate-400">
                © SMK Sasmita Jaya 2 Pamulang
              </p>
            </div>

          </aside>
        </div>
      )}
    </>
  );
};
