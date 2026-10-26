
/** Bentuk data statistik keterserapan dari backend (`/public/reports/keterserapan`). */
export interface KeterserapanData {
  totalAlumni: number;
  totalResponden: number;
  responseRate: number;
  aktivitas: {
    bekerja: number;
    kuliah: number;
    wirausaha: number;
    belumKerja: number;
    lainnya: number;
  };
  kesesuaian: {
    sangatSesuai: number;
    sesuai: number;
    kurangSesuai: number;
    tidakSesuai: number;
  };
  skalaKerja: {
    lokal: number;
    nasional: number;
    multinasional: number;
    wirausaha: number;
  };
  byJurusan: JurusanKeterserapanRow[];
  perbaruPada: string;
}

export interface JurusanKeterserapanRow {
  jurusan: string;
  tahunLulus: number;
  totalAlumni: number;
  mengisiTracer: number;
  bekerja: number;
  kuliah: number;
  wirausaha: number;
  belumKerja: number;
  lainnya: number;
  kesesuaian: {
    sangatSesuai: number;
    sesuai: number;
    kurangSesuai: number;
    tidakSesuai: number;
  };
  skalaKerja: {
    lokal: number;
    nasional: number;
    multinasional: number;
    wirausaha: number;
  };
}

/** Agregat statistik (dipakai untuk chart dan rekap ringkasan). */
export interface StatAggregate {
  totalAlumni: number;
  totalResponden: number;
  aktivitas: KeterserapanData['aktivitas'];
  kesesuaian: KeterserapanData['kesesuaian'];
  skalaKerja: KeterserapanData['skalaKerja'];
}

export interface ChartStats {
  totalResponden: number;
  aktivitas: {
    bekerja: { count: number; percent: number };
    kuliah: { count: number; percent: number };
    wirausaha: { count: number; percent: number };
    belumKerja: { count: number; percent: number };
  };
  kesesuaian: {
    sangatSesuai: { count: number; percent: number };
    sesuai: { count: number; percent: number };
    kurangSesuai: { count: number; percent: number };
    tidakSesuai: { count: number; percent: number };
    totalLinear: number;
  };
  skalaKerja: {
    lokal: { count: number; percent: number };
    nasional: { count: number; percent: number };
    multinasional: { count: number; percent: number };
    wirausaha: { count: number; percent: number };
  };
}

export const EMPTY_STAT_AGGREGATE: StatAggregate = {
  totalAlumni: 0,
  totalResponden: 0,
  aktivitas: { bekerja: 0, kuliah: 0, wirausaha: 0, belumKerja: 0, lainnya: 0 },
  kesesuaian: { sangatSesuai: 0, sesuai: 0, kurangSesuai: 0, tidakSesuai: 0 },
  skalaKerja: { lokal: 0, nasional: 0, multinasional: 0, wirausaha: 0 },
};

import { MOCK_YEARLY_TRACER_DATA } from '@/lib/mockData';

export const EMPTY_KETERSERAPAN: KeterserapanData = {
  ...EMPTY_STAT_AGGREGATE,
  responseRate: 0,
  byJurusan: [],
  perbaruPada: '',
};

/** Data mock keterserapan lengkap sebagai fallback jika API database offline atau kosong. */
export function getFallbackKeterserapan(tahunLulus?: number, jurusan?: string): KeterserapanData {
  let rows: JurusanKeterserapanRow[] = MOCK_YEARLY_TRACER_DATA.map((item) => ({
    jurusan: item.jurusanName,
    tahunLulus: item.year,
    totalAlumni: item.totalAlumni,
    mengisiTracer: item.mengisiTracer,
    bekerja: item.bekerja,
    kuliah: item.kuliah,
    wirausaha: item.wirausaha,
    belumKerja: item.belumKerja,
    lainnya: 0,
    kesesuaian: item.kesesuaian,
    skalaKerja: item.skalaKerja,
  }));

  if (tahunLulus) {
    rows = rows.filter((r) => r.tahunLulus === tahunLulus);
  }
  if (jurusan && jurusan !== 'ALL') {
    rows = rows.filter(
      (r) =>
        jurusanCode(r.jurusan).toLowerCase() === jurusan.toLowerCase() ||
        r.jurusan.toLowerCase() === jurusan.toLowerCase()
    );
  }

  const agg = aggregateRows(rows);
  const responseRate =
    agg.totalAlumni > 0
      ? parseFloat(((agg.totalResponden / agg.totalAlumni) * 100).toFixed(1))
      : 0;

  return {
    ...agg,
    responseRate,
    byJurusan: rows,
    perbaruPada: '2026-10-25T00:00:00.000Z',
  };
}

/** Persentase aman terhadap pembagian nol. */
export function calcPct(num: number, denom: number): number {
  if (!denom || denom === 0) return 0;
  return parseFloat(((num / denom) * 100).toFixed(1));
}

/** Jumlahkan baris rekap jurusan menjadi satu agregat statistik. */
export function aggregateRows(rows: JurusanKeterserapanRow[]): StatAggregate {
  return rows.reduce<StatAggregate>(
    (acc, row) => ({
      totalAlumni: acc.totalAlumni + row.totalAlumni,
      totalResponden: acc.totalResponden + row.mengisiTracer,
      aktivitas: {
        bekerja: acc.aktivitas.bekerja + row.bekerja,
        kuliah: acc.aktivitas.kuliah + row.kuliah,
        wirausaha: acc.aktivitas.wirausaha + row.wirausaha,
        belumKerja: acc.aktivitas.belumKerja + row.belumKerja,
        lainnya: acc.aktivitas.lainnya + row.lainnya,
      },
      kesesuaian: {
        sangatSesuai: acc.kesesuaian.sangatSesuai + row.kesesuaian.sangatSesuai,
        sesuai: acc.kesesuaian.sesuai + row.kesesuaian.sesuai,
        kurangSesuai: acc.kesesuaian.kurangSesuai + row.kesesuaian.kurangSesuai,
        tidakSesuai: acc.kesesuaian.tidakSesuai + row.kesesuaian.tidakSesuai,
      },
      skalaKerja: {
        lokal: acc.skalaKerja.lokal + row.skalaKerja.lokal,
        nasional: acc.skalaKerja.nasional + row.skalaKerja.nasional,
        multinasional: acc.skalaKerja.multinasional + row.skalaKerja.multinasional,
        wirausaha: acc.skalaKerja.wirausaha + row.skalaKerja.wirausaha,
      },
    }),
    {
      totalAlumni: 0,
      totalResponden: 0,
      aktivitas: { bekerja: 0, kuliah: 0, wirausaha: 0, belumKerja: 0, lainnya: 0 },
      kesesuaian: { sangatSesuai: 0, sesuai: 0, kurangSesuai: 0, tidakSesuai: 0 },
      skalaKerja: { lokal: 0, nasional: 0, multinasional: 0, wirausaha: 0 },
    },
  );
}

/** Susun statistik chart dari agregat basis data (angka absolut + persentase). */
export function buildChartStats(data: StatAggregate): ChartStats {
  const totalResponden = data.totalResponden;
  const totalKesesuaian =
    data.kesesuaian.sangatSesuai +
    data.kesesuaian.sesuai +
    data.kesesuaian.kurangSesuai +
    data.kesesuaian.tidakSesuai;
  const totalSkala =
    data.skalaKerja.lokal +
    data.skalaKerja.nasional +
    data.skalaKerja.multinasional +
    data.skalaKerja.wirausaha;

  return {
    totalResponden,
    aktivitas: {
      bekerja: { count: data.aktivitas.bekerja, percent: calcPct(data.aktivitas.bekerja, totalResponden) },
      kuliah: { count: data.aktivitas.kuliah, percent: calcPct(data.aktivitas.kuliah, totalResponden) },
      wirausaha: { count: data.aktivitas.wirausaha, percent: calcPct(data.aktivitas.wirausaha, totalResponden) },
      belumKerja: { count: data.aktivitas.belumKerja, percent: calcPct(data.aktivitas.belumKerja, totalResponden) },
    },
    kesesuaian: {
      sangatSesuai: {
        count: data.kesesuaian.sangatSesuai,
        percent: calcPct(data.kesesuaian.sangatSesuai, totalKesesuaian),
      },
      sesuai: { count: data.kesesuaian.sesuai, percent: calcPct(data.kesesuaian.sesuai, totalKesesuaian) },
      kurangSesuai: {
        count: data.kesesuaian.kurangSesuai,
        percent: calcPct(data.kesesuaian.kurangSesuai, totalKesesuaian),
      },
      tidakSesuai: {
        count: data.kesesuaian.tidakSesuai,
        percent: calcPct(data.kesesuaian.tidakSesuai, totalKesesuaian),
      },
      totalLinear: calcPct(data.kesesuaian.sangatSesuai + data.kesesuaian.sesuai, totalKesesuaian),
    },
    skalaKerja: {
      lokal: { count: data.skalaKerja.lokal, percent: calcPct(data.skalaKerja.lokal, totalSkala) },
      nasional: { count: data.skalaKerja.nasional, percent: calcPct(data.skalaKerja.nasional, totalSkala) },
      multinasional: { count: data.skalaKerja.multinasional, percent: calcPct(data.skalaKerja.multinasional, totalSkala) },
      wirausaha: { count: data.skalaKerja.wirausaha, percent: calcPct(data.skalaKerja.wirausaha, totalSkala) },
    },
  };
}

/** Peta nama jurusan lengkap ke kode singkat & nama pendek. */
export const JURUSAN_INFO: Record<string, { code: string; short: string }> = {
  'Teknik Komputer dan Jaringan': { code: 'TKJ', short: 'Teknik Komputer dan Jaringan' },
  'Teknik Pemesinan': { code: 'TPM', short: 'Teknik Pemesinan' },
  'Teknik Instalasi Tenaga Listrik': { code: 'TITL', short: 'Teknik Instalasi Tenaga Listrik' },
  'Teknik Elektronika Industri': { code: 'EL', short: 'Teknik Elektronika Industri' },
  'Teknik Kendaraan Ringan Otomotif': { code: 'TKRO', short: 'Teknik Kendaraan Ringan Otomotif' },
  'Teknik dan Bisnis Sepeda Motor': { code: 'TBSM', short: 'Teknik dan Bisnis Sepeda Motor' },
};

/** Program keahlian standar sekolah (urutan tampilan). */
export const STANDARD_JURUSAN: string[] = Object.keys(JURUSAN_INFO);

export function jurusanCode(jurusan: string): string {
  return JURUSAN_INFO[jurusan]?.code || jurusan.slice(0, 4).toUpperCase();
}

export function jurusanShortName(jurusan: string): string {
  return JURUSAN_INFO[jurusan]?.short || jurusan;
}

export interface JurusanTableRow {
  id: string;
  code: string;
  name: string;
  jurusan: string;
  totalAlumni: number;
  mengisiTracer: number;
  tracerPercent: string;
  bekerja: number;
  kuliah: number;
  wirausaha: number;
  belumKerja: number;
}

/** Kolom tabel rekap jurusan dari data basis data. */
export function buildJurusanTableRows(byJurusan: JurusanKeterserapanRow[]): JurusanTableRow[] {
  const grouped = new Map<string, JurusanTableRow>();

  for (const row of byJurusan) {
    const current = grouped.get(row.jurusan) || {
      id: row.jurusan,
      code: jurusanCode(row.jurusan),
      name: jurusanShortName(row.jurusan),
      jurusan: row.jurusan,
      totalAlumni: 0,
      mengisiTracer: 0,
      tracerPercent: '0',
      bekerja: 0,
      kuliah: 0,
      wirausaha: 0,
      belumKerja: 0,
    };

    current.totalAlumni += row.totalAlumni;
    current.mengisiTracer += row.mengisiTracer;
    current.bekerja += row.bekerja;
    current.kuliah += row.kuliah;
    current.wirausaha += row.wirausaha;
    current.belumKerja += row.belumKerja;
    grouped.set(row.jurusan, current);
  }

  return Array.from(grouped.values())
    .map((row) => ({
      ...row,
      tracerPercent: calcPct(row.mengisiTracer, row.totalAlumni).toFixed(1),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'id-ID'));
}

/** Filter rekap jurusan berdasarkan kode singkat jurusan. */
export function filterByJurusanCode(rows: JurusanKeterserapanRow[], jurusanId: string): JurusanKeterserapanRow[] {
  if (jurusanId === 'ALL') return rows;
  return rows.filter((row) => jurusanCode(row.jurusan).toLowerCase() === jurusanId.toLowerCase());
}

/** Filter rekap jurusan berdasarkan tahun lulus. */
export function filterByTahun(rows: JurusanKeterserapanRow[], tahunLulus?: number): JurusanKeterserapanRow[] {
  if (!tahunLulus) return rows;
  return rows.filter((row) => row.tahunLulus === tahunLulus);
}

/** Total ringkasan dari rekap jurusan. */
export function summarizeJurusanRows(rows: JurusanTableRow[]) {
  const summary = rows.reduce(
    (acc, row) => ({
      totalAlumni: acc.totalAlumni + row.totalAlumni,
      mengisiTracer: acc.mengisiTracer + row.mengisiTracer,
      bekerja: acc.bekerja + row.bekerja,
      kuliah: acc.kuliah + row.kuliah,
      wirausaha: acc.wirausaha + row.wirausaha,
      belumKerja: acc.belumKerja + row.belumKerja,
    }),
    { totalAlumni: 0, mengisiTracer: 0, bekerja: 0, kuliah: 0, wirausaha: 0, belumKerja: 0 },
  );

  return {
    ...summary,
    tracerPercent:
      summary.totalAlumni > 0
        ? ((summary.mengisiTracer / summary.totalAlumni) * 100).toFixed(1)
        : '0',
  };
}

/** Daftar jurusan yang benar-benar punya data di basis data. */
export function availableJurusan(rows: JurusanKeterserapanRow[]): string[] {
  const present = Array.from(new Set(rows.map((row) => row.jurusan)));
  const known = Object.keys(JURUSAN_INFO).filter((jurusan) => present.includes(jurusan));
  const others = present
    .filter((jurusan) => !JURUSAN_INFO[jurusan])
    .sort((a, b) => a.localeCompare(b, 'id-ID'));
  return [...known, ...others];
}
