import React from "react";
import { JurusanReportBreakdown } from "./exportBuilders";

interface OfficialReportPrintDocProps {
  settings: {
    namaSekolah: string;
    npsn: string;
    alamatSekolah: string;
    kontakBkk: string;
    targetYear: number;
    targetQuota: number;
    kepalaSekolah: string;
    nipKepalaSekolah: string;
    ketuaBkk: string;
    nipKetuaBkk: string;
  };
  totalMaster: number;
  totalResponden: number;
  countKerja: number;
  countKuliah: number;
  countWirausaha: number;
  countBelumKerja: number;
  percentKerja: string;
  percentKuliah: string;
  percentWirausaha: string;
  percentBelumKerja: string;
  jurusanBreakdown: JurusanReportBreakdown[];
  currentDateFormatted: string;
}

export const OfficialReportPrintDoc: React.FC<OfficialReportPrintDocProps> = ({
  settings,
  totalMaster,
  totalResponden,
  countKerja,
  countKuliah,
  countWirausaha,
  countBelumKerja,
  percentKerja,
  percentKuliah,
  percentWirausaha,
  percentBelumKerja,
  jurusanBreakdown,
  currentDateFormatted,
}) => {
  return (
    <div
      id="official-report-printable-doc"
      className="hidden print:block p-8 text-slate-900 font-serif leading-relaxed bg-white"
    >
      {/* Official Letterhead (KOP SURAT RESMI) */}
      <div className="flex items-center justify-between pb-4 border-b-4 border-double border-slate-900 gap-4">
        <img
          src="/logo-smk.png"
          alt="Logo SMK Sasmita Jaya 2"
          className="h-24 w-auto object-contain shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/logo smk sasmita.png";
          }}
        />
        <div className="text-center flex-1 font-sans">
          <h4 className="text-xs sm:text-sm font-bold tracking-wider text-slate-700 uppercase">
            Yayasan Sasmita Jaya
          </h4>
          <h2 className="text-base sm:text-xl font-extrabold tracking-tight text-slate-950 uppercase">
            {settings.namaSekolah}
          </h2>
          <p className="text-[11px] text-slate-600 font-medium">
            NPSN: {settings.npsn} • Akreditasi A Unggul
          </p>
          <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
            {settings.alamatSekolah} • Telp: {settings.kontakBkk}
          </p>
        </div>
        <div className="w-20" />
      </div>

      {/* Document Title */}
      <div className="text-center my-6 font-sans">
        <h3 className="text-sm sm:text-base font-extrabold uppercase underline tracking-wide">
          LAPORAN HASIL PENELUSURAN LULUSAN (TRACER STUDY)
        </h3>
        <p className="text-xs font-semibold text-slate-600 mt-1">
          TAHUN KELULUSAN {settings.targetYear} • PERIODE PENGUMPULAN DATA TAHUN 2026
        </p>
      </div>

      {/* Ringkasan Eksekutif */}
      <div className="space-y-4 text-xs font-sans">
        <p className="text-justify leading-relaxed">
          Berdasarkan hasil penelusuran lulusan yang diselenggarakan oleh
          Bursa Kerja Khusus (BKK) SMK Sasmita Jaya 2 terhadap alumni tahun
          kelulusan <strong>{settings.targetYear}</strong>, berikut adalah
          rekapitulasi data keterserapan dan aktivitas alumni:
        </p>

        {/* Matrix Quick Numbers */}
        <div className="grid grid-cols-4 gap-2 text-center my-3">
          <div className="border border-slate-300 p-2.5 rounded bg-slate-50/50">
            <span className="text-[10px] text-slate-500 block uppercase font-semibold">
              Total Target Lulusan
            </span>
            <span className="text-lg font-bold text-slate-900">
              {settings.targetQuota} Siswa
            </span>
          </div>
          <div className="border border-slate-300 p-2.5 rounded bg-slate-50/50">
            <span className="text-[10px] text-slate-500 block uppercase font-semibold">
              Kuesioner Terisi
            </span>
            <span className="text-lg font-bold text-slate-900">
              {totalResponden} Siswa
            </span>
          </div>
          <div className="border border-slate-300 p-2.5 rounded bg-slate-50/50">
            <span className="text-[10px] text-slate-500 block uppercase font-semibold">
              Tingkat Pengisian
            </span>
            <span className="text-lg font-bold text-emerald-700">
              {((totalResponden / (settings.targetQuota || 1)) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="border border-slate-300 p-2.5 rounded bg-slate-50/50">
            <span className="text-[10px] text-slate-500 block uppercase font-semibold">
              Keterserapan Lulusan
            </span>
            <span className="text-lg font-bold text-[#0d2346]">
              {(
                Number(percentKerja) +
                Number(percentKuliah) +
                Number(percentWirausaha)
              ).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Table 1: Rekapitulasi per Jurusan */}
        <div>
          <h5 className="font-bold text-xs uppercase mb-1.5 text-slate-800">
            1. Rekapitulasi Pengisian per Program Keahlian
          </h5>
          <table className="w-full border-collapse border border-slate-400 text-center text-[11px]">
            <thead className="bg-slate-100 font-semibold">
              <tr>
                <th className="border border-slate-400 p-1.5">No</th>
                <th className="border border-slate-400 p-1.5 text-left">
                  Program Keahlian
                </th>
                <th className="border border-slate-400 p-1.5">Total Alumni</th>
                <th className="border border-slate-400 p-1.5">Isian Masuk</th>
                <th className="border border-slate-400 p-1.5">Bekerja</th>
                <th className="border border-slate-400 p-1.5">Kuliah</th>
                <th className="border border-slate-400 p-1.5">Wirausaha</th>
                <th className="border border-slate-400 p-1.5">Mencari Kerja</th>
                <th className="border border-slate-400 p-1.5">Persentase</th>
              </tr>
            </thead>
            <tbody>
              {jurusanBreakdown.map((item, idx) => (
                <tr key={item.code} className="hover:bg-slate-50">
                  <td className="border border-slate-400 p-1">{idx + 1}</td>
                  <td className="border border-slate-400 p-1 text-left font-medium">
                    {item.name} ({item.code})
                  </td>
                  <td className="border border-slate-400 p-1">{item.total}</td>
                  <td className="border border-slate-400 p-1 font-semibold">
                    {item.filled}
                  </td>
                  <td className="border border-slate-400 p-1">{item.kerja}</td>
                  <td className="border border-slate-400 p-1">{item.kuliah}</td>
                  <td className="border border-slate-400 p-1">{item.usaha}</td>
                  <td className="border border-slate-400 p-1">{item.belum}</td>
                  <td className="border border-slate-400 p-1 font-semibold">
                    {item.responseRate}%
                  </td>
                </tr>
              ))}
              <tr className="bg-slate-100 font-bold">
                <td
                  colSpan={2}
                  className="border border-slate-400 p-1 text-center"
                >
                  TOTAL KESELURUHAN
                </td>
                <td className="border border-slate-400 p-1">{totalMaster}</td>
                <td className="border border-slate-400 p-1">{totalResponden}</td>
                <td className="border border-slate-400 p-1">{countKerja}</td>
                <td className="border border-slate-400 p-1">{countKuliah}</td>
                <td className="border border-slate-400 p-1">{countWirausaha}</td>
                <td className="border border-slate-400 p-1">{countBelumKerja}</td>
                <td className="border border-slate-400 p-1">
                  {((totalResponden / (totalMaster || 1)) * 100).toFixed(1)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Table 2: Distribusi Aktivitas Global */}
        <div className="pt-2">
          <h5 className="font-bold text-xs uppercase mb-1.5 text-slate-800">
            2. Distribusi Aktivitas Alumni (Bekerja, Kuliah, Wirausaha)
          </h5>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 border border-slate-300 rounded bg-slate-50">
              <span className="font-medium text-slate-700 block">
                Bekerja di Instansi / Perusahaan
              </span>
              <span className="text-base font-bold text-slate-900">
                {countKerja} ({percentKerja}%)
              </span>
            </div>
            <div className="p-2 border border-slate-300 rounded bg-slate-50">
              <span className="font-medium text-slate-700 block">
                Melanjutkan Kuliah
              </span>
              <span className="text-base font-bold text-slate-900">
                {countKuliah} ({percentKuliah}%)
              </span>
            </div>
            <div className="p-2 border border-slate-300 rounded bg-slate-50">
              <span className="font-medium text-slate-700 block">
                Wirausaha Mandiri
              </span>
              <span className="text-base font-bold text-slate-900">
                {countWirausaha} ({percentWirausaha}%)
              </span>
            </div>
            <div className="p-2 border border-slate-300 rounded bg-slate-50">
              <span className="font-medium text-slate-700 block">
                Sedang Mencari Kerja
              </span>
              <span className="text-base font-bold text-slate-900">
                {countBelumKerja} ({percentBelumKerja}%)
              </span>
            </div>
          </div>
        </div>

        {/* Catatan Penutup */}
        <p className="text-justify leading-relaxed pt-2">
          Data ini telah melalui proses verifikasi dan validasi oleh pengelola
          Bursa Kerja Khusus (BKK) SMK Sasmita Jaya 2, serta dapat digunakan
          sebagai dokumen pelaporan resmi sekolah.
        </p>
      </div>

      {/* Signature Block (TANDA TANGAN RESMI) */}
      <div className="mt-10 pt-6 grid grid-cols-2 gap-8 text-center text-xs font-sans">
        <div>
          <p className="font-medium text-slate-600">Mengetahui,</p>
          <p className="font-bold text-slate-900">
            Kepala SMK Sasmita Jaya 2
          </p>
          <div className="h-20 flex items-center justify-center">
            <span className="text-[10px] text-slate-400 italic">
              (Tanda Tangan & Cap Sekolah)
            </span>
          </div>
          <p className="font-bold text-slate-950 underline">
            {settings.kepalaSekolah}
          </p>
          <p className="text-[10px] text-slate-600 font-mono">
            NIP. {settings.nipKepalaSekolah}
          </p>
        </div>

        <div>
          <p className="font-medium text-slate-600">
            Pamulang, {currentDateFormatted}
          </p>
          <p className="font-bold text-slate-900">
            Ketua Bursa Kerja Khusus (BKK)
          </p>
          <div className="h-20 flex items-center justify-center">
            <span className="text-[10px] text-slate-400 italic">
              (Tanda Tangan)
            </span>
          </div>
          <p className="font-bold text-slate-950 underline">
            {settings.ketuaBkk}
          </p>
          <p className="text-[10px] text-slate-600 font-mono">
            NIP. {settings.nipKetuaBkk}
          </p>
        </div>
      </div>
    </div>
  );
};

