import React, { useState } from 'react';
import { useTracerStore } from '@/store/tracerStore';
import { DetailKerja, DetailKuliah, DetailUsaha } from '@/types/tracer';
import {
  STATUS_PEKERJAAN_OPTIONS,
  KESESUAIAN_KERJA_OPTIONS,
  PENGHASILAN_OPTIONS,
  JENJANG_KULIAH_OPTIONS,
  STATUS_KULIAH_OPTIONS,
  LAMA_USAHA_OPTIONS,
  JUMLAH_KARYAWAN_OPTIONS,
  KESESUAIAN_USAHA_OPTIONS,
} from '@/schemas/tracerSchema';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { ArrowLeft } from "lucide-react";

interface Step3Props {
  onNext: () => void;
  onPrev: () => void;
}

export const Step3Details: React.FC<Step3Props> = ({ onNext, onPrev }) => {
  const {
    status_kegiatan,
    detail_kerja,
    detail_kuliah,
    detail_usaha,
    updateDetailKerja,
    updateDetailKuliah,
    updateDetailUsaha,
  } = useTracerStore();

  const [warningModal, setWarningModal] = useState<string | null>(null);

  const isKerja =
    status_kegiatan === 'KERJA' || status_kegiatan === 'KERJA_KULIAH';
  const isKuliah =
    status_kegiatan === 'KULIAH' ||
    status_kegiatan === 'KERJA_KULIAH' ||
    status_kegiatan === 'WIRAUSAHA_KULIAH';
  const isUsaha =
    status_kegiatan === 'WIRAUSAHA' || status_kegiatan === 'WIRAUSAHA_KULIAH';
  const isBelumKerja =
    status_kegiatan === 'BELUM_KERJA' || status_kegiatan === 'LAINNYA';

  const handleKerjaChange = (field: keyof DetailKerja, value: any) => {
    updateDetailKerja({
      ...detail_kerja,
      [field]: value,
    });
  };

  const handleKuliahChange = (field: keyof DetailKuliah, value: any) => {
    updateDetailKuliah({
      ...detail_kuliah,
      [field]: value,
    });
  };

  const handleUsahaChange = (field: keyof DetailUsaha, value: any) => {
    updateDetailUsaha({
      ...detail_usaha,
      [field]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isKerja) {
      if (!detail_kerja?.nama_perusahaan?.trim()) {
        setWarningModal('Mohon lengkapi nama perusahaan / instansi tempat bekerja.');
        return;
      }
      if (!detail_kerja?.jabatan?.trim()) {
        setWarningModal('Mohon lengkapi jabatan / posisi pekerjaan.');
        return;
      }
    }

    if (isKuliah) {
      if (!detail_kuliah?.nama_kampus?.trim()) {
        setWarningModal('Mohon lengkapi nama perguruan tinggi.');
        return;
      }
      if (!detail_kuliah?.program_studi?.trim()) {
        setWarningModal('Mohon lengkapi program studi perkuliahan.');
        return;
      }
    }

    if (isUsaha) {
      if (!detail_usaha?.nama_usaha?.trim()) {
        setWarningModal('Mohon lengkapi nama / usaha yang dijalankan.');
        return;
      }
    }

    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
      {/* Blue Section Header Bar matching Dapodik screenshot */}
      <div className="bg-[#1d4ed8] text-white px-4 py-2.5 font-medium text-xs sm:text-sm rounded-t-sm">
        Detail Aktivitas Lulusan
      </div>

      {/* 1. BLOK JIKA ALUMNI BEKERJA */}
      {isKerja && (
        <div className="space-y-6 pt-1">
          <div className="text-xs sm:text-sm font-semibold text-blue-900 border-b border-blue-100 pb-2">
            Jika Alumni Bekerja
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {/* Nama Perusahaan */}
            <Input
              label="Nama perusahaan/instansi"
              placeholder="Contoh : PT Solusi Teknologi Nusantara"
              value={detail_kerja?.nama_perusahaan || ''}
              onChange={(e) => handleKerjaChange('nama_perusahaan', e.target.value)}
              requiredStar
            />

            {/* Jabatan / Posisi */}
            <Input
              label="Jabatan/posisi pekerjaan"
              placeholder="Contoh : Technical Support"
              value={detail_kerja?.jabatan || ''}
              onChange={(e) => handleKerjaChange('jabatan', e.target.value)}
              requiredStar
            />

            {/* Bidang Pekerjaan */}
            <Input
              label="Bidang pekerjaan"
              placeholder="Contoh : IT & Telekomunikasi"
              value={detail_kerja?.bidang_pekerjaan || ''}
              onChange={(e) => handleKerjaChange('bidang_pekerjaan', e.target.value)}
            />

            {/* Kota / Kabupaten Tempat Bekerja */}
            <Input
              label="Kota/kabupaten tempat bekerja"
              placeholder="Contoh : Tangerang Selatan"
              value={detail_kerja?.kota_kabupaten || ''}
              onChange={(e) => handleKerjaChange('kota_kabupaten', e.target.value)}
            />

            {/* Status Pekerjaan */}
            <div className="sm:col-span-2 pt-2 border-t border-slate-100 space-y-3">
              <label className="block text-sm font-semibold text-slate-800 leading-relaxed">
                Status pekerjaan:
              </label>
              <div className="flex flex-wrap items-center gap-5 sm:gap-6">
                {STATUS_PEKERJAAN_OPTIONS.map((status) => {
                  const isSelected = (detail_kerja?.status_pekerjaan || 'Tetap') === status;
                  return (
                    <label key={status} className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-800 hover:text-blue-600 transition-colors leading-relaxed">
                      <input
                        type="radio"
                        name="status_pekerjaan"
                        value={status}
                        checked={isSelected}
                        onChange={() => handleKerjaChange('status_pekerjaan', status)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer shrink-0"
                      />
                      <span>{status}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Kesesuaian Kompetensi SMK */}
            <div className="sm:col-span-2 pt-3 border-t border-slate-100 space-y-3">
              <label className="block text-sm font-semibold text-slate-800 leading-relaxed">
                Apakah pekerjaan sesuai dengan kompetensi keahlian di SMK? <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-wrap items-center gap-5 sm:gap-6">
                {KESESUAIAN_KERJA_OPTIONS.map((kesesuaian) => {
                  const isSelected =
                    detail_kerja?.kesesuaian_jurusan === kesesuaian ||
                    (kesesuaian === 'Sangat sesuai' && detail_kerja?.kesesuaian_jurusan === 'SANGAT_SESUAI') ||
                    (kesesuaian === 'Sesuai' && detail_kerja?.kesesuaian_jurusan === 'SESUAI');
                  return (
                    <label key={kesesuaian} className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-800 hover:text-blue-600 transition-colors leading-relaxed">
                      <input
                        type="radio"
                        name="kesesuaian_jurusan"
                        value={kesesuaian}
                        checked={isSelected}
                        onChange={() => handleKerjaChange('kesesuaian_jurusan', kesesuaian)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer shrink-0"
                      />
                      <span>{kesesuaian}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Kisaran Penghasilan Bulanan (Opsional) */}
            <div className="sm:col-span-2 pt-3 border-t border-slate-100 space-y-3">
              <label className="block text-sm font-semibold text-slate-800 leading-relaxed">
                Kisaran penghasilan per bulan <span className="text-slate-400 font-normal text-xs sm:text-sm">(opsional)</span>
              </label>
              <div className="flex flex-wrap items-center gap-5 sm:gap-6">
                {PENGHASILAN_OPTIONS.map((gaji) => {
                  const isSelected = detail_kerja?.kisaran_penghasilan === gaji;
                  return (
                    <label key={gaji} className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-800 hover:text-blue-600 transition-colors leading-relaxed">
                      <input
                        type="radio"
                        name="kisaran_penghasilan"
                        value={gaji}
                        checked={isSelected}
                        onChange={() => handleKerjaChange('kisaran_penghasilan', gaji)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer shrink-0"
                      />
                      <span>{gaji}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. BLOK JIKA ALUMNI KULIAH */}
      {isKuliah && (
        <div className="space-y-6 pt-2">
          <div className="text-xs sm:text-sm font-semibold text-blue-900 border-b border-blue-100 pb-2">
            Jika Melanjutkan Kuliah
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {/* Nama Kampus */}
            <Input
              label="Nama perguruan tinggi"
              placeholder="Contoh : Universitas Pamulang"
              value={detail_kuliah?.nama_kampus || ''}
              onChange={(e) => handleKuliahChange('nama_kampus', e.target.value)}
              requiredStar
            />

            {/* Program Studi */}
            <Input
              label="Program studi"
              placeholder="Contoh : Teknik Informatika"
              value={detail_kuliah?.program_studi || ''}
              onChange={(e) => handleKuliahChange('program_studi', e.target.value)}
              requiredStar
            />

            {/* Jenjang */}
            <div className="sm:col-span-2 pt-2 border-t border-slate-100 space-y-3">
              <label className="block text-sm font-semibold text-slate-800 leading-relaxed">
                Jenjang:
              </label>
              <div className="flex flex-col gap-3.5">
                <div className="flex flex-wrap items-center gap-5 sm:gap-6">
                  {JENJANG_KULIAH_OPTIONS.map((jenjang) => {
                    const isLainnyaOption = (jenjang as string) === 'Lainnya';
                    const currentJenjang = (detail_kuliah?.jenjang as string) || 'S1';
                    const isSelected = isLainnyaOption
                      ? currentJenjang === 'Lainnya' || !JENJANG_KULIAH_OPTIONS.some(o => (o as string) === currentJenjang && (o as string) !== 'Lainnya')
                      : currentJenjang === jenjang;

                    return (
                      <label key={jenjang} className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-800 hover:text-blue-600 transition-colors leading-relaxed">
                        <input
                          type="radio"
                          name="jenjang"
                          value={jenjang}
                          checked={isSelected}
                          onChange={() => handleKuliahChange('jenjang', jenjang)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer shrink-0"
                        />
                        <span>{jenjang}</span>
                      </label>
                    );
                  })}
                </div>
                
                {/* Input text untuk 'Lainnya' */}
                {(() => {
                  const currentJenjang = (detail_kuliah?.jenjang as string) || 'S1';
                  const isLainnyaSelected = currentJenjang === 'Lainnya' || !JENJANG_KULIAH_OPTIONS.some(o => (o as string) === currentJenjang && (o as string) !== 'Lainnya');
                  
                  if (isLainnyaSelected) {
                    return (
                      <div className="w-full sm:w-1/2 mt-1">
                        <input
                          type="text"
                          placeholder="Sebutkan jenjang lainnya..."
                          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          value={currentJenjang === 'Lainnya' ? '' : currentJenjang}
                          onChange={(e) => handleKuliahChange('jenjang', e.target.value || 'Lainnya')}
                          required
                        />
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>

            {/* Status Kuliah */}
            <div className="sm:col-span-2 pt-3 border-t border-slate-100 space-y-3">
              <label className="block text-sm font-semibold text-slate-800 leading-relaxed">
                Status kuliah:
              </label>
              <div className="flex items-center gap-5 sm:gap-6">
                {STATUS_KULIAH_OPTIONS.map((status) => {
                  const isSelected = (detail_kuliah?.status_kuliah || 'Aktif') === status;
                  return (
                    <label key={status} className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-800 hover:text-blue-600 transition-colors leading-relaxed">
                      <input
                        type="radio"
                        name="status_kuliah"
                        value={status}
                        checked={isSelected}
                        onChange={() => handleKuliahChange('status_kuliah', status)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer shrink-0"
                      />
                      <span>{status}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. BLOK JIKA ALUMNI BERWIRAUSAHA */}
      {isUsaha && (
        <div className="space-y-6 pt-2">
          <div className="text-xs sm:text-sm font-semibold text-blue-900 border-b border-blue-100 pb-2">
            Jika Berwirausaha
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {/* Nama Usaha */}
            <Input
              label="Nama/usaha yang dijalankan"
              placeholder="Contoh : Bengkel Jaya Mandiri"
              value={detail_usaha?.nama_usaha || ''}
              onChange={(e) => handleUsahaChange('nama_usaha', e.target.value)}
              requiredStar
            />

            {/* Bidang Usaha */}
            <Input
              label="Bidang usaha"
              placeholder="Contoh : Otomotif / Servis Motor"
              value={detail_usaha?.bidang_usaha || ''}
              onChange={(e) => handleUsahaChange('bidang_usaha', e.target.value)}
            />

            {/* Lama Menjalankan Usaha */}
            <div className="sm:col-span-2 pt-2 border-t border-slate-100 space-y-3">
              <label className="block text-sm font-semibold text-slate-800 leading-relaxed">
                Lama menjalankan usaha:
              </label>
              <div className="flex flex-wrap items-center gap-5 sm:gap-6">
                {LAMA_USAHA_OPTIONS.map((lama) => {
                  const isSelected = (detail_usaha?.lama_usaha || '< 6 bulan') === lama;
                  return (
                    <label key={lama} className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-800 hover:text-blue-600 transition-colors leading-relaxed">
                      <input
                        type="radio"
                        name="lama_usaha"
                        value={lama}
                        checked={isSelected}
                        onChange={() => handleUsahaChange('lama_usaha', lama)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer shrink-0"
                      />
                      <span>{lama}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Jumlah Tenaga Kerja */}
            <div className="sm:col-span-2 pt-3 border-t border-slate-100 space-y-3">
              <label className="block text-sm font-semibold text-slate-800 leading-relaxed">
                Jumlah tenaga kerja (jika ada):
              </label>
              <div className="flex flex-wrap items-center gap-5 sm:gap-6">
                {JUMLAH_KARYAWAN_OPTIONS.map((jml) => {
                  const isSelected = (detail_usaha?.jumlah_karyawan || 'Belum ada (Dijalankan sendiri)') === jml;
                  return (
                    <label key={jml} className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-800 hover:text-blue-600 transition-colors leading-relaxed">
                      <input
                        type="radio"
                        name="jumlah_karyawan"
                        value={jml}
                        checked={isSelected}
                        onChange={() => handleUsahaChange('jumlah_karyawan', jml)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer shrink-0"
                      />
                      <span>{jml}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Keterkaitan Usaha dengan Kompetensi SMK */}
            <div className="sm:col-span-2 pt-3 border-t border-slate-100 space-y-3">
              <label className="block text-sm font-semibold text-slate-800 leading-relaxed">
                Apakah usaha berkaitan dengan kompetensi yang dipelajari di SMK?
              </label>
              <div className="flex flex-wrap items-center gap-5 sm:gap-6">
                {KESESUAIAN_USAHA_OPTIONS.map((relasi) => {
                  const isSelected = (detail_usaha?.kesesuaian_kompetensi || 'Sangat berkaitan') === relasi;
                  return (
                    <label key={relasi} className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-800 hover:text-blue-600 transition-colors leading-relaxed">
                      <input
                        type="radio"
                        name="kesesuaian_kompetensi"
                        value={relasi}
                        checked={isSelected}
                        onChange={() => handleUsahaChange('kesesuaian_kompetensi', relasi)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer shrink-0"
                      />
                      <span>{relasi}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. BLOK JIKA ALUMNI BELUM BEKERJA / LAINNYA */}
      {isBelumKerja && (
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 space-y-2 leading-relaxed">
          <p className="font-semibold text-slate-900">
            Kesiapan Kerja & Informasi Tambahan
          </p>
          <p>
            Data Anda akan digunakan oleh BKK SMK Sasmita Jaya 2 untuk menyalurkan informasi lowongan kerja aktif dan pelatihan kerja.
          </p>
        </div>
      )}

      {/* Bottom Bar with 'Simpan dan lanjut' matching screenshot */}
      <div className="pt-6 mt-8 border-t border-slate-200 flex items-center justify-between">
        <Button
          type="button"
          onClick={onPrev}
          variant="ghost"
          size="md"
          className="text-xs sm:text-sm"
        >
          <ArrowLeft size={16} className="mr-1" />
          Kembali
        </Button>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="bg-blue-600 hover:bg-blue-700 font-medium text-xs sm:text-sm px-6 py-2.5 rounded-lg shadow-none transition"
        >
          Simpan dan lanjut
        </Button>
      </div>

      {/* Warning Modal */}
      <ConfirmModal
        isOpen={!!warningModal}
        onClose={() => setWarningModal(null)}
        title="Lengkapi Data Aktivitas"
        message={warningModal || ''}
        confirmText="Mengerti"
        type="warning"
      />
    </form>
  );
};
