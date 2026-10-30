import React, { useState } from "react";
import { JobVacancy, JobApplyType } from "@/types/tracer";
import { ArrowLeft } from "lucide-react";
import { CustomSelect } from "@/components/ui/CustomSelect";
import {
  JURUSAN_OPTIONS,
  JOB_TYPES,
  APPLY_TYPE_OPTIONS,
} from "./job-editor/jobEditorConstants";
import { ApplyChannelFields } from "./job-editor/ApplyChannelFields";
import { JobEditorPreview } from "./job-editor/JobEditorPreview";

export { JURUSAN_OPTIONS, JOB_TYPES, APPLY_TYPE_OPTIONS };

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
    applyType: JobApplyType;
    locationAddress?: string;
    walkInSchedule?: string;
    mapsUrl?: string;
    whatsappNumber?: string;
    whatsappTemplate?: string;
    emailAddress?: string;
    emailSubject?: string;
    externalUrl?: string;
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
    editingJob?.location || "Tangerang Selatan"
  );
  const [type, setType] = useState<JobVacancy["type"]>(
    editingJob?.type || "Full-time"
  );
  const [salary, setSalary] = useState(
    editingJob?.salary || "Rp 4.500.000 - Rp 6.500.000"
  );
  const [targetMajors, setTargetMajors] = useState<string[]>(
    editingJob?.targetMajors || ["Teknik Komputer dan Jaringan"]
  );
  const [deadline, setDeadline] = useState(
    editingJob?.deadline || "30 Okt 2026"
  );
  const [contactPerson, setContactPerson] = useState(
    editingJob?.contactPerson || "bkk@smksasmitajaya2.sch.id"
  );
  const [isBkkPartner, setIsBkkPartner] = useState(
    editingJob ? editingJob.isBkkPartner : true
  );
  const [description, setDescription] = useState(editingJob?.description || "");
  const [requirementsText, setRequirementsText] = useState(
    editingJob?.requirements?.join("\n") || ""
  );

  // Dynamic Apply Channels
  const [applyType, setApplyType] = useState<JobApplyType>(
    editingJob?.applyType || "email"
  );
  const [locationAddress, setLocationAddress] = useState(
    editingJob?.locationAddress || ""
  );
  const [walkInSchedule, setWalkInSchedule] = useState(
    editingJob?.walkInSchedule || ""
  );
  const [mapsUrl, setMapsUrl] = useState(editingJob?.mapsUrl || "");
  const [whatsappNumber, setWhatsappNumber] = useState(
    editingJob?.whatsappNumber || ""
  );
  const [whatsappTemplate, setWhatsappTemplate] = useState(
    editingJob?.whatsappTemplate || ""
  );
  const [emailAddress, setEmailAddress] = useState(
    editingJob?.emailAddress || ""
  );
  const [emailSubject, setEmailSubject] = useState(
    editingJob?.emailSubject || ""
  );
  const [externalUrl, setExternalUrl] = useState(
    editingJob?.externalUrl || ""
  );

  const toggleMajor = (major: string) => {
    setTargetMajors((prev) =>
      prev.includes(major) ? prev.filter((m) => m !== major) : [...prev, major]
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
        "Harap lengkapi judul posisi, nama perusahaan, dan deskripsi pekerjaan."
      );
      return;
    }

    if (targetMajors.length === 0) {
      showToast("Harap pilih minimal satu jurusan target.");
      return;
    }

    if (applyType === "whatsapp" && !whatsappNumber.trim()) {
      showToast("Harap isi nomor WhatsApp HRD mitra (contoh: 62812...).");
      return;
    }

    if (applyType === "walk_in" && !locationAddress.trim()) {
      showToast("Harap isi alamat lengkap lokasi kedatangan walk-in interview.");
      return;
    }

    if (applyType === "external_url" && !externalUrl.trim()) {
      showToast("Harap isi tautan (URL) portal rekrutmen resmi atau formulir.");
      return;
    }

    if (applyType === "email" && !emailAddress.trim() && !contactPerson.trim()) {
      showToast("Harap isi alamat email rekrutmen mitra.");
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
      contactPerson:
        contactPerson.trim() ||
        emailAddress.trim() ||
        "bkk@smksasmitajaya2.sch.id",
      isBkkPartner,
      description: description.trim(),
      requirements:
        requirements.length > 0 ? requirements : ["Lulusan SMK Sasmita Jaya 2"],
      applyType,
      locationAddress: locationAddress.trim(),
      walkInSchedule: walkInSchedule.trim(),
      mapsUrl: mapsUrl.trim(),
      whatsappNumber: whatsappNumber.replace(/\D/g, ""),
      whatsappTemplate: whatsappTemplate.trim(),
      emailAddress: emailAddress.trim(),
      emailSubject: emailSubject.trim(),
      externalUrl: externalUrl.trim(),
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
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
            title="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {editingJob ? "Sunting Lowongan Kerja" : "Tambah Lowongan Kerja Baru"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola informasi peluang karir, kriteria penerimaan, dan kanal lamaran bagi alumni
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl bg-[#0d2346] hover:bg-[#163868] text-white text-xs sm:text-sm font-semibold shadow-xs transition active:scale-95 cursor-pointer"
          >
            {editingJob ? "Simpan Perubahan" : "Terbitkan Lowongan"}
          </button>
        </div>
      </div>

      {/* Editor Main Form & Live Preview Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Fields (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5">
          {/* Field 1: Posisi & Perusahaan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900">
                Posisi / Judul Pekerjaan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: IT Network Support, Operator Mesin CNC"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-[#0d2346] focus:ring-2 focus:ring-[#0d2346]/10 focus:outline-none transition bg-slate-50/50 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900">
                Nama Perusahaan / Instansi <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Contoh: PT Telkom Indonesia, PT Astra Otoparts"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-[#0d2346] focus:ring-2 focus:ring-[#0d2346]/10 focus:outline-none transition bg-slate-50/50 focus:bg-white"
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
                placeholder="Tangerang Selatan, Jakarta Barat"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-[#0d2346] focus:ring-2 focus:ring-[#0d2346]/10 focus:outline-none transition bg-slate-50/50 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900">
                Tipe Ikatan Kerja
              </label>
              <CustomSelect
                value={type}
                onChange={(val) => setType(val as JobVacancy["type"])}
                options={JOB_TYPES.map((t) => ({ value: t, label: t }))}
                className="text-xs sm:text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900">
                Kisaran Gaji / Benefit
              </label>
              <input
                type="text"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="Rp 4.500.000 - Rp 6.000.000 / UMR"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-[#0d2346] focus:ring-2 focus:ring-[#0d2346]/10 focus:outline-none transition bg-slate-50/50 focus:bg-white"
              />
            </div>
          </div>

          {/* Field 3: Deadline & Kontak Umum */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900">
                Batas Akhir Pendaftaran
              </label>
              <input
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="Contoh: 30 November 2026 / Segera"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-[#0d2346] focus:ring-2 focus:ring-[#0d2346]/10 focus:outline-none transition bg-slate-50/50 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900">
                Kontak PIC Bursa Kerja / Email BKK
              </label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="bkk@smksasmitajaya2.sch.id"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-[#0d2346] focus:ring-2 focus:ring-[#0d2346]/10 focus:outline-none transition bg-slate-50/50 focus:bg-white"
              />
            </div>
          </div>

          {/* Field 4: Mitra Resmi BKK */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="block text-xs font-bold text-slate-900">
                Tandai sebagai Perusahaan Mitra Resmi BKK
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Menampilkan badge terverifikasi kemitraan resmi SMK Sasmita Jaya 2
              </p>
            </div>
            <input
              type="checkbox"
              checked={isBkkPartner}
              onChange={(e) => setIsBkkPartner(e.target.checked)}
              className="w-5 h-5 rounded text-[#0d2346] accent-[#0d2346] cursor-pointer"
            />
          </div>

          {/* DYNAMIC FIELD SECTION: METODE PENDAFTARAN MITRA */}
          <ApplyChannelFields
            applyType={applyType}
            setApplyType={setApplyType}
            emailAddress={emailAddress}
            setEmailAddress={setEmailAddress}
            emailSubject={emailSubject}
            setEmailSubject={setEmailSubject}
            whatsappNumber={whatsappNumber}
            setWhatsappNumber={setWhatsappNumber}
            whatsappTemplate={whatsappTemplate}
            setWhatsappTemplate={setWhatsappTemplate}
            locationAddress={locationAddress}
            setLocationAddress={setLocationAddress}
            walkInSchedule={walkInSchedule}
            setWalkInSchedule={setWalkInSchedule}
            mapsUrl={mapsUrl}
            setMapsUrl={setMapsUrl}
            externalUrl={externalUrl}
            setExternalUrl={setExternalUrl}
            title={title}
            company={company}
          />

          {/* Field 5: Sasaran Jurusan */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900">
                Sasaran Program Keahlian <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={selectAllMajors}
                className="text-xs text-[#0d2346] hover:underline font-semibold cursor-pointer"
              >
                {targetMajors.length === JURUSAN_OPTIONS.length
                  ? "Batal Pilih Semua"
                  : "Pilih Semua Jurusan"}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {JURUSAN_OPTIONS.map((major) => {
                const isChecked = targetMajors.includes(major);
                return (
                  <label
                    key={major}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition ${
                      isChecked
                        ? "bg-slate-50 border-[#0d2346] text-[#0d2346] font-semibold"
                        : "border-slate-200 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleMajor(major)}
                      className="w-4 h-4 rounded text-[#0d2346] accent-[#0d2346]"
                    />
                    <span>{major}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Field 6: Deskripsi Pekerjaan */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-900">
              Deskripsi Pekerjaan & Tanggung Jawab <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan gambaran umum pekerjaan, tugas harian, dan lingkungan kerja..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-[#0d2346] focus:ring-2 focus:ring-[#0d2346]/10 focus:outline-none transition bg-slate-50/50 focus:bg-white leading-relaxed"
            />
          </div>

          {/* Field 7: Persyaratan & Kualifikasi */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-900">
                Persyaratan & Kualifikasi
              </label>
              <span className="text-[11px] text-slate-400">
                Tulis satu baris untuk tiap poin kualifikasi
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
        <JobEditorPreview
          title={title}
          company={company}
          location={location}
          type={type}
          salary={salary}
          targetMajors={targetMajors}
          deadline={deadline}
          isBkkPartner={isBkkPartner}
          description={description}
          requirementsText={requirementsText}
          applyType={applyType}
          whatsappNumber={whatsappNumber}
          emailAddress={emailAddress}
          contactPerson={contactPerson}
        />
      </div>
    </div>
  );
};
