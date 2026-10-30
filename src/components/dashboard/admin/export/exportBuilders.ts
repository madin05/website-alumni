import { MasterAlumniRecord, RespondentRecord } from "@/store/adminStore";

export const JURUSAN_REPORT_LIST = [
  { code: "TKJ", name: "Teknik Komputer dan Jaringan" },
  { code: "TPM", name: "Teknik Pemesinan" },
  { code: "TITL", name: "Teknik Instalasi Tenaga Listrik" },
  { code: "TEI", name: "Teknik Elektronika Industri" },
  { code: "TKRO", name: "Teknik Kendaraan Ringan Otomotif" },
  { code: "TBSM", name: "Teknik dan Bisnis Sepeda Motor" },
];

export const getSpektrum = (jurusan: string) => {
  if (jurusan.includes("Komputer") || jurusan.includes("TKJ")) {
    return { prog: "Teknik Komputer dan Informatika", bid: "Teknologi Informasi dan Komunikasi" };
  }
  if (jurusan.includes("Listrik") || jurusan.includes("TITL")) {
    return { prog: "Teknik Ketenagalistrikan", bid: "Teknologi dan Rekayasa" };
  }
  if (jurusan.includes("Elektronika") || jurusan.includes("Industri")) {
    return { prog: "Teknik Elektronika", bid: "Teknologi dan Rekayasa" };
  }
  if (jurusan.includes("Sepeda Motor") || jurusan.includes("TBSM")) {
    return { prog: "Teknik Otomotif", bid: "Teknologi dan Rekayasa" };
  }
  if (jurusan.includes("Kendaraan Ringan") || jurusan.includes("TKRO")) {
    return { prog: "Teknik Otomotif", bid: "Teknologi dan Rekayasa" };
  }
  return { prog: "Teknik Mesin", bid: "Teknologi dan Rekayasa" };
};

export const getStatusLabel = (st: string) => {
  switch (st) {
    case "KERJA":
      return "Bekerja";
    case "KULIAH":
      return "Melanjutkan Studi";
    case "WIRAUSAHA":
      return "Wirausaha";
    case "KERJA_KULIAH":
      return "Melanjutkan Studi sambil Bekerja";
    case "WIRAUSAHA_KULIAH":
      return "Melanjutkan Studi sambil Berwirausaha";
    case "BELUM_KERJA":
      return "Belum Bekerja / Mencari Kerja";
    default:
      return st || "Lainnya";
  }
};

export function buildVokasiExcelRows(
  respondents: RespondentRecord[],
  settings: { namaSekolah?: string; npsn?: string }
): Record<string, any>[] {
  return respondents.map((r, idx) => {
    const payload = r.fullPayload;
    const identitas = payload.identitas;
    const kerja = payload.detail_kerja;
    const kuliah = payload.detail_kuliah;
    const usaha = payload.detail_usaha;
    const spektrum = getSpektrum(r.jurusan);

    const keselarasanKerja = kerja?.kesesuaian_jurusan
      ? kerja.kesesuaian_jurusan === "Sangat sesuai" ||
        kerja.kesesuaian_jurusan === "Sesuai" ||
        kerja.kesesuaian_jurusan === "SANGAT_SESUAI" ||
        kerja.kesesuaian_jurusan === "SESUAI"
        ? "Selaras"
        : "Tidak Selaras"
      : "-";

    const keselarasanUsaha = usaha?.kesesuaian_kompetensi
      ? usaha.kesesuaian_kompetensi === "Sangat berkaitan" ||
        usaha.kesesuaian_kompetensi === "Berkaitan"
        ? "Selaras"
        : "Tidak Selaras"
      : "-";

    return {
      No: idx + 1,
      NISN: r.nisn,
      Nama: r.nama,
      "Nama Sekolah": settings.namaSekolah || "SMKS SASMITA JAYA 2",
      NPSN: settings.npsn || "20603287",
      "Status Sekolah": "Swasta",
      "Tahun Lulus": r.tahunLulus,
      "Komp. Keahlian": r.jurusan,
      "Prog. Keahlian": spektrum.prog,
      "Bid. Keahlian": spektrum.bid,
      "Lama Program (Tahun)": 3,
      "Prov. SMK": "Prov. Banten",
      "Kab/Kota": "Kota Tangerang Selatan",
      Usia: identitas?.usia || 20,
      "Jenis Kelamin":
        (identitas?.jenis_kelamin as string) === "Perempuan" ||
        (identitas?.jenis_kelamin as string) === "P"
          ? "P"
          : "L",
      "Status Menikah": identitas?.status_menikah || "Belum Menikah",
      "Prov. Dimisili": identitas?.provinsi_domisili || "Prov. Banten",
      "Kota Domisili": identitas?.kota_domisili || "Kota Tangerang Selatan",
      "E-mail": r.email,
      "No HP": r.noWhatsapp,
      "Status Aktifitas Lulusan": getStatusLabel(r.statusKegiatan),
      Keterangan:
        kerja?.keterangan_kerja ||
        (usaha
          ? "Berusaha/berwirausaha sendiri tanpa dibantu orang lain"
          : "-"),
      "Masa Tunggu Bekerja(bulan)": payload.masa_tunggu || "0",
      "Sertifikat Komp.":
        kerja?.nama_sertifikat ||
        (kerja?.jenis_sertifikat === "BNSP" ? "LSP BNSP" : "-"),
      "Jabatan (Bekerja)": kerja?.jabatan || "-",
      "Nama Tempat Kerja": kerja?.nama_perusahaan || "-",
      "Provinsi Kerja": kerja
        ? kerja.lokasi_pekerjaan === "LUAR_NEGERI"
          ? "Luar Negeri"
          : kerja.provinsi_kerja || "Prov. Banten"
        : "-",
      "Kota Kerja":
        kerja?.kota_kerja ||
        kerja?.kota_kabupaten ||
        (kerja
          ? kerja.lokasi_pekerjaan === "LUAR_NEGERI"
            ? "-"
            : "Kota Tangerang Selatan"
          : "-"),
      "Negara Kerja": kerja
        ? kerja.lokasi_pekerjaan === "LUAR_NEGERI"
          ? kerja.negara_kerja || "Luar Negeri"
          : "Indonesia"
        : "-",
      "Keselarasan Kerja": keselarasanKerja,
      "Provinsi Usaha": usaha?.provinsi_usaha || (usaha ? "Prov. Banten" : "-"),
      "Kota Usaha": usaha?.kota_usaha || (usaha ? "Kota Tangerang Selatan" : "-"),
      "Negara Usaha": usaha ? "Indonesia" : "-",
      "Bidang Usaha": usaha?.bidang_usaha || usaha?.kategori_usaha || "-",
      "Jenis Usaha": usaha?.jenis_usaha || (usaha ? "Jasa" : "-"),
      "Keselarasan Usaha": keselarasanUsaha,
      "Nama Produk Usaha":
        usaha?.nama_produk_usaha || usaha?.bidang_usaha || "-",
      "Jenjang Pendidikan": kuliah?.jenjang
        ? kuliah.jenjang.startsWith("S") || kuliah.jenjang.startsWith("D")
          ? `${kuliah.jenjang.slice(0, 1)}-${kuliah.jenjang.slice(1)}`
          : kuliah.jenjang
        : "-",
      "Nama Perguruan Tinggi": kuliah?.nama_kampus || "-",
      "Nama Prodi": kuliah?.program_studi || "-",
      "Keselarasan Studi Lanjut":
        kuliah?.keselarasan_studi || (kuliah ? "Selaras" : "-"),
      "Pendapatan Bekerja (UMP)":
        kerja?.pendapatan_ump || (kerja ? "Sama dengan atau lebih dari UMP" : "-"),
      "Pendapatan Bekerja (UMK)":
        kerja?.pendapatan_umk || (kerja ? "Kurang dari UMK" : "-"),
      "Pendapatan Wirausaha (UMP)":
        usaha?.pendapatan_ump || (usaha ? "Kurang dari UMP" : "-"),
      "Pendapatan Wirausaha (UMK)":
        usaha?.pendapatan_umk || (usaha ? "Kurang dari UMK" : "-"),
      "Pendapatan Studi Sambil Bekerja (UMP)":
        r.statusKegiatan === "KERJA_KULIAH"
          ? kerja?.pendapatan_ump || "Sama dengan atau lebih dari UMP"
          : "-",
      "Pendapatan Studi Sambil Bekerja (UMK)":
        r.statusKegiatan === "KERJA_KULIAH"
          ? kerja?.pendapatan_umk || "Kurang dari UMK"
          : "-",
      "Pendapatan Studi Sambil Berwirausaha (UMP)":
        r.statusKegiatan === "WIRAUSAHA_KULIAH"
          ? usaha?.pendapatan_ump || "Kurang dari UMP"
          : "-",
      "Pendapatan Studi Sambil Berwirausaha (UMK)":
        r.statusKegiatan === "WIRAUSAHA_KULIAH"
          ? usaha?.pendapatan_umk || "Kurang dari UMK"
          : "-",
    };
  });
}

export function buildMasterAlumniExcelRows(
  masterAlumni: MasterAlumniRecord[]
): Record<string, any>[] {
  return masterAlumni.map((a) => ({
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
}

export function buildRekapKejuruanExcelRows(
  masterAlumni: MasterAlumniRecord[],
  respondents: RespondentRecord[]
): Record<string, any>[] {
  return JURUSAN_REPORT_LIST.map((j) => {
    const totalInJurusan = masterAlumni.filter((a) =>
      a.jurusan.includes(j.name)
    ).length;
    const resp = respondents.filter((r) => r.jurusan.includes(j.name));
    const filled = resp.length;
    const kerja = resp.filter(
      (r) =>
        r.statusKegiatan === "KERJA" || r.statusKegiatan === "KERJA_KULIAH"
    ).length;
    const kuliah = resp.filter(
      (r) =>
        r.statusKegiatan === "KULIAH" ||
        r.statusKegiatan === "WIRAUSAHA_KULIAH"
    ).length;
    const usaha = resp.filter(
      (r) =>
        r.statusKegiatan === "WIRAUSAHA" ||
        r.statusKegiatan === "WIRAUSAHA_KULIAH"
    ).length;
    const belum = resp.filter(
      (r) => r.statusKegiatan === "BELUM_KERJA"
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
      "Program Keahlian": j.name,
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

export function buildVokasiCsvContent(respondents: RespondentRecord[]): string {
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
    const gaji =
      kerja?.kisaran_penghasilan ||
      kerja?.pendapatan_umk ||
      kerja?.pendapatan_ump ||
      usaha?.pendapatan_umk ||
      usaha?.pendapatan_ump ||
      "-";
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

  return "\uFEFF" + [headers, ...rows].join("\n");
}

export function buildMasterAlumniCsvContent(
  masterAlumni: MasterAlumniRecord[]
): string {
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
    ].join(",")
  );
  return "\uFEFF" + [headers, ...rows].join("\n");
}

export function buildRekapKejuruanCsvContent(
  masterAlumni: MasterAlumniRecord[],
  respondents: RespondentRecord[]
): string {
  const headers =
    "JURUSAN,TOTAL_MASTER,TOTAL_RESPON,BEKERJA,KULIAH,WIRAUSAHA,BELUM_KERJA,PERSENTASE_RESPON";
  const rows = JURUSAN_REPORT_LIST.map((j) => {
    const totalInJurusan = masterAlumni.filter((a) =>
      a.jurusan.includes(j.name)
    ).length;
    const resp = respondents.filter((r) => r.jurusan.includes(j.name));
    const filled = resp.length;
    const kerja = resp.filter(
      (r) =>
        r.statusKegiatan === "KERJA" || r.statusKegiatan === "KERJA_KULIAH"
    ).length;
    const kuliah = resp.filter(
      (r) =>
        r.statusKegiatan === "KULIAH" ||
        r.statusKegiatan === "WIRAUSAHA_KULIAH"
    ).length;
    const usaha = resp.filter((r) => r.statusKegiatan === "WIRAUSAHA").length;
    const belum = resp.filter(
      (r) => r.statusKegiatan === "BELUM_KERJA"
    ).length;
    const percent =
      totalInJurusan > 0
        ? ((filled / totalInJurusan) * 100).toFixed(1)
        : "0";
    return `"${j.name}",${totalInJurusan},${filled},${kerja},${kuliah},${usaha},${belum},${percent}%`;
  });
  return "\uFEFF" + [headers, ...rows].join("\n");
}

export interface JurusanReportBreakdown {
  code: string;
  name: string;
  total: number;
  filled: number;
  kerja: number;
  kuliah: number;
  usaha: number;
  belum: number;
  responseRate: number;
}

export interface ReportStatsResult {
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
}

export function calculateReportStats(
  masterAlumni: MasterAlumniRecord[],
  respondents: RespondentRecord[]
): ReportStatsResult {
  const totalMaster = masterAlumni.length;
  const totalResponden = respondents.length;

  const countKerja = respondents.filter(
    (r) => r.statusKegiatan === "KERJA" || r.statusKegiatan === "KERJA_KULIAH"
  ).length;
  const countKuliah = respondents.filter(
    (r) =>
      r.statusKegiatan === "KULIAH" || r.statusKegiatan === "WIRAUSAHA_KULIAH"
  ).length;
  const countWirausaha = respondents.filter(
    (r) => r.statusKegiatan === "WIRAUSAHA"
  ).length;
  const countBelumKerja = respondents.filter(
    (r) => r.statusKegiatan === "BELUM_KERJA"
  ).length;

  const percentKerja =
    totalResponden > 0 ? ((countKerja / totalResponden) * 100).toFixed(1) : "0";
  const percentKuliah =
    totalResponden > 0 ? ((countKuliah / totalResponden) * 100).toFixed(1) : "0";
  const percentWirausaha =
    totalResponden > 0
      ? ((countWirausaha / totalResponden) * 100).toFixed(1)
      : "0";
  const percentBelumKerja =
    totalResponden > 0
      ? ((countBelumKerja / totalResponden) * 100).toFixed(1)
      : "0";

  const jurusanBreakdown: JurusanReportBreakdown[] = JURUSAN_REPORT_LIST.map(
    (j) => {
      const totalInJurusan = masterAlumni.filter((a) =>
        a.jurusan.includes(j.name)
      ).length;
      const respInJurusan = respondents.filter((r) =>
        r.jurusan.includes(j.name)
      );
      const filledCount = respInJurusan.length;
      const kerjaCount = respInJurusan.filter(
        (r) =>
          r.statusKegiatan === "KERJA" || r.statusKegiatan === "KERJA_KULIAH"
      ).length;
      const kuliahCount = respInJurusan.filter(
        (r) =>
          r.statusKegiatan === "KULIAH" ||
          r.statusKegiatan === "WIRAUSAHA_KULIAH"
      ).length;
      const usahaCount = respInJurusan.filter(
        (r) => r.statusKegiatan === "WIRAUSAHA"
      ).length;
      const belumCount = respInJurusan.filter(
        (r) => r.statusKegiatan === "BELUM_KERJA"
      ).length;

      const responseRate =
        totalInJurusan > 0
          ? Math.round((filledCount / totalInJurusan) * 100)
          : 0;

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
    }
  );

  return {
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
  };
}

