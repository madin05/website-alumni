import React from "react";
import { Building, ChevronDown } from "lucide-react";
import { RespondentRecord } from "@/store/adminStore";

interface DrawerKerjaCardProps {
  kerja: NonNullable<RespondentRecord["fullPayload"]["detail_kerja"]>;
  isOpen: boolean;
  onToggle: () => void;
}

export const DrawerKerjaCard: React.FC<DrawerKerjaCardProps> = ({
  kerja,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="rounded-xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs transition">
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-3.5 sm:p-4 bg-slate-50/70 hover:bg-slate-100/70 flex items-center justify-between gap-3 text-left transition cursor-pointer border-b border-transparent data-[open=true]:border-slate-100"
        data-open={isOpen}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Building className="w-5 h-5 text-[#0d2346] shrink-0" />
          <div className="min-w-0">
            <span className="font-bold text-xs sm:text-sm text-slate-700 leading-snug block">
              Rincian Instansi / Tempat Kerja
            </span>
            <p className="text-xs text-slate-500 truncate mt-0.5">
              {kerja.nama_perusahaan} • {kerja.jabatan}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
          <span className="hidden sm:inline">
            {isOpen ? "Tutup Rincian" : "Buka Rincian"}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="p-4 sm:p-5 space-y-4 text-xs animate-in fade-in duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-slate-500 block font-medium">
                Nama Perusahaan / Tempat Kerja:
              </span>
              <span className="font-semibold text-slate-700 text-sm block leading-relaxed">
                {kerja.nama_perusahaan}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 block font-medium">
                Posisi / Jabatan:
              </span>
              <span className="font-semibold text-slate-700 text-sm block leading-relaxed">
                {kerja.jabatan}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 block font-medium">
                Kesesuaian dengan Jurusan SMK:
              </span>
              <span className="font-semibold text-slate-700 text-sm block leading-relaxed">
                {kerja.kesesuaian_jurusan}
              </span>
            </div>
            {kerja.keterangan_kerja && (
              <div className="space-y-1">
                <span className="text-slate-500 block font-medium">
                  Status Hubungan Kerja (BPS):
                </span>
                <span className="font-semibold text-slate-700 text-sm block leading-relaxed">
                  {kerja.keterangan_kerja}
                </span>
              </div>
            )}
            {kerja.lokasi_pekerjaan === "LUAR_NEGERI" ||
            (kerja.negara_kerja && kerja.negara_kerja !== "Indonesia") ? (
              <div className="space-y-1">
                <span className="text-slate-500 block font-medium">
                  Lokasi Kerja (Luar Negeri):
                </span>
                <span className="font-semibold text-slate-700 text-sm block leading-relaxed">
                  {kerja.kota_kerja || kerja.kota_kabupaten
                    ? `${kerja.kota_kerja || kerja.kota_kabupaten}, `
                    : ""}
                  {kerja.negara_kerja || "Luar Negeri"}
                </span>
              </div>
            ) : kerja.provinsi_kerja ||
              kerja.kota_kerja ||
              kerja.kota_kabupaten ? (
              <div className="space-y-1">
                <span className="text-slate-500 block font-medium">
                  Lokasi Tempat Kerja:
                </span>
                <span className="font-semibold text-slate-700 text-sm block leading-relaxed">
                  {kerja.kota_kerja || kerja.kota_kabupaten || "-"},{" "}
                  {kerja.provinsi_kerja || "Prov. Banten"}
                </span>
              </div>
            ) : null}

            {/* Data Pendapatan & Upah Bersih */}
            {kerja.kisaran_penghasilan && (
              <div className="space-y-1">
                <span className="text-slate-500 block font-medium">
                  Perkiraan Penghasilan / Gaji:
                </span>
                <span className="font-semibold text-slate-700 text-sm block leading-relaxed">
                  {kerja.kisaran_penghasilan}
                </span>
              </div>
            )}
            {kerja.pendapatan_ump && (
              <div className="space-y-1">
                <span className="text-slate-500 block font-medium">
                  Standar UMP (Provinsi):
                </span>
                <span className="font-semibold text-slate-700 text-sm block leading-relaxed">
                  {kerja.pendapatan_ump}
                </span>
              </div>
            )}
            {kerja.pendapatan_umk && (
              <div className="space-y-1">
                <span className="text-slate-500 block font-medium">
                  Standar UMK (Kabupaten / Kota):
                </span>
                <span className="font-semibold text-slate-700 text-sm block leading-relaxed">
                  {kerja.pendapatan_umk}
                </span>
              </div>
            )}

            {/* Kontak Atasan / HRD */}
            {kerja.nama_atasan && (
              <div className="sm:col-span-2 bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-1.5">
                <span className="text-slate-500 block text-xs font-medium">
                  Kontak Atasan / HRD (Untuk Survei Kepuasan Pengguna Lulusan):
                </span>
                <p className="text-slate-700 text-sm font-semibold leading-relaxed">
                  {kerja.nama_atasan}{" "}
                  <span className="text-slate-600 font-normal">
                    ({kerja.kontak_atasan || "Nomor kontak belum diisi"})
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

