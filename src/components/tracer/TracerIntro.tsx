import React from "react";
import { Link } from "react-router-dom";

interface TracerIntroProps {
  onStart: () => void;
  onBack?: () => void;
}

export const TracerIntro: React.FC<TracerIntroProps> = ({
  onStart,
  onBack,
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Top Navigation */}
      <div className="mb-4 sm:mb-5">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-blue-600 transition cursor-pointer"
          >
            ← Kembali ke Beranda
          </button>
        ) : (
          <Link
            to="/dashboard"
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-blue-600 transition"
          >
            ← Kembali ke Beranda
          </Link>
        )}
      </div>

      {/* Main Official Intro Card */}
      <div className="bg-white rounded-lg sm:rounded-xl border border-slate-200/90 shadow-sm p-6 sm:p-10 md:p-12 text-slate-800">
        {/* Header Title */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-medium text-slate-900 text-center mb-6 sm:mb-8 tracking-tight">
          Pengantar bagi Alumni SMK
        </h1>
        <hr />

        {/* Content Body */}
        <div className="space-y-6 text-sm sm:text-base leading-relaxed text-slate-700">
          {/* Paragraph 1 */}
          <p className="text-justify sm:text-left">
            Selamat, Anda terpilih sebagai responden dalam survey penelusuran
            lulusan (<em>tracer study</em>) pendidikan vokasi yang
            diselenggarakan oleh Direktorat Sekolah Menengah Kejuruan,
            Kementerian Pendidikan Dasar dan Menengah (Kemendikdasmen).
          </p>

          {/* Section 1: Tujuan */}
          <div className="space-y-2.5">
            <h2 className="font-medium text-slate-900 text-sm sm:text-base">
              Tujuan dari tracer study adalah untuk:
            </h2>
            <div className="space-y-1.5 pl-1 sm:pl-2">
              <div className="flex items-start gap-2.5">
                <span className="font-medium text-slate-600 shrink-0">1)</span>
                <span>
                  mengetahui keterserapan lulusan pendidikan vokasi ke dunia
                  kerja atau melanjutkan pendidikan;
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="font-medium text-slate-600 shrink-0">2)</span>
                <span>
                  mendapatkan informasi umpan balik dari lulusan untuk
                  meningkatkan kualitas program pendidikan dan pelatihan vokasi;
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="font-medium text-slate-600 shrink-0">3)</span>
                <span>
                  mendapatkan informasi tentang ketenagakerjaan dan dunia
                  industri pada level lokal dan nasional;
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="font-medium text-slate-600 shrink-0">4)</span>
                <span>
                  mendapatkan informasi kompetensi (hard skills dan soft skills)
                  yang dibutuhkan industri lokal dan nasional;
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="font-medium text-slate-600 shrink-0">5)</span>
                <span>
                  memetakan kinerja satuan pendidikan vokasi dalam pelaksanaan
                  program pendidikan dan pelatihan vokasi.
                </span>
              </div>
            </div>
          </div>

          {/* Paragraph 2 */}
          <p className="text-justify sm:text-left">
            Kami mengharapkan partisipasi Anda selaku lulusan pendidikan vokasi
            untuk memberikan data dan informasi terkait dengan kegiatan anda
            setelah kelulusan. Informasi yang diberikan sangat bermanfaat bagi
            Kementerian Pendidikan, Kebudayaan, Riset dan Teknologi untuk
            perbaikan kebijakan terkait dengan penyelenggaraan pendidikan vokasi
            di tingkat pusat dan daerah. Bagi satuan pendidikan, tracer study
            bermanfaat sebagai dasar pertimbangan dalam perbaikan kurikulum dan
            sistem pembelajaran.
          </p>

          {/* Section 2: Petunjuk Pengisian */}
          <div className="space-y-2.5 pt-2">
            <h2 className="font-medium text-slate-900 text-sm sm:text-base">
              Petunjuk Pengisian
            </h2>
            <div className="space-y-1.5 pl-1 sm:pl-2">
              <div className="flex items-start gap-2.5">
                <span className="font-medium text-slate-600 shrink-0">1.</span>
                <span>
                  Isilah data identitas Anda dengan lengkap dan benar.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="font-medium text-slate-600 shrink-0">2.</span>
                <span>
                  Jawab pertanyaan-pertanyaan dalam instrumen ini dengan cara
                  meng-klik tombol di samping jawaban yang sesuai dengan keadaan
                  sebenarnya.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="font-medium text-slate-600 shrink-0">3.</span>
                <span>
                  Aplikasi ini secara otomatis akan mengarahkan Anda pada
                  pertanyaan berikut setelah pertanyaan yang muncul sebelumnya
                  Anda jawab.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Button */}
        <div className="mt-8 sm:mt-10 flex justify-center">
          <button
            type="button"
            onClick={onStart}
            className="px-8 sm:px-10 py-3 sm:py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm tracking-wider  rounded-md shadow hover:shadow-md transition-all active:scale-[0.99] cursor-pointer"
          >
            Mulai Survey
          </button>
        </div>
      </div>

      {/* Footer Note */}
      <p className="text-center text-xs text-slate-400 mt-4 sm:mt-6">
        Dilindungi standar kerahasiaan data alumni • Yayasan Sasmita Jaya
        Pamulang
      </p>
    </div>
  );
};
