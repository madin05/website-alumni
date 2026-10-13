import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useAdminStore, MasterAlumniRecord } from "@/store/adminStore";
import { JurusanSMK } from "@/types/tracer";
import { AdminImportModal } from "./AdminImportModal";
import { exportJsonToExcel } from "@/lib/excelExport";
import {
  Users,
  Search,
  Plus,
  Upload,
  Download,
  CheckCircle2,
  Clock,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  X,
  Phone,
  Mail,
  FileSpreadsheet,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Pagination } from "@/components/ui/Pagination";
import { Toast } from "@/components/ui/Toast";

const WhatsAppIcon: React.FC<{ className?: string }> = ({
  className = "w-3.5 h-3.5",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const SolidUsersIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5 text-[#0d2346]",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);

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
  const { masterAlumni, deleteMasterAlumni, addSingleMasterAlumni, settings } =
    useAdminStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "SUDAH" | "BELUM">(
    "ALL",
  );
  const [jurusanFilter, setJurusanFilter] = useState("ALL");
  const [nameSortOrder, setNameSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [deleteConfirmAlumni, setDeleteConfirmAlumni] =
    useState<MasterAlumniRecord | null>(null);
  const [selectedPreviewAlumni, setSelectedPreviewAlumni] =
    useState<MasterAlumniRecord | null>(null);

  // Add Single Alumni Form State
  const [newNisn, setNewNisn] = useState("");
  const [newNik, setNewNik] = useState("");
  const [newNama, setNewNama] = useState("");
  const [newJurusan, setNewJurusan] = useState<JurusanSMK>(
    "Teknik Komputer dan Jaringan",
  );
  const [newTahun, setNewTahun] = useState(2024);
  const [newNoWa, setNewNoWa] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [addError, setAddError] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmAlumni) {
      deleteMasterAlumni(deleteConfirmAlumni.id);
      showToast(`Data ${deleteConfirmAlumni.nama} berhasil dihapus.`);
      setDeleteConfirmAlumni(null);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, jurusanFilter]);

  const filteredAlumni = masterAlumni.filter((a) => {
    const matchSearch =
      a.nama.toLowerCase().includes(search.toLowerCase()) ||
      a.nisn.includes(search) ||
      a.nik.includes(search);

    const matchStatus =
      statusFilter === "ALL" || a.statusTracer === statusFilter;

    const matchJurusan = jurusanFilter === "ALL" || a.jurusan === jurusanFilter;

    return matchSearch && matchStatus && matchJurusan;
  });

  const sortedAlumni = [...filteredAlumni].sort((a, b) => {
    if (nameSortOrder === "asc") {
      return a.nama.localeCompare(b.nama, "id-ID");
    }
    return b.nama.localeCompare(a.nama, "id-ID");
  });

  const totalPages = Math.ceil(sortedAlumni.length / itemsPerPage);
  const paginatedAlumni = sortedAlumni.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const countSudah = masterAlumni.filter(
    (a) => a.statusTracer === "SUDAH",
  ).length;
  const countBelum = masterAlumni.filter(
    (a) => a.statusTracer === "BELUM",
  ).length;

  const handleDownloadTemplate = () => {
    const sampleRows = [
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

    try {
      const ws = XLSX.utils.json_to_sheet(sampleRows);
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
      showToast("Format template Excel (.xlsx) berhasil diunduh.");
    } catch {
      const headers = "nisn,nik,nama,jurusan,tahun_lulus,no_wa,email\n";
      const csvContent = sampleRows
        .map(
          (r) =>
            `${r.nisn},${r.nik},${r.nama},${r.jurusan},${r.tahun_lulus},${r.no_wa},${r.email}`
        )
        .join("\n");
      const blob = new Blob([headers + csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "template_data_alumni_smk_sasmita2.csv");
      link.style.position = "fixed";
      link.style.top = "-9999px";
      link.style.left = "-9999px";
      link.style.opacity = "0";
      link.style.pointerEvents = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast("Format template CSV berhasil diunduh.");
    }
  };

  const handleExportExcel = () => {
    if (masterAlumni.length === 0) {
      showToast("Tidak ada data siswa untuk diekspor.");
      return;
    }

    const listToExport = filteredAlumni.length > 0 ? filteredAlumni : masterAlumni;
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
      { sheetName: "Data Siswa Lulusan" }
    );
    showToast(`Berhasil mengekspor ${exportData.length} data siswa ke Excel (.xlsx).`);
  };

  const handleCreateSingle = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");

    if (!newNisn.trim() || !newNama.trim()) {
      setAddError("NISN dan Nama Lengkap wajib diisi.");
      return;
    }

    const success = addSingleMasterAlumni({
      nisn: newNisn.trim(),
      nik: newNik.trim() || "3674000000000000",
      nama: newNama.trim(),
      jurusan: newJurusan,
      tahunLulus: Number(newTahun) || 2024,
      noWhatsapp: newNoWa.trim() || "081200000000",
      email:
        newEmail.trim() ||
        `${newNama.toLowerCase().replace(/\s+/g, "")}@example.com`,
    });

    if (success) {
      showToast(`Data siswa ${newNama} berhasil ditambahkan.`);
      setIsAddModalOpen(false);
      setNewNisn("");
      setNewNik("");
      setNewNama("");
      setNewNoWa("");
      setNewEmail("");
    } else {
      setAddError("NISN ini sudah terdaftar di basis data.");
    }
  };

  const generateWaLink = (alumni: MasterAlumniRecord) => {
    const rawNumber = alumni.noWhatsapp.replace(/\D/g, "");
    const cleanNumber = rawNumber.startsWith("0")
      ? "62" + rawNumber.slice(1)
      : rawNumber;
    const text = encodeURIComponent(
      `Halo *${alumni.nama}* (Alumni ${alumni.jurusan} Angkatan ${alumni.tahunLulus}),\n\nKami dari Bursa Kerja Khusus SMK Sasmita Jaya 2 Pamulang mengingatkan Anda untuk mengisi kuesioner penelusuran lulusan (tracer study).\n\nSilakan masuk menggunakan NISN: *${alumni.nisn}* melalui halaman login:\nhttps://tracerstudy-sasmita2.sch.id/login\n\nTerima kasih atas bantuan dan kerja sama Anda.`,
    );
    return `https://wa.me/${cleanNumber}?text=${text}`;
  };

  return (
    <>
      <div className="space-y-5">
        {/* Header Banner */}
        <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <SolidUsersIcon className="w-5 h-5 text-[#0d2346] shrink-0" />
              <span>Data Siswa Lulusan</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={handleExportExcel}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200 transition flex items-center gap-1.5 cursor-pointer shrink-0"
              title="Ekspor seluruh data siswa lulusan ke berkas Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-700 shrink-0" />
              <span>Ekspor Excel (.xlsx)</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shrink-0"
              title="Unduh format template Excel (.xlsx) untuk impor data"
            >
              <Download className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <span>Unduh Format (.xlsx)</span>
            </button>
            <button
              type="button"
              onClick={() => setIsImportModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200 transition flex items-center gap-1.5 cursor-pointer shrink-0"
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

          {/* Input & Dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-7">
              <Input
                placeholder="Cari berdasarkan nama lengkap, NISN, atau NIK..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="sm:col-span-5">
              <CustomSelect
                value={jurusanFilter}
                onChange={(v) => setJurusanFilter(v)}
                options={JURUSAN_OPTIONS}
              />
            </div>
          </div>
        </div>

        {/* Master Data Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-[#0d2346] text-white text-[11px]">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">
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
                  <th className="py-2.5 px-3 font-semibold">NISN</th>
                  <th className="py-2.5 px-3 font-semibold">
                    Program Keahlian
                  </th>
                  <th className="py-2.5 px-3 font-semibold text-center">
                    Preview
                  </th>
                  <th className="py-2.5 px-3 font-semibold text-center">
                    Pengingat
                  </th>
                  <th className="py-2.5 px-3 font-semibold text-center">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-[11px]">
                {paginatedAlumni.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
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
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-900 text-xs">
                          {alumni.nama}
                        </div>
                      </td>

                      {/* 2. NISN */}
                      <td className="py-2.5 px-3 font-mono">
                        <span className="font-semibold text-slate-900 text-xs">
                          {alumni.nisn}
                        </span>
                      </td>

                      {/* 3. Program Keahlian */}
                      <td className="py-2.5 px-3">
                        <div className="text-slate-800 font-medium text-xs">
                          {alumni.jurusan}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Lulusan Tahun {alumni.tahunLulus}
                        </div>
                      </td>

                      {/* 4. Preview */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedPreviewAlumni(alumni)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-slate-700 hover:text-[#0d2346] hover:bg-slate-100 text-[11px] font-semibold cursor-pointer shadow-2xs border border-slate-200 transition"
                          title="Buka data lengkap siswa"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Lihat</span>
                        </button>
                      </td>

                      {/* 5. Pengingat WA */}
                      <td className="py-2.5 px-3 text-center">
                        {alumni.statusTracer === "BELUM" ? (
                          <a
                            href={generateWaLink(alumni)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center p-1.5 rounded-md text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
                            title="Kirim pengingat WhatsApp"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-slate-300 text-xs">-</span>
                        )}
                      </td>

                      {/* 6. Aksi (Hapus) */}
                      <td className="py-2.5 px-3 text-center">
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

      {/* Toast Notification (Outside space-y container to eliminate any layout shifting) */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs sm:text-sm font-medum px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 pointer-events-none animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Import Modal */}
      <AdminImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={(count) =>
          showToast(`Berhasil menambahkan ${count} data siswa ke basis data.`)
        }
      />

      {/* Add Single Alumni Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-slate-700" />
                <span>Tambah Data Siswa Lulusan</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleCreateSingle}
              className="p-5 space-y-3.5 text-xs"
            >
              {addError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 font-semibold">
                  {addError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Nomor Induk Siswa Nasional (NISN)*
                  </label>
                  <input
                    required
                    maxLength={10}
                    placeholder="Contoh: 0051234567"
                    value={newNisn}
                    onChange={(e) => setNewNisn(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-[#0d2346] focus:border-[#0d2346]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Nomor Induk Kependudukan (NIK)
                  </label>
                  <input
                    maxLength={16}
                    placeholder="Contoh: 3674012345670001"
                    value={newNik}
                    onChange={(e) => setNewNik(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-[#0d2346] focus:border-[#0d2346]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Nama Lengkap Siswa*
                </label>
                <input
                  required
                  placeholder="Contoh: Muhammad Rizki"
                  value={newNama}
                  onChange={(e) => setNewNama(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0d2346] focus:border-[#0d2346]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1 text-xs">
                    Program Keahlian
                  </label>
                  <CustomSelect
                    options={JURUSAN_OPTIONS.filter((j) => j.value !== "ALL")}
                    value={newJurusan}
                    onChange={(val) => setNewJurusan(val as JurusanSMK)}
                    triggerSize="sm"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Tahun Kelulusan
                  </label>
                  <input
                    type="number"
                    value={newTahun}
                    onChange={(e) => setNewTahun(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0d2346] focus:border-[#0d2346]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Nomor WhatsApp
                  </label>
                  <input
                    placeholder="Contoh: 081298765432"
                    value={newNoWa}
                    onChange={(e) => setNewNoWa(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-[#0d2346] focus:border-[#0d2346]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Alamat Email
                  </label>
                  <input
                    placeholder="Contoh: alumni@example.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0d2346] focus:border-[#0d2346]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-semibold cursor-pointer hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#0d2346] hover:bg-[#163868] text-white font-semibold shadow-xs cursor-pointer"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Preview Data Lengkap Siswa */}
      {selectedPreviewAlumni && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="font-bold text-base text-slate-900 leading-snug tracking-tight">
                    Preview Data Lengkap Siswa
                  </h3>
                  <p className="text-xs text-slate-500 leading-normal mt-0.5">
                    Data pokok alumni SMKS Sasmita Jaya 2
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPreviewAlumni(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 overflow-y-auto">
              {/* Profile Card Header */}
              <div className="p-4 sm:p-4.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-4">
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-slate-900 text-base sm:text-lg leading-snug tracking-tight truncate">
                    {selectedPreviewAlumni.nama}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed truncate mt-1">
                    {selectedPreviewAlumni.jurusan}
                  </p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-200/80 text-slate-700 tracking-wide">
                      Angkatan {selectedPreviewAlumni.tahunLulus}
                    </span>
                    {selectedPreviewAlumni.statusTracer === "SUDAH" ? (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100/90 text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Sudah Mengisi Tracer</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-100/90 text-amber-800 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Belum Mengisi Tracer</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 1: Identitas Pokok Siswa */}
              <div className="p-4 sm:p-4.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* NISN */}
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-slate-500 block leading-normal">
                      Nomor Induk Siswa (NISN)
                    </span>
                    <span className="font-mono font-semibold text-slate-900 text-sm tracking-wide block leading-snug">
                      {selectedPreviewAlumni.nisn}
                    </span>
                  </div>

                  {/* NIK */}
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-slate-500 block leading-normal">
                      Nomor Induk Kependudukan (NIK)
                    </span>
                    <span className="font-mono font-semibold text-slate-900 text-sm tracking-wide block leading-snug">
                      {selectedPreviewAlumni.nik || "-"}
                    </span>
                  </div>

                  {/* Program Keahlian */}
                  <div className="sm:col-span-2 pt-2.5 border-t border-slate-100 space-y-1">
                    <span className="text-xs font-medium text-slate-500 block leading-normal">
                      Program Keahlian / Jurusan
                    </span>
                    <span className="font-semibold text-slate-900 text-sm leading-relaxed block tracking-normal">
                      {selectedPreviewAlumni.jurusan}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: Kontak & Komunikasi */}
              <div className="p-4 sm:p-4.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-3.5">
                {/* Nomor WhatsApp */}
                <div className="flex items-center justify-between gap-3 pt-1">
                  <div className="min-w-0 space-y-1">
                    <span className="text-xs font-medium text-slate-500 block leading-normal">
                      Nomor WhatsApp
                    </span>
                    <span className="font-mono font-semibold text-slate-900 text-sm tracking-wide flex items-center gap-2 leading-snug">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{selectedPreviewAlumni.noWhatsapp || "-"}</span>
                    </span>
                  </div>
                  {selectedPreviewAlumni.noWhatsapp && (
                    <a
                      href={`https://wa.me/${
                        selectedPreviewAlumni.noWhatsapp
                          .replace(/\D/g, "")
                          .startsWith("0")
                          ? "62" +
                            selectedPreviewAlumni.noWhatsapp
                              .replace(/\D/g, "")
                              .slice(1)
                          : selectedPreviewAlumni.noWhatsapp.replace(/\D/g, "")
                      }`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 rounded-full text-emerald-700 font-semibold hover:bg-slate-200 text-xs flex items-center gap-1.5 shrink-0 active:scale-95 shadow-2xs"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Chat</span>
                    </a>
                  )}
                </div>

                {/* Email */}
                <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-slate-100">
                  <div className="min-w-0 pr-2 space-y-1">
                    <span className="text-xs font-medium text-slate-500 block leading-normal">
                      Alamat Email
                    </span>
                    <span className="font-semibold text-slate-900 text-xs sm:text-sm truncate flex items-center gap-2 leading-snug tracking-normal">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">
                        {selectedPreviewAlumni.email || "-"}
                      </span>
                    </span>
                  </div>
                  {selectedPreviewAlumni.email && (
                    <a
                      href={`mailto:${selectedPreviewAlumni.email}`}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition shrink-0 active:scale-95"
                    >
                      Kirim Email
                    </a>
                  )}
                </div>
              </div>

              {/* Section 3: Informasi Tracer Study */}
              <div className="p-4 sm:p-4.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                {selectedPreviewAlumni.statusTracer === "SUDAH" ? (
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between gap-2 leading-relaxed">
                      <span className="text-slate-500 font-medium">
                        No. Registrasi / Submisi:
                      </span>
                      <span className="font-mono font-bold text-slate-900 tracking-wide text-xs sm:text-sm">
                        {selectedPreviewAlumni.submissionId || "-"}
                      </span>
                    </div>
                    {selectedPreviewAlumni.submittedAt && (
                      <div className="flex items-center justify-between gap-2 leading-relaxed pt-2 border-t border-slate-200/60">
                        <span className="text-slate-500 font-medium">
                          Waktu Pengisian:
                        </span>
                        <span className="text-slate-800 font-medium">
                          {new Date(
                            selectedPreviewAlumni.submittedAt,
                          ).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Alumni ini belum menyelesaikan pengisian kuesioner
                    penelusuran tamatan.
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              <div>
                {selectedPreviewAlumni.statusTracer === "BELUM" && (
                  <a
                    href={generateWaLink(selectedPreviewAlumni)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition active:scale-95"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    <span>Kirim Pengingat WA</span>
                  </a>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedPreviewAlumni(null)}
                className="px-5 py-2.5 rounded-xl bg-[#0d2346] hover:bg-[#163868] text-white text-xs font-semibold tracking-wide transition active:scale-95 cursor-pointer shadow-xs"
              >
                Tutup Preview
              </button>
            </div>
          </div>
        </div>
      )}

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
