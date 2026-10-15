/**
 * Validasi sisi klien untuk membuat & mengedit berita serta loker.
 *
 * Aturan dibuat SAMA PERSIS dengan skema zod di backend
 * (backend/src/modules/news/schemas.ts & jobs/schemas.ts) supaya:
 *   1. Input yang tidak memenuhi syarat minimum TIDAK PERNAH masuk ke
 *      local state maupun dikirim ke server.
 *   2. Pesan peringatan yang tampil di form jelas dan spesifik
 *      (mis. "minimal 10 karakter").
 */

export interface FieldErrors {
  [field: string]: string;
}

const hasErrors = (errors: FieldErrors): boolean =>
  Object.keys(errors).length > 0;

export function firstError(errors: FieldErrors): string | null {
  const keys = Object.keys(errors);
  return keys.length > 0 ? errors[keys[0]] : null;
}

/**
 * Ambil semua pesan error dalam bentuk urutan (untuk warning banner).
 */
export function errorList(errors: FieldErrors): string[] {
  return Object.values(errors);
}

/* ------------------------------------------------------------------ */
/* Parser tanggal Indonesia: "12 Okt 2026", "30 Oktober 2026", ISO     */
/* ------------------------------------------------------------------ */

const INDONESIAN_MONTHS: Record<string, number> = {
  jan: 0, januari: 0,
  feb: 1, februari: 1,
  mar: 2, maret: 2,
  apr: 3, april: 3,
  mei: 4,
  jun: 5, juni: 5,
  jul: 6, juli: 6,
  agu: 7, agustus: 7,
  sep: 8, september: 8,
  okt: 9, oktober: 9,
  nov: 10, november: 10,
  des: 11, desember: 11,
};

/**
 * Parse string tanggal beragam format menjadi Date valid.
 * SELALU mengembalikan Date yang valid (fallback: Date.now()).
 */
export function parseIndonesianDate(dateStr: string | undefined | null): Date {
  if (!dateStr || !dateStr.trim()) return new Date();
  const trimmed = dateStr.trim();
  const parts = trimmed.split(/\s+/);
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const monthKey = parts[1].toLowerCase().replace(/\./g, '');
    const month = INDONESIAN_MONTHS[monthKey];
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && month !== undefined && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }
  const parsed = new Date(trimmed);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

/** true jika string tanggal bisa diparse (untuk validasi masuk user). */
export function isParseableDate(dateStr: string | undefined | null): boolean {
  if (!dateStr || !dateStr.trim()) return false;
  const trimmed = dateStr.trim();
  const parts = trimmed.split(/\s+/);
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const monthKey = parts[1].toLowerCase().replace(/\./g, '');
    const month = INDONESIAN_MONTHS[monthKey];
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && month !== undefined && !isNaN(year)) return true;
  }
  return !isNaN(new Date(trimmed).getTime());
}

/* ------------------------------------------------------------------ */
/* Validasi Berita (mirror newsCreateSchema)                           */
/*                                                                     */
/* title    : min 3,  max 200                                          */
/* excerpt  : min 10                                                   */
/* content  : min 20                                                   */
/* category : min 2,  max 50                                           */
/* readTime : min 1,  max 20                                           */
/* author   : min 2,  max 100                                          */
/* ------------------------------------------------------------------ */

export interface NewsValidationInput {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  readTime: string;
}

export function validateNewsInput(input: NewsValidationInput): FieldErrors {
  const errors: FieldErrors = {};

  const title = input.title.trim();
  if (title.length === 0) {
    errors.title = 'Judul berita wajib diisi.';
  } else if (title.length < 3) {
    errors.title = `Judul terlalu pendek — minimal 3 karakter (kini ${title.length}).`;
  } else if (title.length > 200) {
    errors.title = `Judul terlalu panjang — maksimal 200 karakter (kini ${title.length}).`;
  }

  const excerpt = input.excerpt.trim();
  if (excerpt.length === 0) {
    errors.excerpt = 'Ringkasan singkat wajib diisi.';
  } else if (excerpt.length < 10) {
    errors.excerpt = `Ringkasan terlalu pendek — minimal 10 karakter (kini ${excerpt.length}).`;
  }

  const content = input.content.trim();
  if (content.length === 0) {
    errors.content = 'Isi berita wajib diisi.';
  } else if (content.length < 20) {
    errors.content = `Isi berita terlalu pendek — minimal 20 karakter (kini ${content.length}).`;
  }

  const category = (input.category ?? '').trim();
  if (category.length < 2) {
    errors.category = 'Kategori minimal 2 karakter.';
  } else if (category.length > 50) {
    errors.category = 'Kategori maksimal 50 karakter.';
  }

  const author = input.author.trim();
  if (author.length < 2) {
    errors.author = 'Nama penulis minimal 2 karakter.';
  } else if (author.length > 100) {
    errors.author = 'Nama penulis maksimal 100 karakter.';
  }

  const readTime = input.readTime.trim();
  if (readTime.length < 1) {
    errors.readTime = 'Estimasi baca wajib diisi.';
  } else if (readTime.length > 20) {
    errors.readTime = 'Estimasi baca maksimal 20 karakter.';
  }

  return errors;
}

export function hasNewsErrors(errors: FieldErrors): boolean {
  return hasErrors(errors);
}

/* ------------------------------------------------------------------ */
/* Validasi Loker (mirror jobCreateSchema)                             */
/*                                                                     */
/* title          : min 3,  max 100                                    */
/* company        : min 2,  max 100                                    */
/* location       : min 2,  max 100                                    */
/* salary         : min 1                                              */
/* type           : salah satu dari JOB_TYPES                          */
/* targetMajors   : minimal 1                                          */
/* deadline       : harus berupa tanggal valid                          */
/* contactPerson  : min 2,  max 100                                    */
/* description    : min 10                                             */
/* requirements   : minimal 1                                          */
/* ------------------------------------------------------------------ */

export const JOB_TYPE_VALUES = [
  'Full-time',
  'Internship / Magang',
  'Kontrak',
  'Part-time',
] as const;

export interface JobValidationInput {
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  targetMajors: string[];
  deadline: string;
  contactPerson: string;
  description: string;
  requirements: string[];
}

export function validateJobInput(input: JobValidationInput): FieldErrors {
  const errors: FieldErrors = {};

  const title = input.title.trim();
  if (title.length === 0) {
    errors.title = 'Posisi / judul pekerjaan wajib diisi.';
  } else if (title.length < 3) {
    errors.title = `Judul posisi terlalu pendek — minimal 3 karakter (kini ${title.length}).`;
  } else if (title.length > 100) {
    errors.title = `Judul posisi terlalu panjang — maksimal 100 karakter (kini ${title.length}).`;
  }

  const company = input.company.trim();
  if (company.length === 0) {
    errors.company = 'Nama perusahaan wajib diisi.';
  } else if (company.length < 2) {
    errors.company = `Nama perusahaan minimal 2 karakter (kini ${company.length}).`;
  } else if (company.length > 100) {
    errors.company = `Nama perusahaan maksimal 100 karakter (kini ${company.length}).`;
  }

  const location = input.location.trim();
  if (location.length < 2) {
    errors.location = `Lokasi minimal 2 karakter (kini ${location.length}).`;
  } else if (location.length > 100) {
    errors.location = `Lokasi maksimal 100 karakter (kini ${location.length}).`;
  }

  if (input.salary.trim().length < 1) {
    errors.salary = 'Kisaran gaji wajib diisi.';
  }

  if (!JOB_TYPE_VALUES.includes(input.type as (typeof JOB_TYPE_VALUES)[number])) {
    errors.type = 'Tipe pekerjaan tidak valid.';
  }

  if (!Array.isArray(input.targetMajors) || input.targetMajors.length === 0) {
    errors.targetMajors = 'Pilih minimal satu jurusan sasaran.';
  }

  if (!isParseableDate(input.deadline)) {
    errors.deadline =
      'Format deadline tidak valid. Contoh: "30 Okt 2026".';
  }

  const contactPerson = input.contactPerson.trim();
  if (contactPerson.length < 2) {
    errors.contactPerson = `Kontak / email lamaran minimal 2 karakter (kini ${contactPerson.length}).`;
  } else if (contactPerson.length > 100) {
    errors.contactPerson = `Kontak / email lamaran maksimal 100 karakter (kini ${contactPerson.length}).`;
  }

  const description = input.description.trim();
  if (description.length === 0) {
    errors.description = 'Deskripsi pekerjaan wajib diisi.';
  } else if (description.length < 10) {
    errors.description = `Deskripsi terlalu pendek — minimal 10 karakter (kini ${description.length}).`;
  }

  if (!Array.isArray(input.requirements) || input.requirements.length === 0) {
    errors.requirements = 'Isi minimal satu persyaratan kualifikasi.';
  }

  return errors;
}

export function hasJobErrors(errors: FieldErrors): boolean {
  return hasErrors(errors);
}
