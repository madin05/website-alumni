import React, { useState, useEffect } from "react";
import { useContentStore } from "@/store/contentStore";
import { JobVacancy } from "@/types/tracer";
import {
  Plus,
  Search,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  Edit3,
  Trash2,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Pagination } from "@/components/ui/Pagination";
import { AdminJobEditor, JURUSAN_OPTIONS, JOB_TYPES } from "./AdminJobEditor";

const SolidBriefcaseIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5 text-[#0d2346]",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.1 0 2-.89 2-2V8c0-1.1-.89-2-2-2zm-6 0h-4V4h4v2z" />
  </svg>
);

export const AdminJobsTab: React.FC = () => {
  const { jobList, addJob, updateJob, deleteJob, fetchJobsFromBackend } = useContentStore();

  const [viewMode, setViewMode] = useState<"list" | "editor">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("Semua");
  const [selectedMajor, setSelectedMajor] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchJobsFromBackend();
  }, [fetchJobsFromBackend]);

  // Editor State
  const [editingJob, setEditingJob] = useState<JobVacancy | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");


  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  }

  const handleOpenEditor = (job: JobVacancy | null) => {
    setEditingJob(job);
    setViewMode("editor");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const handleSaveJob = (data: {
    title: string;
    company: string;
    location: string;
    type: JobVacancy["type"];
    salary: string;
    targetMajors: string[];
    deadline: string;
    contactPerson: string;
    isBkkPartner: boolean;
    description: string;
    requirements: string[];
  }) => {
    const todayStr = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    if (editingJob) {
      updateJob(editingJob.id, {
        ...data,
      });
      showToast("Lowongan kerja berhasil diperbarui dan disinkronkan ke Dashboard Alumni!");
    } else {
      addJob({
        ...data,
        postedAt: todayStr,
      });
      showToast("Lowongan baru berhasil ditambahkan dan langsung tampil di Dashboard Alumni!");
    }

    setViewMode("list");
  }

  const handleDelete = (id: string) => {
    deleteJob(id);
    setDeleteConfirmId(null);
    showToast("Lowongan kerja berhasil dihapus dari sistem.");
  }

  // Reset pagination when search query or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedType, selectedMajor]);

  // Filtered Jobs
  const filteredJobs = jobList.filter((job) => {
    const matchSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = selectedType === "Semua" || job.type === selectedType;
    const matchMajor =
      selectedMajor === "Semua" ||
      job.targetMajors.some((m) =>
        m.toLowerCase().includes(selectedMajor.toLowerCase())
      );
    return matchSearch && matchType && matchMajor;
  });

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-[#0d2346] text-white rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">
            {toastMessage}
          </span>
        </div>
      )}

      {/* VIEW 1: DEDICATED EDITOR PAGE */}
      {viewMode === "editor" ? (
        <AdminJobEditor
          editingJob={editingJob}
          onSave={handleSaveJob}
          onCancel={() => setViewMode("list")}
          showToast={showToast}
        />
      ) : (
        /* VIEW 2: LIST VIEW OF ALL JOBS */
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header Banner */}
          <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <SolidBriefcaseIcon className="w-5 h-5 text-[#0d2346] shrink-0" />
                <span>Kelola Lowongan Kerja & Karir Alumni</span>
              </h1>
            </div>

            <button
              type="button"
              onClick={() => handleOpenEditor(null)}
              className="px-4 py-2 rounded-xl bg-[#0d2346] hover:bg-[#163868] text-white text-xs font-semibold shadow-xs transition active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Lowongan Baru</span>
            </button>
          </div>

          {/* Quick Stat Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Total Loker Aktif
                </p>
                <p className="text-2xl font-bold text-[#0d2346] mt-1">
                  {jobList.length}
                </p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Tersedia untuk Alumni
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Mitra DUDI Resmi
                </p>
                <p className="text-2xl font-bold text-[#0d2346] mt-1">
                  {jobList.filter((j) => j.isBkkPartner).length}
                </p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Terverifikasi BKK
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Jurusan Tercover
                </p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  6 Program
                </p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  100% Sesuai Keahlian
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto flex-1">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari posisi, PT, lokasi..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0d2346]/10 focus:border-[#0d2346] transition"
                />
              </div>

              <CustomSelect
                options={["Semua", ...JOB_TYPES].map((t) => ({
                  value: t,
                  label: t === "Semua" ? "Semua Tipe Pekerjaan" : t,
                }))}
                value={selectedType}
                onChange={(val) => setSelectedType(val)}
              />

              <CustomSelect
                options={["Semua", ...JURUSAN_OPTIONS].map((m) => ({
                  value: m,
                  label: m === "Semua" ? "Semua Target Jurusan" : m,
                }))}
                value={selectedMajor}
                onChange={(val) => setSelectedMajor(val)}
              />
            </div>

            <div className="text-xs text-slate-500 font-medium self-end md:self-center shrink-0">
              Menampilkan{" "}
              <strong className="text-slate-800">{filteredJobs.length}</strong>{" "}
              lowongan
            </div>
          </div>

          {/* Jobs Card List */}
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">
                Tidak ada lowongan ditemukan
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Coba sesuaikan kata kunci pencarian atau filter tipe pekerjaan.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 content-start min-h-[520px]">
              {paginatedJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Header: Type and BKK Partner Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {job.type}
                      </span>
                      {job.isBkkPartner && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-700">
                          <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                          <span>Mitra DUDI</span>
                        </span>
                      )}
                    </div>

                    {/* Job Title and Company */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0d2346] transition leading-snug line-clamp-1">
                        {job.title}
                      </h3>
                      <p className="text-xs font-semibold text-slate-600 mt-1 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="line-clamp-1">{job.company}</span>
                      </p>
                    </div>

                    {/* Location, Salary and Dates Box */}
                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{job.location}</span>
                        </span>
                        <span className="font-bold text-slate-900 shrink-0">
                          {job.salary}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          Diposting: {job.postedAt}
                        </span>
                        <span className="flex items-center gap-1 text-rose-600 font-semibold">
                          <Clock className="w-3 h-3" />
                          Batas: {job.deadline}
                        </span>
                      </div>
                    </div>

                    {/* Target Majors */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold  tracking-wider text-slate-400 block">
                        Sasaran Program:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {job.targetMajors.slice(0, 2).map((m) => (
                          <span
                            key={m}
                            className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200 truncate max-w-[170px]"
                            title={m}
                          >
                            {m}
                          </span>
                        ))}
                        {job.targetMajors.length > 2 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                            +{job.targetMajors.length - 2}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Excerpt of Description */}
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500 font-medium truncate max-w-[120px]">
                      {job.contactPerson}
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenEditor(job)}
                        className="px-2.5 py-1.5 text-slate-700 text-xs font-semibold flex items-center gap-1 transition shadow-2xs cursor-pointer"
                        title="Edit Lowongan"
                      >
                        <Edit3 className="w-3 h-3 text-slate-600" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(job.id)}
                        className="px-2.5 py-1.5 text-rose-700 text-xs font-semibold flex items-center gap-1 transition shadow-2xs cursor-pointer"
                        title="Hapus Lowongan"
                      >
                        <Trash2 className="w-3 h-3 text-rose-600" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => setCurrentPage(p)}
            totalItems={filteredJobs.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteConfirmId}
        title="Konfirmasi Hapus Lowongan"
        message="Apakah Anda yakin ingin menghapus lowongan pekerjaan ini? Lowongan yang dihapus tidak akan lagi tampil di dashboard pencarian kerja alumni."
        confirmText="Hapus Lowongan"
        cancelText="Batal"
        type="danger"
        onConfirm={() => deleteConfirmId && handleDelete(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
      />
    </div>
  );
};

