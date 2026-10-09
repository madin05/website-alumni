import React, { useState } from "react";
import {
  useAdminStore,
  RespondentRecord,
  VerificationStatus,
} from "@/store/adminStore";
import { AdminRespondentDetailDrawer } from "./AdminRespondentDetailDrawer";
import {
  FileCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  Building,
  GraduationCap,
  Store,
  Check,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Pagination } from "@/components/ui/Pagination";

const SolidFileCheckIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 text-[#0d2346]" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
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
  const { respondents, updateVerificationStatus } = useAdminStore();

  const [search, setSearch] = useState("");
  const [jurusanFilter, setJurusanFilter] = useState("ALL");
  const [aktivitasFilter, setAktivitasFilter] = useState("ALL");
  const [verificationFilter, setVerificationFilter] = useState<
    "ALL" | VerificationStatus
  >("ALL");
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

  const filteredRespondents = respondents.filter((r) => {
    const matchSearch =
      r.nama.toLowerCase().includes(search.toLowerCase()) ||
      r.nisn.includes(search) ||
      r.instansiKampusUsaha.toLowerCase().includes(search.toLowerCase());

    const matchJurusan = jurusanFilter === "ALL" || r.jurusan === jurusanFilter;

    const matchAktivitas =
      aktivitasFilter === "ALL" ||
      r.statusKegiatan === aktivitasFilter ||
      (aktivitasFilter === "KERJA" &&
        (r.statusKegiatan === "KERJA" ||
          r.statusKegiatan === "KERJA_KULIAH")) ||
      (aktivitasFilter === "KULIAH" &&
        (r.statusKegiatan === "KULIAH" ||
          r.statusKegiatan === "KERJA_KULIAH" ||
          r.statusKegiatan === "WIRAUSAHA_KULIAH"));

    const matchVerification =
      verificationFilter === "ALL" ||
      r.verificationStatus === verificationFilter;

    return matchSearch && matchJurusan && matchAktivitas && matchVerification;
  });

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, jurusanFilter, aktivitasFilter, verificationFilter]);

  const sortedRespondents = [...filteredRespondents].sort((a, b) => {
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

  const totalPages = Math.ceil(sortedRespondents.length / itemsPerPage);
  const paginatedRespondents = sortedRespondents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const countPending = respondents.filter(
    (r) => r.verificationStatus === "PENDING",
  ).length;
  const countValid = respondents.filter(
    (r) => r.verificationStatus === "VALID",
  ).length;
  const countRevisi = respondents.filter(
    (r) => r.verificationStatus === "REVISI",
  ).length;

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
      case "WIRAUSAHA_KULIAH":
        return (
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-800">
            <Store className="w-3.5 h-3.5 text-slate-600" />
            <span>Wirausaha</span>
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

  const renderVerificationBadge = (status: VerificationStatus) => {
    switch (status) {
      case "VALID":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 font-medium bg-slate-50 text-slate-800">
            <span>Disetujui</span>
          </span>
        );
      case "REVISI":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 font-medium bg-rose-50 text-rose-800">
            <span>Perlu Perbaikan</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 font-medium bg-slate-50 text-slate-800">
            <span>Menunggu Tinjauan</span>
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
            <span>
              Verifikasi Kuesioner Alumni
            </span>
          </h2>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-3">
        {/* Verification Status Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-100 text-xs">
          <button
            onClick={() => setVerificationFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              verificationFilter === "ALL"
                ? "bg-[#0d2346] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Semua Isian ({respondents.length})
          </button>
          <button
            onClick={() => setVerificationFilter("PENDING")}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
              verificationFilter === "PENDING"
                ? "bg-slate-700 text-white shadow-xs"
                : "bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-200/60"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Menunggu Tinjauan ({countPending})</span>
          </button>
          <button
            onClick={() => setVerificationFilter("VALID")}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
              verificationFilter === "VALID"
                ? "bg-slate-700 text-white shadow-xs"
                : "bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-200/60"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Disetujui ({countValid})</span>
          </button>
          <button
            onClick={() => setVerificationFilter("REVISI")}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
              verificationFilter === "REVISI"
                ? "bg-rose-700 text-white shadow-xs"
                : "bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200/60"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Perlu Perbaikan ({countRevisi})</span>
          </button>
        </div>

        {/* Search & Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <Input
              placeholder="Cari berdasarkan nama, NISN, atau instansi tempat beraktivitas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />
          </div>
          <div className="sm:col-span-3">
            <CustomSelect
              value={jurusanFilter}
              onChange={(v) => setJurusanFilter(v)}
              options={JURUSAN_OPTIONS}
            />
          </div>
          <div className="sm:col-span-3">
            <CustomSelect
              value={aktivitasFilter}
              onChange={(v) => setAktivitasFilter(v)}
              options={STATUS_AKTIVITAS_OPTIONS}
            />
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
                        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
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
                    <span>NISN & Nama Lengkap</span>
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
                <th className="py-2.5 px-3 font-semibold">Jurusan & Angkatan</th>
                <th className="py-2.5 px-3 font-semibold">Aktivitas Lulusan</th>
                <th className="py-2.5 px-3 font-semibold">
                  Instansi / Perusahaan / Usaha
                </th>
                <th className="py-2.5 px-3 font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      if (sortField !== "tanggal") {
                        setSortField("tanggal");
                        setSortOrder("desc");
                      } else {
                        setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
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
                    <span>Tanggal Kirim</span>
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
                <th className="py-2.5 px-3 font-semibold">Status Verifikasi</th>
                <th className="py-2.5 px-3 font-semibold text-center">Rincian</th>
                <th className="py-2.5 px-3 font-semibold text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-[11px]">
              {paginatedRespondents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-slate-500 text-xs">
                    Tidak ditemukan data kuesioner yang sesuai dengan kriteria
                    pencarian.
                  </td>
                </tr>
              ) : (
                paginatedRespondents.map((rsp) => (
                  <tr
                    key={rsp.submissionId}
                    className="hover:bg-slate-50 transition cursor-pointer"
                    onClick={() => setSelectedRespondent(rsp)}
                  >
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900 text-[11px]">
                        {rsp.nama}
                      </div>
                      <div className="font-mono text-[9.5px] text-slate-500">
                        {rsp.nisn}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-slate-800 text-[11px]">
                        {rsp.jurusan}
                      </div>
                      <div className="text-[9.5px] text-slate-400">
                        Angkatan {rsp.tahunLulus}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      {renderAktivitasBadge(rsp.statusKegiatan)}
                    </td>
                    <td className="py-2.5 px-3 max-w-[200px] truncate">
                      <div className="font-medium text-slate-900 text-[11px] truncate">
                        {rsp.instansiKampusUsaha}
                      </div>
                      <div className="text-[9.5px] text-slate-500 truncate">
                        {rsp.jabatanProdiUsaha}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[10px]">
                      {new Date(rsp.submittedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-2.5 px-3 text-[10px]">
                      {renderVerificationBadge(rsp.verificationStatus)}
                    </td>
                    <td
                      className="py-2.5 px-3 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedRespondent(rsp)}
                        className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium transition text-[10px] cursor-pointer shadow-2xs"
                        title="Lihat rincian kuesioner"
                      >
                        <Eye className="w-3 h-3 text-slate-600" />
                        <span>Rincian</span>
                      </button>
                    </td>
                    <td
                      className="py-2.5 px-3 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {rsp.verificationStatus !== "VALID" ? (
                        <button
                          type="button"
                          onClick={() =>
                            updateVerificationStatus(
                              rsp.submissionId,
                              "VALID",
                            )
                          }
                          className="p-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-emerald-700 transition cursor-pointer inline-flex items-center justify-center shadow-2xs"
                          title="Setujui data kuesioner"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="inline-flex items-center justify-center p-1 text-emerald-600" title="Sudah Terverifikasi">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
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

      {/* Detail & Verification Drawer */}
      <AdminRespondentDetailDrawer
        respondent={selectedRespondent}
        onClose={() => {
          setSelectedRespondent(null);
          onClearInitialSelectedId?.();
        }}
      />
    </div>
  );
};
