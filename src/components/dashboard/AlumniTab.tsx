import React, { useState, useEffect, useMemo } from "react";
import { useAdminStore } from "@/store/adminStore";
import { useTracerStore } from "@/store/tracerStore";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/Input";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { UserAvatar, detectGenderFromName } from "@/components/ui/UserAvatar";
import { Pagination } from "@/components/ui/Pagination";
import { Search, GraduationCap, Building, MapPin } from "lucide-react";

export const AlumniTab: React.FC = () => {
  const [search, setSearch] = useState("");
  const [jurusanFilter, setJurusanFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { masterAlumni, respondents } = useAdminStore();
  const {
    isSubmitted,
    status_kegiatan,
    detail_kerja,
    detail_kuliah,
    detail_usaha,
    identitas,
  } = useTracerStore();
  const { user } = useAuthStore();

  useEffect(() => {
    setCurrentPage(1);
  }, [search, jurusanFilter]);

  // Hanya tampilkan data alumni yang SUDAH mengisi kuesioner tracer study (telah terlacak oleh sekolah)
  const combinedAlumniList = useMemo(() => {
    // 1. Filter master alumni yang sudah mengisi tracer study atau user aktif yang telah submit
    const trackedMaster = (masterAlumni || []).filter((m) => {
      const isCurrentUser =
        (user?.nisn && (user.nisn === m.nisn || user.nik === m.nik)) ||
        (identitas?.nisn &&
          (identitas.nisn === m.nisn || identitas.nik === m.nik)) ||
        (user?.nama && user.nama.toLowerCase() === m.nama.toLowerCase());

      const hasCompleted =
        m.statusTracer === "SUDAH" ||
        (respondents || []).some((r) => r.nisn === m.nisn || r.nik === m.nik) ||
        (isCurrentUser && (isSubmitted || user?.tracerStatus === "SUDAH"));

      return hasCompleted;
    });

    const trackedList = trackedMaster.map((m) => {
      const resp = (respondents || []).find(
        (r) => r.nisn === m.nisn || r.nik === m.nik,
      );

      const isCurrentUser =
        (user?.nisn && (user.nisn === m.nisn || user.nik === m.nik)) ||
        (identitas?.nisn &&
          (identitas.nisn === m.nisn || identitas.nik === m.nik)) ||
        (user?.nama && user.nama.toLowerCase() === m.nama.toLowerCase());

      let pekerjaan = "Bekerja";
      let kampus = "-";
      let kota = "Tangerang Selatan";

      if (resp) {
        if (resp.statusKegiatan === "KERJA") {
          const jab =
            resp.fullPayload?.detail_kerja?.jabatan ||
            resp.jabatanProdiUsaha ||
            "Staff";
          const per =
            resp.fullPayload?.detail_kerja?.nama_perusahaan ||
            resp.instansiKampusUsaha ||
            "Perusahaan Mitra";
          pekerjaan = `${jab} di ${per}`;
          kampus = "-";
          kota =
            resp.fullPayload?.detail_kerja?.kota_kabupaten ||
            resp.fullPayload?.identitas?.kota_domisili ||
            "Tangerang Selatan";
        } else if (resp.statusKegiatan === "KERJA_KULIAH") {
          const jab =
            resp.fullPayload?.detail_kerja?.jabatan ||
            resp.jabatanProdiUsaha?.split("/")[0]?.trim() ||
            "Staff";
          const per =
            resp.fullPayload?.detail_kerja?.nama_perusahaan ||
            resp.instansiKampusUsaha?.split("/")[0]?.trim() ||
            "Perusahaan Mitra";
          pekerjaan = `${jab} di ${per}`;

          const prodi =
            resp.fullPayload?.detail_kuliah?.program_studi ||
            resp.jabatanProdiUsaha?.split("/")[1]?.trim() ||
            "Mahasiswa";
          const kmp =
            resp.fullPayload?.detail_kuliah?.nama_kampus ||
            resp.instansiKampusUsaha?.split("/")[1]?.trim() ||
            "Universitas";
          kampus = `${prodi} di ${kmp}`;
          kota =
            resp.fullPayload?.detail_kerja?.kota_kabupaten ||
            resp.fullPayload?.identitas?.kota_domisili ||
            "Tangerang Selatan";
        } else if (resp.statusKegiatan === "KULIAH") {
          const prodi =
            resp.fullPayload?.detail_kuliah?.program_studi ||
            resp.jabatanProdiUsaha ||
            "Mahasiswa";
          const kmp =
            resp.fullPayload?.detail_kuliah?.nama_kampus ||
            resp.instansiKampusUsaha ||
            "Universitas";
          kampus = `${prodi} di ${kmp}`;
          pekerjaan = "Studi Lanjut (Kuliah)";
          kota =
            resp.fullPayload?.detail_kuliah?.alamat_kampus ||
            resp.fullPayload?.identitas?.kota_domisili ||
            "Tangerang Selatan";
        } else if (resp.statusKegiatan === "WIRAUSAHA") {
          pekerjaan = `Owner ${resp.fullPayload?.detail_usaha?.nama_usaha || resp.instansiKampusUsaha || "Usaha Mandiri"}`;
          kampus = "-";
          kota =
            resp.fullPayload?.detail_usaha?.kota_usaha ||
            resp.fullPayload?.identitas?.kota_domisili ||
            "Tangerang Selatan";
        } else if (resp.statusKegiatan === "WIRAUSAHA_KULIAH") {
          pekerjaan = `Owner ${resp.fullPayload?.detail_usaha?.nama_usaha || resp.instansiKampusUsaha?.split("/")[0]?.trim() || "Usaha Mandiri"}`;
          const prodi =
            resp.fullPayload?.detail_kuliah?.program_studi ||
            resp.jabatanProdiUsaha?.split("/")[1]?.trim() ||
            "Mahasiswa";
          const kmp =
            resp.fullPayload?.detail_kuliah?.nama_kampus ||
            resp.instansiKampusUsaha?.split("/")[1]?.trim() ||
            "Universitas";
          kampus = `${prodi} di ${kmp}`;
          kota =
            resp.fullPayload?.detail_usaha?.kota_usaha ||
            resp.fullPayload?.identitas?.kota_domisili ||
            "Tangerang Selatan";
        } else if (resp.statusKegiatan === "BELUM_KERJA") {
          pekerjaan = "Mencari Kerja / Persiapan Karir";
          kampus = "-";
          kota =
            resp.fullPayload?.identitas?.kota_domisili || "Tangerang Selatan";
        }
      }

      // Prioritas sinkronisasi: jika ini akun yang sedang login dan sudah mengisi kuesioner tracer
      if (isCurrentUser && (isSubmitted || user?.tracerStatus === "SUDAH")) {
        const tracerStatus = status_kegiatan || resp?.statusKegiatan || "KERJA";
        if (tracerStatus === "KERJA") {
          const jab =
            detail_kerja?.jabatan ||
            resp?.fullPayload?.detail_kerja?.jabatan ||
            resp?.jabatanProdiUsaha ||
            "Junior Network Administrator";
          const pers =
            detail_kerja?.nama_perusahaan ||
            resp?.fullPayload?.detail_kerja?.nama_perusahaan ||
            resp?.instansiKampusUsaha ||
            "PT Solusi Teknologi Nusantara";
          pekerjaan = `${jab} di ${pers}`;
          kampus = "-";
          kota =
            detail_kerja?.kota_kabupaten ||
            resp?.fullPayload?.detail_kerja?.kota_kabupaten ||
            "Tangerang Selatan";
        } else if (tracerStatus === "KERJA_KULIAH") {
          const jab =
            detail_kerja?.jabatan ||
            resp?.fullPayload?.detail_kerja?.jabatan ||
            "Junior Network Administrator";
          const pers =
            detail_kerja?.nama_perusahaan ||
            resp?.fullPayload?.detail_kerja?.nama_perusahaan ||
            "PT Solusi Teknologi Nusantara";
          pekerjaan = `${jab} di ${pers}`;
          const prodi =
            detail_kuliah?.program_studi ||
            resp?.fullPayload?.detail_kuliah?.program_studi ||
            "Teknik Informatika";
          const kmp =
            detail_kuliah?.nama_kampus ||
            resp?.fullPayload?.detail_kuliah?.nama_kampus ||
            "Universitas Pamulang";
          kampus = `${prodi} di ${kmp}`;
          kota =
            detail_kerja?.kota_kabupaten ||
            resp?.fullPayload?.detail_kerja?.kota_kabupaten ||
            "Tangerang Selatan";
        } else if (tracerStatus === "KULIAH") {
          const prodi =
            detail_kuliah?.program_studi ||
            resp?.fullPayload?.detail_kuliah?.program_studi ||
            resp?.jabatanProdiUsaha ||
            "Teknik Informatika";
          const kmp =
            detail_kuliah?.nama_kampus ||
            resp?.fullPayload?.detail_kuliah?.nama_kampus ||
            resp?.instansiKampusUsaha ||
            "Universitas Pamulang";
          kampus = `${prodi} di ${kmp}`;
          pekerjaan = "Studi Lanjut (Kuliah)";
          kota =
            detail_kuliah?.alamat_kampus ||
            resp?.fullPayload?.detail_kuliah?.alamat_kampus ||
            "Tangerang Selatan";
        } else if (tracerStatus === "WIRAUSAHA") {
          pekerjaan = `Owner ${detail_usaha?.nama_usaha || resp?.fullPayload?.detail_usaha?.nama_usaha || resp?.instansiKampusUsaha || "Usaha Mandiri"}`;
          kampus = "-";
          kota =
            detail_usaha?.kota_usaha ||
            resp?.fullPayload?.detail_usaha?.kota_usaha ||
            "Tangerang Selatan";
        } else if (tracerStatus === "WIRAUSAHA_KULIAH") {
          pekerjaan = `Owner ${detail_usaha?.nama_usaha || resp?.fullPayload?.detail_usaha?.nama_usaha || "Usaha Mandiri"}`;
          const prodi =
            detail_kuliah?.program_studi ||
            resp?.fullPayload?.detail_kuliah?.program_studi ||
            "Teknik Informatika";
          const kmp =
            detail_kuliah?.nama_kampus ||
            resp?.fullPayload?.detail_kuliah?.nama_kampus ||
            "Universitas Pamulang";
          kampus = `${prodi} di ${kmp}`;
          kota =
            detail_usaha?.kota_usaha ||
            resp?.fullPayload?.detail_usaha?.kota_usaha ||
            "Tangerang Selatan";
        } else if (tracerStatus === "BELUM_KERJA") {
          pekerjaan = "Mencari Kerja / Persiapan Karir";
          kampus = "-";
          kota =
            identitas?.kota_domisili ||
            resp?.fullPayload?.identitas?.kota_domisili ||
            "Tangerang Selatan";
        }
      }

      const explicitG =
        m.jenisKelamin ||
        resp?.jenisKelamin ||
        (resp?.fullPayload?.identitas?.jenis_kelamin?.startsWith("P")
          ? "P"
          : resp?.fullPayload?.identitas?.jenis_kelamin?.startsWith("L")
            ? "L"
            : undefined) ||
        (isCurrentUser ? user?.jenisKelamin : undefined);

      const gender = detectGenderFromName(m.nama, explicitG);

      return {
        nama: m.nama,
        jurusan: m.jurusan,
        tahunLulus: m.tahunLulus,
        status:
          resp?.statusKegiatan ||
          (isCurrentUser && isSubmitted
            ? status_kegiatan
            : m.statusTracer === "SUDAH"
              ? "KERJA"
              : "BELUM_KERJA"),
        pekerjaan,
        kampus,
        kota,
        jenisKelamin: gender,
      };
    });

    // 2. Sertakan responden yang mungkin belum ada di masterAlumni
    const coveredNisns = new Set(trackedMaster.map((m) => m.nisn));
    const extraRespondents = (respondents || [])
      .filter((r) => !coveredNisns.has(r.nisn))
      .map((r) => {
        let pekerjaan = "Bekerja";
        let kampus = "-";
        let kota =
          r.fullPayload?.identitas?.kota_domisili || "Tangerang Selatan";

        if (r.statusKegiatan === "KERJA") {
          const jab =
            r.fullPayload?.detail_kerja?.jabatan ||
            r.jabatanProdiUsaha ||
            "Staff";
          const per =
            r.fullPayload?.detail_kerja?.nama_perusahaan ||
            r.instansiKampusUsaha ||
            "Perusahaan Mitra";
          pekerjaan = `${jab} di ${per}`;
          kota = r.fullPayload?.detail_kerja?.kota_kabupaten || kota;
        } else if (r.statusKegiatan === "KERJA_KULIAH") {
          const jab =
            r.fullPayload?.detail_kerja?.jabatan ||
            r.jabatanProdiUsaha?.split("/")[0]?.trim() ||
            "Staff";
          const per =
            r.fullPayload?.detail_kerja?.nama_perusahaan ||
            r.instansiKampusUsaha?.split("/")[0]?.trim() ||
            "Perusahaan Mitra";
          pekerjaan = `${jab} di ${per}`;
          const prodi =
            r.fullPayload?.detail_kuliah?.program_studi ||
            r.jabatanProdiUsaha?.split("/")[1]?.trim() ||
            "Mahasiswa";
          const kmp =
            r.fullPayload?.detail_kuliah?.nama_kampus ||
            r.instansiKampusUsaha?.split("/")[1]?.trim() ||
            "Universitas";
          kampus = `${prodi} di ${kmp}`;
          kota = r.fullPayload?.detail_kerja?.kota_kabupaten || kota;
        } else if (r.statusKegiatan === "KULIAH") {
          const prodi =
            r.fullPayload?.detail_kuliah?.program_studi ||
            r.jabatanProdiUsaha ||
            "Mahasiswa";
          const kmp =
            r.fullPayload?.detail_kuliah?.nama_kampus ||
            r.instansiKampusUsaha ||
            "Universitas";
          kampus = `${prodi} di ${kmp}`;
          pekerjaan = "Studi Lanjut (Kuliah)";
          kota = r.fullPayload?.detail_kuliah?.alamat_kampus || kota;
        } else if (r.statusKegiatan === "WIRAUSAHA") {
          pekerjaan = `Owner ${r.fullPayload?.detail_usaha?.nama_usaha || r.instansiKampusUsaha || "Usaha Mandiri"}`;
          kota = r.fullPayload?.detail_usaha?.kota_usaha || kota;
        } else if (r.statusKegiatan === "WIRAUSAHA_KULIAH") {
          pekerjaan = `Owner ${r.fullPayload?.detail_usaha?.nama_usaha || r.instansiKampusUsaha?.split("/")[0]?.trim() || "Usaha Mandiri"}`;
          const prodi =
            r.fullPayload?.detail_kuliah?.program_studi ||
            r.jabatanProdiUsaha?.split("/")[1]?.trim() ||
            "Mahasiswa";
          const kmp =
            r.fullPayload?.detail_kuliah?.nama_kampus ||
            r.instansiKampusUsaha?.split("/")[1]?.trim() ||
            "Universitas";
          kampus = `${prodi} di ${kmp}`;
          kota = r.fullPayload?.detail_usaha?.kota_usaha || kota;
        } else if (r.statusKegiatan === "BELUM_KERJA") {
          pekerjaan = "Mencari Kerja / Persiapan Karir";
        }

        const explicitG =
          r.jenisKelamin ||
          (r.fullPayload?.identitas?.jenis_kelamin?.startsWith("P")
            ? "P"
            : r.fullPayload?.identitas?.jenis_kelamin?.startsWith("L")
              ? "L"
              : undefined);

        return {
          nama: r.nama,
          jurusan: r.jurusan,
          tahunLulus: r.tahunLulus,
          status: r.statusKegiatan,
          pekerjaan,
          kampus,
          kota,
          jenisKelamin: detectGenderFromName(r.nama, explicitG),
        };
      });

    return [...trackedList, ...extraRespondents];
  }, [
    masterAlumni,
    respondents,
    isSubmitted,
    status_kegiatan,
    detail_kerja,
    detail_kuliah,
    detail_usaha,
    user,
    identitas,
  ]);

  const filteredAlumni = combinedAlumniList.filter((alumni) => {
    const matchSearch =
      alumni.nama.toLowerCase().includes(search.toLowerCase()) ||
      alumni.pekerjaan.toLowerCase().includes(search.toLowerCase()) ||
      alumni.kota.toLowerCase().includes(search.toLowerCase());

    const matchJurusan =
      jurusanFilter === "ALL" ||
      alumni.jurusan.toLowerCase().includes(jurusanFilter.toLowerCase());

    return matchSearch && matchJurusan;
  });

  const totalPages = Math.ceil(filteredAlumni.length / itemsPerPage);
  const paginatedAlumni = filteredAlumni.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base sm:text-xl font-bold text-slate-900">
          Direktori & Jejaring Alumni Sasmita Jaya 2
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
            { value: "ALL", label: "Semua Jurusan" },
            { value: "Pemesinan", label: "Teknik Pemesinan (TPM)" },
            { value: "Listrik", label: "Teknik Listrik (TITL)" },
            { value: "Elektronika", label: "Elektronika Industri (EL)" },
            { value: "Ringan", label: "Otomotif Mobil (TKRO)" },
            { value: "Sepeda Motor", label: "Sepeda Motor (TBSM)" },
            { value: "Jaringan", label: "Komputer & Jaringan (TKJ)" },
          ]}
        />
      </div>

      {/* Alumni Cards Grid */}
      {paginatedAlumni.length === 0 ? (
        <div className="bg-white rounded-xl p-8 border border-slate-200 text-center space-y-2 min-h-[300px] flex flex-col items-center justify-center">
          <p className="text-sm font-semibold text-slate-800">
            Tidak ada data alumni yang sesuai.
          </p>
          <p className="text-xs text-slate-500">
            Coba ubah kata kunci pencarian atau filter jurusan Anda.
          </p>
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
                  <span className="font-medium text-slate-800">
                    {alumni.pekerjaan}
                  </span>
                </p>

                {alumni.kampus !== "-" && (
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
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </div>
  );
};
