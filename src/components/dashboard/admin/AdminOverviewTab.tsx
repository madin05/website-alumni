import React from "react";
import { useAdminStore } from "@/store/adminStore";
import {
  ArrowRight,
} from "lucide-react";

const SolidUsersIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4 text-[#0d2346]" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);

const SolidTrendingUpIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4 text-[#0d2346]" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" />
  </svg>
);

const SolidClockIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4 text-[#0d2346]" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
  </svg>
);

const SolidBriefcaseIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4 text-[#0d2346]" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
  </svg>
);

const SolidFileCheckIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4 text-white" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-3.3 14.7-3.4-3.4 1.4-1.4 2 2 4.6-4.6 1.4 1.4-6 6zM13 9V3.5L18.5 9H13z" />
  </svg>
);

interface AdminOverviewTabProps {
  onNavigateTab: (tabId: string) => void;
  onOpenRespondentDetail?: (submissionId: string) => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  onNavigateTab,
  onOpenRespondentDetail,
}) => {
  const { masterAlumni, respondents, settings } = useAdminStore();

  const totalMaster = masterAlumni.length;
  const totalSubmitted = masterAlumni.filter(
    (a) => a.statusTracer === "SUDAH",
  ).length;
  const targetQuota = settings.targetQuota || 450;
  const responseRate =
    totalMaster > 0 ? ((totalSubmitted / targetQuota) * 100).toFixed(1) : "0";

  const pendingVerification = respondents.filter(
    (r) => r.verificationStatus === "PENDING",
  ).length;
  const validVerification = respondents.filter(
    (r) => r.verificationStatus === "VALID",
  ).length;
  const revisionCount = respondents.filter(
    (r) => r.verificationStatus === "REVISI",
  ).length;

  // Status Activities Counts
  const countKerja = respondents.filter(
    (r) => r.statusKegiatan === "KERJA" || r.statusKegiatan === "KERJA_KULIAH",
  ).length;
  const countKuliah = respondents.filter(
    (r) =>
      r.statusKegiatan === "KULIAH" || r.statusKegiatan === "WIRAUSAHA_KULIAH",
  ).length;
  const countWirausaha = respondents.filter(
    (r) => r.statusKegiatan === "WIRAUSAHA",
  ).length;
  const countBelumKerja = respondents.filter(
    (r) => r.statusKegiatan === "BELUM_KERJA",
  ).length;

  // Jurusan distribution with unified theme styling
  const jurusanList = [
    { code: "TKJ", name: "Teknik Komputer dan Jaringan" },
    { code: "TPM", name: "Teknik Pemesinan" },
    { code: "TITL", name: "Teknik Instalasi Tenaga Listrik" },
    { code: "EL", name: "Teknik Elektronika Industri" },
    { code: "TKRO", name: "Teknik Kendaraan Ringan Otomotif" },
    { code: "TBSM", name: "Teknik dan Bisnis Sepeda Motor" },
  ];

  const jurusanStats = jurusanList.map((j) => {
    const totalInJurusan = masterAlumni.filter((a) =>
      a.jurusan.includes(j.name),
    ).length;
    const filledInJurusan = masterAlumni.filter(
      (a) => a.jurusan.includes(j.name) && a.statusTracer === "SUDAH",
    ).length;
    const percent =
      totalInJurusan > 0
        ? Math.round((filledInJurusan / totalInJurusan) * 100)
        : 0;
    return {
      ...j,
      total: totalInJurusan,
      filled: filledInJurusan,
      percent,
    };
  });

  const recentSubmissions = respondents.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-[#0d2346] text-white rounded-t-md p-6 sm:p-7 border border-[#163868] shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Pemantauan Penelusuran Lulusan Angkatan {settings.targetYear}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
            Pantau kemajuan pengisian kuesioner, verifikasi data lulusan yang
            masuk, dan siapkan dokumen laporan penelusuran tamatan untuk sekolah
            dan dinas terkait.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab("master_alumni")}
              className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-semibold border border-white/25 shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <SolidUsersIcon className="w-4 h-4 text-white" />
              <span>Data Alumni ({totalMaster} Siswa)</span>
            </button>
            <button
              onClick={() => onNavigateTab("verifikasi")}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/20 transition active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <SolidFileCheckIcon className="w-4 h-4 text-slate-200" />
              <span>Verifikasi Isian ({pendingVerification} Menunggu)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pending Action Notification */}
      {pendingVerification > 0 && (
        <div className="bg-amber-50/90 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-600 text-white flex items-center justify-center shrink-0">
              <SolidClockIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-amber-900">
                Ada {pendingVerification} isian kuesioner baru yang perlu
                ditinjau
              </p>
              <p className="text-[11px] sm:text-xs text-amber-800">
                Periksa kesesuaian data pekerjaan dan kontak sebelum dicetak ke
                dalam laporan resmi.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab("verifikasi")}
            className="px-3.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold transition shrink-0 cursor-pointer flex items-center gap-1.5 self-end sm:self-auto"
          >
            <span>Tinjau Isian</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4 Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Target Kuota */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Target Jumlah Lulusan
            </span>
            <div className="w-8 h-8 text-[#0d2346] flex items-center justify-center">
              <SolidUsersIcon className="w-4 h-4 text-[#0d2346]" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {targetQuota}
            </span>
            <span className="text-xs text-slate-500">Siswa</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {totalMaster} siswa terdaftar di data pokok
          </p>
        </div>

        {/* Card 2: Tingkat Pengisian */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Tingkat Pengisian
            </span>
            <div className="w-8 h-8 text-[#0d2346] flex items-center justify-center">
              <SolidTrendingUpIcon className="w-4 h-4 text-[#0d2346]" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {responseRate}%
            </span>
            <span className="text-xs text-slate-500">
              ({totalSubmitted} dari {targetQuota})
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-[#0d2346] rounded-full transition-all duration-300"
              style={{ width: `${Math.min(Number(responseRate), 100)}%` }}
            />
          </div>
        </div>

        {/* Card 3: Status Verifikasi */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Status Verifikasi
            </span>
            <div className="w-8 h-8 text-[#0d2346] flex items-center justify-center">
              <SolidClockIcon className="w-4 h-4 text-[#0d2346]" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {pendingVerification}
            </span>
            <span className="text-xs text-slate-500">Menunggu Tinjauan</span>
          </div>
          <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
            <span className="text-slate-700 font-semibold">
              {validVerification} Disetujui
            </span>
            <span>•</span>
            <span className="text-slate-700 font-semibold">
              {revisionCount} Perlu Perbaikan
            </span>
          </div>
        </div>

        {/* Card 4: Aktivitas Lulusan */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Aktivitas Lulusan
            </span>
            <div className="w-8 h-8 text-[#0d2346] flex items-center justify-center">
              <SolidBriefcaseIcon className="w-4 h-4 text-[#0d2346]" />
            </div>
          </div>
          <div className="mt-2.5 space-y-1 text-xs">
            <div className="flex items-center justify-between text-slate-700">
              <span>Bekerja</span>
              <span className="font-bold text-slate-900">
                {countKerja} Siswa
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span>Melanjutkan Kuliah</span>
              <span className="font-bold text-slate-900">
                {countKuliah} Siswa
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span>Wirausaha</span>
              <span className="font-bold text-slate-900">
                {countWirausaha} Siswa
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Program Keahlian Breakdown & Recent Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Partisipasi per Program Keahlian */}
        <div className="lg:col-span-7 bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                Pengisian per Program Keahlian
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Jumlah data kuesioner yang telah terisi pada setiap jurusan
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
              Angkatan {settings.targetYear}
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {jurusanStats.map((item) => (
              <div key={item.code} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 mb-1.5">
                    {item.name}
                  </span>
                  <span className="font-light text-slate-700">
                    {item.filled} dari {item.total} Siswa ({item.percent}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-700 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(item.percent, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Data tersinkronisasi otomatis dengan basis data sekolah</span>
            <button
              onClick={() => onNavigateTab("master_alumni")}
              className="text-[#0d2346] font-semibold hover:underline flex items-center gap-1"
            >
              <span>Buka Data Alumni</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right 5 cols: Kuesioner Masuk Terbaru */}
        <div className="lg:col-span-5 bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  Kuesioner Masuk Terbaru
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  5 alumni terakhir yang mengirimkan data penelusuran
                </p>
              </div>
              <button
                onClick={() => onNavigateTab("verifikasi")}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Lihat Semua
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-1">
              {recentSubmissions.map((sub) => (
                <div
                  key={sub.submissionId}
                  onClick={() =>
                    onOpenRespondentDetail &&
                    onOpenRespondentDetail(sub.submissionId)
                  }
                  className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 rounded-lg px-2 -mx-2 transition cursor-pointer"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {sub.nama}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {sub.jurusan} • {sub.instansiKampusUsaha}
                    </p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        sub.verificationStatus === "VALID"
                          ? "text-slate-800"
                          : sub.verificationStatus === "REVISI"
                            ? "text-rose-800"
                            : "text-slate-800"
                      }`}
                    >
                      {sub.verificationStatus === "VALID"
                        ? "Disetujui"
                        : sub.verificationStatus === "REVISI"
                          ? "Perlu Perbaikan"
                          : "Menunggu"}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(sub.submittedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 bg-slate-50 -mx-5 -mb-5 p-4 rounded-b-xl flex items-center justify-between text-xs">
            <span className="text-slate-600">
              Perlu mencetak rekapitulasi data?
            </span>
            <button
              onClick={() => onNavigateTab("laporan")}
              className="px-3 py-1.5 rounded-full bg-[#0d2346] hover:bg-[#163868] text-white font-semibold transition cursor-pointer"
            >
              Buka Laporan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
