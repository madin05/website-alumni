import React, { useState, useEffect, useMemo } from 'react';
import { MOCK_ALUMNI_LIST } from '@/lib/mockData';
import { useAdminStore } from '@/store/adminStore';
import { Input } from '@/components/ui/Input';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { Pagination } from '@/components/ui/Pagination';
import { Users, Search, GraduationCap, Building, MapPin, Sparkles } from 'lucide-react';

export const AlumniTab: React.FC = () => {
  const [search, setSearch] = useState('');
  const [jurusanFilter, setJurusanFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { masterAlumni, respondents } = useAdminStore();

  useEffect(() => {
    setCurrentPage(1);
  }, [search, jurusanFilter]);

  // Combine master alumni from admin store with mock alumni
  const combinedAlumniList = useMemo(() => {
    const fromAdmin = (masterAlumni || []).map((m) => {
      const resp = (respondents || []).find((r) => r.nisn === m.nisn || r.nik === m.nik);
      const isFemale = /^(citra|mega|olivia|qori|siti|vina|yasmin|bella|gita|indah|dwi|ani|nur|rina)/i.test(m.nama);

      let pekerjaan = 'Alumni Terdaftar';
      let kampus = '-';
      let kota = 'Tangerang Selatan';

      if (resp) {
        if (resp.statusKegiatan === 'KERJA' || resp.statusKegiatan === 'KERJA_KULIAH') {
          pekerjaan = `${resp.jabatanProdiUsaha || 'Staff'} di ${resp.instansiKampusUsaha || 'Perusahaan Mitra'}`;
          kota = resp.fullPayload?.detail_kerja?.kota_kabupaten || 'Tangerang Selatan';
        } else if (resp.statusKegiatan === 'KULIAH') {
          kampus = `${resp.jabatanProdiUsaha || 'Mahasiswa'} di ${resp.instansiKampusUsaha || 'Universitas'}`;
          pekerjaan = 'Studi Lanjut (Kuliah)';
        } else if (resp.statusKegiatan === 'WIRAUSAHA' || resp.statusKegiatan === 'WIRAUSAHA_KULIAH') {
          pekerjaan = `Owner ${resp.instansiKampusUsaha || 'Usaha Mandiri'}`;
        }
      }

      return {
        nama: m.nama,
        jurusan: m.jurusan,
        tahunLulus: m.tahunLulus,
        status: resp?.statusKegiatan || (m.statusTracer === 'SUDAH' ? 'KERJA' : 'BELUM_KERJA'),
        pekerjaan,
        kampus,
        kota,
        jenisKelamin: (isFemale ? 'P' : 'L') as 'L' | 'P',
      };
    });

    // Merge without duplicates by name
    const seenNames = new Set(fromAdmin.map((a) => a.nama.toLowerCase()));
    const additionalMock = MOCK_ALUMNI_LIST.filter((a) => !seenNames.has(a.nama.toLowerCase()));

    return [...fromAdmin, ...additionalMock];
  }, [masterAlumni, respondents]);

  const filteredAlumni = combinedAlumniList.filter((alumni) => {
    const matchSearch =
      alumni.nama.toLowerCase().includes(search.toLowerCase()) ||
      alumni.pekerjaan.toLowerCase().includes(search.toLowerCase()) ||
      alumni.kota.toLowerCase().includes(search.toLowerCase());

    const matchJurusan =
      jurusanFilter === 'ALL' || alumni.jurusan.toLowerCase().includes(jurusanFilter.toLowerCase());

    return matchSearch && matchJurusan;
  });

  const totalPages = Math.ceil(filteredAlumni.length / itemsPerPage);
  const paginatedAlumni = filteredAlumni.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base sm:text-xl font-bold text-slate-900">
          Direktori & Jejaring Alumni Sasmita Jaya
        </h2>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Cari nama alumni, profesi, atau lokasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <CustomSelect
          value={jurusanFilter}
          onChange={(val) => setJurusanFilter(val)}
          className="w-full sm:w-64"
          options={[
            { value: 'ALL', label: 'Semua Jurusan' },
            { value: 'Pemesinan', label: 'Teknik Pemesinan (TPM)' },
            { value: 'Listrik', label: 'Teknik Listrik (TITL)' },
            { value: 'Elektronika', label: 'Elektronika Industri (EL)' },
            { value: 'Ringan', label: 'Otomotif Mobil (TKRO)' },
            { value: 'Sepeda Motor', label: 'Sepeda Motor (TBSM)' },
            { value: 'Jaringan', label: 'Komputer & Jaringan (TKJ)' },
          ]}
        />
      </div>

      {/* Alumni Cards Grid */}
      {paginatedAlumni.length === 0 ? (
        <div className="bg-white rounded-xl p-8 border border-slate-200 text-center space-y-2 min-h-[300px] flex flex-col items-center justify-center">
          <p className="text-sm font-semibold text-slate-800">Tidak ada data alumni yang sesuai.</p>
          <p className="text-xs text-slate-500">Coba ubah kata kunci pencarian atau filter jurusan Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5 content-start min-h-[580px] lg:min-h-[400px]">
          {paginatedAlumni.map((alumni, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-start gap-3.5">
                <UserAvatar
                  name={alumni.nama}
                  gender={alumni.jenisKelamin}
                  className="w-12 h-12 shrink-0 border-2 border-slate-100 shadow-xs"
                />
                <div className="overflow-hidden">
                  <h3 className="font-bold text-sm text-slate-900 truncate">
                    {alumni.nama}
                  </h3>
                  <p className="text-[11px] text-slate-600 font-medium truncate">
                    {alumni.jurusan}
                  </p>
                  <span className="inline-block text-[10px] text-slate-400 font-medium">
                    Angkatan {alumni.tahunLulus}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <p className="flex items-start gap-1.5 leading-snug">
                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-800">{alumni.pekerjaan}</span>
                </p>

                {alumni.kampus !== '-' && (
                  <p className="flex items-start gap-1.5 leading-snug text-slate-400">
                    <GraduationCap className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{alumni.kampus}</span>
                  </p>
                )}

                <p className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{alumni.kota}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredAlumni.length}
        itemsPerPage={itemsPerPage}
        itemName="alumni"
        onPageChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
};
