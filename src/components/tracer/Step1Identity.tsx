import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step1Schema, STATUS_MENIKAH_OPTIONS } from "@/schemas/tracerSchema";
import { useTracerStore } from "@/store/tracerStore";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { z } from "zod";

type Step1FormData = z.infer<typeof step1Schema>;

interface Step1Props {
  onNext: () => void;
}

export const Step1Identity: React.FC<Step1Props> = ({ onNext }) => {
  const { user } = useAuthStore();
  const { identitas, updateIdentitas, loadSampleData } = useTracerStore();

  const userGender: "Laki-laki" | "Perempuan" =
    user?.jenisKelamin === "P" || user?.jenisKelamin === "Perempuan"
      ? "Perempuan"
      : "Laki-laki";

  const defaultNama = user?.nama || identitas.nama_lengkap || "";
  const defaultNisn = user?.nisn || identitas.nisn || "";
  const defaultTahunLulus = user?.tahun_lulus || identitas.tahun_lulus || 2025;
  const defaultTahunMasuk =
    identitas.tahun_masuk || (user?.tahun_lulus ? user.tahun_lulus - 3 : 2022);
  const defaultJurusan = (user?.jurusan ||
    identitas.jurusan ||
    "Teknik Pemesinan") as any;
  const defaultGender = identitas.jenis_kelamin || userGender;
  const defaultWhatsapp = identitas.no_whatsapp || user?.noWhatsapp || "";
  const defaultEmail = identitas.email || user?.email || "";

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      nama_lengkap: defaultNama,
      nisn: defaultNisn,
      nik: identitas.nik || user?.nik || "",
      tahun_lulus: defaultTahunLulus,
      jurusan: defaultJurusan,
      tahun_masuk: defaultTahunMasuk,
      no_whatsapp: defaultWhatsapp,
      email: defaultEmail,
      jenis_kelamin: defaultGender,
      status_menikah: identitas.status_menikah || "Belum Menikah",
      usia: identitas.usia ?? 20,
      provinsi_domisili: identitas.provinsi_domisili || "Prov. Banten",
      kota_domisili: identitas.kota_domisili || "Kota Tangerang Selatan",
    },
  });

  const selectedGender = watch("jenis_kelamin");
  const selectedMarital = watch("status_menikah");

  // Sinkronisasi otomatis data profil akun alumni yang aktif
  useEffect(() => {
    if (user) {
      if (user.nama) setValue("nama_lengkap", user.nama);
      if (user.nisn) setValue("nisn", user.nisn);
      if (user.tahun_lulus) {
        setValue("tahun_lulus", user.tahun_lulus);
        setValue("tahun_masuk", user.tahun_lulus - 3);
      }
      if (user.jurusan) setValue("jurusan", user.jurusan as any);
      if (user.jenisKelamin) {
        const g =
          user.jenisKelamin === "P" || user.jenisKelamin === "Perempuan"
            ? "Perempuan"
            : "Laki-laki";
        setValue("jenis_kelamin", g);
      }
      // Field editable hanya diisi default jika masih kosong agar tidak menimpa ketikan alumni
      if (user.noWhatsapp && !getValues("no_whatsapp")) {
        setValue("no_whatsapp", user.noWhatsapp);
      }
      if (user.email && !getValues("email")) {
        setValue("email", user.email);
      }
      if (user.nik && !getValues("nik")) {
        setValue("nik", user.nik);
      }
    }
  }, [user, setValue, getValues]);

  const onSubmit = (data: Step1FormData) => {
    updateIdentitas({
      ...data,
      nik: data.nik || user?.nik || identitas.nik || "",
    } as any);
    onNext();
  };

  const handleFillDemo = () => {
    loadSampleData();
    setValue("nik", "3674012000000001");
    setValue("no_whatsapp", "081310000023");
    setValue("email", user?.email || "adityapratama@gmail.com");
    setValue("status_menikah", "Belum Menikah");
    setValue("usia", 20);
    setValue("provinsi_domisili", "Prov. Banten");
    setValue("kota_domisili", "Kota Tangerang Selatan");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-7">
      {/* Blue Section Header Bar matching Dapodik screenshot */}
      <div className="bg-[#1d4ed8] text-white px-4 py-2.5 font-medium text-xs sm:text-sm flex items-center justify-between rounded-t-sm">
        <span>Update Data Pribadi</span>
        <button
          type="button"
          onClick={handleFillDemo}
          className="text-xs underline hover:text-blue-100 transition cursor-pointer"
        >
          Isi Contoh Data
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
        {/* Nama Lengkap - Locked */}
        <div className="sm:col-span-2">
          <Input
            label="Nama Lengkap Alumni"
            placeholder="Contoh : Aditya Pratama"
            requiredStar
            readOnly
            tabIndex={-1}
            className="bg-slate-100 text-slate-700 border-slate-200 cursor-not-allowed select-none"
            error={errors.nama_lengkap?.message}
            {...register("nama_lengkap")}
          />
        </div>

        {/* NIS / NISN - Locked */}
        <Input
          label="Nomor Induk Siswa (NIS / NISN)"
          placeholder="Contoh : 0078912364"
          requiredStar
          readOnly
          tabIndex={-1}
          className="bg-slate-100 text-slate-700 border-slate-200 cursor-not-allowed select-none"
          error={errors.nisn?.message}
          {...register("nisn")}
        />

        {/* NIK (Nomor Induk Kependudukan) - Opsional */}
        <Input
          label="Nomor Induk Kependudukan (NIK)"
          placeholder="16 digit NIK KTP (opsional)"
          maxLength={16}
          error={errors.nik?.message}
          {...register("nik")}
        />

        {/* Tahun Masuk - Locked */}
        <Input
          label="Tahun Masuk"
          type="number"
          placeholder="Contoh : 2022"
          requiredStar
          readOnly
          tabIndex={-1}
          className="bg-slate-100 text-slate-700 border-slate-200 cursor-not-allowed select-none"
          error={errors.tahun_masuk?.message}
          {...register("tahun_masuk", { valueAsNumber: true })}
        />

        {/* Tahun Lulus - Locked */}
        <Input
          label="Tahun Lulus"
          type="number"
          placeholder="Contoh : 2025"
          requiredStar
          readOnly
          tabIndex={-1}
          className="bg-slate-100 text-slate-700 border-slate-200 cursor-not-allowed select-none"
          error={errors.tahun_lulus?.message}
          {...register("tahun_lulus", { valueAsNumber: true })}
        />

        {/* Kompetensi Keahlian / Jurusan - Locked */}
        <div className="sm:col-span-2">
          <Input
            label="Kompetensi Keahlian / Jurusan SMK"
            requiredStar
            readOnly
            tabIndex={-1}
            className="bg-slate-100 text-slate-700 border-slate-200 cursor-not-allowed select-none"
            error={errors.jurusan?.message}
            {...register("jurusan")}
          />
        </div>

        {/* Nomor WhatsApp - EDITABLE */}
        <Input
          label="No.HP / WhatsApp"
          placeholder="Contoh : 081310000023"
          requiredStar
          error={errors.no_whatsapp?.message}
          {...register("no_whatsapp")}
        />

        {/* Email - EDITABLE */}
        <Input
          label="Email"
          type="email"
          placeholder="Contoh : adityapratama@gmail.com"
          requiredStar
          error={errors.email?.message}
          {...register("email")}
        />

        {/* Jenis Kelamin - Locked */}
        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
            Jenis Kelamin <span className="text-rose-500">*</span>
          </label>
          <input type="hidden" {...register("jenis_kelamin")} />
          <div className="flex items-center gap-6 pt-1 opacity-75 pointer-events-none select-none">
            <label className="flex items-center gap-2.5 text-sm text-slate-700 leading-relaxed cursor-not-allowed">
              <input
                type="radio"
                checked={selectedGender === "Laki-laki"}
                readOnly
                tabIndex={-1}
                className="w-4 h-4 text-blue-600 border-slate-300 shrink-0 cursor-not-allowed"
              />
              <span>Laki-laki</span>
            </label>
            <label className="flex items-center gap-2.5 text-sm text-slate-700 leading-relaxed cursor-not-allowed">
              <input
                type="radio"
                checked={selectedGender === "Perempuan"}
                readOnly
                tabIndex={-1}
                className="w-4 h-4 text-blue-600 border-slate-300 shrink-0 cursor-not-allowed"
              />
              <span>Perempuan</span>
            </label>
          </div>
        </div>

        {/* Usia Saat Ini - EDITABLE */}
        <Input
          label="Usia Saat Ini"
          type="number"
          placeholder="Contoh : 20"
          error={errors.usia?.message}
          {...register("usia", { valueAsNumber: true })}
        />

        {/* Status Menikah - EDITABLE */}
        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
            Status Menikah
          </label>
          <div className="flex items-center gap-6 pt-1">
            {STATUS_MENIKAH_OPTIONS.map((status) => (
              <label
                key={status}
                className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-800 hover:text-blue-600 transition-colors leading-relaxed"
              >
                <input
                  type="radio"
                  name="status_menikah"
                  value={status}
                  checked={selectedMarital === status}
                  onChange={() => setValue("status_menikah", status)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 shrink-0 cursor-pointer"
                />
                <span>{status}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Provinsi & Kota Domisili Tempat Tinggal - EDITABLE */}
        <Input
          label="Provinsi Domisili Tinggal"
          error={errors.provinsi_domisili?.message}
          {...register("provinsi_domisili")}
        />

        <Input
          label="Kota / Kab. Domisili Tinggal"
          error={errors.kota_domisili?.message}
          {...register("kota_domisili")}
        />
      </div>

      {/* Bottom Bar with 'Simpan dan lanjut' matching screenshot */}
      <div className="pt-6 mt-8 border-t border-slate-200 flex items-center justify-end">
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="bg-blue-600 hover:bg-blue-700 font-medium text-xs sm:text-sm px-6 py-2.5 rounded-lg shadow-none transition"
        >
          Simpan dan lanjut
        </Button>
      </div>
    </form>
  );
};
