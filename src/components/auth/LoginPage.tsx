import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useAdminStore } from "@/store/adminStore";
import { getHelpdeskWaUrl } from "@/lib/whatsapp";
import {
  ArrowRight,
  ChevronLeft,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { DEMO_USERS, findDemoUser } from "@/data/demoUsers";
import { DemoUserSelect } from "./DemoUserSelect";
import {
  fetchActiveDemoLocks,
  isUserLockedByOther,
  subscribeDemoLockChanges,
  DemoLocksMap,
} from "@/services/demoSessionService";

export const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [demoLocks, setDemoLocks] = useState<DemoLocksMap>({});
  const [selectedDemoUser, setSelectedDemoUser] = useState("");

  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (location.state?.expiredMessage) {
      setError(location.state.expiredMessage);
    }
  }, [location.state]);

  useEffect(() => {
    // 1. Initial fetch demo locks
    fetchActiveDemoLocks().then(setDemoLocks);

    // 2. BroadcastChannel listener (instant cross-tab sync)
    const unsubscribe = subscribeDemoLockChanges((locks) => {
      setDemoLocks(locks);
    });

    // 3. Immediate sync on tab focus or mobile screen resume
    const handleVisibilityOrFocus = () => {
      if (
        typeof document !== "undefined" &&
        document.visibilityState === "visible"
      ) {
        fetchActiveDemoLocks().then(setDemoLocks);
      }
    };
    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);

    // 4. Polling interval (cross-device demo audience sync)
    const interval = setInterval(() => {
      fetchActiveDemoLocks().then(setDemoLocks);
    }, 4000);

    return () => {
      unsubscribe();
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      clearInterval(interval);
    };
  }, []);

  const handleSelectDemoUser = (username: string) => {
    setSelectedDemoUser(username);
    if (!username) {
      setIdentifier("");
      setPassword("");
      return;
    }

    const found = DEMO_USERS.find((u) => u.username === username);
    if (found) {
      if (isUserLockedByOther(found.username, demoLocks)) {
        setError(`Akun ${found.username} sedang digunakan oleh audiens lain.`);
        setSelectedDemoUser("");
        setIdentifier("");
        setPassword("");
        return;
      }
      setIdentifier(found.username);
      setPassword(found.password);
      setError("");
    }
  };

  const handleClearDemo = () => {
    setSelectedDemoUser("");
    setIdentifier("");
    setPassword("");
    setError("");
  };

  const availableDemoUsersCount = DEMO_USERS.filter(
    (u) => !isUserLockedByOther(u.username, demoLocks),
  ).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim()) {
      setError("Harap masukkan NISN atau Username Anda.");
      return;
    }

    if (!password.trim()) {
      setError("Harap masukkan password Anda.");
      return;
    }

    // Validasi pencegahan jika akun demo sedang aktif di perangkat lain
    const cleanId = identifier.trim().toLowerCase();
    const demoFound = findDemoUser(cleanId);
    if (demoFound && isUserLockedByOther(demoFound.username, demoLocks)) {
      setError(
        `Akun ${demoFound.username} (${demoFound.nama}) sedang aktif digunakan di perangkat lain. Silakan pilih akun demo lain.`,
      );
      return;
    }

    setLoading(true);
    try {
      if (demoFound) {
        const freshLocks = await fetchActiveDemoLocks();
        setDemoLocks(freshLocks);
        if (isUserLockedByOther(demoFound.username, freshLocks)) {
          setError(
            `Akun ${demoFound.username} (${demoFound.nama}) sedang aktif digunakan di perangkat lain. Silakan pilih akun demo lain.`,
          );
          setLoading(false);
          return;
        }
      }

      const ok = await login(identifier, password, "alumni");
      if (!ok) {
        setError("Username atau password salah.");
        return;
      }
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(
        err?.message ||
          "Data tidak ditemukan. Silakan periksa kembali data Anda.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    const firstFree = DEMO_USERS.find(
      (u) => !isUserLockedByOther(u.username, demoLocks),
    );
    if (firstFree) {
      handleSelectDemoUser(firstFree.username);
    } else {
      setIdentifier("3079145847");
      setPassword("alumni#847");
    }
  };

  const handleAdminDemo = () => {
    setIdentifier("admin@smksasmitajaya2.sch.id");
    setPassword("Admin#12345");
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

            {/* Step Label & Title (Hidden on Desktop because the left panel already has greeting) */}
            <div className="mb-5 sm:mb-6 lg:hidden">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight text-center">
                Selamat Datang
              </h2>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-700">
                {error}
              </div>
            )}

            {/* Custom Dropdown Demo Audiens (user01 - user30) */}
            <div className="mb-6 p-3.5 bg-gradient-to-br from-blue-50/80 via-slate-50 to-indigo-50/50 border border-blue-200/90 rounded-xl shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <label
                    htmlFor="demo-user-custom-trigger"
                    className="text-xs font-bold text-slate-800 tracking-tight"
                  >
                    Akun Demo
                  </label>
                </div>
                <span className="text-[10px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                  {availableDemoUsersCount} / {DEMO_USERS.length} Tersedia
                </span>
              </div>

              <DemoUserSelect
                selectedUser={selectedDemoUser}
                onSelectUser={handleSelectDemoUser}
                demoLocks={demoLocks}
                disabled={loading}
              />

              {selectedDemoUser ? (
                <div className="mt-2.5 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200/80 rounded-lg px-2.5 py-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>
                      Password otomatis terisi untuk{" "}
                      <strong>{selectedDemoUser}</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearDemo}
                    className="text-[10px] text-slate-500 hover:text-rose-600 font-medium underline ml-2 cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              ) : (
                <p className="mt-2 text-[10.5px] text-slate-500 leading-normal">
                  Pilih username dari dropdown, password terisi otomatis. Akun
                  yang sedang aktif terkunci hingga user logout.
                </p>
              )}
            </div>

            {/* Form Inputs */}
            <form onSubmit={handleSubmit} className="mt-2 space-y-7">
              <div className="material-group">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => {
                    const val = e.target.value;
                    setIdentifier(val);
                    const match = DEMO_USERS.find(
                      (u) =>
                        u.username.toLowerCase() === val.trim().toLowerCase(),
                    );
                    if (match) {
                      setSelectedDemoUser(match.username);
                    } else {
                      setSelectedDemoUser("");
                    }
                  }}
                  placeholder=""
                  className="material-input"
                  required
                />
                <span className="material-bar" />
                <span className="material-highlight" />
                <label className="material-label">Username</label>
              </div>

              <div className="material-group !mt-7">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=""
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
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
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
              {/* <button
                type="button"
                onClick={handleQuickDemo}
                className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 font-medium text-[11px]"
              >
                Alumni (DEMO)
              </button>
              <button
                type="button"
                onClick={handleAdminDemo}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium text-[11px]"
              >
                Admin BKK
              </button> */}
            </div>

            {/* WA Helpdesk Link */}
            <p className="text-xs text-slate-500">
              Butuh bantuan?{" "}
              <a
                href={getHelpdeskWaUrl(
                  useAdminStore.getState().settings.kontakBkk,
                  "Halo BKK SMK Sasmita Jaya 2, saya butuh bantuan login Tracer Study",
                )}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-slate-700 hover:text-blue-600 underline"
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
