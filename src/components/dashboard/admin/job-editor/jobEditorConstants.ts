import { JobVacancy, JurusanSMK, JobApplyType } from "@/types/tracer";

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

export const APPLY_TYPE_OPTIONS: {
  value: JobApplyType;
  label: string;
  desc: string;
}[] = [
  {
    value: "email",
    label: "Email Rekrutmen",
    desc: "Alumni mengirimkan berkas CV via email HRD",
  },
  {
    value: "whatsapp",
    label: "WhatsApp HRD",
    desc: "Alumni menghubungi HRD mitra via pesan chat terformat",
  },
  {
    value: "walk_in",
    label: "Walk-in Interview",
    desc: "Alumni hadir langsung membawa berkas ke lokasi",
  },
  {
    value: "external_url",
    label: "Portal Karir Resmi",
    desc: "Alumni mendaftar via formulir / sistem website mitra",
  },
];

