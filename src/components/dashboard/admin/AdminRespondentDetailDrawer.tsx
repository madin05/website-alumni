import React, { useState } from "react";
import { RespondentRecord } from "@/store/adminStore";
import {
  X,
  Phone,
  ChevronDown,
  Building,
  GraduationCap,
  Store,
  Clock,
  Layers,
} from "lucide-react";

const SolidUserIcon: React.FC<{ className?: string }> = ({
  className = "w-4 h-4 text-[#0d2346]",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const SolidBuildingIcon: React.FC<{ className?: string }> = ({
  className = "w-4 h-4 text-[#0d2346]",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
  </svg>
);

const SolidMessageSquareIcon: React.FC<{ className?: string }> = ({
  className = "w-4 h-4 text-[#0d2346]",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
  </svg>
);

interface AdminRespondentDetailDrawerProps {
  respondent: RespondentRecord | null;
  onClose: () => void;
}

export const AdminRespondentDetailDrawer: React.FC<
  AdminRespondentDetailDrawerProps
> = ({ respondent, onClose }) => {
  if (!respondent) return null;

  const payload = respondent.fullPayload;
  const identitas = payload.identitas;
  const kerja = payload.detail_kerja;
  const kuliah = payload.detail_kuliah;
  const usaha = payload.detail_usaha;
  const evaluasi = payload.evaluasi;

  // Dropdown states for each activity section
  const [openKerja, setOpenKerja] = useState<boolean>(true);
  const [openKuliah, setOpenKuliah] = useState<boolean>(true);
  const [openUsaha, setOpenUsaha] = useState<boolean>(true);
  const [filterTab, setFilterTab] = useState<
    "ALL" | "KERJA" | "KULIAH" | "USAHA"
  >("ALL");

  const hasMultipleActivities =
    (Boolean(kerja) && Boolean(kuliah)) ||
    (Boolean(kuliah) && Boolean(usaha)) ||
    (Boolean(kerja) && Boolean(usaha));

  const formatMasaTunggu = (val?: string | number) => {
    if (val === undefined || val === null || val === "") return "-";
    const strVal = String(val).trim();
    if (
      strVal === "0" ||
      strVal.toLowerCase() === "0 bulan" ||
      strVal.toLowerCase() === "langsung"
    ) {
      return "Langsung / 0 Bulan (Tanpa Jeda)";
    }
    if (!isNaN(Number(strVal))) {
      return `${strVal} Bulan setelah lulus`;
    }
    return strVal;
  };

  const getAktivitasLabel = (status: string) => {
    switch (status) {
      case "KERJA":
        return "Bekerja di Instansi / Perusahaan";
      case "KULIAH":
        return "Melanjutkan Kuliah";
      case "WIRAUSAHA":
        return "Wirausaha Mandiri";
      case "KERJA_KULIAH":
        return "Kuliah & Kerja";
      case "WIRAUSAHA_KULIAH":
        return "Kuliah & Wirausaha";
      default:
        return "Sedang Mencari Kerja";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sliding Sheet / Drawer Panel from Right */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 sm:px-6 border-b border-slate-100 bg-[#0d2346] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                    {respondent.nama}
                  </h2>
                  <span className="px-2.5 py-0.5 text-[10px] sm:text-[11px] font-medium rounded-full bg-white/15 text-white border border-white/20">
                    Kuesioner Masuk
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-normal">
                  Nomor Berkas:{" "}
                  <span className="font-mono text-white">
                    {respondent.submissionId}
                  </span>{" "}
                  | Angkatan {respondent.tahunLulus}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
              title="Tutup"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6 flex-1 text-slate-800 bg-slate-50/60">
            {/* Section 1: Identitas Alumni */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4 sm:space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-[#0d2346]">
                  <SolidUserIcon className="w-4 h-4 text-[#0d2346]" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  Identitas dan Kontak Alumni
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-500 block text-xs font-medium tracking-wide">
                    NISN / NIK:
                  </span>
                  <span className="font-mono text-sm sm:text-[15px] font-semibold text-slate-900 leading-relaxed block break-words">
                    {identitas.nisn}{" "}
                    {identitas.nik ? ` / ${identitas.nik}` : ""}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 block text-xs font-medium tracking-wide">
                    Jurusan / Program Keahlian:
                  </span>
                  <span className="text-sm sm:text-[15px] font-semibold text-slate-900 leading-relaxed block">
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
                    className="font-mono text-sm sm:text-[15px] font-semibold text-slate-900 hover:text-blue-700 hover:underline inline-flex items-center gap-1.5 leading-relaxed"
                  >
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span>{identitas.no_whatsapp}</span>
                  </a>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 block text-xs font-medium tracking-wide">
                    Alamat Email:
                  </span>
                  <span className="text-sm sm:text-[15px] font-semibold text-slate-900 leading-relaxed block break-words">
                    {identitas.email || "-"}
                  </span>
                </div>
                {(identitas.status_menikah || identitas.usia) && (
                  <div className="space-y-1">
                    <span className="text-slate-500 block text-xs font-medium tracking-wide">
                      Demografi (Usia & Pernikahan):
                    </span>
                    <span className="text-sm sm:text-[15px] font-semibold text-slate-900 leading-relaxed block">
                      {identitas.usia ? `${identitas.usia} Tahun` : "-"} •{" "}
                      {identitas.status_menikah || "Belum Menikah"}
                    </span>
                  </div>
                )}
                {(identitas.kota_domisili || identitas.provinsi_domisili) && (
                  <div className="space-y-1 sm:col-span-2">
                    <span className="text-slate-500 block text-xs font-medium tracking-wide">
                      Domisili Tempat Tinggal:
                    </span>
                    <span className="text-sm sm:text-[15px] font-semibold text-slate-900 leading-relaxed block">
                      {identitas.kota_domisili || "-"},{" "}
                      {identitas.provinsi_domisili || "-"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Section 2: Aktivitas Pasca Kelulusan */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4 sm:space-y-5">
              <div className="flex items-center justify-between gap-3 flex-wrap pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-[#0d2346]">
                    <SolidBuildingIcon className="w-4 h-4 text-[#0d2346]" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900">
                    Aktivitas Setelah Kelulusan
                  </h3>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-800 rounded-md text-xs font-semibold">
                    {getAktivitasLabel(respondent.statusKegiatan)}
                  </span>
                  {payload.masa_tunggu !== undefined &&
                    payload.masa_tunggu !== null && (
                      <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-md text-xs font-medium flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>
                          Waktu Tunggu: {formatMasaTunggu(payload.masa_tunggu)}
                        </span>
                      </span>
                    )}
                </div>
              </div>

              {/* Selector Jika Alumni Memiliki Lebih dari Satu Aktivitas */}
              {hasMultipleActivities && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#0d2346]" />
                    <span className="text-xs font-semibold text-slate-700">
                      Pilihan Tampilan Rincian Data:
                    </span>
                  </div>
                  <select
                    value={filterTab}
                    onChange={(e) =>
                      setFilterTab(e.target.value as "ALL" | "KERJA" | "KULIAH" | "USAHA")
                    }
                    className="text-xs font-medium bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0d2346] cursor-pointer shadow-2xs"
                  >
                    <option value="ALL">Tampilkan Semua Rincian Data</option>
                    {kuliah && <option value="KULIAH">Rincian Perguruan Tinggi</option>}
                    {kerja && <option value="KERJA">Rincian Instansi / Tempat Kerja</option>}
                    {usaha && <option value="USAHA">Rincian Usaha Mandiri</option>}
                  </select>
                </div>
              )}

              {/* Rincian Dropdown Cards Container */}
              <div className="space-y-4">
                {/* 1. Kuliah Detail (Dropdown Card) */}
                {kuliah && (filterTab === "ALL" || filterTab === "KULIAH") && (
                  <div className="rounded-xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs transition">
                    <button
                      type="button"
                      onClick={() => setOpenKuliah(!openKuliah)}
                      className="w-full p-3.5 sm:p-4 bg-slate-50/70 hover:bg-slate-100/70 flex items-center justify-between gap-3 text-left transition cursor-pointer border-b border-transparent data-[open=true]:border-slate-100"
                      data-open={openKuliah}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <GraduationCap className="w-5 h-5 text-[#0d2346] shrink-0" />
                        <div className="min-w-0">
                          <span className="font-bold text-xs sm:text-sm text-slate-900 leading-snug block">
                            Rincian Perguruan Tinggi
                          </span>
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {kuliah.nama_kampus} • {kuliah.program_studi} (
                            {kuliah.jenjang})
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
                        <span className="hidden sm:inline">
                          {openKuliah ? "Tutup Rincian" : "Buka Rincian"}
                        </span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            openKuliah ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {openKuliah && (
                      <div className="p-4 sm:p-5 space-y-4 text-xs animate-in fade-in duration-150">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <span className="text-slate-500 block font-medium">
                              Nama Kampus / Perguruan Tinggi:
                            </span>
                            <span className="font-semibold text-slate-900 text-sm block leading-relaxed">
                              {kuliah.nama_kampus}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-slate-500 block font-medium">
                              Program Studi & Jenjang:
                            </span>
                            <span className="font-semibold text-slate-900 text-sm block leading-relaxed">
                              {kuliah.program_studi} ({kuliah.jenjang})
                            </span>
                          </div>
                          {kuliah.keselarasan_studi && (
                            <div className="space-y-1 sm:col-span-2 pt-2 border-t border-slate-100">
                              <span className="text-slate-500 block font-medium">
                                Keselarasan Program Studi dengan SMK:
                              </span>
                              <span className="font-semibold text-slate-900 text-sm block leading-relaxed">
                                {kuliah.keselarasan_studi}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Kerja Detail (Dropdown Card) */}
                {kerja && (filterTab === "ALL" || filterTab === "KERJA") && (
                  <div className="rounded-xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs transition">
                    <button
                      type="button"
                      onClick={() => setOpenKerja(!openKerja)}
                      className="w-full p-3.5 sm:p-4 bg-slate-50/70 hover:bg-slate-100/70 flex items-center justify-between gap-3 text-left transition cursor-pointer border-b border-transparent data-[open=true]:border-slate-100"
                      data-open={openKerja}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Building className="w-5 h-5 text-[#0d2346] shrink-0" />
                        <div className="min-w-0">
                          <span className="font-bold text-xs sm:text-sm text-slate-900 leading-snug block">
                            Rincian Instansi / Tempat Kerja
                          </span>
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {kerja.nama_perusahaan} • {kerja.jabatan}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
                        <span className="hidden sm:inline">
                          {openKerja ? "Tutup Rincian" : "Buka Rincian"}
                        </span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            openKerja ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {openKerja && (
                      <div className="p-4 sm:p-5 space-y-4 text-xs animate-in fade-in duration-150">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <span className="text-slate-500 block font-medium">
                              Nama Perusahaan / Tempat Kerja:
                            </span>
                            <span className="font-semibold text-slate-900 text-sm block leading-relaxed">
                              {kerja.nama_perusahaan}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-slate-500 block font-medium">
                              Posisi / Jabatan:
                            </span>
                            <span className="font-semibold text-slate-900 text-sm block leading-relaxed">
                              {kerja.jabatan}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-slate-500 block font-medium">
                              Kesesuaian dengan Jurusan SMK:
                            </span>
                            <span className="font-semibold text-slate-900 text-sm block leading-relaxed">
                              {kerja.kesesuaian_jurusan}
                            </span>
                          </div>
                          {kerja.keterangan_kerja && (
                            <div className="space-y-1">
                              <span className="text-slate-500 block font-medium">
                                Status Hubungan Kerja (BPS):
                              </span>
                              <span className="font-semibold text-slate-900 text-sm block leading-relaxed">
                                {kerja.keterangan_kerja}
                              </span>
                            </div>
                          )}
                          {kerja.lokasi_pekerjaan === "LUAR_NEGERI" ||
                          (kerja.negara_kerja &&
                            kerja.negara_kerja !== "Indonesia") ? (
                            <div className="space-y-1">
                              <span className="text-slate-500 block font-medium">
                                Lokasi Kerja (Luar Negeri):
                              </span>
                              <span className="font-semibold text-slate-900 text-sm block leading-relaxed">
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
                              <span className="font-semibold text-slate-900 text-sm block leading-relaxed">
                                {kerja.kota_kerja ||
                                  kerja.kota_kabupaten ||
                                  "-"}
                                , {kerja.provinsi_kerja || "Prov. Banten"}
                              </span>
                            </div>
                          ) : null}

                          {/* Data Pendapatan & Upah Bersih */}
                          {kerja.kisaran_penghasilan && (
                            <div className="space-y-1">
                              <span className="text-slate-500 block font-medium">
                                Perkiraan Penghasilan / Gaji:
                              </span>
                              <span className="font-semibold text-slate-900 text-sm block leading-relaxed">
                                {kerja.kisaran_penghasilan}
                              </span>
                            </div>
                          )}
                          {kerja.pendapatan_ump && (
                            <div className="space-y-1">
                              <span className="text-slate-500 block font-medium">
                                Standar UMP (Provinsi):
                              </span>
                              <span className="font-semibold text-slate-900 text-sm block leading-relaxed">
                                {kerja.pendapatan_ump}
                              </span>
                            </div>
                          )}
                          {kerja.pendapatan_umk && (
                            <div className="space-y-1">
                              <span className="text-slate-500 block font-medium">
                                Standar UMK (Kabupaten / Kota):
                              </span>
                              <span className="font-semibold text-slate-900 text-sm block leading-relaxed">
                                {kerja.pendapatan_umk}
                              </span>
                            </div>
                          )}

                          {/* Kontak Atasan / HRD */}
                          {kerja.nama_atasan && (
                            <div className="sm:col-span-2 bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-1.5">
                              <span className="text-slate-500 block text-xs font-medium">
                                Kontak Atasan / HRD (Untuk Survei Kepuasan
                                Pengguna Lulusan):
                              </span>
                              <p className="text-slate-900 text-sm font-semibold leading-relaxed">
                                {kerja.nama_atasan}{" "}
                                <span className="text-slate-600 font-normal">
                                  (
                                  {kerja.kontak_atasan ||
                                    "Nomor kontak belum diisi"}
                                  )
                                </span>
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Usaha Detail (Dropdown Card) */}
                {usaha && (filterTab === "ALL" || filterTab === "USAHA") && (
                  <div className="rounded-xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs transition">
                    <button
                      type="button"
                      onClick={() => setOpenUsaha(!openUsaha)}
                      className="w-full p-3.5 sm:p-4 bg-slate-50/70 hover:bg-slate-100/70 flex items-center justify-between gap-3 text-left transition cursor-pointer border-b border-transparent data-[open=true]:border-slate-100"
                      data-open={openUsaha}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Store className="w-5 h-5 text-[#0d2346] shrink-0" />
                        <div className="min-w-0">
                          <span className="font-bold text-xs sm:text-sm text-slate-900 leading-snug block">
                            Rincian Usaha Mandiri
                          </span>
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {usaha.nama_usaha} •{" "}
                            {usaha.bidang_usaha ||
                              usaha.kategori_usaha ||
                              "Wirausaha"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
                        <span className="hidden sm:inline">
                          {openUsaha ? "Tutup Rincian" : "Buka Rincian"}
                        </span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            openUsaha ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {openUsaha && (
                      <div className="p-4 sm:p-5 space-y-4 text-xs animate-in fade-in duration-150">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <span className="text-slate-500 block font-medium">
                              Nama Usaha:
                            </span>
                            <span className="font-semibold text-slate-900 text-sm block leading-relaxed">
                              {usaha.nama_usaha}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-slate-500 block font-medium">
                              Bidang Usaha & Jenis:
                            </span>
                            <span className="font-semibold text-slate-900 text-sm block leading-relaxed">
                              {usaha.bidang_usaha || usaha.kategori_usaha}{" "}
                              {usaha.jenis_usaha
                                ? `(${usaha.jenis_usaha})`
                                : ""}
                            </span>
                          </div>
                          {usaha.nama_produk_usaha && (
                            <div className="space-y-1">
                              <span className="text-slate-500 block font-medium">
                                Nama Produk / Komoditas:
                              </span>
                              <span className="font-semibold text-slate-900 text-sm block leading-relaxed">
                                {usaha.nama_produk_usaha}
                              </span>
                            </div>
                          )}
                          {(usaha.provinsi_usaha || usaha.kota_usaha) && (
                            <div className="space-y-1">
                              <span className="text-slate-500 block font-medium">
                                Lokasi Usaha:
                              </span>
                              <span className="font-semibold text-slate-900 text-sm block leading-relaxed">
                                {usaha.kota_usaha || "-"},{" "}
                                {usaha.provinsi_usaha || "Prov. Banten"}
                              </span>
                            </div>
                          )}

                          {/* Data Standar UMP & UMK Usaha */}
                          {usaha.pendapatan_ump && (
                            <div className="space-y-1">
                              <span className="text-slate-500 block font-medium">
                                Standar UMP Usaha (Provinsi):
                              </span>
                              <span className="font-semibold text-slate-900 text-sm block leading-relaxed">
                                {usaha.pendapatan_ump}
                              </span>
                            </div>
                          )}
                          {usaha.pendapatan_umk && (
                            <div className="space-y-1">
                              <span className="text-slate-500 block font-medium">
                                Standar UMK Usaha (Kabupaten / Kota):
                              </span>
                              <span className="font-semibold text-slate-900 text-sm block leading-relaxed">
                                {usaha.pendapatan_umk}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: Evaluasi Pembelajaran & Masukan */}
            {evaluasi && (
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4 sm:space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-[#0d2346]">
                    <SolidMessageSquareIcon className="w-4 h-4 text-[#0d2346]" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900">
                    Evaluasi Pembelajaran dan Masukan Sekolah
                  </h3>
                </div>
                <div className="space-y-4 text-xs">
                  {evaluasi.saran_pembelajaran && (
                    <div className="space-y-1.5">
                      <span className="text-slate-500 block text-xs font-medium">
                        Saran untuk Pembelajaran & Kurikulum:
                      </span>
                      <p className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-slate-800 text-sm italic leading-relaxed">
                        "{evaluasi.saran_pembelajaran}"
                      </p>
                    </div>
                  )}
                  {evaluasi.saran_bkk && (
                    <div className="space-y-1.5">
                      <span className="text-slate-500 block text-xs font-medium">
                        Saran untuk Layanan Bursa Kerja Khusus (BKK):
                      </span>
                      <p className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-slate-800 text-sm italic leading-relaxed">
                        "{evaluasi.saran_bkk}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-white flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#0d2346] hover:bg-[#163868] text-white text-xs sm:text-sm font-semibold shadow-xs transition active:scale-95 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
