import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { MOCK_YEARLY_TRACER_DATA } from "@/lib/mockData";
import { JurusanYearlyStat } from "@/types/tracer";
import { CustomSelect } from "@/components/ui/CustomSelect";

const JURUSAN_OPTIONS_MAP = [
  { id: "ALL", name: "Semua Jurusan (Total Global)", code: "Semua" },
  { id: "tpm", name: "Teknik Pemesinan (TPM)", code: "TPM" },
  { id: "titl", name: "Teknik Instalasi Tenaga Listrik (TITL)", code: "TITL" },
  { id: "el", name: "Teknik Elektronika Industri (EL)", code: "EL" },
  { id: "tkro", name: "Teknik Kendaraan Ringan Otomotif (TKRO)", code: "TKRO" },
  { id: "tbsm", name: "Teknik dan Bisnis Sepeda Motor (TBSM)", code: "TBSM" },
  { id: "tkj", name: "Teknik Komputer dan Jaringan (TKJ)", code: "TKJ" },
];

const YEAR_OPTIONS = [
  { value: "ALL", label: "Semua Tahun (Akumulatif 2022 - 2025)" },
  { value: "2025", label: "Tahun Lulus 2025" },
  { value: "2024", label: "Tahun Lulus 2024" },
  { value: "2023", label: "Tahun Lulus 2023" },
  { value: "2022", label: "Tahun Lulus 2022" },
];

export const ReportSection: React.FC = () => {
  const navigate = useNavigate();

  // 1. Filter States (2 Dropdowns)
  const [selectedYear, setSelectedYear] = useState<string>("ALL");
  const [selectedJurusan, setSelectedJurusan] = useState<string>("ALL");

  // Filter raw data by year
  const rawFilteredByYear = useMemo(() => {
    if (selectedYear === "ALL") {
      return MOCK_YEARLY_TRACER_DATA;
    }
    const y = parseInt(selectedYear, 10);
    return MOCK_YEARLY_TRACER_DATA.filter((item) => item.year === y);
  }, [selectedYear]);

  // Table Data Grouped by Jurusan (TPM, TITL, EL, TKRO, TBSM, TKJ)
  const tableRows = useMemo(() => {
    const majors: JurusanYearlyStat["jurusanId"][] = [
      "tpm",
      "titl",
      "el",
      "tkro",
      "tbsm",
      "tkj",
    ];

    return majors.map((jId) => {
      const matching = rawFilteredByYear.filter(
        (item) => item.jurusanId === jId,
      );
      const totalAlumni = matching.reduce(
        (acc, curr) => acc + curr.totalAlumni,
        0,
      );
      const mengisiTracer = matching.reduce(
        (acc, curr) => acc + curr.mengisiTracer,
        0,
      );
      const bekerja = matching.reduce((acc, curr) => acc + curr.bekerja, 0);
      const kuliah = matching.reduce((acc, curr) => acc + curr.kuliah, 0);
      const wirausaha = matching.reduce((acc, curr) => acc + curr.wirausaha, 0);
      const belumKerja = matching.reduce(
        (acc, curr) => acc + curr.belumKerja,
        0,
      );

      const sample = matching[0] || {
        jurusanCode: jId.toUpperCase(),
        jurusanName: jId,
      };

      const tracerPercent =
        totalAlumni > 0
          ? ((mengisiTracer / totalAlumni) * 100).toFixed(1)
          : "0";

      return {
        id: jId,
        code: sample.jurusanCode,
        name: sample.jurusanName,
        totalAlumni,
        mengisiTracer,
        tracerPercent,
        bekerja,
        kuliah,
        wirausaha,
        belumKerja,
      };
    });
  }, [rawFilteredByYear]);

  // Total Summary Row
  const totalSummary = useMemo(() => {
    const totalAlumni = tableRows.reduce(
      (acc, curr) => acc + curr.totalAlumni,
      0,
    );
    const mengisiTracer = tableRows.reduce(
      (acc, curr) => acc + curr.mengisiTracer,
      0,
    );
    const bekerja = tableRows.reduce((acc, curr) => acc + curr.bekerja, 0);
    const kuliah = tableRows.reduce((acc, curr) => acc + curr.kuliah, 0);
    const wirausaha = tableRows.reduce((acc, curr) => acc + curr.wirausaha, 0);
    const belumKerja = tableRows.reduce(
      (acc, curr) => acc + curr.belumKerja,
      0,
    );
    const tracerPercent =
      totalAlumni > 0 ? ((mengisiTracer / totalAlumni) * 100).toFixed(1) : "0";

    return {
      totalAlumni,
      mengisiTracer,
      tracerPercent,
      bekerja,
      kuliah,
      wirausaha,
      belumKerja,
    };
  }, [tableRows]);

  // Aggregated Stats for the 3 Charts
  const chartStats = useMemo(() => {
    const targetData = rawFilteredByYear.filter((item) => {
      if (selectedJurusan === "ALL") return true;
      return item.jurusanId === selectedJurusan;
    });

    const totalResponden = targetData.reduce(
      (acc, curr) => acc + curr.mengisiTracer,
      0,
    );
    const bekerja = targetData.reduce((acc, curr) => acc + curr.bekerja, 0);
    const kuliah = targetData.reduce((acc, curr) => acc + curr.kuliah, 0);
    const wirausaha = targetData.reduce((acc, curr) => acc + curr.wirausaha, 0);
    const belumKerja = targetData.reduce(
      (acc, curr) => acc + curr.belumKerja,
      0,
    );

    const sangatSesuai = targetData.reduce(
      (acc, curr) => acc + curr.kesesuaian.sangatSesuai,
      0,
    );
    const sesuai = targetData.reduce(
      (acc, curr) => acc + curr.kesesuaian.sesuai,
      0,
    );
    const kurangSesuai = targetData.reduce(
      (acc, curr) => acc + curr.kesesuaian.kurangSesuai,
      0,
    );
    const tidakSesuai = targetData.reduce(
      (acc, curr) => acc + curr.kesesuaian.tidakSesuai,
      0,
    );

    const lokal = targetData.reduce(
      (acc, curr) => acc + curr.skalaKerja.lokal,
      0,
    );
    const nasional = targetData.reduce(
      (acc, curr) => acc + curr.skalaKerja.nasional,
      0,
    );
    const multinasional = targetData.reduce(
      (acc, curr) => acc + curr.skalaKerja.multinasional,
      0,
    );
    const skalaWirausaha = targetData.reduce(
      (acc, curr) => acc + curr.skalaKerja.wirausaha,
      0,
    );

    const calcPct = (num: number, denom: number) => {
      if (!denom || denom === 0) return 0;
      return parseFloat(((num / denom) * 100).toFixed(1));
    };

    const totalKesesuaian = sangatSesuai + sesuai + kurangSesuai + tidakSesuai;
    const totalSkala = lokal + nasional + multinasional + skalaWirausaha;

    return {
      totalResponden,
      aktivitas: {
        bekerja: { count: bekerja, percent: calcPct(bekerja, totalResponden) },
        kuliah: { count: kuliah, percent: calcPct(kuliah, totalResponden) },
        wirausaha: {
          count: wirausaha,
          percent: calcPct(wirausaha, totalResponden),
        },
        belumKerja: {
          count: belumKerja,
          percent: calcPct(belumKerja, totalResponden),
        },
      },
      kesesuaian: {
        sangatSesuai: {
          count: sangatSesuai,
          percent: calcPct(sangatSesuai, totalKesesuaian),
        },
        sesuai: { count: sesuai, percent: calcPct(sesuai, totalKesesuaian) },
        kurangSesuai: {
          count: kurangSesuai,
          percent: calcPct(kurangSesuai, totalKesesuaian),
        },
        tidakSesuai: {
          count: tidakSesuai,
          percent: calcPct(tidakSesuai, totalKesesuaian),
        },
        totalLinear: calcPct(sangatSesuai + sesuai, totalKesesuaian),
      },
      skalaKerja: {
        lokal: { count: lokal, percent: calcPct(lokal, totalSkala) },
        nasional: { count: nasional, percent: calcPct(nasional, totalSkala) },
        multinasional: {
          count: multinasional,
          percent: calcPct(multinasional, totalSkala),
        },
        wirausaha: {
          count: skalaWirausaha,
          percent: calcPct(skalaWirausaha, totalSkala),
        },
      },
    };
  }, [rawFilteredByYear, selectedJurusan]);

  const activeJurusanObj =
    JURUSAN_OPTIONS_MAP.find((j) => j.id === selectedJurusan) ||
    JURUSAN_OPTIONS_MAP[0];
  const activeYearLabel =
    YEAR_OPTIONS.find((y) => y.value === selectedYear)?.label || selectedYear;

  return (
    <section id="laporan" className="relative py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#182a4a] tracking-tight">
            Statistik Keterserapan Lulusan
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
            Data ketercapaian alumni SMK Sasmita Jaya 2 dalam dunia kerja,
            pendidikan tinggi, dan wirausaha mandiri yang diperbarui secara
            berkala.
          </p>
        </div>

        {/* 2. Tiga Chart Inti (Baku Standar Tracer Yayasan) */}
        <div className="bg-white border border-slate-200 shadow-xs grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
          {/* Chart 1: Laju Serap Donut Chart */}
          <div className="p-5 sm:p-6  flex flex-col justify-between">
            <div>
              <div className="pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Laju Serap & Aktivitas
                </h3>
              </div>

              {/* Donut Graphic */}
              <div className="relative flex items-center justify-center my-4">
                <svg
                  className="w-40 h-40 transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="text-slate-100 stroke-current"
                    strokeWidth="14"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#182a4a"
                    strokeWidth="14"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset={
                      251.2 -
                      (251.2 * chartStats.aktivitas.bekerja.percent) / 100
                    }
                    strokeLinecap="butt"
                    className="transition-all duration-700"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#3b82f6"
                    strokeWidth="14"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset={
                      251.2 -
                      (251.2 *
                        (chartStats.aktivitas.bekerja.percent +
                          chartStats.aktivitas.kuliah.percent)) /
                        100
                    }
                    style={{
                      transformOrigin: "center",
                      transform: `rotate(${(chartStats.aktivitas.bekerja.percent / 100) * 360}deg)`,
                    }}
                    strokeLinecap="butt"
                    className="transition-all duration-700"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#64748b"
                    strokeWidth="14"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset={
                      251.2 -
                      (251.2 *
                        (chartStats.aktivitas.bekerja.percent +
                          chartStats.aktivitas.kuliah.percent +
                          chartStats.aktivitas.wirausaha.percent)) /
                        100
                    }
                    style={{
                      transformOrigin: "center",
                      transform: `rotate(${
                        ((chartStats.aktivitas.bekerja.percent +
                          chartStats.aktivitas.kuliah.percent) /
                          100) *
                        360
                      }deg)`,
                    }}
                    strokeLinecap="butt"
                    className="transition-all duration-700"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-2xl font-black text-slate-900 leading-none">
                    {chartStats.aktivitas.bekerja.percent}%
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
                    Bekerja
                  </span>
                </div>
              </div>

              {/* Legends */}
              <div className="space-y-2 mt-4 text-xs">
                <div className="flex items-center justify-between p-2 ">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#182a4a]" />
                    <span className="font-semibold text-slate-800">
                      Bekerja
                    </span>
                  </div>
                  <span className="font-bold text-[#182a4a]">
                    {chartStats.aktivitas.bekerja.percent}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 ">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
                    <span className="font-semibold text-slate-800">Kuliah</span>
                  </div>
                  <span className="font-bold text-slate-900">
                    {chartStats.aktivitas.kuliah.percent}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 ">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#64748b]" />
                    <span className="font-semibold text-slate-800">
                      Wirausaha
                    </span>
                  </div>
                  <span className="font-bold text-slate-900">
                    {chartStats.aktivitas.wirausaha.percent}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 ">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <span className="font-semibold text-slate-800">
                      Belum Kerja
                    </span>
                  </div>
                  <span className="font-bold text-slate-900">
                    {chartStats.aktivitas.belumKerja.percent}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Chart 2: Linieritas / Kesesuaian Bidang Kerja */}
          <div className="p-5 sm:p-6  flex flex-col justify-between">
            <div>
              <div className="pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Kesesuaian Bidang Kerja
                </h3>
              </div>

              <div className="p-4 text-center my-2">
                <div className="text-3xl font-black text-[#182a4a] mt-1">
                  {chartStats.kesesuaian.totalLinear}%
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Bekerja relevan dengan kompetensi keahlian kejuruan
                </p>
              </div>

              <div className="space-y-3 mt-4 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-800">Sangat Sesuai</span>
                    <span className="text-slate-900 font-bold">
                      {chartStats.kesesuaian.sangatSesuai.percent}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#182a4a] rounded-full"
                      style={{
                        width: `${chartStats.kesesuaian.sangatSesuai.percent}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-800">Sesuai</span>
                    <span className="text-slate-900 font-bold">
                      {chartStats.kesesuaian.sesuai.percent}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{
                        width: `${chartStats.kesesuaian.sesuai.percent}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-800">Kurang Sesuai</span>
                    <span className="text-slate-900 font-bold">
                      {chartStats.kesesuaian.kurangSesuai.percent}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-500 rounded-full"
                      style={{
                        width: `${chartStats.kesesuaian.kurangSesuai.percent}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-800">Tidak Sesuai</span>
                    <span className="text-slate-900 font-bold">
                      {chartStats.kesesuaian.tidakSesuai.percent}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-300 rounded-full"
                      style={{
                        width: `${chartStats.kesesuaian.tidakSesuai.percent}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart 3: Skala & Sektor Tempat Kerja */}
          <div className="p-5 sm:p-6  flex flex-col justify-between">
            <div>
              <div className="pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Sektor & Skala Kerja
                </h3>
              </div>

              <div className="space-y-3 mt-2">
                <div className="p-2.5 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800">
                      Nasional / BUMN
                    </span>
                    <span className="font-extrabold text-[#182a4a]">
                      {chartStats.skalaKerja.nasional.percent}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#182a4a] rounded-full"
                      style={{
                        width: `${chartStats.skalaKerja.nasional.percent}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="p-2.5 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800">
                      Lokal / Wilayah
                    </span>
                    <span className="font-extrabold text-slate-900">
                      {chartStats.skalaKerja.lokal.percent}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{
                        width: `${chartStats.skalaKerja.lokal.percent}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="p-2.5 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800">
                      Multinasional / Global
                    </span>
                    <span className="font-extrabold text-slate-900">
                      {chartStats.skalaKerja.multinasional.percent}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-600 rounded-full"
                      style={{
                        width: `${chartStats.skalaKerja.multinasional.percent}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="p-2.5 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800">
                      Wirausaha / Mandiri
                    </span>
                    <span className="font-extrabold text-slate-900">
                      {chartStats.skalaKerja.wirausaha.percent}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-400 rounded-full"
                      style={{
                        width: `${chartStats.skalaKerja.wirausaha.percent}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/laporan")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#182a4a] hover:bg-[#122038] text-white font-semibold text-xs shadow-md transition active:scale-95 cursor-pointer self-start sm:self-auto hover:scale-105"
          >
            <span>Buka Halaman Laporan Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
