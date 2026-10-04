import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1Schema, JURUSAN_OPTIONS } from '@/schemas/tracerSchema';
import { useTracerStore } from '@/store/tracerStore';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { z } from 'zod';

type Step1FormData = z.infer<typeof step1Schema>;

interface Step1Props {
  onNext: () => void;
}

export const Step1Identity: React.FC<Step1Props> = ({ onNext }) => {
  const { identitas, updateIdentitas, loadSampleData } = useTracerStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      nama_lengkap: identitas.nama_lengkap || '',
      nisn: identitas.nisn || '',
      nik: identitas.nik || '',
      tahun_lulus: identitas.tahun_lulus || 2024,
      jurusan: (identitas.jurusan as any) || 'Teknik Komputer dan Jaringan',
      tahun_masuk: identitas.tahun_masuk || 2021,
      no_whatsapp: identitas.no_whatsapp || '',
      email: identitas.email || '',
      jenis_kelamin: (identitas.jenis_kelamin as any) || 'Laki-laki',
    },
  });

  const selectedGender = watch('jenis_kelamin');

  const onSubmit = (data: Step1FormData) => {
    updateIdentitas(data as any);
    onNext();
  };

  const handleFillDemo = () => {
    loadSampleData();
    setValue('nama_lengkap', 'Ahmad Dani');
    setValue('nisn', '0051234567');
    setValue('nik', '3674012345670001');
    setValue('tahun_lulus', 2024);
    setValue('jurusan', 'Teknik Komputer dan Jaringan');
    setValue('tahun_masuk', 2021);
    setValue('no_whatsapp', '081298765432');
    setValue('email', 'ahmaddani@example.com');
    setValue('jenis_kelamin', 'Laki-laki');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Blue Section Header Bar matching Dapodik screenshot */}
      <div className="bg-[#1d4ed8] text-white px-4 py-2 font-medium text-xs  flex items-center justify-between rounded-t-sm">
        <span>Update Data Pribadi</span>
        <button
          type="button"
          onClick={handleFillDemo}
          className="text-[11px] underline hover:text-blue-100 transition cursor-pointer"
        >
          Isi Contoh Data
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nama Lengkap */}
        <div className="sm:col-span-2">
          <Input
            label="Nama Lengkap Alumni"
            placeholder="Contoh : Ahmad Dani"
            requiredStar
            error={errors.nama_lengkap?.message}
            {...register('nama_lengkap')}
          />
        </div>

        {/* NIS / NISN */}
        <Input
          label="Nomor Induk Siswa (NIS / NISN)"
          placeholder="Contoh : 0051234567"
          requiredStar
          error={errors.nisn?.message}
          {...register('nisn')}
        />

        {/* Tahun Lulus */}
        <Input
          label="Tahun Lulus"
          type="number"
          placeholder="Contoh : 2024"
          requiredStar
          error={errors.tahun_lulus?.message}
          {...register('tahun_lulus', { valueAsNumber: true })}
        />

        {/* Kompetensi Keahlian / Jurusan */}
        <div className="sm:col-span-2">
          <Select
            label="Kompetensi Keahlian / Jurusan SMK"
            requiredStar
            error={errors.jurusan?.message}
            {...register('jurusan')}
          >
            {JURUSAN_OPTIONS.map((jurusan) => (
              <option key={jurusan} value={jurusan}>
                {jurusan}
              </option>
            ))}
          </Select>
        </div>

        {/* Tahun Masuk */}
        <Input
          label="Tahun Masuk"
          type="number"
          placeholder="Contoh : 2021"
          requiredStar
          error={errors.tahun_masuk?.message}
          {...register('tahun_masuk', { valueAsNumber: true })}
        />

        {/* Nomor WhatsApp */}
        <Input
          label="No.HP / WhatsApp"
          placeholder="contoh: 08123455"
          requiredStar
          error={errors.no_whatsapp?.message}
          {...register('no_whatsapp')}
        />

        {/* Email */}
        <Input
          label="Email"
          type="email"
          placeholder="Contoh : contoh.email@gmail.com"
          requiredStar
          error={errors.email?.message}
          {...register('email')}
        />

        {/* Jenis Kelamin */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Jenis Kelamin <span className="text-rose-500">*</span>
          </label>
          <div className="flex items-center gap-6 mt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-slate-800">
              <input
                type="radio"
                name="jenis_kelamin"
                value="Laki-laki"
                checked={selectedGender === 'Laki-laki'}
                onChange={() => setValue('jenis_kelamin', 'Laki-laki')}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span>Laki-laki</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-slate-800">
              <input
                type="radio"
                name="jenis_kelamin"
                value="Perempuan"
                checked={selectedGender === 'Perempuan'}
                onChange={() => setValue('jenis_kelamin', 'Perempuan')}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span>Perempuan</span>
            </label>
          </div>
        </div>

        {/* Optional NIK for Dapodik / Dukcapil */}
        <div className="sm:col-span-2 pt-2 border-t border-slate-100">
          <Input
            label="Nomor Induk Kependudukan (NIK - Opsional)"
            placeholder="Contoh : 3674012345670001 (opsional)"
            maxLength={16}
            error={errors.nik?.message}
            {...register('nik')}
          />
        </div>
      </div>

      {/* Bottom Bar with 'Simpan dan lanjut' matching screenshot */}
      <div className="pt-4 border-t border-slate-200 flex items-center justify-end">
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="bg-blue-600 hover:bg-blue-700 font-medium text-xs sm:text-sm px-6 py-2 rounded shadow-none"
        >
          Simpan dan lanjut
        </Button>
      </div>
    </form>
  );
};
