import React from "react";
import { Phone } from "lucide-react";
import { SolidUserIcon } from "./DrawerIcons";
import { RespondentRecord } from "@/store/adminStore";

interface DrawerIdentitySectionProps {
  identitas: RespondentRecord["fullPayload"]["identitas"];
}

export const DrawerIdentitySection: React.FC<DrawerIdentitySectionProps> = ({
  identitas,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4 sm:space-y-5">
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-[#0d2346]">
          <SolidUserIcon className="w-4 h-4 text-[#0d2346]" />
        </div>
        <h3 className="font-bold text-sm sm:text-base text-slate-700">
          Identitas dan Kontak Alumni
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 text-xs">
        <div className="space-y-1">
          <span className="text-slate-500 block text-xs font-medium tracking-wide">
            NISN / NIK:
          </span>
          <span className="font-mono text-sm sm:text-[15px] font-medium text-slate-700 leading-relaxed block break-words">
            {identitas.nisn}{" "}
            {identitas.nik ? ` / ${identitas.nik}` : ""}
          </span>
        </div>
        <div className="space-y-1">
          <span className="text-slate-500 block text-xs font-medium tracking-wide">
            Jurusan / Program Keahlian:
          </span>
          <span className="text-sm sm:text-[15px] font-semibold text-slate-700 leading-relaxed block">
            {identitas.jurusan}
          </span>
        </div>
        <div className="space-y-1">
          <span className="text-slate-500 block text-xs font-medium tracking-wide">
            Nomor WhatsApp:
          </span>
          <a
            href={`https://wa.me/${identitas.no_whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-sm sm:text-[15px] font-semibold text-slate-700 hover:text-blue-700 hover:underline inline-flex items-center gap-1.5 leading-relaxed"
          >
            <Phone className="w-4 h-4 text-slate-500" />
            <span>{identitas.no_whatsapp}</span>
          </a>
        </div>
        <div className="space-y-1">
          <span className="text-slate-500 block text-xs font-medium tracking-wide">
            Alamat Email:
          </span>
          <span className="text-sm sm:text-[15px] font-semibold text-slate-700 leading-relaxed block break-words">
            {identitas.email || "-"}
          </span>
        </div>
        {(identitas.status_menikah || identitas.usia) && (
          <div className="space-y-1">
            <span className="text-slate-500 block text-xs font-medium tracking-wide">
              Demografi (Usia & Pernikahan):
            </span>
            <span className="text-sm sm:text-[15px] font-semibold text-slate-700 leading-relaxed block">
              {identitas.usia ? `${identitas.usia} Tahun` : "-"} -{" "}
              {identitas.status_menikah || "Belum Menikah"}
            </span>
          </div>
        )}
        {(identitas.kota_domisili || identitas.provinsi_domisili) && (
          <div className="space-y-1 sm:col-span-2">
            <span className="text-slate-500 block text-xs font-medium tracking-wide">
              Domisili Tempat Tinggal:
            </span>
            <span className="text-sm sm:text-[15px] font-semibold text-slate-700 leading-relaxed block">
              {identitas.kota_domisili || "-"},{" "}
              {identitas.provinsi_domisili || "-"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

