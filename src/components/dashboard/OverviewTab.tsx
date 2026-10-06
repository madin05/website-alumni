import React from "react";
import { useAuthStore } from "@/store/authStore";
import { useTracerStore } from "@/store/tracerStore";
import { useContentStore } from "@/store/contentStore";
import { JobVacancy } from "@/types/tracer";
import { DashboardTab } from "./DashboardSidebar";
import {
  Check,
  AlertCircle,
  Download,
  Briefcase,
  GraduationCap,
  Building,
  ArrowRight,
  MapPin,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface OverviewTabProps {
  onNavigateTab: (tab: DashboardTab) => void;
  onOpenReceipt: () => void;
  onSelectJob: (job: JobVacancy) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  onNavigateTab,
  onOpenReceipt,
  onSelectJob,
}) => {
  const { user } = useAuthStore();
  const { isSubmitted, lastSubmissionId } = useTracerStore();
  const { jobList } = useContentStore();

  const isTracerDone = isSubmitted || user?.tracerStatus === "SUDAH";
  const recentJobs = jobList.slice(0, 3);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Banner Tracer Study matching Wireframe */}
      <div className="relative rounded-t-md overflow-hidden bg-gradient-to-r from-[#102a4e] via-[#1a3d6d] to-[#254f8a] text-white p-4 sm:p-6 md:p-8 shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1.5 sm:space-y-2 max-w-xl">
            <h2 className="text-base sm:text-xl md:text-2xl font-bold tracking-tight">
              {isTracerDone
                ? "Data Tracer Study Anda Sudah Tersimpan"
                : "Kuesioner Tracer Study 2026 Tersedia"}
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {isTracerDone
                ? `Terima kasih telah mengisi Tracer Study. Nomor registrasi Anda: ${lastSubmissionId || user?.submissionId || "2026102498"}`
                : "Mohon luangkan waktu 3-5 menit untuk memperbarui data karir, studi, atau wirausaha Anda guna membantu pengembangan kurikulum sekolah."}
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            {isTracerDone ? (
              <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full">
                <Button
                  onClick={onOpenReceipt}
                  variant="secondary"
                  size="md"
                  className="font-bold text-slate-950 w-full flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer text-xs sm:text-sm px-2 sm:px-4 text-center"
                >
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 mr-1" />
                  <span className="truncate">Unduh Bukti</span>
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => onNavigateTab("tracer_study")}
                variant="yellow"
                size="lg"
                className="font-bold text-slate-950 shadow-lg w-full md:w-auto cursor-pointer"
              >
                <span>Isi Kuesioner Sekarang</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Ambient decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-full bg-blue-400/10 blur-3xl pointer-events-none" />
      </div>

      {/* 2. Bagian Statistik matching Wireframe (3 Cards in a row) */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5">
          {/* Stat Card 1: Status Tracer Study */}
          <div
            onClick={() => onNavigateTab("tracer_study")}
            className="uiverse-stat-card group"
            role="button"
            tabIndex={0}
          >
            {/* 100% In-Bounds Ripple Overlay */}
            <div className="card-ripple-bg" />

            <div className="card-content">
              <span className="stat-tag text-xs font-semibold text-slate-500 block mb-2 transition-colors">
                Status Tracer Study
              </span>
              <h4 className="stat-heading text-lg sm:text-xl font-bold text-slate-900 leading-snug transition-colors">
                {isTracerDone ? "Selesai Terjawab" : "Belum Terjawab"}
              </h4>
              <p className="stat-desc text-xs font-light text-slate-600 mt-1.5 transition-colors">
                {isTracerDone
                  ? "Tervalidasi di sistem"
                  : "Wajib diisi sebelum ambil ijazah"}
              </p>
            </div>

            <div className="card-content mt-4 pt-3 border-t border-slate-200/60 group-hover:border-white/20 transition-colors">
              <div className="stat-action text-xs font-bold text-[#0d2346] flex items-center gap-1.5 transition-colors">
                <span>
                  {isTracerDone ? "Buka Form Tracer" : "Lengkapi Sekarang"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <div className="go-corner" title="Tracer Study">
              {isTracerDone ? (
                <Check className="go-icon" strokeWidth={2.5} />
              ) : (
                <AlertCircle className="go-icon" strokeWidth={2.5} />
              )}
            </div>
          </div>

          {/* Stat Card 2: Status Ijazah */}
          <div
            onClick={() => onNavigateTab("cek_ijazah")}
            className="uiverse-stat-card group"
            role="button"
            tabIndex={0}
          >
            {/* 100% In-Bounds Ripple Overlay */}
            <div className="card-ripple-bg" />

            <div className="card-content">
              <span className="stat-tag text-xs font-semibold text-slate-500 block mb-2 transition-colors">
                Status Fisik Ijazah
              </span>
              <h4 className="stat-heading text-lg sm:text-xl font-bold text-slate-900 leading-snug transition-colors">
                Siap Diambil di TU
              </h4>
              <p className="stat-desc text-xs font-light text-slate-600 mt-1.5 transition-colors">
                No. Ijazah: M-SMK/24/0048291
              </p>
            </div>

            <div className="card-content mt-4 pt-3 border-t border-slate-200/60 group-hover:border-white/20 transition-colors">
              <div className="stat-action text-xs font-bold text-[#0d2346] flex items-center gap-1.5 transition-colors">
                <span>Cek Alur Pengambilan</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <div className="go-corner" title="Ijazah Alumni">
              <GraduationCap className="go-icon" />
            </div>
          </div>

          {/* Stat Card 3: Info Loker Terbuka */}
          <div
            onClick={() => onNavigateTab("loker")}
            className="uiverse-stat-card group"
            role="button"
            tabIndex={0}
          >
            {/* 100% In-Bounds Ripple Overlay */}
            <div className="card-ripple-bg" />

            <div className="card-content">
              <span className="stat-tag text-xs font-semibold text-slate-500 block mb-2 transition-colors">
                Lowongan BKK Aktif
              </span>
              <h4 className="stat-heading text-lg sm:text-xl font-bold text-slate-900 leading-snug transition-colors">
                28 Lowongan Baru
              </h4>
              <p className="stat-desc text-xs font-light text-slate-600 mt-1.5 transition-colors">
                Kemitraan DUDI Tangerang Selatan & Jabodetabek
              </p>
            </div>

            <div className="card-content mt-4 pt-3 border-t border-slate-200/60 group-hover:border-white/20 transition-colors">
              <div className="stat-action text-xs font-bold text-[#0d2346] flex items-center gap-1.5 transition-colors">
                <span>Eksplor Lowongan</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <div className="go-corner" title="Lowongan Kerja">
              <Briefcase className="go-icon" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bagian Info Loker matching Wireframe (3 Cards + 'Lihat semua' button) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Info Loker & Magang
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab("loker")}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Lihat semua</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recentJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => onSelectJob(job)}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold">
                    {job.type}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{job.deadline}</span>
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition leading-snug">
                    {job.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 font-medium flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.company}</span>
                  </p>
                </div>

                <p className="text-xs font-light text-slate-700 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{job.location}</span>
                </p>
                <p className="text-xs font-bold text-slate-600 mt-1">
                  {job.salary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600 group-hover:underline">
                  Detail & Lamar ➜
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
