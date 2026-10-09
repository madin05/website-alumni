import React, { useState } from "react";
import {
  useAdminStore,
  RespondentRecord,
  VerificationStatus,
} from "@/store/adminStore";
import {
  X,
  Phone,
  Send,
} from "lucide-react";

const SolidFileCheckIcon: React.FC<{ className?: string }> = ({
  className = "w-4 h-4 text-[#0d2346]",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-3.3 14.7-3.4-3.4 1.4-1.4 2 2 4.6-4.6 1.4 1.4-6 6zM13 9V3.5L18.5 9H13z" />
  </svg>
);

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

const SolidGraduationCapIcon: React.FC<{ className?: string }> = ({
  className = "w-4 h-4 text-[#0d2346]",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
  </svg>
);

const SolidStoreIcon: React.FC<{ className?: string }> = ({
  className = "w-4 h-4 text-[#0d2346]",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z" />
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
  const { updateVerificationStatus } = useAdminStore();
  const [selectedStatus, setSelectedStatus] = useState<VerificationStatus>(
    respondent?.verificationStatus || "PENDING",
  );
  const [revisionNote, setRevisionNote] = useState<string>(
    respondent?.verificationNote || "",
  );
  const [isSaved, setIsSaved] = useState(false);

  // Sync state when respondent changes
  React.useEffect(() => {
    if (respondent) {
      setSelectedStatus(respondent.verificationStatus);
      setRevisionNote(respondent.verificationNote || "");
      setIsSaved(false);
    }
  }, [respondent]);

  if (!respondent) return null;

  const handleSaveVerification = () => {
    updateVerificationStatus(
      respondent.submissionId,
      selectedStatus,
      selectedStatus === "REVISI" ? revisionNote : undefined,
    );
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 400);
  };

  const payload = respondent.fullPayload;
  const identitas = payload.identitas;
  const kerja = payload.detail_kerja;
  const kuliah = payload.detail_kuliah;
  const usaha = payload.detail_usaha;
  const evaluasi = payload.evaluasi;

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case "VALID":
        return (
          <span className="px-2 py-0.5 text-[10px] sm:text-[11px] font-medium rounded-full bg-slate-500/20 text-white border border-slate-500/30">
            Disetujui
          </span>
        );
      case "REVISI":
        return (
          <span className="px-2 py-0.5 text-[10px] sm:text-[11px] font-medium rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
            Perlu Perbaikan
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] sm:text-[11px] font-medium rounded-full bg-slate-500/20 text-white border border-slate-500/30">
            Menunggu Tinjauan
          </span>
        );
    }
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
                  {getStatusBadge(respondent.verificationStatus)}
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
                    className="font-mono text-sm sm:text-[15px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline inline-flex items-center gap-1.5 leading-relaxed"
                  >
                    <Phone className="w-4 h-4 text-emerald-600" />
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
                  <span className="px-2.5 py-1 bg-[#0d2346]/10 text-[#0d2346] rounded-md text-xs font-semibold">
                    {getAktivitasLabel(respondent.statusKegiatan)}
                  </span>
                  {payload.masa_tunggu && (
                    <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-md text-xs font-medium">
                      Waktu Tunggu: {payload.masa_tunggu}
                    </span>
                  )}
                </div>
              </div>

              {/* Kerja Detail */}
              {kerja && (
                <div className="space-y-3.5 pt-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Rincian Pekerjaan & Perusahaan:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div className="space-y-1">
                      <span className="text-slate-500 block text-xs font-medium">
                        Nama Perusahaan / Tempat Kerja:
                      </span>
                      <span className="text-sm sm:text-[15px] font-semibold text-slate-900 leading-relaxed block">
                        {kerja.nama_perusahaan}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-500 block text-xs font-medium">
                        Posisi / Jabatan:
                      </span>
                      <span className="text-sm sm:text-[15px] font-semibold text-slate-900 leading-relaxed block">
                        {kerja.jabatan}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-500 block text-xs font-medium">
                        Kesesuaian dengan Jurusan SMK:
                      </span>
                      <span className="text-sm sm:text-[15px] font-semibold text-slate-800 leading-relaxed block">
                        {kerja.kesesuaian_jurusan}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-500 block text-xs font-medium">
                        Perkiraan Penghasilan Per Bulan:
                      </span>
                      <span className="text-sm sm:text-[15px] font-semibold text-slate-900 leading-relaxed block">
                        {kerja.kisaran_penghasilan || "-"}
                      </span>
                    </div>
                    {kerja.nama_atasan && (
                      <div className="sm:col-span-2 bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-1.5">
                        <span className="text-slate-500 block text-xs font-medium">
                          Kontak Atasan / HRD (Untuk Survei Kepuasan Pengguna
                          Lulusan):
                        </span>
                        <p className="text-slate-900 text-sm font-semibold leading-relaxed">
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

              {/* Kuliah Detail */}
              {kuliah && (
                <div className="space-y-3.5 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <SolidGraduationCapIcon className="w-3.5 h-3.5 text-slate-500" />
                    <span>Rincian Perguruan Tinggi:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div className="space-y-1">
                      <span className="text-slate-500 block text-xs font-medium">
                        Nama Kampus / Perguruan Tinggi:
                      </span>
                      <span className="text-sm sm:text-[15px] font-semibold text-slate-900 leading-relaxed block">
                        {kuliah.nama_kampus}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-500 block text-xs font-medium">
                        Program Studi & Jenjang:
                      </span>
                      <span className="text-sm sm:text-[15px] font-semibold text-slate-900 leading-relaxed block">
                        {kuliah.program_studi} ({kuliah.jenjang})
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Usaha Detail */}
              {usaha && (
                <div className="space-y-3.5 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <SolidStoreIcon className="w-3.5 h-3.5 text-slate-500" />
                    <span>Rincian Usaha Mandiri:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div className="space-y-1">
                      <span className="text-slate-500 block text-xs font-medium">
                        Nama Usaha:
                      </span>
                      <span className="text-sm sm:text-[15px] font-semibold text-slate-900 leading-relaxed block">
                        {usaha.nama_usaha}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-500 block text-xs font-medium">
                        Bidang Usaha:
                      </span>
                      <span className="text-sm sm:text-[15px] font-semibold text-slate-900 leading-relaxed block">
                        {usaha.bidang_usaha || usaha.kategori_usaha}
                      </span>
                    </div>
                  </div>
                </div>
              )}
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

            {/* Section 4: Form Tindakan Verifikasi Admin */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4 sm:space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-[#0d2346]">
                  <SolidFileCheckIcon className="w-4 h-4 text-[#0d2346]" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  Pembaruan Status Verifikasi
                </h3>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedStatus("VALID")}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                    selectedStatus === "VALID"
                      ? "bg-[#0d2346] text-white shadow-xs"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Disetujui
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedStatus("REVISI")}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                    selectedStatus === "REVISI"
                      ? "bg-rose-700 text-white shadow-xs"
                      : "bg-white text-rose-800 border border-rose-200 hover:bg-rose-50"
                  }`}
                >
                  Perlu Perbaikan
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedStatus("PENDING")}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                    selectedStatus === "PENDING"
                      ? "bg-slate-700 text-white shadow-xs"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Menunggu Tinjauan
                </button>
              </div>

              {selectedStatus === "REVISI" && (
                <div className="space-y-2 pt-2 animate-in fade-in duration-200">
                  <label className="text-xs sm:text-sm font-semibold text-slate-700 block">
                    Catatan Perbaikan untuk Alumni:
                  </label>
                  <textarea
                    rows={3}
                    value={revisionNote}
                    onChange={(e) => setRevisionNote(e.target.value)}
                    placeholder="Contoh: Mohon lengkapi nama atasan atau konfirmasi kembali nama instansi tempat bekerja..."
                    className="w-full p-3.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0d2346]/20 focus:border-[#0d2346] bg-white leading-relaxed"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-medium transition cursor-pointer"
            >
              Tutup
            </button>
            <button
              onClick={handleSaveVerification}
              className="px-5 py-2.5 rounded-xl bg-[#0d2346] hover:bg-[#163868] text-white text-xs sm:text-sm font-semibold shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Send className="w-4 h-4 text-slate-300" />
              <span>{isSaved ? "Tersimpan" : "Simpan Status Verifikasi"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
