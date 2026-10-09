import React, { useState } from "react";
import { useAdminStore } from "@/store/adminStore";
import { exportJsonToExcel } from "@/lib/excelExport";
import {
  FileSpreadsheet,
  Download,
  CheckCircle2,
  FileDown,
  Table,
} from "lucide-react";

const SolidFileSpreadsheetIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5 text-[#0d2346]",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zm-5 4h3v2H8v-2zm5 0h3v2h-3v-2zm-5 4h3v2H8v-2zm5 0h3v2h-3v-2z" />
  </svg>
);

export const AdminExportReportTab: React.FC = () => {
  const { masterAlumni, respondents, settings } = useAdminStore();
  const [selectedFormat, setSelectedFormat] = useState<
    "ditjen_vokasi" | "master_lengkap" | "rekap_bmw"
  >("ditjen_vokasi");
  const [downloadSuccess, setDownloadSuccess] = useState("");

  const showDownloadToast = (msg: string) => {
    setDownloadSuccess(msg);
    setTimeout(() => setDownloadSuccess(""), 4000);
  };

  // 1. Export Direct to Native Excel (.xlsx)
  const handleExportExcel = () => {
    let filename = "";
    let sheetName = "";
    let dataRows: Record<string, any>[] = [];

    if (selectedFormat === "ditjen_vokasi") {
      filename = `export_tracer_vokasi_smk_sasmita2_${settings.targetYear}.xlsx`;
      sheetName = "Tracer Study Vokasi";
      dataRows = respondents.map((r) => {
        const payload = r.fullPayload;
        const kerja = payload.detail_kerja;
        const kuliah = payload.detail_kuliah;
        const usaha = payload.detail_usaha;

        const instansi =
          kerja?.nama_perusahaan ||
          kuliah?.nama_kampus ||
          usaha?.nama_usaha ||
          (r.statusKegiatan === "BELUM_KERJA" ? "Belum Bekerja" : "-");

        const jabatan =
          kerja?.jabatan || kuliah?.program_studi || usaha?.bidang_usaha || "-";

        const kesesuaian =
          kerja?.kesesuaian_jurusan || usaha?.kesesuaian_kompetensi || "-";
        const gaji = kerja?.kisaran_penghasilan || "-";
        const atasan = kerja?.nama_atasan || "-";
        const kontakAtasan = kerja?.kontak_atasan || "-";

        return {
          "ID Submisi": r.submissionId,
          NISN: r.nisn,
          NIK: r.nik,
          "Nama Lengkap": r.nama,
          "Program Keahlian (Jurusan)": r.jurusan,
          "Tahun Lulus": r.tahunLulus,
          "Status Kegiatan": r.statusKegiatan,
          "Masa Tunggu": payload.masa_tunggu || "-",
          "Nama Perusahaan / Kampus / Usaha": instansi,
          "Jabatan / Program Studi": jabatan,
          "Kesesuaian Kompetensi": kesesuaian,
          "Rentang Penghasilan": gaji,
          "Nama Atasan / HRD": atasan,
          "Kontak Atasan / HRD": kontakAtasan,
          "No. WhatsApp Alumni": r.noWhatsapp,
          "Email Alumni": r.email,
          "Tanggal Kirim": r.submittedAt,
          "Status Verifikasi": r.verificationStatus,
        };
      });
    } else if (selectedFormat === "master_lengkap") {
      filename = `export_master_alumni_smk_sasmita2_${settings.targetYear}.xlsx`;
      sheetName = "Data Master Alumni";
      dataRows = masterAlumni.map((a) => ({
        "ID Alumni": a.id,
        NISN: a.nisn,
        NIK: a.nik,
        "Nama Lengkap": a.nama,
        "Program Keahlian": a.jurusan,
        "Tahun Lulus": a.tahunLulus,
        "No. WhatsApp": a.noWhatsapp,
        Email: a.email,
        "Status Kuesioner": a.statusTracer,
        "ID Submisi": a.submissionId || "-",
        "Tanggal Submit": a.submittedAt || "-",
      }));
    } else {
      filename = `rekap_aktivitas_lulusan_smk_sasmita2_${settings.targetYear}.xlsx`;
      sheetName = "Rekapitulasi Kejuruan";
      const jurusanList = [
        "Teknik Komputer dan Jaringan",
        "Teknik Pemesinan",
        "Teknik Instalasi Tenaga Listrik",
        "Teknik Elektronika Industri",
        "Teknik Kendaraan Ringan Otomotif",
        "Teknik dan Bisnis Sepeda Motor",
      ];
      dataRows = jurusanList.map((j) => {
        const totalInJurusan = masterAlumni.filter((a) =>
          a.jurusan.includes(j),
        ).length;
        const resp = respondents.filter((r) => r.jurusan.includes(j));
        const filled = resp.length;
        const kerja = resp.filter(
          (r) =>
            r.statusKegiatan === "KERJA" || r.statusKegiatan === "KERJA_KULIAH",
        ).length;
        const kuliah = resp.filter(
          (r) =>
            r.statusKegiatan === "KULIAH" ||
            r.statusKegiatan === "WIRAUSAHA_KULIAH",
        ).length;
        const usaha = resp.filter(
          (r) => r.statusKegiatan === "WIRAUSAHA",
        ).length;
        const belum = resp.filter(
          (r) => r.statusKegiatan === "BELUM_KERJA",
        ).length;
        const percent =
          totalInJurusan > 0
            ? Number(((filled / totalInJurusan) * 100).toFixed(1))
            : 0;
        const bmwRate =
          filled > 0
            ? Number((((kerja + kuliah + usaha) / filled) * 100).toFixed(1))
            : 0;

        return {
          "Program Keahlian": j,
          "Total Alumni Master": totalInJurusan,
          "Kuesioner Terisi": filled,
          Bekerja: kerja,
          Kuliah: kuliah,
          Wirausaha: usaha,
          "Mencari Kerja": belum,
          "Tingkat Partisipasi (%)": `${percent}%`,
          "Tingkat Keterserapan BMW (%)": `${bmwRate}%`,
        };
      });
    }

    exportJsonToExcel(dataRows, filename, { sheetName });
    showDownloadToast(`Berkas Excel (${filename}) berhasil diunduh.`);
  };

  // 2. Export Direct to CSV
  const handleExportCsv = () => {
    let csvContent = "";
    let filename = "";

    if (selectedFormat === "ditjen_vokasi") {
      filename = `export_tracer_vokasi_smk_sasmita2_${settings.targetYear}.csv`;
      const headers = [
        "ID_SUBMISI",
        "NISN",
        "NIK",
        "NAMA_LENGKAP",
        "JURUSAN",
        "TAHUN_LULUS",
        "STATUS_KEGIATAN",
        "MASA_TUNGGU",
        "NAMA_PERUSAHAAN_KAMPUS_USAHA",
        "JABATAN_PRODI",
        "KESESUAIAN_JURUSAN",
        "RENTANG_PENGHASILAN",
        "NAMA_ATASAN_HRD",
        "KONTAK_ATASAN_HRD",
        "NO_WHATSAPP_ALUMNI",
        "EMAIL_ALUMNI",
        "TANGGAL_SUBMIT",
        "STATUS_VERIFIKASI",
      ].join(",");

      const rows = respondents.map((r) => {
        const payload = r.fullPayload;
        const kerja = payload.detail_kerja;
        const kuliah = payload.detail_kuliah;
        const usaha = payload.detail_usaha;

        const instansi =
          kerja?.nama_perusahaan ||
          kuliah?.nama_kampus ||
          usaha?.nama_usaha ||
          (r.statusKegiatan === "BELUM_KERJA" ? "Belum Bekerja" : "-");

        const jabatan =
          kerja?.jabatan || kuliah?.program_studi || usaha?.bidang_usaha || "-";

        const kesesuaian =
          kerja?.kesesuaian_jurusan || usaha?.kesesuaian_kompetensi || "-";
        const gaji = kerja?.kisaran_penghasilan || "-";
        const atasan = kerja?.nama_atasan || "-";
        const kontakAtasan = kerja?.kontak_atasan || "-";

        return [
          `"${r.submissionId}"`,
          `"${r.nisn}"`,
          `"${r.nik}"`,
          `"${r.nama.replace(/"/g, '""')}"`,
          `"${r.jurusan}"`,
          r.tahunLulus,
          `"${r.statusKegiatan}"`,
          `"${payload.masa_tunggu || "-"}"`,
          `"${instansi.replace(/"/g, '""')}"`,
          `"${jabatan.replace(/"/g, '""')}"`,
          `"${kesesuaian}"`,
          `"${gaji}"`,
          `"${atasan.replace(/"/g, '""')}"`,
          `"${kontakAtasan}"`,
          `"${r.noWhatsapp}"`,
          `"${r.email}"`,
          `"${r.submittedAt}"`,
          `"${r.verificationStatus}"`,
        ].join(",");
      });

      csvContent = "\uFEFF" + [headers, ...rows].join("\n");
    } else if (selectedFormat === "master_lengkap") {
      filename = `export_master_alumni_smk_sasmita2_${settings.targetYear}.csv`;
      const headers =
        "NISN,NIK,NAMA_LENGKAP,JURUSAN,TAHUN_LULUS,NO_WHATSAPP,EMAIL,STATUS_KUESIONER,ID_SUBMISI";
      const rows = masterAlumni.map((a) =>
        [
          `"${a.nisn}"`,
          `"${a.nik}"`,
          `"${a.nama.replace(/"/g, '""')}"`,
          `"${a.jurusan}"`,
          a.tahunLulus,
          `"${a.noWhatsapp}"`,
          `"${a.email}"`,
          `"${a.statusTracer}"`,
          `"${a.submissionId || "-"}"`,
        ].join(","),
      );
      csvContent = "\uFEFF" + [headers, ...rows].join("\n");
    } else {
      filename = `rekap_aktivitas_lulusan_smk_sasmita2_${settings.targetYear}.csv`;
      const headers =
        "JURUSAN,TOTAL_MASTER,TOTAL_RESPON,BEKERJA,KULIAH,WIRAUSAHA,BELUM_KERJA,PERSENTASE_RESPON";
      const jurusanList = [
        "Teknik Komputer dan Jaringan",
        "Teknik Pemesinan",
        "Teknik Instalasi Tenaga Listrik",
        "Teknik Elektronika Industri",
        "Teknik Kendaraan Ringan Otomotif",
        "Teknik dan Bisnis Sepeda Motor",
      ];
      const rows = jurusanList.map((j) => {
        const totalInJurusan = masterAlumni.filter((a) =>
          a.jurusan.includes(j),
        ).length;
        const resp = respondents.filter((r) => r.jurusan.includes(j));
        const filled = resp.length;
        const kerja = resp.filter(
          (r) =>
            r.statusKegiatan === "KERJA" || r.statusKegiatan === "KERJA_KULIAH",
        ).length;
        const kuliah = resp.filter(
          (r) =>
            r.statusKegiatan === "KULIAH" ||
            r.statusKegiatan === "WIRAUSAHA_KULIAH",
        ).length;
        const usaha = resp.filter(
          (r) => r.statusKegiatan === "WIRAUSAHA",
        ).length;
        const belum = resp.filter(
          (r) => r.statusKegiatan === "BELUM_KERJA",
        ).length;
        const percent =
          totalInJurusan > 0
            ? ((filled / totalInJurusan) * 100).toFixed(1)
            : "0";
        return `"${j}",${totalInJurusan},${filled},${kerja},${kuliah},${usaha},${belum},${percent}%`;
      });
      csvContent = "\uFEFF" + [headers, ...rows].join("\n");
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    link.style.position = "fixed";
    link.style.top = "-9999px";
    link.style.left = "-9999px";
    link.style.opacity = "0";
    link.style.pointerEvents = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showDownloadToast(`Berkas CSV (${filename}) berhasil diunduh.`);
  };

  // 3. Direct Download Official Summary Sheet (Opens Print / Save as PDF immediately)
  const handleDirectDownloadOfficialReport = () => {
    window.print();
    showDownloadToast(
      "Membuka dialog cetak / simpan dokumen Lembar Rekapitulasi Resmi.",
    );
  };

  // Data calculations for official report letterhead
  const totalMaster = masterAlumni.length;
  const totalResponden = respondents.length;

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

  const percentKerja =
    totalResponden > 0 ? ((countKerja / totalResponden) * 100).toFixed(1) : "0";
  const percentKuliah =
    totalResponden > 0
      ? ((countKuliah / totalResponden) * 100).toFixed(1)
      : "0";
  const percentWirausaha =
    totalResponden > 0
      ? ((countWirausaha / totalResponden) * 100).toFixed(1)
      : "0";
  const percentBelumKerja =
    totalResponden > 0
      ? ((countBelumKerja / totalResponden) * 100).toFixed(1)
      : "0";

  const jurusanList = [
    { code: "TKJ", name: "Teknik Komputer dan Jaringan" },
    { code: "TPM", name: "Teknik Pemesinan" },
    { code: "TITL", name: "Teknik Instalasi Tenaga Listrik" },
    { code: "TEI", name: "Teknik Elektronika Industri" },
    { code: "TKRO", name: "Teknik Kendaraan Ringan Otomotif" },
    { code: "TBSM", name: "Teknik dan Bisnis Sepeda Motor" },
  ];

  const jurusanBreakdown = jurusanList.map((j) => {
    const totalInJurusan = masterAlumni.filter((a) =>
      a.jurusan.includes(j.name),
    ).length;
    const respInJurusan = respondents.filter((r) => r.jurusan.includes(j.name));
    const filledCount = respInJurusan.length;
    const kerjaCount = respInJurusan.filter(
      (r) =>
        r.statusKegiatan === "KERJA" || r.statusKegiatan === "KERJA_KULIAH",
    ).length;
    const kuliahCount = respInJurusan.filter(
      (r) =>
        r.statusKegiatan === "KULIAH" ||
        r.statusKegiatan === "WIRAUSAHA_KULIAH",
    ).length;
    const usahaCount = respInJurusan.filter(
      (r) => r.statusKegiatan === "WIRAUSAHA",
    ).length;
    const belumCount = respInJurusan.filter(
      (r) => r.statusKegiatan === "BELUM_KERJA",
    ).length;

    const responseRate =
      totalInJurusan > 0 ? Math.round((filledCount / totalInJurusan) * 100) : 0;
    return {
      ...j,
      total: totalInJurusan,
      filled: filledCount,
      kerja: kerjaCount,
      kuliah: kuliahCount,
      usaha: usahaCount,
      belum: belumCount,
      responseRate,
    };
  });

  const currentDateFormatted = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <div className="space-y-6 animate-in fade-in duration-200 print:hidden">
        {/* Header Banner */}
        <div className="p-5">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <SolidFileSpreadsheetIcon className="w-5 h-5 text-[#0d2346]" />
            <span>Laporan dan Ekspor Data Lulusan</span>
          </h2>
        </div>

        {/* 2 Main Action Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Card: Export Engine (.xlsx / .csv) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-sm transition flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Ekspor ke Format Excel (.xlsx) atau CSV
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  Pilih format data yang ingin diunduh. Berkas Excel (.xlsx)
                  siap pakai langsung terstruktur rapi untuk Microsoft Excel dan
                  Google Sheets.
                </p>
              </div>

              {/* Format Selection */}
              <div className="space-y-2 text-xs">
                <label className="font-semibold text-slate-700 block">
                  Pilih Format Berkas:
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 p-3 hover:bg-slate-50 cursor-pointer transition">
                    <input
                      type="radio"
                      name="export_format"
                      checked={selectedFormat === "ditjen_vokasi"}
                      onChange={() => setSelectedFormat("ditjen_vokasi")}
                      className="accent-[#0d2346] text-[#0d2346] focus:ring-[#0d2346]"
                    />
                    <div>
                      <span className="font-semibold text-slate-800 block">
                        Format Standar Penelusuran Vokasi (Rekomendasi)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Memuat 18 kolom data lengkap termasuk kontak atasan
                        tempat bekerja
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 hover:bg-slate-50 cursor-pointer transition">
                    <input
                      type="radio"
                      name="export_format"
                      checked={selectedFormat === "master_lengkap"}
                      onChange={() => setSelectedFormat("master_lengkap")}
                      className="accent-[#0d2346] text-[#0d2346] focus:ring-[#0d2346]"
                    />
                    <div>
                      <span className="font-semibold text-slate-800 block">
                        Data Lengkap Seluruh Alumni ({masterAlumni.length}{" "}
                        Siswa)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Daftar seluruh alumni terdaftar beserta status pengisian
                        kuesionernya
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 hover:bg-slate-50 cursor-pointer transition">
                    <input
                      type="radio"
                      name="export_format"
                      checked={selectedFormat === "rekap_bmw"}
                      onChange={() => setSelectedFormat("rekap_bmw")}
                      className="accent-[#0d2346] text-[#0d2346] focus:ring-[#0d2346]"
                    />
                    <div>
                      <span className="font-semibold text-slate-800 block">
                        Rekapitulasi Aktivitas per Program Keahlian
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Ringkasan jumlah alumni yang bekerja, kuliah, wirausaha,
                        atau mencari kerja
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons: Excel (.xlsx) & CSV in 2 Columns */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleExportExcel}
                className="w-full py-3 px-3 rounded-full bg-[#0d2346] hover:bg-[#163868] text-white text-xs sm:text-sm font-bold shadow-xs transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <FileSpreadsheet className="w-4 h-4 text-white shrink-0" />
                <span className="truncate">Unduh Excel (.xlsx)</span>
              </button>

              <button
                onClick={handleExportCsv}
                className="w-full py-3 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 border border-slate-200"
              >
                <Download className="w-4 h-4 text-slate-600 shrink-0" />
                <span className="truncate">Unduh CSV (.csv)</span>
              </button>
            </div>
          </div>

          {/* Right Card: Direct Download Official Letterhead Summary */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-sm transition flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Unduh Lembar Rekapitulasi Resmi
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Format Berkop Surat Resmi SMK Sasmita Jaya 2
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Hasilkan lembar ringkasan formal yang memuat tabel tingkat
                keterserapan tiap program keahlian, distribusi aktivitas
                lulusan, serta lembar pengesahan Kepala Sekolah dan Ketua Bursa
                Kerja Khusus.
              </p>

              {/* Summary Points */}
              <div className="p-4 space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0d2346] shrink-0" />
                  <span>Kop Surat Resmi Yayasan dan SMK Sasmita Jaya 2</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0d2346] shrink-0" />
                  <span>
                    Tabel Keterserapan 6 Jurusan dan Tingkat Partisipasi
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0d2346] shrink-0" />
                  <span>
                    Kolom Pengesahan: {settings.kepalaSekolah} &{" "}
                    {settings.ketuaBkk}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0d2346] shrink-0" />
                  <span>
                    Tata letak terformat presisi untuk dokumen cetak ukuran
                    kertas A4
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Download Button */}
            <div className="pt-2">
              <button
                onClick={handleDirectDownloadOfficialReport}
                className="w-full py-3 rounded-full bg-[#0d2346] hover:bg-[#163868] text-white text-xs sm:text-sm font-bold shadow-xs transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-white" />
                <span>Unduh Lembar Rekapitulasi Resmi (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Document Container (Only visible during window.print()) */}
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
            TAHUN KELULUSAN {settings.targetYear} • PERIODE PENGUMPULAN DATA
            TAHUN 2026
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
                {((totalResponden / (settings.targetQuota || 1)) * 100).toFixed(
                  1,
                )}
                %
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
                ).toFixed(1)}
                %
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
                  <th className="border border-slate-400 p-1.5">
                    Total Alumni
                  </th>
                  <th className="border border-slate-400 p-1.5">Isian Masuk</th>
                  <th className="border border-slate-400 p-1.5">Bekerja</th>
                  <th className="border border-slate-400 p-1.5">Kuliah</th>
                  <th className="border border-slate-400 p-1.5">Wirausaha</th>
                  <th className="border border-slate-400 p-1.5">
                    Mencari Kerja
                  </th>
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
                    <td className="border border-slate-400 p-1">
                      {item.total}
                    </td>
                    <td className="border border-slate-400 p-1 font-semibold">
                      {item.filled}
                    </td>
                    <td className="border border-slate-400 p-1">
                      {item.kerja}
                    </td>
                    <td className="border border-slate-400 p-1">
                      {item.kuliah}
                    </td>
                    <td className="border border-slate-400 p-1">
                      {item.usaha}
                    </td>
                    <td className="border border-slate-400 p-1">
                      {item.belum}
                    </td>
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
                  <td className="border border-slate-400 p-1">
                    {totalResponden}
                  </td>
                  <td className="border border-slate-400 p-1">{countKerja}</td>
                  <td className="border border-slate-400 p-1">{countKuliah}</td>
                  <td className="border border-slate-400 p-1">
                    {countWirausaha}
                  </td>
                  <td className="border border-slate-400 p-1">
                    {countBelumKerja}
                  </td>
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

      {/* Toast Alert */}
      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 pointer-events-none animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}
    </>
  );
};
