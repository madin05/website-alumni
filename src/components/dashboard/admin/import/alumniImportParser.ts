import * as XLSX from "xlsx";
import { JurusanSMK } from "@/types/tracer";
import { downloadBlob } from "@/lib/fileDownload";
import { formatNameTitleCase } from "@/lib/utils";

export interface ParsedAlumniRow {
  nisn: string;
  nik: string;
  nama: string;
  jenisKelamin?: "L" | "P";
  jurusan: JurusanSMK;
  tahunLulus: number;
  noWhatsapp: string;
  email: string;
  namaSekolah?: string;
  npsn?: string;
  statusSekolah?: string;
  lamaProgram?: number;
  provinsiSmk?: string;
  kabKotaSmk?: string;
  kompKeahlian?: string;
  progKeahlian?: string;
  bidKeahlian?: string;
}

export const DEFAULT_SCHOOL_INFO = {
  namaSekolah: "SMKS SASMITA JAYA 2",
  npsn: "20603287",
  statusSekolah: "Swasta",
  lamaProgram: 3,
  provinsiSmk: "Prov. Banten",
  kabKotaSmk: "Kota Tangerang Selatan",
};

export const DEFAULT_PROGRAM_KEAHLIAN: Record<
  JurusanSMK,
  { progKeahlian: string; bidKeahlian: string }
> = {
  "Teknik Komputer dan Jaringan": {
    progKeahlian: "Teknik Komputer dan Informatika",
    bidKeahlian: "Teknologi Informasi dan Komunikasi",
  },
  "Teknik Pemesinan": {
    progKeahlian: "Teknik Mesin",
    bidKeahlian: "Teknologi dan Rekayasa",
  },
  "Teknik Instalasi Tenaga Listrik": {
    progKeahlian: "Teknik Ketenagalistrikan",
    bidKeahlian: "Teknologi dan Rekayasa",
  },
  "Teknik Elektronika Industri": {
    progKeahlian: "Teknik Elektronika",
    bidKeahlian: "Teknologi dan Rekayasa",
  },
  "Teknik Kendaraan Ringan Otomotif": {
    progKeahlian: "Teknik Otomotif",
    bidKeahlian: "Teknologi dan Rekayasa",
  },
  "Teknik dan Bisnis Sepeda Motor": {
    progKeahlian: "Teknik Otomotif",
    bidKeahlian: "Teknologi dan Rekayasa",
  },
};

export const sampleAlumniData = [
  {
    nisn: "",
    nik: "",
    nama: "",
    jenis_kelamin: "",
    jurusan: "",
    tahun_lulus: "",
    nama_sekolah: "SMKS SASMITA JAYA 2",
    npsn: "20603287",
    status_sekolah: "Swasta",
    lama_program: 3,
    provinsi_smk: "Prov. Banten",
    kab_kota_smk: "Kota Tangerang Selatan",
    komp_keahlian: "",
    prog_keahlian: "",
    bid_keahlian: "",
    no_wa: "",
    email: "",
  },
  {
    nisn: "",
    nik: "",
    nama: "",
    jenis_kelamin: "",
    jurusan: "",
    tahun_lulus: "",
    nama_sekolah: "SMKS SASMITA JAYA 2",
    npsn: "20603287",
    status_sekolah: "Swasta",
    lama_program: 3,
    provinsi_smk: "Prov. Banten",
    kab_kota_smk: "Kota Tangerang Selatan",
    komp_keahlian: "",
    prog_keahlian: "",
    bid_keahlian: "",
    no_wa: "",
    email: "",
  },
  {
    nisn: "",
    nik: "",
    nama: "",
    jenis_kelamin: "",
    jurusan: "",
    tahun_lulus: "",
    nama_sekolah: "SMKS SASMITA JAYA 2",
    npsn: "20603287",
    status_sekolah: "Swasta",
    lama_program: 3,
    provinsi_smk: "Prov. Banten",
    kab_kota_smk: "Kota Tangerang Selatan",
    komp_keahlian: "",
    prog_keahlian: "",
    bid_keahlian: "",
    no_wa: "",
    email: "",
  },
  {
    nisn: "",
    nik: "",
    nama: "",
    jenis_kelamin: "",
    jurusan: "",
    tahun_lulus: "",
    nama_sekolah: "SMKS SASMITA JAYA 2",
    npsn: "20603287",
    status_sekolah: "Swasta",
    lama_program: 3,
    provinsi_smk: "Prov. Banten",
    kab_kota_smk: "Kota Tangerang Selatan",
    komp_keahlian: "",
    prog_keahlian: "",
    bid_keahlian: "",
    no_wa: "",
    email: "",
  },
  {
    nisn: "",
    nik: "",
    nama: "",
    jenis_kelamin: "",
    jurusan: "",
    tahun_lulus: "",
    nama_sekolah: "SMKS SASMITA JAYA 2",
    npsn: "20603287",
    status_sekolah: "Swasta",
    lama_program: 3,
    provinsi_smk: "Prov. Banten",
    kab_kota_smk: "Kota Tangerang Selatan",
    komp_keahlian: "",
    prog_keahlian: "",
    bid_keahlian: "",
    no_wa: "",
    email: "",
  },
];

export function downloadAlumniExcelTemplate() {
  try {
    const ws = XLSX.utils.json_to_sheet(sampleAlumniData);
    ws["!cols"] = [
      { wch: 14 }, // nisn
      { wch: 20 }, // nik
      { wch: 24 }, // nama
      { wch: 14 }, // jenis_kelamin
      { wch: 34 }, // jurusan
      { wch: 14 }, // tahun_lulus
      { wch: 26 }, // nama_sekolah
      { wch: 14 }, // npsn
      { wch: 16 }, // status_sekolah
      { wch: 14 }, // lama_program
      { wch: 18 }, // provinsi_smk
      { wch: 26 }, // kab_kota_smk
      { wch: 34 }, // komp_keahlian
      { wch: 32 }, // prog_keahlian
      { wch: 34 }, // bid_keahlian
      { wch: 18 }, // no_wa
      { wch: 28 }, // email
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template Siswa");
    XLSX.writeFile(wb, "template_data_alumni_smk_sasmita2.xlsx");
  } catch (e) {
    console.error(e);
    downloadAlumniCsvTemplate();
  }
}

export function downloadAlumniCsvTemplate() {
  const headers =
    "nisn,nik,nama,jenis_kelamin,jurusan,tahun_lulus,nama_sekolah,npsn,status_sekolah,lama_program,provinsi_smk,kab_kota_smk,komp_keahlian,prog_keahlian,bid_keahlian,no_wa,email\n";
  const sampleRows = sampleAlumniData
    .map(
      (r) =>
        `${r.nisn},${r.nik},${r.nama},${r.jenis_kelamin},${r.jurusan},${r.tahun_lulus},${r.nama_sekolah},${r.npsn},${r.status_sekolah},${r.lama_program},${r.provinsi_smk},${r.kab_kota_smk},${r.komp_keahlian},${r.prog_keahlian},${r.bid_keahlian},${r.no_wa},${r.email}`,
    )
    .join("\n");

  downloadBlob(
    headers + sampleRows,
    "template_data_alumni_smk_sasmita2.csv",
    "text/csv;charset=utf-8;",
  );
}

export const mapJurusan = (raw: string): JurusanSMK => {
  const lower = (raw || "").toLowerCase();
  if (lower.includes("mesin") || lower.includes("tpm")) return "Teknik Pemesinan";
  if (lower.includes("listrik") || lower.includes("titl"))
    return "Teknik Instalasi Tenaga Listrik";
  if (
    lower.includes("elektronika") ||
    lower.includes("elektro") ||
    lower.includes("industri") ||
    lower.includes("tei")
  )
    return "Teknik Elektronika Industri";
  if (
    lower.includes("ringan") ||
    lower.includes("tkro") ||
    lower.includes("mobil")
  )
    return "Teknik Kendaraan Ringan Otomotif";
  if (
    lower.includes("motor") ||
    lower.includes("tbsm") ||
    lower.includes("sepeda")
  )
    return "Teknik dan Bisnis Sepeda Motor";
  if (
    lower.includes("komputer") ||
    lower.includes("jaringan") ||
    lower.includes("tkj")
  )
    return "Teknik Komputer dan Jaringan";
  return "Teknik Komputer dan Jaringan";
};

export const cleanIdString = (val: unknown): string => {
  if (val === null || val === undefined) return "";
  let str = String(val).trim().replace(/^['"]|['"]$/g, "");
  if (/^[0-9]+(\.[0-9]+)?e\+[0-9]+$/i.test(str)) {
    try {
      str = BigInt(Math.floor(Number(val))).toString();
    } catch {
      // keep string
    }
  }
  return str;
};

export function parseWorkbookMatrix(rawRows: unknown[][]): {
  rows: ParsedAlumniRow[];
  error?: string;
} {
  const cleanRows = rawRows.filter(
    (r) => Array.isArray(r) && r.some((c) => String(c ?? "").trim().length > 0)
  );

  if (cleanRows.length <= 1) {
    return {
      rows: [],
      error: "Berkas tidak memiliki baris data atau isi berkas kosong.",
    };
  }

  let headerRowIndex = 0;
  const colMap = {
    nisn: 0,
    nik: 1,
    nama: 2,
    jenisKelamin: -1,
    jurusan: 3,
    tahun: 4,
    namaSekolah: -1,
    npsn: -1,
    statusSekolah: -1,
    lamaProgram: -1,
    provinsiSmk: -1,
    kabKotaSmk: -1,
    kompKeahlian: -1,
    progKeahlian: -1,
    bidKeahlian: -1,
    noWa: 5,
    email: 6,
  };

  // Detect header row dynamically
  for (let i = 0; i < Math.min(cleanRows.length, 6); i++) {
    const row = cleanRows[i].map((c) => String(c ?? "").toLowerCase().trim());
    const hasNisn = row.some((c) => c.includes("nisn"));
    const hasNama = row.some((c) => c.includes("nama"));
    if (hasNisn || hasNama) {
      headerRowIndex = i;
      row.forEach((colName, colIdx) => {
        if (colName.includes("nisn")) colMap.nisn = colIdx;
        else if (colName.includes("nik") || colName.includes("ktp"))
          colMap.nik = colIdx;
        else if (
          colName.includes("nama") &&
          !colName.includes("sekolah") &&
          !colName.includes("tempat") &&
          !colName.includes("usaha")
        )
          colMap.nama = colIdx;
        else if (
          colName.includes("kelamin") ||
          colName.includes("gender") ||
          colName === "jk" ||
          colName === "l/p"
        )
          colMap.jenisKelamin = colIdx;
        else if (colName.includes("nama sekolah") || colName.includes("sekolah asal"))
          colMap.namaSekolah = colIdx;
        else if (colName.includes("npsn")) colMap.npsn = colIdx;
        else if (colName.includes("status sekolah")) colMap.statusSekolah = colIdx;
        else if (colName.includes("lama program") || colName.includes("durasi"))
          colMap.lamaProgram = colIdx;
        else if (
          colName.includes("prov. smk") ||
          colName.includes("provinsi smk") ||
          colName.includes("prov. sekolah")
        )
          colMap.provinsiSmk = colIdx;
        else if (
          colName.includes("kab/kota") ||
          colName.includes("kabupaten") ||
          colName.includes("kota smk")
        )
          colMap.kabKotaSmk = colIdx;
        else if (
          colName.includes("komp. keahlian") ||
          colName.includes("kompetensi")
        )
          colMap.kompKeahlian = colIdx;
        else if (
          colName.includes("prog. keahlian") ||
          colName.includes("program keahlian")
        )
          colMap.progKeahlian = colIdx;
        else if (
          colName.includes("bid. keahlian") ||
          colName.includes("bidang keahlian")
        )
          colMap.bidKeahlian = colIdx;
        else if (colName.includes("jurusan") || colName.includes("prodi"))
          colMap.jurusan = colIdx;
        else if (
          colName.includes("tahun") ||
          colName.includes("angkatan") ||
          colName.includes("lulus")
        )
          colMap.tahun = colIdx;
        else if (
          colName.includes("wa") ||
          colName.includes("hp") ||
          colName.includes("telepon") ||
          colName.includes("ponsel")
        )
          colMap.noWa = colIdx;
        else if (colName.includes("email") || colName.includes("surel"))
          colMap.email = colIdx;
      });
      break;
    }
  }

  const dataRows = cleanRows.slice(headerRowIndex + 1);
  const result: ParsedAlumniRow[] = [];

  dataRows.forEach((row) => {
    const getVal = (idx: number) => {
      if (idx < 0 || idx >= row.length) return "";
      const v = row[idx];
      return v === null || v === undefined ? "" : String(v).trim();
    };

    const nisn = cleanIdString(getVal(colMap.nisn));
    const rawNik = getVal(colMap.nik);
    const nik =
      rawNik && rawNik !== "-" && rawNik !== "3674000000000000"
        ? cleanIdString(rawNik)
        : "";
    const nama = formatNameTitleCase(getVal(colMap.nama));
    const rawJurusan = getVal(colMap.jurusan);
    const jurusanMapped = mapJurusan(rawJurusan);
    const parsedTahun = parseInt(getVal(colMap.tahun), 10) || 2024;
    const rawWa = getVal(colMap.noWa);
    const noWa =
      rawWa && rawWa !== "-" && rawWa !== "081200000000" ? rawWa : "";
    const rawEmail = getVal(colMap.email);
    const email =
      rawEmail &&
      rawEmail !== "-" &&
      !rawEmail.toLowerCase().endsWith("@example.com")
        ? rawEmail
        : "";

    // Jenis Kelamin
    const rawJk = getVal(colMap.jenisKelamin).toUpperCase();
    let jenisKelamin: "L" | "P" | undefined = undefined;
    if (rawJk.startsWith("L") || rawJk === "PRIA" || rawJk === "LAKI-LAKI")
      jenisKelamin = "L";
    else if (
      rawJk.startsWith("P") ||
      rawJk === "WANITA" ||
      rawJk === "PEREMPUAN"
    )
      jenisKelamin = "P";

    // Sekolah & Keahlian (dengan default SMKS Sasmita Jaya 2 jika kosong)
    const keahlianDefault =
      DEFAULT_PROGRAM_KEAHLIAN[jurusanMapped] || {
        progKeahlian: "Teknik Otomotif",
        bidKeahlian: "Teknologi dan Rekayasa",
      };

    const namaSekolah =
      getVal(colMap.namaSekolah) || DEFAULT_SCHOOL_INFO.namaSekolah;
    const npsn = getVal(colMap.npsn) || DEFAULT_SCHOOL_INFO.npsn;
    const statusSekolah =
      getVal(colMap.statusSekolah) || DEFAULT_SCHOOL_INFO.statusSekolah;
    const rawLama = getVal(colMap.lamaProgram);
    const lamaProgram = rawLama
      ? parseInt(rawLama, 10) || DEFAULT_SCHOOL_INFO.lamaProgram
      : DEFAULT_SCHOOL_INFO.lamaProgram;
    const provinsiSmk =
      getVal(colMap.provinsiSmk) || DEFAULT_SCHOOL_INFO.provinsiSmk;
    const kabKotaSmk =
      getVal(colMap.kabKotaSmk) || DEFAULT_SCHOOL_INFO.kabKotaSmk;
    const kompKeahlian = getVal(colMap.kompKeahlian) || jurusanMapped;
    const progKeahlian =
      getVal(colMap.progKeahlian) || keahlianDefault.progKeahlian;
    const bidKeahlian =
      getVal(colMap.bidKeahlian) || keahlianDefault.bidKeahlian;

    if (nisn && nama) {
      result.push({
        nisn,
        nik,
        nama,
        jenisKelamin,
        jurusan: jurusanMapped,
        tahunLulus: parsedTahun,
        namaSekolah,
        npsn,
        statusSekolah,
        lamaProgram,
        provinsiSmk,
        kabKotaSmk,
        kompKeahlian,
        progKeahlian,
        bidKeahlian,
        noWhatsapp: noWa,
        email,
      });
    }
  });

  if (result.length === 0) {
    return {
      rows: [],
      error:
        "Tidak ditemukan baris data yang valid. Pastikan kolom NISN dan Nama Lengkap terisi.",
    };
  }

  return { rows: result };
}

