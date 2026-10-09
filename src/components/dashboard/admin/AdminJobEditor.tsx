import React, { useState } from "react";
import { JobVacancy, JurusanSMK } from "@/types/tracer";
import {
  ArrowLeft,
  ShieldCheck,
  Building2,
  MapPin,
  Clock,
  Calendar,
} from "lucide-react";
import { CustomSelect } from "@/components/ui/CustomSelect";

export const JURUSAN_OPTIONS: JurusanSMK[] = [
  "Teknik Komputer dan Jaringan",
  "Teknik Pemesinan",
  "Teknik Instalasi Tenaga Listrik",
  "Teknik Elektronika Industri",
  "Teknik Kendaraan Ringan Otomotif",
  "Teknik dan Bisnis Sepeda Motor",
];

export const JOB_TYPES: JobVacancy["type"][] = [
  "Full-time",
  "Internship / Magang",
  "Kontrak",
  "Part-time",
];

export interface AdminJobEditorProps {
  editingJob: JobVacancy | null;
  onSave: (data: {
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
  }) => void;
  onCancel: () => void;
  showToast: (msg: string) => void;
}

export const AdminJobEditor: React.FC<AdminJobEditorProps> = ({
  editingJob,
  onSave,
  onCancel,
  showToast,
}) => {
  const [title, setTitle] = useState(editingJob?.title || "");
  const [company, setCompany] = useState(editingJob?.company || "");
  const [location, setLocation] = useState(
    editingJob?.location || "Tangerang Selatan",
  );
  const [type, setType] = useState<JobVacancy["type"]>(
    editingJob?.type || "Full-time",
  );
  const [salary, setSalary] = useState(
    editingJob?.salary || "Rp 4.500.000 - Rp 6.500.000",
  );
  const [targetMajors, setTargetMajors] = useState<string[]>(
    editingJob?.targetMajors || ["Teknik Komputer dan Jaringan"],
  );
  const [deadline, setDeadline] = useState(
    editingJob?.deadline || "30 Okt 2026",
  );
  const [contactPerson, setContactPerson] = useState(
    editingJob?.contactPerson || "bkk@smksasmitajaya2.sch.id",
  );
  const [isBkkPartner, setIsBkkPartner] = useState(
    editingJob ? editingJob.isBkkPartner : true,
  );
  const [description, setDescription] = useState(editingJob?.description || "");
  const [requirementsText, setRequirementsText] = useState(
    editingJob?.requirements?.join("\n") || "",
  );

  const toggleMajor = (major: string) => {
    setTargetMajors((prev) =>
      prev.includes(major) ? prev.filter((m) => m !== major) : [...prev, major],
    );
  };

  const selectAllMajors = () => {
    if (targetMajors.length === JURUSAN_OPTIONS.length) {
      setTargetMajors([]);
    } else {
      setTargetMajors([...JURUSAN_OPTIONS]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !company.trim() || !description.trim()) {
      showToast(
        "Harap lengkapi judul posisi, nama perusahaan, dan deskripsi pekerjaan.",
      );
      return;
    }

    if (targetMajors.length === 0) {
      showToast("Harap pilih minimal satu jurusan target.");
      return;
    }

    const requirements = requirementsText
      .split("\n")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    onSave({
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      type,
      salary: salary.trim(),
      targetMajors,
      deadline: deadline.trim(),
      contactPerson: contactPerson.trim(),
      isBkkPartner,
      description: description.trim(),
      requirements:
        requirements.length > 0 ? requirements : ["Lulusan SMK Sasmita Jaya 2"],
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Editor Header Navigation */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 text-slate-700 transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Kembali ke daftar lowongan"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
            <span>Kembali</span>
          </button>

          <div>
            <h1 className="text-base sm:text-lg font-bold text-[#0d2346]">
              {editingJob
                ? "Edit Lowongan Kerja"
                : "Tambah Lowongan Kerja Baru"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 rounded-xl bg-[#0d2346] hover:bg-[#163868] text-white text-xs sm:text-sm font-bold shadow-xs transition active:scale-95 cursor-pointer"
          >
            {editingJob ? "Simpan Perubahan Loker" : "Publikasikan Lowongan"}
          </button>
        </div>
      </div>

      {/* Form and Live Preview 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Column (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5">
          {/* Field 1: Posisi & Perusahaan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900">
                Posisi / Judul Pekerjaan{" "}
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Junior Network Administrator"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-[#0d2346] focus:ring-2 focus:ring-[#0d2346]/10 focus:outline-none transition bg-slate-50/50 focus:bg-white"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900">
                Nama Perusahaan / Instansi{" "}
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Contoh: PT Solusi Teknologi Nusantara"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-[#0d2346] focus:ring-2 focus:ring-[#0d2346]/10 focus:outline-none transition bg-slate-50/50 focus:bg-white"
                required
              />
            </div>
          </div>

          {/* Field 2: Lokasi, Tipe, Gaji */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900">
                Lokasi Penempatan
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: Tangerang Selatan"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-[#0d2346] focus:ring-2 focus:ring-[#0d2346]/10 focus:outline-none transition bg-slate-50/50 focus:bg-white"
              />
            </div>

            <CustomSelect
              label="Tipe Pekerjaan"
              options={JOB_TYPES.map((t) => ({ value: t, label: t }))}
              value={type}
              onChange={(val) => setType(val as JobVacancy["type"])}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900">
                Kisaran Gaji
              </label>
              <input
                type="text"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="Contoh: Rp 4.500.000 - Rp 6.500.000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-[#0d2346] focus:ring-2 focus:ring-[#0d2346]/10 focus:outline-none transition bg-slate-50/50 focus:bg-white"
              />
            </div>
          </div>

          {/* Field 3: Deadline & Kontak */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900">
                Batas Akhir Pendaftaran (Deadline)
              </label>
              <input
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="Contoh: 30 Okt 2026"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-[#0d2346] focus:ring-2 focus:ring-[#0d2346]/10 focus:outline-none transition bg-slate-50/50 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900">
                Kontak / Email Lamaran
              </label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="Email HRD atau kontak WA BKK"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-[#0d2346] focus:ring-2 focus:ring-[#0d2346]/10 focus:outline-none transition bg-slate-50/50 focus:bg-white"
              />
            </div>
          </div>

          {/* Field 4: Mitra Resmi BKK Sasmita Card */}
          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Tandai sebagai Mitra Resmi BKK Sasmita
                </span>
                <p className="text-[11px] text-slate-500">
                  Memberikan badge resmi verifikasi DUDI mitra sekolah pada
                  kartu lowongan.
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isBkkPartner}
              onChange={(e) => setIsBkkPartner(e.target.checked)}
              className="w-5 h-5 rounded text-[#0d2346] accent-[#0d2346] cursor-pointer"
            />
          </div>

          {/* Field 5: Sasaran Jurusan */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900">
                Sasaran Program Keahlian{" "}
                <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={selectAllMajors}
                className="text-[11px] text-blue-700 hover:underline cursor-pointer"
              >
                {targetMajors.length === JURUSAN_OPTIONS.length
                  ? "Batal Pilih Semua"
                  : "Pilih Semua Jurusan"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-4 bg-slate-50/80 rounded-xl border border-slate-200">
              {JURUSAN_OPTIONS.map((major) => {
                const isChecked = targetMajors.includes(major);
                return (
                  <label
                    key={major}
                    className={`flex items-center gap-2.5 p-2.5 text-xs font-medium cursor-pointer transition ${
                      isChecked
                        ? " text-[#0d2346] font-semibold shadow-2xs"
                        : "  text-slate-700 hover:bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleMajor(major)}
                      className="w-4 h-4 rounded text-[#0d2346] accent-[#0d2346] cursor-pointer"
                    />
                    <span className="truncate">{major}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Field 6: Deskripsi Pekerjaan */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-900">
              Deskripsi Pekerjaan <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan ruang lingkup peran utama, tanggung jawab operasional, dan gambaran tugas harian..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-[#0d2346] focus:ring-2 focus:ring-[#0d2346]/10 focus:outline-none transition bg-slate-50/50 focus:bg-white leading-relaxed"
              required
            />
          </div>

          {/* Field 7: Persyaratan & Kualifikasi */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-900">
                Persyaratan & Kualifikasi Pelamar
              </label>
              <span className="text-[11px] text-slate-400">
                Pisahkan 1 kualifikasi per baris (Enter)
              </span>
            </div>
            <textarea
              rows={4}
              value={requirementsText}
              onChange={(e) => setRequirementsText(e.target.value)}
              placeholder="Lulusan SMK Sasmita Jaya 2&#10;Memiliki sertifikat kompetensi BNSP&#10;Mampu bekerjasama dalam tim kerja industri&#10;Disiplin dan teliti"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-[#0d2346] focus:ring-2 focus:ring-[#0d2346]/10 focus:outline-none transition bg-slate-50/50 focus:bg-white leading-relaxed"
            />
          </div>
        </div>

        {/* Right Column: Live Preview (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4 sticky top-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0d2346]">
              <span>Pratinjau</span>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              Live Preview
            </span>
          </div>

          {/* Card Preview */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                    {type}
                  </span>
                  {isBkkPartner && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold">
                      <ShieldCheck className="w-3 h-3" />
                      Mitra BKK
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-[#0d2346] leading-tight">
                  {title || "Judul Posisi Pekerjaan"}
                </h4>
                <p className="text-xs font-semibold text-slate-600 mt-0.5 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-slate-400" />
                  <span>{company || "Nama Perusahaan / DUDI"}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <div className="flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{location || "Lokasi"}</span>
              </div>
              <div className="flex items-center gap-1 truncate font-semibold text-slate-800">
                <span className="truncate">{salary || "Gaji"}</span>
              </div>
              <div className="flex items-center gap-1 truncate text-slate-500">
                <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">
                  Batas: {deadline || "30 Okt 2026"}
                </span>
              </div>
              <div className="flex items-center gap-1 truncate text-slate-500">
                <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                <span>Dibuat: Baru saja</span>
              </div>
            </div>

            {/* Target Majors Tags */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold  tracking-wider text-slate-400 block">
                Sasaran Jurusan ({targetMajors.length}):
              </span>
              <div className="flex flex-wrap gap-1">
                {targetMajors.slice(0, 3).map((m) => (
                  <span
                    key={m}
                    className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {m}
                  </span>
                ))}
                {targetMajors.length > 3 && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-200 text-slate-700">
                    +{targetMajors.length - 3} lainnya
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
              {description ||
                "Deskripsi pekerjaan akan ditampilkan di sini sebagai ringkasan informasi bagi para alumni yang ingin melamar."}
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="truncate max-w-[150px]">
                {contactPerson || "Kontak Lamaran"}
              </span>
              <span className="font-bold text-[#0d2346]">
                {
                  requirementsText
                    .split("\n")
                    .filter((r) => r.trim().length > 0).length
                }{" "}
                Kualifikasi
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed italic text-center">
            Perubahan pada form otomatis terupdate secara instan pada pratinjau
            kartu di atas.
          </p>
        </div>
      </div>
    </div>
  );
};
