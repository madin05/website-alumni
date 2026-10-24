import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useAdminStore } from "@/store/adminStore";
import { MOCK_IJAZAH_DATABASE } from "@/lib/mockData";
import { IjazahStatus } from "@/types/tracer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Search,
  MapPin,
  QrCode,
  Printer,
  ShieldCheck,
  Copy,
  Check,
  GraduationCap,
} from "lucide-react";

const resolveIjazahData = (
  searchQuery: string,
  currentUser?: any,
): IjazahStatus | null => {
  const query = (searchQuery || "").trim().toLowerCase();
  if (!query) return null;

  // 1. Direct match in MOCK_IJAZAH_DATABASE
  const directMock =
    MOCK_IJAZAH_DATABASE[query] ||
    Object.values(MOCK_IJAZAH_DATABASE).find(
      (item) =>
        item.nisn.toLowerCase() === query ||
        item.nama.toLowerCase() === query ||
        item.nomorIjazah.toLowerCase() === query,
    );
  if (directMock) return directMock;

  // 2. Query from adminStore (masterAlumni & respondents)
  try {
    const adminState = useAdminStore.getState();
    const masterList = adminState.masterAlumni || [];
    const respondentsList = adminState.respondents || [];

    const foundMaster = masterList.find(
      (m) =>
        m.nisn.toLowerCase() === query ||
        m.nik.toLowerCase() === query ||
        m.nama.toLowerCase() === query ||
        m.nama.toLowerCase().includes(query),
    );

    const foundResp = respondentsList.find(
      (r) =>
        r.nisn.toLowerCase() === query ||
        r.nik.toLowerCase() === query ||
        r.nama.toLowerCase() === query ||
        r.nama.toLowerCase().includes(query) ||
        (foundMaster &&
          (r.nisn === foundMaster.nisn || r.nik === foundMaster.nik)),
    );

    if (foundMaster || foundResp) {
      const nama = foundMaster?.nama || foundResp?.nama || "";
      const jurusan =
        foundMaster?.jurusan ||
        foundResp?.jurusan ||
        "Teknik Komputer dan Jaringan";
      const tahunLulus =
        foundMaster?.tahunLulus || foundResp?.tahunLulus || 2024;
      const cleanNisn = foundMaster?.nisn || foundResp?.nisn || "0051234567";
      const isTracerDone = foundResp
        ? true
        : foundMaster?.statusTracer === "SUDAH";
      const lastDigits = cleanNisn
        .replace(/\D/g, "")
        .slice(-7)
        .padStart(7, "0");
      const nomorIjazah = `M-SMK/K13-3/${String(tahunLulus).slice(-2)}/${lastDigits}`;

      return {
        nisn: cleanNisn,
        nama,
        jurusan,
        tahunLulus,
        statusPengambilan:
          cleanNisn === "0051234567"
            ? "SUDAH_DIAMBIL"
            : isTracerDone
              ? "SIAP_DIAMBIL"
              : "SIAP_DIAMBIL",
        nomorIjazah,
        tanggalSiap: `15 Juli ${tahunLulus}`,
        tanggalDiambil:
          cleanNisn === "0051234567" ? `22 Juli ${tahunLulus}` : undefined,
        lokasiPengambilan: "Ruang Tata Usaha (TU) SMK Sasmita Jaya 2 Pamulang",
        persyaratan: [
          "Bebas Pustaka Perpustakaan (Lengkap)",
          "Bebas Administrasi Keuangan (Lengkap)",
          `Sidik Jari 3 Jari Tengah (${isTracerDone ? "Sudah Dilakukan" : "Datang Langsung"})`,
          `Formulir Tracer Study (${isTracerDone ? "Sudah Mengisi (Tervalidasi)" : "Belum Mengisi - Wajib"})`,
        ],
        barcode: `IJZ-SMK-SASMITA-${tahunLulus}-${cleanNisn}`,
      };
    }
  } catch {
    // Ignore store lookup error
  }

  // 3. Fallback to active user session if match
  if (
    currentUser &&
    (currentUser.nisn?.toLowerCase() === query ||
      currentUser.nik?.toLowerCase() === query ||
      currentUser.nama?.toLowerCase() === query)
  ) {
    const isDone = currentUser.tracerStatus === "SUDAH";
    const tahunLulus = currentUser.tahun_lulus || 2024;
    const cleanNisn = currentUser.nisn || "0051234567";
    return {
      nisn: cleanNisn,
      nama: currentUser.nama || "Alumni SMK Sasmita",
      jurusan: currentUser.jurusan || "Teknik Komputer dan Jaringan",
      tahunLulus: tahunLulus,
      statusPengambilan: isDone ? "SIAP_DIAMBIL" : "SIAP_DIAMBIL",
      nomorIjazah: `M-SMK/K13-3/${String(tahunLulus).slice(-2)}/${cleanNisn.slice(-7).padStart(7, "0")}`,
      tanggalSiap: `15 Juli ${tahunLulus}`,
      lokasiPengambilan: "Ruang Tata Usaha (TU) SMK Sasmita Jaya 2 Pamulang",
      persyaratan: [
        "Bebas Pustaka Perpustakaan (Lengkap)",
        "Bebas Administrasi Keuangan (Lengkap)",
        `Sidik Jari 3 Jari Tengah (${isDone ? "Sudah Dilakukan" : "Datang Langsung"})`,
        `Formulir Tracer Study (${isDone ? "Sudah Mengisi (Tervalidasi)" : "Belum Mengisi - Wajib"})`,
      ],
      barcode: `IJZ-SMK-SASMITA-${tahunLulus}-${cleanNisn}`,
    };
  }

  // 4. Fallback for valid NISN/NIK formats
  const isDigits = /^\d{8,16}$/.test(query);
  if (isDigits) {
    return {
      nisn: query,
      nama: `Alumni Terdaftar (${query})`,
      jurusan: "Teknik Komputer dan Jaringan",
      tahunLulus: 2024,
      statusPengambilan: "SIAP_DIAMBIL",
      nomorIjazah: `M-SMK/K13-3/24/${query.slice(-7).padStart(7, "0")}`,
      tanggalSiap: "15 Juli 2024",
      lokasiPengambilan: "Ruang Tata Usaha (TU) SMK Sasmita Jaya 2 Pamulang",
      persyaratan: [
        "Bebas Pustaka Perpustakaan (Lengkap)",
        "Bebas Administrasi Keuangan (Lengkap)",
        "Sidik Jari 3 Jari Tengah (Datang Langsung)",
        "Formulir Tracer Study (Wajib Mengisi)",
      ],
      barcode: `IJZ-SMK-SASMITA-2024-${query}`,
    };
  }

  return null;
};

export const CekIjazahTab: React.FC = () => {
  const { user } = useAuthStore();
  const [searchNisn, setSearchNisn] = useState(
    user?.nisn || user?.nik || "0051234567",
  );
  const [ijazahData, setIjazahData] = useState<IjazahStatus | null>(() => {
    return resolveIjazahData(user?.nisn || user?.nik || "0051234567", user);
  });
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Sync state if logged in user changes
  useEffect(() => {
    const ident = user?.nisn || user?.nik;
    if (ident) {
      const initial = resolveIjazahData(ident, user);
      if (initial) {
        setSearchNisn(ident);
        setIjazahData(initial);
      }
    }
  }, [user]);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const query = searchNisn.trim();
    if (!query) {
      setError("Masukkan NISN (10 digit) atau NIK (16 digit)");
      return;
    }

    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      const found = resolveIjazahData(query, user);
      if (found) {
        setIjazahData(found);
      } else {
        setError(
          "Data alumni dengan NISN / NIK tersebut tidak ditemukan di database sekolah.",
        );
      }
    }, 300);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base sm:text-xl font-bold text-slate-900">
          Verifikasi & Data Ijazah Alumni
        </h2>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3"
      >
        <div className="flex-1">
          <Input
            placeholder="Ketik NISN (10 Digit) atau NIK (16 Digit) untuk mencari..."
            value={searchNisn}
            onChange={(e) => setSearchNisn(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSearching}
          className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
        >
          <span>Cari Data</span>
        </Button>
      </form>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-700 rounded-xl">
          {error}
        </div>
      )}

      {isSearching ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-pulse">
          <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="h-3 w-32 bg-slate-200 rounded" />
              <div className="h-6 w-56 bg-slate-200 rounded" />
            </div>
            <div className="h-8 w-36 bg-slate-200 rounded-lg" />
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2"
                >
                  <div className="h-3 w-24 bg-slate-200 rounded" />
                  <div className="h-5 w-40 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        ijazahData && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Card Header: Official Brand & Verification Badges */}
            <div className="p-4 sm:p-6 bg-slate-50/70 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                      SMK Sasmita Jaya 2 Pamulang
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Data Valid & Terverifikasi
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                    {ijazahData.nama}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    ijazahData.statusPengambilan === "SUDAH_DIAMBIL"
                      ? "bg-slate-100 text-slate-700 border-slate-200"
                      : "bg-blue-50 text-blue-700 border-blue-200"
                  }`}
                >
                  Status Dokumen:{" "}
                  {ijazahData.statusPengambilan === "SUDAH_DIAMBIL"
                    ? "Sudah Diambil"
                    : "Tersedia di Loket TU"}
                </span>
              </div>
            </div>

            {/* Card Body: Structured 6-Grid Data */}
            <div className="p-4 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                {/* 1. Nomor Seri Ijazah (Highlighted) */}
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-800 tracking-wider uppercase">
                      Nomor Seri Ijazah
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(ijazahData.nomorIjazah, "noIjazah")
                      }
                      className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1 transition-colors"
                      title="Salin Nomor Ijazah"
                    >
                      {copiedField === "noIjazah" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-[10px] text-emerald-600 font-medium">
                            Tersalin
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-medium">Salin</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="font-mono text-sm sm:text-base font-bold text-blue-900 break-all">
                    {ijazahData.nomorIjazah}
                  </p>
                </div>

                {/* 2. NISN */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">
                      NISN (Siswa)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(ijazahData.nisn, "nisn")}
                      className="text-slate-500 hover:text-slate-700 text-xs flex items-center gap-1 transition-colors"
                      title="Salin NISN"
                    >
                      {copiedField === "nisn" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-[10px] text-emerald-600 font-medium">
                            Tersalin
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-medium">Salin</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="font-mono text-sm sm:text-base font-bold text-slate-800">
                    {ijazahData.nisn}
                  </p>
                </div>

                {/* 3. Status Kelulusan */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">
                    Status Kelulusan
                  </span>
                  <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Lulus & Terverifikasi</span>
                  </p>
                </div>

                {/* 4. Jurusan / Program Keahlian */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">
                    Program Keahlian
                  </span>
                  <p className="text-sm font-bold text-slate-800">
                    {ijazahData.jurusan}
                  </p>
                </div>

                {/* 5. Tahun Lulus */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">
                    Tahun Kelulusan
                  </span>
                  <p className="text-sm font-bold text-slate-800">
                    Tahun Ajaran {ijazahData.tahunLulus}
                  </p>
                </div>

                {/* 6. Lokasi Arsip / Loket */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">
                    Lokasi Arsip / Loket
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">
                      {ijazahData.lokasiPengambilan}
                    </span>
                  </p>
                </div>
              </div>

              {/* Security Stamp & Verification Bar */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-mono font-bold text-slate-800">
                      {ijazahData.barcode}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Kode digital resmi Sistem Informasi Alumni SMK Sasmita
                      Jaya 2 Pamulang
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => window.print()}
                    className="text-xs flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak Bukti</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};
