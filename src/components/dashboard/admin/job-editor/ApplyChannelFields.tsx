import React from "react";
import { JobApplyType } from "@/types/tracer";
import { APPLY_TYPE_OPTIONS } from "./jobEditorConstants";

interface ApplyChannelFieldsProps {
  applyType: JobApplyType;
  setApplyType: (t: JobApplyType) => void;
  emailAddress: string;
  setEmailAddress: (v: string) => void;
  emailSubject: string;
  setEmailSubject: (v: string) => void;
  whatsappNumber: string;
  setWhatsappNumber: (v: string) => void;
  whatsappTemplate: string;
  setWhatsappTemplate: (v: string) => void;
  locationAddress: string;
  setLocationAddress: (v: string) => void;
  walkInSchedule: string;
  setWalkInSchedule: (v: string) => void;
  mapsUrl: string;
  setMapsUrl: (v: string) => void;
  externalUrl: string;
  setExternalUrl: (v: string) => void;
  title: string;
  company: string;
}

export const ApplyChannelFields: React.FC<ApplyChannelFieldsProps> = ({
  applyType,
  setApplyType,
  emailAddress,
  setEmailAddress,
  emailSubject,
  setEmailSubject,
  whatsappNumber,
  setWhatsappNumber,
  whatsappTemplate,
  setWhatsappTemplate,
  locationAddress,
  setLocationAddress,
  walkInSchedule,
  setWalkInSchedule,
  mapsUrl,
  setMapsUrl,
  externalUrl,
  setExternalUrl,
  title,
  company,
}) => {
  return (
    <div className="p-4 bg-blue-50/40 rounded-xl border border-blue-100 space-y-4">
      <div>
        <label className="block text-xs font-bold text-[#0d2346]">
          Metode Kanal Pendaftaran Alumni (Direct Referral){" "}
          <span className="text-rose-500">*</span>
        </label>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Tentukan bagaimana alumni yang tervalidasi Tracer Study menghubungi
          atau mendaftar ke mitra ini.
        </p>
      </div>

      {/* Apply Type Radio Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {APPLY_TYPE_OPTIONS.map((opt) => {
          const isSelected = applyType === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setApplyType(opt.value)}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? "bg-white border-[#0d2346] ring-2 ring-[#0d2346]/10 shadow-xs"
                  : "bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold ${
                    isSelected ? "text-[#0d2346]" : "text-slate-800"
                  }`}
                >
                  {opt.label}
                </span>
                <span
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    isSelected
                      ? "border-[#0d2346] bg-[#0d2346]"
                      : "border-slate-300"
                  }`}
                >
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">{opt.desc}</p>
            </button>
          );
        })}
      </div>

      {/* DYNAMIC INPUTS BASED ON APPLY TYPE */}
      {/* TYPE 1: EMAIL */}
      {applyType === "email" && (
        <div className="pt-2 border-t border-blue-100 space-y-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-900">
              Alamat Email Rekrutmen Mitra <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder="recruitment@nama-perusahaan.co.id"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-[#0d2346] focus:ring-2 focus:ring-[#0d2346]/10 focus:outline-none transition bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-900">
                Format Subjek Email Terstandarisasi
              </label>
              <span className="text-[11px] text-slate-400">
                Opsional - default: Lamaran Pekerjaan - [Posisi] - [Nama]
              </span>
            </div>
            <input
              type="text"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              placeholder={`Lamaran Pekerjaan - ${title || "Posisi"} - [Nama Alumni]`}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-[#0d2346] focus:ring-2 focus:ring-[#0d2346]/10 focus:outline-none transition bg-white"
            />
          </div>
        </div>
      )}

      {/* TYPE 2: WHATSAPP */}
      {applyType === "whatsapp" && (
        <div className="pt-2 border-t border-blue-100 space-y-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-900">
              Nomor WhatsApp HRD Resmi (Standar Internasional){" "}
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="6281298765432 (Gunakan awalan 62 tanpa spasi atau strip)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-[#0d2346] focus:ring-2 focus:ring-[#0d2346]/10 focus:outline-none transition bg-white"
            />
            <p className="text-[10px] text-slate-500">
              Sistem otomatis mengarahkan ke link resmi wa.me saat alumni
              mengklik tombol pendaftaran.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-900">
              Template Pesan WhatsApp Rekomendasi
            </label>
            <textarea
              rows={3}
              value={whatsappTemplate}
              onChange={(e) => setWhatsappTemplate(e.target.value)}
              placeholder={`Halo Tim Rekrutmen ${company || "Perusahaan"}, saya alumni SMK Sasmita Jaya 2 bermaksud mengajukan lamaran untuk posisi ${title || "pekerjaan ini"}...`}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-[#0d2346] focus:ring-2 focus:ring-[#0d2346]/10 focus:outline-none transition bg-white"
            />
          </div>
        </div>
      )}

      {/* TYPE 3: WALK-IN INTERVIEW */}
      {applyType === "walk_in" && (
        <div className="pt-2 border-t border-blue-100 space-y-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-900">
              Alamat Lengkap Lokasi Walk-in <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              value={locationAddress}
              onChange={(e) => setLocationAddress(e.target.value)}
              placeholder="Gedung Head Office, Lantai 3, Jl. Raya Industri No. 45, Karawang..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-[#0d2346] focus:ring-2 focus:ring-[#0d2346]/10 focus:outline-none transition bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900">
                Jadwal / Jam Kedatangan
              </label>
              <input
                type="text"
                value={walkInSchedule}
                onChange={(e) => setWalkInSchedule(e.target.value)}
                placeholder="Senin - Kamis, Pukul 08.00 - 11.00 WIB"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-[#0d2346] focus:ring-2 focus:ring-[#0d2346]/10 focus:outline-none transition bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900">
                Tautan Google Maps Lokasi
              </label>
              <input
                type="text"
                value={mapsUrl}
                onChange={(e) => setMapsUrl(e.target.value)}
                placeholder="https://maps.google.com/?q=..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-[#0d2346] focus:ring-2 focus:ring-[#0d2346]/10 focus:outline-none transition bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* TYPE 4: EXTERNAL URL */}
      {applyType === "external_url" && (
        <div className="pt-2 border-t border-blue-100 space-y-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-900">
              Tautan Portal Karir / Google Form Resmi{" "}
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="url"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://career.mitra-industri.id/apply"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-[#0d2346] focus:ring-2 focus:ring-[#0d2346]/10 focus:outline-none transition bg-white"
            />
            <p className="text-[10px] text-slate-500">
              Alumni akan diarahkan langsung ke halaman pendaftaran resmi mitra
              pada tab baru.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

