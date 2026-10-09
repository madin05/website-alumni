import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { ArrowRight, ChevronLeft, Eye, EyeOff } from "lucide-react";

export const LoginPage: React.FC = () => {
  const [loginMethod, setLoginMethod] = useState<"nisn" | "nik">("nisn");
  const [identifier, setIdentifier] = useState("0061234567");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLoginMethodChange = (method: "nisn" | "nik") => {
    setLoginMethod(method);
    setIdentifier(method === "nisn" ? "0061234567" : "3274012304050001");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim()) {
      setError("Harap masukkan NISN atau NIK Anda.");
      return;
    }

    if (!password.trim()) {
      setError("Harap masukkan password Anda.");
      return;
    }

    setLoading(true);
    try {
      await login(identifier, "alumni");
      navigate("/dashboard", { replace: true });
    } catch {
      setError("Data tidak ditemukan. Silakan periksa kembali NISN/NIK Anda.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setLoginMethod("nisn");
    setIdentifier("0051234567");
    setPassword("123456");
  };

  const handleAdminDemo = () => {
    setLoginMethod("nisn");
    setIdentifier("admin@smksasmitajaya2.sch.id");
    setPassword("admin123");
  };

  return (
    <div className="min-h-screen bg-[#edf2f7] flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden">
      {/* Static Background Ornaments */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl" />
        <img
          src="/background-decoration.svg"
          alt="Decoration"
          className="w-full h-full object-cover opacity-[0.06] -scale-x-100"
        />
      </div>

      {/* Main Login Card: Single column on mobile/tablet, 12-col split on desktop */}
      <div className="relative z-10 w-full max-w-md sm:max-w-lg lg:max-w-5xl bg-white rounded-2xl lg:rounded-xl shadow-xl sm:shadow-2xl overflow-hidden border border-slate-200/90 grid grid-cols-1 lg:grid-cols-12">
        {/* LEFT COLUMN: Dark Navy Branding & Guarantee Panel (Visible only on Desktop lg+) */}
        <div className="hidden lg:flex lg:col-span-5 bg-[#122e5d] text-white p-8 sm:p-10 lg:p-11 flex-col justify-between relative overflow-hidden">
          {/* Seigaiha Wave Pattern Overlay */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.14] pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="login-seigaiha"
                width="60"
                height="30"
                patternUnits="userSpaceOnUse"
              >
                <g stroke="#ffffff" strokeWidth="1.2" fill="none">
                  <circle cx="30" cy="0" r="30" />
                  <circle cx="30" cy="0" r="24" />
                  <circle cx="30" cy="0" r="18" />
                  <circle cx="30" cy="0" r="12" />
                  <circle cx="30" cy="0" r="6" />
                  <circle cx="0" cy="30" r="30" />
                  <circle cx="0" cy="30" r="24" />
                  <circle cx="0" cy="30" r="18" />
                  <circle cx="0" cy="30" r="12" />
                  <circle cx="0" cy="30" r="6" />
                  <circle cx="60" cy="30" r="30" />
                  <circle cx="60" cy="30" r="24" />
                  <circle cx="60" cy="30" r="18" />
                  <circle cx="60" cy="30" r="12" />
                  <circle cx="60" cy="30" r="6" />
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#login-seigaiha)" />
          </svg>

          {/* Top Brand Logo */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 group">
              <img
                src="/favicon.png"
                alt="Logo SMK Sasmita Jaya 2"
                className="w-10 h-10 object-contain drop-shadow-md"
              />
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-white leading-none tracking-tight">
                  SMK SASMITA JAYA 2
                </h3>
                <p className="text-[9px] text-slate-300 font-medium tracking-wider mt-1">
                  Tracer Study & Alumni
                </p>
              </div>
            </div>
          </div>

          {/* Middle Content */}
          <div className="relative z-10 my-8 sm:my-10 space-y-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight">
              Selamat datang kembali, pejuang pendidikan kejuruan.
            </h1>

            {/* Privacy callout box */}
            <div className="p-2 rounded-md bg-white/10 backdrop-blur-md border border-white/15 text-left space-y-1 mt-6">
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Seluruh jawaban tidak dipublikasikan & dilindungi sesuai UU
                Perlindungan Data.
              </p>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="relative z-10 text-[10px] text-slate-400">
            © SMK Sasmita Jaya 2
          </div>
        </div>

        {/* RIGHT COLUMN / MOBILE CARD: Interactive Login Form (Full width on mobile/tablet, 7 cols on desktop) */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-12 flex flex-col justify-between bg-white">
          <div>
            {/* Top Back Link */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Kembali</span>
              </Link>
            </div>

            {/* Mobile & Tablet Logo Banner (Hidden on Desktop) */}
            <div className="flex justify-center items-center mb-5 lg:hidden">
              <img
                src="/favicon.png"
                alt="Logo SMK Sasmita Jaya 2"
                className="w-20 h-20 object-contain drop-shadow-xs"
              />
            </div>

            {/* Step Label & Title */}
            <div className="mb-5 sm:mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#182a4a] tracking-tight text-center">
                Selamat Datang
              </h2>
            </div>

            {/* Login Method Switcher with Smooth Slider */}
            <div className="relative grid grid-cols-2 p-1 bg-slate-100/90 rounded-full border border-slate-200/90 mb-5 select-none">
              {/* Sliding Pill Indicator */}
              <div
                className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-[#182a4a] rounded-full shadow-sm transition-transform duration-300 ease-out pointer-events-none ${
                  loginMethod === "nik" ? "translate-x-full" : "translate-x-0"
                }`}
              />

              <button
                type="button"
                onClick={() => handleLoginMethodChange("nisn")}
                className={`relative z-10 py-2 px-3 rounded-full text-xs text-center cursor-pointer transition-colors duration-200 ${
                  loginMethod === "nisn"
                    ? "text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Login NISN
              </button>

              <button
                type="button"
                onClick={() => handleLoginMethodChange("nik")}
                className={`relative z-10 py-2 px-3 rounded-full text-xs text-center cursor-pointer transition-colors duration-200 ${
                  loginMethod === "nik"
                    ? "text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Login NIK
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                {error}
              </div>
            )}

            {/* Form Inputs */}
            <form onSubmit={handleSubmit} className="mt-7 space-y-7">
              <div className="material-group">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    loginMethod === "nisn"
                      ? "0061234567"
                      : "3274012304050001"
                  }
                  className="material-input"
                  required
                />
                <span className="material-bar" />
                <span className="material-highlight" />
                <label className="material-label">
                  {loginMethod === "nisn"
                    ? "NISN (10 digit)"
                    : "NIK KTP (16 digit)"}
                </label>
              </div>

              <div className="material-group !mt-7">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="material-input pr-8"
                  required
                />
                <span className="material-bar" />
                <span className="material-highlight" />
                <label className="material-label">Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer p-0.5"
                  tabIndex={-1}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-[#182945] hover:bg-[#122038] text-white font-medium text-sm tracking-wide shadow-md cursor-pointer disabled:opacity-75 flex items-center justify-center gap-2 transition-all active:scale-[0.99] !mt-8"
              >
                {loading ? (
                  <span>Memproses...</span>
                ) : (
                  <>
                    <span>Masuk & Mulai Survey</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Demo Fill & Helpdesk */}
          <div className="mt-6 pt-4 border-t border-slate-100 space-y-3 text-center">
            {/* 1-Click Demo Shortcut */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              <button
                type="button"
                onClick={handleQuickDemo}
                className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 font-semibold text-[11px]"
              >
                Alumni (DEMO)
              </button>
              <button
                type="button"
                onClick={handleAdminDemo}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[11px]"
              >
                Admin BKK
              </button>
            </div>

            {/* WA Helpdesk Link */}
            <p className="text-xs text-slate-500">
              Butuh bantuan?{" "}
              <a
                href="https://wa.me/6281298765432?text=Halo%20BKK%20SMK%20Sasmita%20Jaya%202,%20saya%20butuh%20bantuan%20login%20Tracer%20Study"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#182a4a] hover:text-blue-600 underline"
              >
                Hubungi Helpdesk
              </a>
            </p>

            {/* Mobile Footer Copyright */}
            <p className="text-[10px] text-slate-400 pt-1 lg:hidden">
              © SMK Sasmita Jaya 2
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
