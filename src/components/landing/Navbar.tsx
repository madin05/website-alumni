import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  ChevronDown,
  ExternalLink,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";

interface NavbarProps {
  onOpenLogin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileTracerOpen, setMobileTracerOpen] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isLandingPage = location.pathname === "/";
  const isHeroTheme = isLandingPage && !isScrolled;

  // Track scroll position for desktop navbar color transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside & escape key to close desktop dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Lock scroll when mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={`z-40 py-1 sm:py-1.5 ${
          isHeroTheme
            ? "bg-white sticky top-0 left-0 right-0 shadow-xs lg:bg-transparent lg:fixed lg:bg-gradient-to-b lg:from-[#001733]/80 lg:via-[#00284d]/40 lg:to-transparent lg:border-transparent lg:shadow-none"
            : isLandingPage
              ? "sticky top-0 lg:fixed left-0 right-0 bg-white shadow-xs"
              : "sticky top-0 left-0 right-0 bg-white shadow-xs"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Crisp Official Logo Image */}
          <Link
            to="/"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="flex items-center cursor-pointer"
          >
            {/* Standard dark text logo for mobile always, and desktop when scrolled */}
            <img
              src="/logo-smk.png"
              alt="SMK Sasmita Jaya 2"
              className={`h-11 sm:h-16 lg:h-[78px] w-auto max-w-[210px] sm:max-w-[340px] object-contain select-none transition-opacity duration-300 ${
                isHeroTheme ? "lg:hidden" : "block"
              }`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/logo smk sasmita.png";
              }}
            />
            {/* Crisp white text logo for desktop when hero theme is active */}
            <img
              src="/logo-smk-dark.png"
              alt="SMK Sasmita Jaya 2"
              className={`h-11 sm:h-16 lg:h-[78px] w-auto max-w-[210px] sm:max-w-[340px] object-contain select-none transition-opacity duration-300 ${
                isHeroTheme ? "hidden lg:block" : "hidden"
              }`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/logo-smk.png";
              }}
            />
          </Link>

          {/* Desktop Navigation Links (Visible on Large Screens 1024px+) */}
          <nav
            className={`hidden lg:flex items-center gap-7 lg:gap-9 text-sm sm:text-[15px] font-medium  ${
              isHeroTheme
                ? "text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]"
                : "text-slate-800"
            }`}
          >
            <Link
              to="/#beranda"
              className={
                isHeroTheme
                  ? "hover:text-[#fdb813] transition-colors"
                  : "hover:text-blue-600 transition-colors"
              }
            >
              Beranda
            </Link>
            <Link
              to="/#tentang"
              className={
                isHeroTheme
                  ? "hover:text-[#fdb813] transition-colors"
                  : "hover:text-blue-600 transition-colors"
              }
            >
              Tentang
            </Link>
            {/* Tracer Study Dropdown with Cek Ijazah */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 transition-colors cursor-pointer py-1.5 font-medium ${
                  isHeroTheme ? "hover:text-[#fdb813]" : "hover:text-blue-600"
                }`}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <span>Tracer Study</span>
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-90" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu Card with continuous hit area (zero hover gap) */}
              {dropdownOpen && (
                <div className="absolute top-full left-0 pt-2.5 w-52 z-50">
                  <div className="bg-white rounded-md shadow-lg border border-gray-200 py-1 text-slate-800 [filter:none]">
                    <a
                      href="https://ijazah.pendidikan.go.id/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                    >
                      Cek Ijazah
                    </a>
                  </div>
                </div>
              )}
            </div>
            <Link
              to="/#berita"
              className={
                isHeroTheme
                  ? "hover:text-[#fdb813] transition-colors"
                  : "hover:text-blue-600 transition-colors"
              }
            >
              Berita
            </Link>
            <Link
              to="/laporan"
              className={
                isHeroTheme
                  ? "hover:text-[#fdb813] transition-colors"
                  : "hover:text-blue-600 transition-colors"
              }
            >
              Hasil & Laporan
            </Link>
            <Link
              to="/#kontak"
              className={
                isHeroTheme
                  ? "hover:text-[#fdb813] transition-colors"
                  : "hover:text-blue-600 transition-colors"
              }
            >
              Kontak Kami
            </Link>
          </nav>

          {/* Action Button: Show Dashboard when authenticated, Login when not authenticated */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-[#132238] hover:bg-[#1c3355] text-white text-sm font-semibold tracking-wide shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <img
                src="/icon-login-btn.svg"
                alt="Login"
                className="w-5 h-5 object-contain invert opacity-95"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <span>Login</span>
            </button>
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
      <div
        className={`fixed inset-0 z-50 lg:hidden touch-none select-none overscroll-none transition-all duration-300 ${
          mobileMenuOpen
            ? "pointer-events-auto visible"
            : "pointer-events-none invisible delay-300"
        }`}
      >
        {/* Backdrop Overlay */}
        <div
          className={`fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 touch-none select-none ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileMenuOpen(false)}
          onTouchMove={(e) => e.preventDefault()}
          onWheel={(e) => e.preventDefault()}
          aria-hidden="true"
        />

        {/* Slide-in Sidebar Panel from Left */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-[300px] max-w-[85vw] bg-white shadow-2xl flex flex-col justify-between p-5 sm:p-6 border-r border-slate-100 transform transition-transform duration-300 ease-in-out overflow-y-auto overscroll-contain ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Top Header */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <Link
                to="/"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (window.location.pathname === "/") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className="flex items-center"
              >
                <img
                  src="/logo-smk.png"
                  alt="Logo SMK Sasmita Jaya 2"
                  className="h-12 w-auto object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/logo smk sasmita.png";
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

              {/* Tracer Study Accordion with Cek Ijazah */}
              <div className="rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setMobileTracerOpen(!mobileTracerOpen)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                    <span>Tracer Study</span>
                  </div>
                  <ChevronRight
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      mobileTracerOpen ? "rotate-90 text-blue-600" : ""
                    }`}
                  />
                </button>

                {mobileTracerOpen && (
                  <div className="pl-9 pr-2 py-1 space-y-0.5 mt-0.5">
                    <a
                      href="https://ijazah.pendidikan.go.id/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-md text-sm font-normal text-slate-700 hover:text-blue-600 hover:bg-white transition-colors"
                    >
                      Cek Ijazah
                    </a>
                  </div>
                )}
              </div>

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
                  navigate("/dashboard");
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
                  navigate("/login");
                }}
                className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-[#132238] hover:bg-[#1c3355] text-white text-sm font-semibold tracking-wide shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <img
                  src="/icon-login-btn.svg"
                  alt="Login"
                  className="w-5 h-5 object-contain invert opacity-95"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
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
    </>
  );
};
