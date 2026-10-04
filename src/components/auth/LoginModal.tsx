import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  X,
  ShieldCheck,
  ArrowRight,
  Info,
  Sparkles,
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [loginMethod, setLoginMethod] = useState<'nisn' | 'nik'>('nisn');
  const [identifier, setIdentifier] = useState('0061234567');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuthStore();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLoginMethodChange = (method: 'nisn' | 'nik') => {
    setLoginMethod(method);
    setIdentifier(method === 'nisn' ? '0061234567' : '3274012304050001');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError('Harap masukkan identitas akun Anda.');
      return;
    }

    setLoading(true);
    try {
      await login(identifier, 'alumni');
      onClose();
      navigate('/dashboard', { replace: true });
    } catch {
      setError('Data tidak cocok. Silakan coba lagi atau gunakan tombol demo di bawah.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setLoginMethod('nisn');
    setIdentifier('0051234567');
  };

  const handleUnfilledDemo = () => {
    setLoginMethod('nisn');
    setIdentifier('0057890123');
  };

  const handleAdminDemo = () => {
    setLoginMethod('nisn');
    setIdentifier('admin@smksasmitajaya2.sch.id');
  };

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-6 lg:p-8">
        {/* Main Split Login Card without animations */}
        <div
          className="relative z-10 w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200/90 grid grid-cols-1 md:grid-cols-12 animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          {/* LEFT COLUMN: Dark Navy Branding Panel (5 cols) */}
          <div className="md:col-span-5 bg-[#122e5d] text-white p-7 sm:p-9 flex flex-col justify-between relative overflow-hidden">
            
            {/* Seigaiha Pattern Overlay */}
            <svg
              className="absolute inset-0 w-full h-full opacity-[0.14] pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="modal-seigaiha" width="60" height="30" patternUnits="userSpaceOnUse">
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
              <rect width="100%" height="100%" fill="url(#modal-seigaiha)" />
            </svg>

            {/* Top Brand Logo */}
            <div className="relative z-10">
              <div className="flex items-center gap-2.5">
                <img
                  src="/favicon.png"
                  alt="Logo SMK Sasmita Jaya 2"
                  className="w-10 h-10 object-contain drop-shadow-md"
                />
                <div>
                  <h3 className="text-xs font-extrabold text-white leading-none tracking-tight">
                    SMK SASMITA JAYA 2
                  </h3>
                  <p className="text-[9px] text-slate-300 tracking-wider uppercase mt-0.5">
                    Tracer Study & Alumni
                  </p>
                </div>
              </div>
            </div>

            {/* Middle Content */}
            <div className="relative z-10 my-6 space-y-3">
              <span className="inline-block text-[10px] font-extrabold tracking-widest text-[#ffc72c] uppercase">
                MULAI SURVEY
              </span>

              <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight tracking-tight">
                Selamat datang kembali, pejuang pendidikan kejuruan.
              </h2>

              <p className="text-xs text-slate-200 leading-relaxed font-normal">
                Masuk untuk memulai atau melanjutkan pengisian tracer study alumni tahun 2026.
              </p>

              {/* Privacy callout box */}
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-left space-y-0.5 mt-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#ffc72c]" />
                  <span>Data Anda aman</span>
                </div>
                <p className="text-[10px] text-slate-300 leading-relaxed pl-5">
                  Seluruh jawaban tidak dipublikasikan & dilindungi UU Perlindungan Data.
                </p>
              </div>
            </div>

            {/* Bottom Copyright */}
            <div className="relative z-10 text-[9px] text-slate-400">
              © Direktorat SMK • SMK Sasmita Jaya 2
            </div>

          </div>

          {/* RIGHT COLUMN: Interactive Login Form (7 cols) */}
          <div className="md:col-span-7 p-7 sm:p-9 flex flex-col justify-between bg-white">
            
            <div>
              {/* Step Label & Title */}
              <div className="mb-5 pr-8">
                <span className="text-[10px] font-extrabold text-slate-900 tracking-wider block uppercase mb-1">
                  Langkah 1 dari 2
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#182a4a] tracking-tight">
                  Masuk Alumni
                </h3>
                <p className="text-xs text-slate-500 font-normal mt-0.5">
                  Pilih metode login menggunakan NISN atau NIK Anda.
                </p>
              </div>

              {/* Sub Login Method Switcher */}
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                <button
                  type="button"
                  onClick={() => handleLoginMethodChange('nisn')}
                  className={`py-1.5 px-2.5 rounded-xl text-xs font-bold text-center cursor-pointer ${
                    loginMethod === 'nisn'
                      ? 'border-2 border-[#182a4a] text-[#182a4a] bg-blue-50/40'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Login pakai NISN
                </button>

                <button
                  type="button"
                  onClick={() => handleLoginMethodChange('nik')}
                  className={`py-1.5 px-2.5 rounded-xl text-xs font-bold text-center cursor-pointer ${
                    loginMethod === 'nik'
                      ? 'border-2 border-[#182a4a] text-[#182a4a] bg-blue-50/40'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Login pakai NIK
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                  {error}
                </div>
              )}

              {/* Form Inputs */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {loginMethod === 'nisn' ? 'NISN (10 digit)' : 'NIK KTP (16 digit)'}
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={loginMethod === 'nisn' ? 'Contoh: 0061234567' : 'Contoh: 3274012304050001'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#182a4a] focus:border-transparent"
                    required
                  />
                </div>

                {/* Informational Alert Box */}
                <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-blue-900 flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>
                    Hanya untuk lulusan SMK Sasmita Jaya 2 tahun 2020 - 2026.
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-5 rounded-xl bg-[#182945] hover:bg-[#122038] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md cursor-pointer disabled:opacity-75 flex items-center justify-center gap-2"
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
            <div className="mt-5 pt-3 border-t border-slate-100 space-y-2 text-center">
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="text-slate-400 text-[10px] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  1-Click Demo:
                </span>
                <button
                  type="button"
                  onClick={handleQuickDemo}
                  className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-[10px]"
                  title="Alumni yang sudah mengisi tracer"
                >
                  Alumni (Sudah Isi)
                </button>
                <button
                  type="button"
                  onClick={handleUnfilledDemo}
                  className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 hover:bg-amber-100 font-semibold text-[10px]"
                  title="Alumni yang belum mengisi tracer"
                >
                  Alumni (Belum Isi)
                </button>
                <button
                  type="button"
                  onClick={handleAdminDemo}
                  className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[10px]"
                  title="Akun Admin Pengelola BKK"
                >
                  Admin BKK
                </button>
              </div>

              <p className="text-[11px] text-slate-500">
                Butuh bantuan?{' '}
                <a
                  href="https://wa.me/6281298765432?text=Halo%20BKK%20SMK%20Sasmita%20Jaya%202,%20saya%20butuh%20bantuan%20login%20Tracer%20Study"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-[#182a4a] hover:text-blue-600 underline"
                >
                  Hubungi WA Helpdesk BKK
                </a>
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>,
    document.body
  );
};
