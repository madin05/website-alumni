import React, { useState, useEffect, useMemo, useRef } from "react";
import { useAdminStore, MasterAlumniRecord } from "@/store/adminStore";
import { AdminImportModal } from "./AdminImportModal";
import { exportJsonToExcel } from "@/lib/excelExport";
import { downloadAlumniExcelTemplate } from "./import/alumniImportParser";
import {
  Search,
  Upload,
  Download,
  CheckCircle2,
  Clock,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  FileSpreadsheet,
  RefreshCw,
  SlidersHorizontal,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Pagination } from "@/components/ui/Pagination";
import { Toast } from "@/components/ui/Toast";
import {
  WhatsAppIcon,
  SolidUsersIcon,
  generateAlumniWaLink,
} from "./master-alumni/MasterAlumniIcons";
import { MasterAlumniAddModal } from "./master-alumni/MasterAlumniAddModal";
import { MasterAlumniPreviewModal } from "./master-alumni/MasterAlumniPreviewModal";

const JURUSAN_OPTIONS = [
  { value: "ALL", label: "Semua Program Keahlian" },
  {
    value: "Teknik Komputer dan Jaringan",
    label: "Teknik Komputer dan Jaringan",
  },
  { value: "Teknik Pemesinan", label: "Teknik Pemesinan" },
  {
    value: "Teknik Instalasi Tenaga Listrik",
    label: "Teknik Instalasi Tenaga Listrik",
  },
  {
    value: "Teknik Elektronika Industri",
    label: "Teknik Elektronika Industri",
  },
  {
    value: "Teknik Kendaraan Ringan Otomotif",
    label: "Teknik Kendaraan Ringan Otomotif",
  },
  {
    value: "Teknik dan Bisnis Sepeda Motor",
    label: "Teknik dan Bisnis Sepeda Motor",
  },
];

export const AdminMasterAlumniTab: React.FC = () => {
  const {
    masterAlumni,
    deleteMasterAlumni,
    addSingleMasterAlumni,
    fetchMasterAlumniFromBackend,
  } = useAdminStore();

  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    fetchMasterAlumniFromBackend?.();
  }, []);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "SUDAH" | "BELUM">(
    "ALL",
  );
  const [jurusanFilter, setJurusanFilter] = useState("ALL");
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
  const [nameSortOrder, setNameSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [deleteConfirmAlumni, setDeleteConfirmAlumni] =
    useState<MasterAlumniRecord | null>(null);
  const [selectedPreviewAlumni, setSelectedPreviewAlumni] =
    useState<MasterAlumniRecord | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmAlumni) {
      await deleteMasterAlumni(deleteConfirmAlumni.id);
      showToast(`Data ${deleteConfirmAlumni.nama} berhasil dihapus.`);
      setDeleteConfirmAlumni(null);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, jurusanFilter]);

  const filteredAlumni = useMemo(() => {
    const q = search.toLowerCase().trim();
    return masterAlumni.filter((a) => {
      const matchSearch =
        !q ||
        a.nama.toLowerCase().includes(q) ||
        a.nisn.includes(q) ||
        a.nik.includes(q);

      const matchStatus =
        statusFilter === "ALL" || a.statusTracer === statusFilter;

      const matchJurusan =
        jurusanFilter === "ALL" || a.jurusan === jurusanFilter;

      return matchSearch && matchStatus && matchJurusan;
    });
  }, [masterAlumni, search, statusFilter, jurusanFilter]);

  const sortedAlumni = useMemo(() => {
    return [...filteredAlumni].sort((a, b) => {
      if (nameSortOrder === "asc") {
        return a.nama.localeCompare(b.nama, "id-ID");
      }
      return b.nama.localeCompare(a.nama, "id-ID");
    });
  }, [filteredAlumni, nameSortOrder]);

  const totalPages = Math.ceil(sortedAlumni.length / itemsPerPage);
  const paginatedAlumni = useMemo(() => {
    return sortedAlumni.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [sortedAlumni, currentPage, itemsPerPage]);

  const { countSudah, countBelum } = useMemo(() => {
    let sudah = 0;
    let belum = 0;
    for (const a of masterAlumni) {
      if (a.statusTracer === "SUDAH") sudah++;
      else if (a.statusTracer === "BELUM") belum++;
    }
    return { countSudah: sudah, countBelum: belum };
  }, [masterAlumni]);

  const handleDownloadTemplate = () => {
    downloadAlumniExcelTemplate();
    showToast("Format template Excel (.xlsx) berhasil diunduh.");
  };

  const handleExportExcel = () => {
    if (masterAlumni.length === 0) {
      showToast("Tidak ada data siswa untuk diekspor.");
      return;
    }

    const listToExport =
      filteredAlumni.length > 0 ? filteredAlumni : masterAlumni;
    const exportData = listToExport.map((item, index) => ({
      No: index + 1,
      NISN: item.nisn,
      NIK: item.nik,
      "Nama Lengkap": item.nama,
      "Program Keahlian": item.jurusan,
      "Tahun Kelulusan": item.tahunLulus,
      "No. WhatsApp": item.noWhatsapp,
      Email: item.email,
      "Status Pengisian Tracer":
        item.statusTracer === "SUDAH" ? "Sudah Mengisi" : "Belum Mengisi",
    }));

    exportJsonToExcel(
      exportData,
      `data_siswa_lulusan_smk_sasmita2_${new Date().getFullYear()}`,
      { sheetName: "Data Siswa Lulusan" },
    );
    showToast(
      `Berhasil mengekspor ${exportData.length} data siswa ke Excel (.xlsx).`,
    );
  };

  const handleCreateSingle = async (data: {
    nisn: string;
    nik: string;
    nama: string;
    jurusan: (typeof JURUSAN_OPTIONS)[number]["value"];
    tahunLulus: number;
    noWhatsapp: string;
    email: string;
  }) => {
    const success = await addSingleMasterAlumni(data as any);
    if (success) {
      showToast(`Data siswa ${data.nama} berhasil ditambahkan.`);
      return true;
    }
    return false;
  };

  const handleSyncFromDatabase = async () => {
    setIsSyncing(true);
    try {
      const ok = await fetchMasterAlumniFromBackend();
      if (ok) {
        showToast(
          "Data siswa alumni berhasil disinkronkan dari database.",
        );
      } else {
        showToast("Sinkronisasi selesai");
      }
    } catch {
      showToast("Gagal menyinkronkan data dari database.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <>
      <div className="space-y-5">
        {/* Header Banner */}
        <div className="p-4 sm:p-5 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
          <div className="shrink-0">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2 whitespace-nowrap">
              <SolidUsersIcon className="w-5 h-5 text-[#0d2346] shrink-0" />
              <span>Data Siswa Lulusan</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full xl:w-auto border border-slate-200 p-1.5 sm:px-2 sm:py-1 rounded-lg sm:rounded-md bg-slate-50/50">
            <button
              type="button"
              onClick={handleSyncFromDatabase}
              disabled={isSyncing}
              className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-slate-200 text-slate-800 text-xs font-medium transition flex items-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50"
              title="Sinkronkan data siswa langsung dari database pusat"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`}
              />
              <span>{isSyncing ? "Menyinkronkan..." : "Refresh"}</span>
            </button>
            <button
              type="button"
              onClick={handleExportExcel}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium flex items-center gap-1.5 cursor-pointer shrink-0"
              title="Ekspor seluruh data siswa lulusan ke berkas Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-700 shrink-0" />
              <span>Ekspor Excel (.xlsx)</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition flex items-center gap-1.5 cursor-pointer shrink-0"
              title="Unduh format template Excel (.xlsx) untuk impor data"
            >
              <Download className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <span>Unduh Format (.xlsx)</span>
            </button>
            <button
              type="button"
              onClick={() => setIsImportModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Upload className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <span>Impor Berkas</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pb-2 border-b border-slate-100 text-[11px] sm:text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter("ALL")}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg font-normal transition cursor-pointer ${
                statusFilter === "ALL"
                  ? "bg-[#0d2346] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Semua Data ({masterAlumni.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("SUDAH")}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg font-normal transition cursor-pointer flex items-center gap-1 sm:gap-1.5 ${
                statusFilter === "SUDAH"
                  ? "bg-[#0d2346] text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Sudah Mengisi ({countSudah})</span>
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("BELUM")}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg font-normal transition cursor-pointer flex items-center gap-1 sm:gap-1.5 ${
                statusFilter === "BELUM"
                  ? "bg-slate-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Belum Mengisi ({countBelum})</span>
            </button>
          </div>

          {/* Combined Search & Filter Bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <Input
                placeholder="Cari berdasarkan nama lengkap, NISN, atau NIK..."
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
                  jurusanFilter !== "ALL"
                    ? "bg-blue-50 border-blue-200 text-[#0d2346]"
                    : "bg-slate-50/50 hover:bg-white border-slate-200 text-slate-700 hover:text-slate-900"
                }`}
                title="Filter Program Keahlian"
                aria-expanded={isFilterOpen}
              >
                <SlidersHorizontal
                  className={`w-4 h-4 ${
                    jurusanFilter !== "ALL"
                      ? "text-[#0d2346]"
                      : "text-slate-600"
                  }`}
                />
                <span className="hidden xs:inline sm:inline">Filter</span>
                {jurusanFilter !== "ALL" && (
                  <span className="w-2 h-2 rounded-full bg-[#0d2346] shrink-0" />
                )}
              </button>

              {/* Filter Dropdown Popover */}
              {isFilterOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 max-w-[calc(100vw-32px)] bg-white rounded-2xl border border-slate-200 shadow-xl z-30 p-2.5 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 mb-1.5 px-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
                      <span>Program Keahlian</span>
                    </span>
                    {jurusanFilter !== "ALL" && (
                      <button
                        type="button"
                        onClick={() => {
                          setJurusanFilter("ALL");
                        }}
                        className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  <div className="space-y-0.5 max-h-64 overflow-y-auto">
                    {JURUSAN_OPTIONS.map((opt) => {
                      const isSelected = jurusanFilter === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setJurusanFilter(opt.value as string);
                            setIsFilterOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition cursor-pointer ${
                            isSelected
                              ? "bg-slate-100 font-bold text-[#0d2346]"
                              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"
                          }`}
                        >
                          <span className="truncate pr-2">{opt.label}</span>
                          {isSelected && (
                            <Check className="w-4 h-4 text-[#0d2346] shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Master Data Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-[#0d2346] text-white text-[11px]">
                <tr>
                  <th className="py-2.5 px-3 font-medium min-w-[140px]">
                    <button
                      type="button"
                      onClick={() => {
                        setNameSortOrder((prev) =>
                          prev === "asc" ? "desc" : "asc",
                        );
                      }}
                      className="inline-flex items-center gap-1 hover:text-white transition cursor-pointer select-none group"
                      title={
                        nameSortOrder === "asc"
                          ? "Urutan Nama: A - Z (Klik untuk Z - A)"
                          : "Urutan Nama: Z - A (Klik untuk A - Z)"
                      }
                    >
                      <span>Nama Lengkap</span>
                      {nameSortOrder === "asc" ? (
                        <ArrowUp className="w-3 h-3 text-slate-200" />
                      ) : (
                        <ArrowDown className="w-3 h-3 text-slate-200" />
                      )}
                    </button>
                  </th>
                  <th className="py-2.5 px-3 font-medium whitespace-nowrap min-w-[110px]">
                    NISN
                  </th>
                  <th className="py-2.5 px-3 font-medium min-w-[150px]">
                    Program Keahlian
                  </th>
                  <th className="py-2.5 px-3 font-medium text-center whitespace-nowrap min-w-[130px]">
                    Status Tracer
                  </th>
                  <th className="py-2.5 px-3 font-medium text-center whitespace-nowrap min-w-[80px]">
                    Preview
                  </th>
                  <th className="py-2.5 px-3 font-medium text-center whitespace-nowrap min-w-[80px]">
                    Pengingat
                  </th>
                  <th className="py-2.5 px-3 font-medium text-center whitespace-nowrap min-w-[80px]">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-[11px]">
                {paginatedAlumni.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-6 text-center text-slate-500 text-xs"
                    >
                      Tidak ada data siswa yang cocok dengan pencarian atau
                      filter yang dipilih.
                    </td>
                  </tr>
                ) : (
                  paginatedAlumni.map((alumni) => (
                    <tr
                      key={alumni.id}
                      className="hover:bg-slate-50 transition"
                    >
                      {/* 1. Nama Lengkap */}
                      <td className="py-2.5 px-3 min-w-[140px]">
                        <div className="font-medium text-slate-900 text-xs">
                          {alumni.nama}
                        </div>
                      </td>

                      {/* 2. NISN */}
                      <td className="py-2.5 px-3 font-mono whitespace-nowrap min-w-[110px]">
                        <span className="font-medium text-slate-900 text-xs">
                          {alumni.nisn}
                        </span>
                      </td>

                      {/* 3. Program Keahlian */}
                      <td className="py-2.5 px-3 min-w-[150px]">
                        <div className="text-slate-800 font-medium text-xs">
                          {alumni.jurusan}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Lulusan Tahun {alumni.tahunLulus}
                        </div>
                      </td>

                      {/* 4. Status Tracer */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap min-w-[130px]">
                        {alumni.statusTracer === "SUDAH" ? (
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-50 text-slate-700 border border-slate-200 whitespace-nowrap shadow-2xs"
                            title="Sudah mengisi kuesioner tracer study"
                          >
                            <CheckCircle2 className="w-3 h-3 text-slate-600 shrink-0" />
                            <span>Sudah Mengisi</span>
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-50 text-slate-700 border border-slate-200 whitespace-nowrap shadow-2xs"
                            title="Belum mengisi tracer study"
                          >
                            <Clock className="w-3 h-3 text-slate-600 shrink-0" />
                            <span>Belum Mengisi</span>
                          </span>
                        )}
                      </td>

                      {/* 5. Preview */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap min-w-[80px]">
                        <button
                          type="button"
                          onClick={() => setSelectedPreviewAlumni(alumni)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-slate-700 hover:text-[#0d2346] hover:bg-slate-100 text-[11px] font-medium cursor-pointer shadow-2xs border border-slate-200 transition"
                          title="Buka data lengkap siswa"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Lihat</span>
                        </button>
                      </td>

                      {/* 5. Pengingat WA */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap min-w-[80px]">
                        {alumni.statusTracer === "BELUM" &&
                        alumni.noWhatsapp &&
                        alumni.noWhatsapp !== "-" &&
                        alumni.noWhatsapp !== "081200000000" ? (
                          <a
                            href={generateAlumniWaLink(alumni)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center p-1.5 rounded-md text-slate-600 hover:text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                            title="Kirim pengingat WhatsApp"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-slate-300 text-xs">-</span>
                        )}
                      </td>

                      {/* 6. Aksi (Hapus) */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap min-w-[80px]">
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmAlumni(alumni)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer inline-flex items-center justify-center"
                          title="Hapus data siswa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Pagination & Info */}
          <div className="border-t border-slate-100">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={sortedAlumni.length}
              itemsPerPage={itemsPerPage}
              itemName="siswa"
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>

      {/* Import Modal */}
      <AdminImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={(count) =>
          showToast(`Berhasil menambahkan ${count} data siswa ke basis data.`)
        }
      />

      {/* Add Single Alumni Modal */}
      <MasterAlumniAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateSingle}
        jurusanOptions={JURUSAN_OPTIONS}
      />

      {/* Modal Preview Data Lengkap Siswa */}
      <MasterAlumniPreviewModal
        alumni={selectedPreviewAlumni}
        onClose={() => setSelectedPreviewAlumni(null)}
      />

      {/* Custom Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteConfirmAlumni)}
        onClose={() => setDeleteConfirmAlumni(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Data Siswa Alumni?"
        message={
          deleteConfirmAlumni
            ? `Apakah Anda yakin ingin menghapus data siswa ${deleteConfirmAlumni.nama} (NISN: ${deleteConfirmAlumni.nisn}) dari master alumni?`
            : ""
        }
        confirmText="Ya, Hapus Data"
        cancelText="Batal"
        type="danger"
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage("")}
        type="success"
      />
    </>
  );
};
