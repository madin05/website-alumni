import React, { useState, useMemo, useEffect, useRef } from "react";
import { useAdminStore, RespondentRecord } from "@/store/adminStore";
import { AdminRespondentDetailDrawer } from "./AdminRespondentDetailDrawer";
import {
  Search,
  Clock,
  Eye,
  Building,
  GraduationCap,
  Store,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  SlidersHorizontal,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { Toast } from "@/components/ui/Toast";

const SolidFileCheckIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5 text-[#0d2346]",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-3.3 14.7-3.4-3.4 1.4-1.4 2 2 4.6-4.6 1.4 1.4-6 6zM13 9V3.5L18.5 9H13z" />
  </svg>
);

const JURUSAN_OPTIONS = [
  { value: "ALL", label: "Semua Jurusan" },
  {
    value: "Teknik Komputer dan Jaringan",
    label: "Teknik Komputer dan Jaringan (TKJ)",
  },
  { value: "Teknik Pemesinan", label: "Teknik Pemesinan (TPM)" },
  {
    value: "Teknik Instalasi Tenaga Listrik",
    label: "Teknik Instalasi Tenaga Listrik (TITL)",
  },
  {
    value: "Teknik Elektronika Industri",
    label: "Teknik Elektronika Industri (TEI)",
  },
  {
    value: "Teknik Kendaraan Ringan Otomotif",
    label: "Teknik Kendaraan Ringan Otomotif (TKRO)",
  },
  {
    value: "Teknik dan Bisnis Sepeda Motor",
    label: "Teknik dan Bisnis Sepeda Motor (TBSM)",
  },
];

const STATUS_AKTIVITAS_OPTIONS = [
  { value: "ALL", label: "Semua Aktivitas Lulusan" },
  { value: "KERJA", label: "Bekerja di Instansi / Perusahaan" },
  { value: "KULIAH", label: "Melanjutkan Studi / Kuliah" },
  { value: "WIRAUSAHA", label: "Wirausaha Mandiri" },
  { value: "KERJA_KULIAH", label: "Kuliah & Kerja" },
  { value: "BELUM_KERJA", label: "Sedang Mencari Kerja" },
];

export interface AdminRespondentsTabProps {
  initialSelectedId?: string | null;
  onClearInitialSelectedId?: () => void;
}

type SortField = "nama" | "tanggal" | "none";
type SortOrder = "asc" | "desc";

export const AdminRespondentsTab: React.FC<AdminRespondentsTabProps> = ({
  initialSelectedId,
  onClearInitialSelectedId,
}) => {
  const { respondents, fetchRespondentsFromBackend } = useAdminStore();

  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  useEffect(() => {
    fetchRespondentsFromBackend?.();
  }, []);

  const handleSyncFromDatabase = async () => {
    setIsSyncing(true);
    try {
      const ok = await fetchRespondentsFromBackend();
      if (ok) {
        showToast(
          "Data responden kuesioner berhasil disinkronkan dari database pusat.",
        );
      } else {
        showToast("Sinkronisasi selesai (data telah mutakhir).");
      }
    } catch {
      showToast("Gagal menyinkronkan data responden dari database.");
    } finally {
      setIsSyncing(false);
    }
  };

  const [search, setSearch] = useState("");
  const [jurusanFilter, setJurusanFilter] = useState("ALL");
  const [aktivitasFilter, setAktivitasFilter] = useState("ALL");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    if (isFilterOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("touchstart", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isFilterOpen]);
  const [selectedRespondent, setSelectedRespondent] =
    useState<RespondentRecord | null>(null);
  const [sortField, setSortField] = useState<SortField>("tanggal");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Handle initial auto-open if explicitly requested from overview, then clear it immediately
  React.useEffect(() => {
    if (initialSelectedId) {
      const found = respondents.find(
        (r) => r.submissionId === initialSelectedId,
      );
      if (found) {
        setSelectedRespondent(found);
      }
      onClearInitialSelectedId?.();
    }
  }, [initialSelectedId, respondents, onClearInitialSelectedId]);

  const filteredRespondents = useMemo(() => {
    const searchLower = search.toLowerCase().trim();
    return respondents.filter((r) => {
      const matchSearch =
        !searchLower ||
        r.nama.toLowerCase().includes(searchLower) ||
        r.nisn.includes(searchLower) ||
        r.instansiKampusUsaha.toLowerCase().includes(searchLower);

      const matchJurusan =
        jurusanFilter === "ALL" || r.jurusan === jurusanFilter;

      const matchAktivitas =
        aktivitasFilter === "ALL" ||
        r.statusKegiatan === aktivitasFilter ||
        (aktivitasFilter === "KERJA" &&
          (r.statusKegiatan === "KERJA" ||
            r.statusKegiatan === "KERJA_KULIAH")) ||
        (aktivitasFilter === "KULIAH" &&
          (r.statusKegiatan === "KULIAH" ||
            r.statusKegiatan === "KERJA_KULIAH" ||
            r.statusKegiatan === "WIRAUSAHA_KULIAH")) ||
        (aktivitasFilter === "WIRAUSAHA" &&
          (r.statusKegiatan === "WIRAUSAHA" ||
            r.statusKegiatan === "WIRAUSAHA_KULIAH")) ||
        (aktivitasFilter === "BELUM_KERJA" &&
          r.statusKegiatan === "BELUM_KERJA");

      return matchSearch && matchJurusan && matchAktivitas;
    });
  }, [respondents, search, jurusanFilter, aktivitasFilter]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, jurusanFilter, aktivitasFilter]);

  const sortedRespondents = useMemo(() => {
    return [...filteredRespondents].sort((a, b) => {
      if (sortField === "nama") {
        const cmp = a.nama.localeCompare(b.nama, "id-ID");
        return sortOrder === "asc" ? cmp : -cmp;
      }
      if (sortField === "tanggal") {
        const timeA = new Date(a.submittedAt).getTime();
        const timeB = new Date(b.submittedAt).getTime();
        return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
      }
      return 0;
    });
  }, [filteredRespondents, sortField, sortOrder]);

  const totalPages = Math.ceil(sortedRespondents.length / itemsPerPage);
  const paginatedRespondents = useMemo(() => {
    return sortedRespondents.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [sortedRespondents, currentPage, itemsPerPage]);

  const { countKerja, countKuliah, countWirausaha, countBelumKerja } =
    useMemo(() => {
      let kerja = 0;
      let kuliah = 0;
      let wirausaha = 0;
      let belumKerja = 0;
      for (const r of respondents) {
        if (
          r.statusKegiatan === "KERJA" ||
          r.statusKegiatan === "KERJA_KULIAH"
        ) {
          kerja++;
        }
        if (
          r.statusKegiatan === "KULIAH" ||
          r.statusKegiatan === "KERJA_KULIAH" ||
          r.statusKegiatan === "WIRAUSAHA_KULIAH"
        ) {
          kuliah++;
        }
        if (
          r.statusKegiatan === "WIRAUSAHA" ||
          r.statusKegiatan === "WIRAUSAHA_KULIAH"
        ) {
          wirausaha++;
        }
        if (r.statusKegiatan === "BELUM_KERJA") {
          belumKerja++;
        }
      }
      return {
        countKerja: kerja,
        countKuliah: kuliah,
        countWirausaha: wirausaha,
        countBelumKerja: belumKerja,
      };
    }, [respondents]);

  const renderAktivitasBadge = (status: string) => {
    switch (status) {
      case "KERJA":
        return (
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-800">
            <Building className="w-3.5 h-3.5 text-slate-600" />
            <span>Bekerja</span>
          </span>
        );
      case "KERJA_KULIAH":
        return (
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-800">
            <Building className="w-3.5 h-3.5 text-slate-600" />
            <span>Kuliah & Kerja</span>
          </span>
        );
      case "KULIAH":
        return (
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-800">
            <GraduationCap className="w-3.5 h-3.5 text-slate-600" />
            <span>Kuliah</span>
          </span>
        );
      case "WIRAUSAHA":
        return (
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-800">
            <Store className="w-3.5 h-3.5 text-slate-600" />
            <span>Wirausaha</span>
          </span>
        );
      case "WIRAUSAHA_KULIAH":
        return (
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-800">
            <Store className="w-3.5 h-3.5 text-slate-600" />
            <span>Kuliah & Wirausaha</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-800">
            <Clock className="w-3.5 h-3.5 text-slate-600" />
            <span>Mencari Kerja</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <SolidFileCheckIcon className="w-5 h-5 text-[#0d2346]" />
            <span>Data Responden Tracer Study</span>
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleSyncFromDatabase}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-60 transition cursor-pointer shadow-xs"
            title="Ambil data responden terbaru dari database"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-blue-600" : "text-slate-500"}`}
            />
            <span>{isSyncing ? "Menyinkronkan..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-3">
        {/* Quick Activity Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-100 text-xs">
          <button
            onClick={() => setAktivitasFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              aktivitasFilter === "ALL"
                ? "bg-[#0d2346] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Semua Responden ({respondents.length})
          </button>
          <button
            onClick={() => setAktivitasFilter("KERJA")}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
              aktivitasFilter === "KERJA"
                ? "bg-slate-800 text-white shadow-xs"
                : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60"
            }`}
          >
            <Building className="w-3.5 h-3.5 text-white" />
            <span>Bekerja ({countKerja})</span>
          </button>
          <button
            onClick={() => setAktivitasFilter("KULIAH")}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
              aktivitasFilter === "KULIAH"
                ? "bg-slate-800 text-white shadow-xs"
                : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-white" />
            <span>Kuliah ({countKuliah})</span>
          </button>
          <button
            onClick={() => setAktivitasFilter("WIRAUSAHA")}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
              aktivitasFilter === "WIRAUSAHA"
                ? "bg-slate-800 text-white shadow-xs"
                : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60"
            }`}
          >
            <Store className="w-3.5 h-3.5 text-white" />
            <span>Wirausaha ({countWirausaha})</span>
          </button>
          <button
            onClick={() => setAktivitasFilter("BELUM_KERJA")}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
              aktivitasFilter === "BELUM_KERJA"
                ? "bg-slate-800 text-white shadow-xs"
                : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-white" />
            <span>Mencari Kerja ({countBelumKerja})</span>
          </button>
        </div>

        {/* Combined Search & Filter Bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <Input
              placeholder="Cari berdasarkan nama, NISN, atau instansi tempat beraktivitas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />
          </div>

          <div className="relative shrink-0" ref={filterRef}>
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition cursor-pointer shadow-2xs ${
                (jurusanFilter !== "ALL" || aktivitasFilter !== "ALL")
                  ? "bg-blue-50 border-blue-200 text-[#0d2346]"
                  : "bg-slate-50/50 hover:bg-white border-slate-200 text-slate-700 hover:text-slate-900"
              }`}
              title="Filter Jurusan & Aktivitas"
              aria-expanded={isFilterOpen}
            >
              <SlidersHorizontal
                className={`w-4 h-4 ${
                  jurusanFilter !== "ALL" || aktivitasFilter !== "ALL"
                    ? "text-[#0d2346]"
                    : "text-slate-600"
                }`}
              />
              <span className="hidden xs:inline sm:inline">Filter</span>
              {(jurusanFilter !== "ALL" || aktivitasFilter !== "ALL") && (
                <span className="min-w-[18px] h-[18px] px-1 bg-[#0d2346] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {(jurusanFilter !== "ALL" ? 1 : 0) + (aktivitasFilter !== "ALL" ? 1 : 0)}
                </span>
              )}
            </button>

            {/* Filter Dropdown Popover */}
            {isFilterOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-84 max-w-[calc(100vw-32px)] bg-white rounded-2xl border border-slate-200 shadow-xl z-30 p-2.5 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 px-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
                    <span>Filter Data Responden</span>
                  </span>
                  {(jurusanFilter !== "ALL" || aktivitasFilter !== "ALL") && (
                    <button
                      type="button"
                      onClick={() => {
                        setJurusanFilter("ALL");
                        setAktivitasFilter("ALL");
                      }}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition cursor-pointer"
                    >
                      Reset Semua
                    </button>
                  )}
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {/* Section 1: Jurusan */}
                  <div>
                    <span className="text-[10px] font-medium text-slate-400 e tracking-wider px-2 block mb-1">
                      Program Keahlian
                    </span>
                    <div className="space-y-0.5">
                      {JURUSAN_OPTIONS.map((opt) => {
                        const isSelected = jurusanFilter === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setJurusanFilter(opt.value as string);
                            }}
                            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between transition cursor-pointer ${
                              isSelected
                                ? "bg-slate-100 font-bold text-[#0d2346]"
                                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"
                            }`}
                          >
                            <span className="truncate pr-2">{opt.label}</span>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-[#0d2346] shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section 2: Aktivitas */}
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-medium text-slate-400 e tracking-wider px-2 block mb-1">
                      Aktivitas Lulusan
                    </span>
                    <div className="space-y-0.5">
                      {STATUS_AKTIVITAS_OPTIONS.map((opt) => {
                        const isSelected = aktivitasFilter === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setAktivitasFilter(opt.value as string);
                            }}
                            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between transition cursor-pointer ${
                              isSelected
                                ? "bg-slate-100 font-bold text-[#0d2346]"
                                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"
                            }`}
                          >
                            <span className="truncate pr-2">{opt.label}</span>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-[#0d2346] shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full py-1.5 text-center text-xs font-bold bg-[#0d2346] text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Respondents Data Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-[#0d2346] text-white text-[11px]">
              <tr>
                <th className="py-2.5 px-3 font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      if (sortField !== "nama") {
                        setSortField("nama");
                        setSortOrder("asc");
                      } else {
                        setSortOrder((prev) =>
                          prev === "asc" ? "desc" : "asc",
                        );
                      }
                    }}
                    className="inline-flex items-center gap-1 hover:text-white transition cursor-pointer select-none group text-left"
                    title={
                      sortField === "nama"
                        ? sortOrder === "asc"
                          ? "Urutan Nama: A - Z (Klik untuk Z - A)"
                          : "Urutan Nama: Z - A (Klik untuk A - Z)"
                        : "Klik untuk mengurutkan Nama (A - Z)"
                    }
                  >
                    <span>Nama</span>
                    {sortField === "nama" ? (
                      sortOrder === "asc" ? (
                        <ArrowUp className="w-3 h-3 text-slate-200" />
                      ) : (
                        <ArrowDown className="w-3 h-3 text-slate-200" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400 group-hover:text-white" />
                    )}
                  </button>
                </th>
                <th className="py-2.5 px-3 font-semibold">
                  Jurusan & Angkatan
                </th>
                <th className="py-2.5 px-3 font-semibold">Aktivitas Lulusan</th>
                <th className="py-2.5 px-3 font-semibold whitespace-nowrap min-w-[110px]">
                  <button
                    type="button"
                    onClick={() => {
                      if (sortField !== "tanggal") {
                        setSortField("tanggal");
                        setSortOrder("desc");
                      } else {
                        setSortOrder((prev) =>
                          prev === "desc" ? "asc" : "desc",
                        );
                      }
                    }}
                    className="inline-flex items-center gap-1 hover:text-white transition cursor-pointer select-none group text-left"
                    title={
                      sortField === "tanggal"
                        ? sortOrder === "desc"
                          ? "Urutan Tanggal: Terbaru (Klik untuk Terlama)"
                          : "Urutan Tanggal: Terlama (Klik untuk Terbaru)"
                        : "Klik untuk mengurutkan Tanggal Kirim"
                    }
                  >
                    <span>Tgl Kirim</span>
                    {sortField === "tanggal" ? (
                      sortOrder === "desc" ? (
                        <ArrowDown className="w-3 h-3 text-slate-200" />
                      ) : (
                        <ArrowUp className="w-3 h-3 text-slate-200" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400 group-hover:text-white" />
                    )}
                  </button>
                </th>
                <th className="py-2.5 px-3 font-semibold text-center whitespace-nowrap min-w-[130px]">
                  Detil Data
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-[11px]">
              {paginatedRespondents.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-6 text-center text-slate-500 text-xs"
                  >
                    Tidak ditemukan data responden kuesioner yang sesuai dengan
                    kriteria pencarian.
                  </td>
                </tr>
              ) : (
                paginatedRespondents.map((rsp) => (
                  <tr
                    key={rsp.submissionId}
                    className="hover:bg-slate-50 transition cursor-pointer"
                    onClick={() => setSelectedRespondent(rsp)}
                  >
                    {/* 1. Nama */}
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900 text-xs">
                        {rsp.nama}
                      </div>
                    </td>

                    {/* 2. Jurusan dan Angkatan */}
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-slate-800 text-xs">
                        {rsp.jurusan}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Angkatan {rsp.tahunLulus}
                      </div>
                    </td>

                    {/* 3. Aktivitas Lulusan */}
                    <td className="py-2.5 px-3">
                      {renderAktivitasBadge(rsp.statusKegiatan)}
                    </td>

                    {/* 4. Tgl Kirim */}
                    <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                      {new Date(rsp.submittedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* 5. Detil Data */}
                    <td
                      className="py-2.5 px-3 text-center whitespace-nowrap min-w-[130px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedRespondent(rsp)}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold transition-colors text-xs whitespace-nowrap cursor-pointer border border-slate-200/80 shadow-2xs"
                        title="Lihat detil data kuesioner"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                        <span>Detil Data</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info & Pagination */}
        <div className="border-t border-slate-100">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={sortedRespondents.length}
            itemsPerPage={itemsPerPage}
            itemName="responden"
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      {/* Detail Questionnaire Drawer */}
      <AdminRespondentDetailDrawer
        respondent={selectedRespondent}
        onClose={() => {
          setSelectedRespondent(null);
          onClearInitialSelectedId?.();
        }}
      />

      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
    </div>
  );
};
