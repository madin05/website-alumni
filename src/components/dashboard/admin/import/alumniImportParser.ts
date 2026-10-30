import * as XLSX from "xlsx";
import { JurusanSMK } from "@/types/tracer";
import { downloadBlob } from "@/lib/fileDownload";

export interface ParsedAlumniRow {
  nisn: string;
  nik: string;
  nama: string;
  jurusan: JurusanSMK;
  tahunLulus: number;
  noWhatsapp: string;
  email: string;
}

export const sampleAlumniData = [
  {
    nisn: "0051234567",
    nik: "3674012345670001",
    nama: "Ahmad Dani",
    jurusan: "Teknik Komputer dan Jaringan",
    tahun_lulus: 2024,
    no_wa: "081298765432",
    email: "ahmaddani@example.com",
  },
  {
    nisn: "0052345678",
    nik: "3674012345670002",
    nama: "Budi Santoso",
    jurusan: "Teknik Pemesinan",
    tahun_lulus: 2024,
    no_wa: "081311223344",
    email: "budisantoso@example.com",
  },
  {
    nisn: "0053456789",
    nik: "3674012345670003",
    nama: "Citra Dewi",
    jurusan: "Teknik Instalasi Tenaga Listrik",
    tahun_lulus: 2024,
    no_wa: "081233445566",
    email: "citradewi@example.com",
  },
  {
    nisn: "0054567890",
    nik: "3674012345670004",
    nama: "Dimas Pratama",
    jurusan: "Teknik Elektronika Industri",
    tahun_lulus: 2024,
    no_wa: "085711229988",
    email: "dimaspratama@example.com",
  },
  {
    nisn: "0055678901",
    nik: "3674012345670005",
    nama: "Eko Wahyudi",
    jurusan: "Teknik Kendaraan Ringan Otomotif",
    tahun_lulus: 2024,
    no_wa: "087811992233",
    email: "ekowahyudi@example.com",
  },
  {
    nisn: "0056789012",
    nik: "3674012345670006",
    nama: "Farhan Rizki",
    jurusan: "Teknik dan Bisnis Sepeda Motor",
    tahun_lulus: 2024,
    no_wa: "081299887766",
    email: "farhanrizki@example.com",
  },
];

export function downloadAlumniExcelTemplate() {
  try {
    const ws = XLSX.utils.json_to_sheet(sampleAlumniData);
    ws["!cols"] = [
      { wch: 14 },
      { wch: 20 },
      { wch: 24 },
      { wch: 36 },
      { wch: 14 },
      { wch: 16 },
      { wch: 28 },
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
  const headers = "nisn,nik,nama,jurusan,tahun_lulus,no_wa,email\n";
  const sampleRows = sampleAlumniData
    .map(
      (r) =>
        `${r.nisn},${r.nik},${r.nama},${r.jurusan},${r.tahun_lulus},${r.no_wa},${r.email}`
    )
    .join("\n");

  downloadBlob(
    headers + sampleRows,
    "template_data_alumni_smk_sasmita2.csv",
    "text/csv;charset=utf-8;"
  );
}

export const mapJurusan = (raw: string): JurusanSMK => {
  const lower = (raw || "").toLowerCase();
  if (lower.includes("mesin") || lower.includes("tpm")) return "Teknik Pemesinan";
  if (lower.includes("listrik") || lower.includes("titl"))
    return "Teknik Instalasi Tenaga Listrik";
  if (
    lower.includes("elektronika") ||
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
    jurusan: 3,
    tahun: 4,
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
        else if (colName.includes("nama")) colMap.nama = colIdx;
        else if (
          colName.includes("jurusan") ||
          colName.includes("prodi") ||
          colName.includes("kompetensi") ||
          colName.includes("keahlian")
        )
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
    const nama = getVal(colMap.nama);
    const rawJurusan = getVal(colMap.jurusan);
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

    if (nisn && nama) {
      result.push({
        nisn,
        nik,
        nama,
        jurusan: mapJurusan(rawJurusan),
        tahunLulus: parsedTahun,
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

