import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Printer } from "lucide-react";
import { PrivacyPolicyModal, TermsOfServiceModal } from "./LegalModals";

export const Footer: React.FC = () => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  return (
    <footer
      id="kontak"
      className="bg-[#0b192e] text-slate-300 pt-14 pb-8 border-t border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top/Middle row */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 pb-10 border-b border-slate-800">
          {/* Logo prominently sized */}
          <Link
            to="/"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="flex items-center text-left cursor-pointer shrink-0 mx-auto md:mx-0"
          >
            <img
              src="/logo-smk-dark.png"
              alt="Logo SMK Sasmita Jaya 2"
              className="h-16 sm:h-20 w-auto object-contain brightness-110"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/logo-smk-dark.png";
              }}
            />
          </Link>

          {/* School Address & Contacts (4 clean rows) */}
          <div className="flex flex-col items-center md:items-start text-xs text-slate-400 max-w-xs md:max-w-sm lg:max-w-md space-y-2 leading-relaxed mx-auto md:mx-0">
            {/* 1. Alamat */}
            <div className="flex items-start gap-2.5 text-left w-full max-w-xs sm:max-w-sm md:max-w-md">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span className="text-left">
                Jl. Surya Kencana No. 1, Pamulang Barat, Kec. Pamulang, Kota
                Tangerang Selatan, Banten 15417
              </span>
            </div>

            {/* 2. Email */}
            <a
              href="mailto:sasmitajaya2pml@gmail.com"
              className="inline-flex items-center gap-2.5 hover:text-white transition-colors text-slate-300 w-full max-w-xs sm:max-w-sm md:max-w-md"
            >
              <Mail className="w-4 h-4 shrink-0 text-slate-400" />
              <span>sasmitajaya2pml@gmail.com</span>
            </a>

            {/* 3. Telepon */}
            <a
              href="tel:0217427375"
              className="inline-flex items-center gap-2.5 hover:text-white transition-colors text-slate-300 w-full max-w-xs sm:max-w-sm md:max-w-md"
            >
              <Phone className="w-4 h-4 shrink-0 text-slate-400" />
              <span>(021) 7427375</span>
            </a>

            {/* 4. Fax */}
            <div className="inline-flex items-center gap-2.5 text-slate-300 w-full max-w-xs sm:max-w-sm md:max-w-md">
              <Printer className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Fax: (021) 7412491</span>
            </div>
          </div>

          {/* Social Icons & Copyright */}
          <div className="flex flex-col items-center md:items-end gap-3 text-center md:text-right shrink-0 mx-auto md:mx-0">
            <div className="flex items-center gap-3">
              {/* Tiktok */}
              <a
                href="https://www.tiktok.com/@smksasmitajaya2.official"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10  text-white flex items-center justify-center transition-colors"
                aria-label="Tiktok"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/smksasmitajaya2.official"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10  text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@smksasmitajaya239"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
            <p className="text-[11px] text-slate-500">
              © {new Date().getFullYear()} SMK Sasmita Jaya 2. All rights
              reserved.
            </p>
            <p className="text-[11px] text-slate-500 flex items-center justify-center md:justify-end gap-1.5 whitespace-nowrap">
              <button
                type="button"
                onClick={() => setIsPrivacyOpen(true)}
                className="hover:text-slate-300 transition-colors focus:outline-none focus:underline cursor-pointer"
              >
                Kebijakan Privasi
              </button>
              <span className="text-slate-600">|</span>
              <button
                type="button"
                onClick={() => setIsTermsOpen(true)}
                className="hover:text-slate-300 transition-colors focus:outline-none focus:underline cursor-pointer"
              >
                Syarat & Ketentuan
              </button>
            </p>
          </div>
        </div>

        {/* Bottom micro note */}
        <div className="pt-6 text-center text-[11px] text-slate-500">
          Sistem Informasi Alumni & Tracer Study Vokasi
        </div>
      </div>

      {/* Popups / Modals */}
      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
      <TermsOfServiceModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />
    </footer>
  );
};
