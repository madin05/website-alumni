import React from "react";
import { JobVacancy, JobApplyType } from "@/types/tracer";
import {
  Building2,
  MapPin,
  Clock,
  Calendar,
  ShieldCheck,
} from "lucide-react";

interface JobEditorPreviewProps {
  title: string;
  company: string;
  location: string;
  type: JobVacancy["type"];
  salary: string;
  targetMajors: string[];
  deadline: string;
  isBkkPartner: boolean;
  description: string;
  requirementsText: string;
  applyType: JobApplyType;
  whatsappNumber: string;
  emailAddress: string;
  contactPerson: string;
}

export const JobEditorPreview: React.FC<JobEditorPreviewProps> = ({
  title,
  company,
  location,
  type,
  salary,
  targetMajors,
  deadline,
  isBkkPartner,
  description,
  requirementsText,
  applyType,
  whatsappNumber,
  emailAddress,
  contactPerson,
}) => {
  return (
    <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4 sticky top-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#0d2346]">
          <span>Pratinjau Dashboard Alumni</span>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
          Live Preview
        </span>
      </div>

      {/* Card Preview */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                {type}
              </span>
              {/* Channel Badge */}
              {applyType === "walk_in" && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Walk-in
                </span>
              )}
              {applyType === "whatsapp" && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                  WhatsApp
                </span>
              )}
              {applyType === "email" && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                  Email
                </span>
              )}
              {applyType === "external_url" && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Portal Web
                </span>
              )}
              {isBkkPartner && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold text-slate-700 bg-slate-50 border border-slate-200">
                  <ShieldCheck className="w-3 h-3 text-blue-600" />
                  Mitra BKK
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-[#0d2346] leading-tight">
              {title || "Judul Posisi Pekerjaan"}
            </h4>
            <p className="text-xs font-semibold text-slate-600 mt-0.5 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-slate-400" />
              <span>{company || "Nama Perusahaan / DUDI"}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <div className="flex items-center gap-1 truncate">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{location || "Lokasi"}</span>
          </div>
          <div className="flex items-center gap-1 truncate font-semibold text-slate-800">
            <span className="truncate">{salary || "Gaji"}</span>
          </div>
          <div className="flex items-center gap-1 truncate text-slate-500">
            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">Batas: {deadline || "30 Okt 2026"}</span>
          </div>
          <div className="flex items-center gap-1 truncate text-slate-500">
            <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
            <span>Status: Aktif</span>
          </div>
        </div>

        {/* Target Majors Tags */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 block">
            Sasaran Jurusan ({targetMajors.length}):
          </span>
          <div className="flex flex-wrap gap-1">
            {targetMajors.slice(0, 3).map((m) => (
              <span
                key={m}
                className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
              >
                {m}
              </span>
            ))}
            {targetMajors.length > 3 && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-200 text-slate-700">
                +{targetMajors.length - 3} lainnya
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
          {description ||
            "Deskripsi pekerjaan akan ditampilkan di sini sebagai ringkasan informasi bagi para alumni yang ingin melamar."}
        </p>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="truncate max-w-[150px] font-medium text-blue-700">
            {applyType === "whatsapp"
              ? `WA: ${whatsappNumber || "-"}`
              : applyType === "walk_in"
              ? "Rute Walk-In"
              : applyType === "external_url"
              ? "Portal Mitra"
              : emailAddress || contactPerson || "Kirim Email"}
          </span>
          <span className="font-bold text-[#0d2346]">
            {requirementsText.split("\n").filter((r) => r.trim().length > 0).length}{" "}
            Kualifikasi
          </span>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 leading-relaxed text-center">
        Perubahan pada form otomatis terupdate secara instan pada pratinjau kartu
        di atas.
      </p>
    </div>
  );
};

