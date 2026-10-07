import React, { useState, useEffect } from "react";
import { useTracerStore } from "@/store/tracerStore";
import { useAuthStore } from "@/store/authStore";
import { TracerIntro } from "./TracerIntro";
import { Stepper } from "./Stepper";
import { Step1Identity } from "./Step1Identity";
import { Step2Status } from "./Step2Status";
import { Step3Details } from "./Step3Details";
import { Step4Evaluation } from "./Step4Evaluation";
import { Step5Review } from "./Step5Review";
import { generateTracerReceiptPdf } from "@/lib/pdfGenerator";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  RefreshCw,
  Lock,
  ArrowRight,
  Download,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface TracerWizardProps {
  onBackToOverview?: () => void;
}

export const TracerWizard: React.FC<TracerWizardProps> = ({
  onBackToOverview,
}) => {
  const {
    currentStep,
    setStep,
    hasStartedSurvey,
    setHasStartedSurvey,
    resetForm,
    isSubmitted,
    lastSubmissionId,
    lastSubmittedAt,
    identitas,
    status_kegiatan,
  } = useTracerStore();
  const { user, isAuthenticated, updateUserTracerStatus } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const stepParam = searchParams.get("step");
  const isTracerDone = isSubmitted || user?.tracerStatus === "SUDAH";

  // Synchronize step with URL search param so browser Back (<) and Forward (>) work seamlessly
  useEffect(() => {
    if (stepParam) {
      const parsed = parseInt(stepParam, 10);
      if (parsed >= 1 && parsed <= 5) {
        setStep(parsed);
        setHasStartedSurvey(true);
      }
    } else {
      setHasStartedSurvey(false);
    }
  }, [stepParam, setStep, setHasStartedSurvey]);

  const goToStep = (newStep: number) => {
    setStep(newStep);
    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev);
      nextParams.set("step", String(newStep));
      return nextParams;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStartSurvey = () => {
    setHasStartedSurvey(true);
    setStep(1);
    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev);
      nextParams.set("step", "1");
      return nextParams;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleShowIntro = () => {
    setHasStartedSurvey(false);
    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev);
      nextParams.delete("step");
      return nextParams;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [demoResetModalOpen, setDemoResetModalOpen] = useState(false);

  // Unduh PDF langsung tanpa preview modal
  const handleDirectDownload = (subId?: string) => {
    const regId =
      subId || lastSubmissionId || user?.submissionId || "2026102498";
    const activeIdent = identitas?.nama_lengkap
      ? identitas
      : {
          nama_lengkap: user?.nama || "Ahmad Dani",
          nisn: user?.nisn || "0051234567",
          nik: user?.nik || "3674012345670001",
          jurusan: user?.jurusan || ("Teknik Komputer dan Jaringan" as any),
          tahun_lulus: user?.tahun_lulus || 2024,
          tahun_masuk: (user?.tahun_lulus || 2024) - 3,
          no_whatsapp: "081298765432",
          email: user?.email || "alumni@example.com",
        };

    generateTracerReceiptPdf({
      submissionId: regId,
      identitas: activeIdent,
      statusKegiatan: status_kegiatan || "KERJA",
      submittedAt:
        lastSubmittedAt || user?.submittedAt || new Date().toISOString(),
    });
  };

  const handleSuccess = (submissionId: string) => {
    // Langsung unduh PDF resmi saat submit sukses
    handleDirectDownload(submissionId);
  };

  const handleDemoReset = () => {
    resetForm();
    useTracerStore.setState({
      isSubmitted: false,
      lastSubmissionId: null,
      lastSubmittedAt: null,
      hasStartedSurvey: false,
      currentStep: 1,
    });
    updateUserTracerStatus("BELUM");
    setDemoResetModalOpen(false);
    setHasStartedSurvey(false);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("step");
      return next;
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  // 1. TAMPILAN TERKUNCI (Single-Submission per Periode Tahunan)
  if (isTracerDone) {
    const formattedDate =
      lastSubmittedAt || user?.submittedAt
        ? new Date(lastSubmittedAt || user?.submittedAt || "").toLocaleString(
            "id-ID",
            {
              dateStyle: "long",
              timeStyle: "short",
            },
          )
        : "26 September 2026, 13:38 WIB";

    return (
      <div className="min-h-screen bg-slate-50/50 py-5 sm:py-10 px-3.5 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-5 sm:space-y-6">
          {/* Locked Status Card */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header Strip */}
            <div className="bg-[#1e293b] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="font-medium text-xs">
                  Tracer Study Periode 2026
                </span>
              </div>
              <span className="text-[11px] font-semibold bg-slate-500/20 text-white border border-slate-500/30 px-2.5 py-0.5 rounded-full">
                Sudah Mengisi
              </span>
            </div>

            <div className="p-5 sm:p-8 space-y-6">
              {/* Success Message Banner */}
              <div className="flex items-start gap-3.5 sm:gap-4 p-4 rounded-xl bg-slate-50/80 border border-slate-200 text-slate-900">
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm sm:text-base">
                    Pengisian Kuesioner Tracer Study Anda Sudah Tersimpan
                  </h3>
                  <p className="text-xs font-normal sm:text-sm text-slate-800/90 leading-relaxed">
                    Terima kasih atas partisipasi Anda.
                  </p>
                  <hr />
                  <p className="text-xs font-light sm:text-sm text-slate-800/90 text-justify leading-relaxed">
                    Sesuai regulasi penelusuran tamatan Kemendikdasmen RI & BKK
                    SMK Sasmita Jaya 2, pengisian instrumen kuesioner dibatasi{" "}
                    <strong>1 (satu) kali per periode tahun ajaran</strong> guna
                    menjaga integritas data statistik sekolah.
                  </p>
                </div>
              </div>

              {/* Data Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 sm:p-5 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold mb-0.5">
                    Nomor Registrasi Resmi
                  </span>
                  <span className="font-mono font-semibold text-blue-700 text-sm">
                    {lastSubmissionId || user?.submissionId || "2026102498"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold mb-0.5">
                    Waktu Pengisian
                  </span>
                  <span className="font-semibold text-slate-800">
                    {formattedDate}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold mb-0.5">
                    Nama Alumni & NISN
                  </span>
                  <span className="font-semibold text-slate-800">
                    {user?.nama || "Ahmad Dani"} ({user?.nisn || "0051234567"})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold mb-0.5">
                    Jurusan & Tahun Lulus
                  </span>
                  <span className="font-semibold text-slate-800">
                    {user?.jurusan || "Teknik Komputer dan Jaringan"} (
                    {user?.tahun_lulus || 2024})
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
                <Button
                  onClick={() => handleDirectDownload()}
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto bg-[#0d2346] hover:bg-[#163868] font-medium flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4 mr-1.5" />
                  <span>Unduh Bukti Pengisian</span>
                </Button>

                {onBackToOverview ? (
                  <Button
                    onClick={onBackToOverview}
                    variant="outline"
                    size="md"
                    className="w-full sm:w-auto"
                  >
                    <span>Kembali ke Dashboard</span>
                  </Button>
                ) : (
                  <Button
                    onClick={() => navigate("/dashboard")}
                    variant="outline"
                    size="md"
                    className="w-full sm:w-auto"
                  >
                    <span>Kembali ke Dashboard</span>
                  </Button>
                )}
              </div>

              {/* Demo Mode Testing Box */}
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                <div className="flex items-start gap-2.5">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-medium text-amber-950">
                      Mode Pengujian Demo
                    </h4>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      Ingin mendemokan alur pengisian kuisioner 5 langkah dari
                      awal? Anda dapat mereset status pengisian pada sesi demo
                      ini.
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => setDemoResetModalOpen(true)}
                  variant="outline"
                  size="sm"
                  className="bg-white hover:bg-amber-100/60 border-amber-300 text-amber-900 text-xs shrink-0 font-semibold cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1" />
                  <span>Uji Coba Isi Ulang (Demo)</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Reset Confirm Modal */}
        <ConfirmModal
          isOpen={demoResetModalOpen}
          onClose={() => setDemoResetModalOpen(false)}
          onConfirm={handleDemoReset}
          title="Izinkan Pengisian Ulang (Mode Demo)?"
          message="Status kuesioner tahun 2026 akan direset menjadi 'Belum Mengisi' agar Anda dapat mendemokan pengisian 5 langkah formulir Tracer Study kembali."
          confirmText="Ya, Buka Form Pengisian"
          cancelText="Batal"
          type="info"
        />
      </div>
    );
  }

  // 2. TAMPILAN PENGANTAR (sebelum klik MULAI SURVEY)
  if (!hasStartedSurvey) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-5 sm:py-10 px-3.5 sm:px-6 lg:px-8">
        <TracerIntro onStart={handleStartSurvey} onBack={onBackToOverview} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-5 sm:py-10 px-3.5 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Top Breadcrumb & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleShowIntro}
              className="text-xs font-medium text-slate-500 hover:text-blue-600 transition cursor-pointer"
              title="Lihat teks pengantar tracer study"
            >
              Baca Pengantar
            </button>

            <button
              type="button"
              onClick={() => setResetModalOpen(true)}
              className="text-xs text-slate-400 hover:text-rose-600 transition cursor-pointer"
            >
              Reset Isian
            </button>
          </div>
        </div>

        {/* Unified Portal Container Card matching Dapodik screenshot */}
        <div className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-sm">
          {/* Step Tabs Bar */}
          <Stepper currentStep={currentStep} />

          {/* Form Step Body */}
          <div className="p-5 sm:p-8 md:p-10 bg-white">
            {currentStep === 1 && <Step1Identity onNext={() => goToStep(2)} />}
            {currentStep === 2 && (
              <Step2Status
                onNext={() => goToStep(3)}
                onPrev={() => goToStep(1)}
              />
            )}
            {currentStep === 3 && (
              <Step3Details
                onNext={() => goToStep(4)}
                onPrev={() => goToStep(2)}
              />
            )}
            {currentStep === 4 && (
              <Step4Evaluation
                onNext={() => goToStep(5)}
                onPrev={() => goToStep(3)}
              />
            )}
            {currentStep === 5 && (
              <Step5Review
                onPrev={() => goToStep(4)}
                onSuccess={(subId) => handleSuccess(subId)}
              />
            )}
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-slate-400">
          Dilindungi standar kerahasiaan data alumni • Yayasan Sasmita Jaya
          Pamulang
        </p>
      </div>

      {/* Reset Form Confirmation Modal */}
      <ConfirmModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={resetForm}
        title="Atur Ulang Formulir Tracer Study?"
        message="Semua isian formulir yang tersimpan sementara di perangkat Anda akan dihapus dan dikembalikan ke awal."
        confirmText="Ya, Reset Isian"
        cancelText="Batal"
        type="warning"
      />
    </div>
  );
};
