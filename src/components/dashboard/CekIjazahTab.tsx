import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { IjazahStatus } from "@/types/tracer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getMyIjazah, getIjazahByNisn } from "@/services/ijazahService";
import {
  FileCheck2,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  QrCode,
  Printer,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

const getJurusanCode = (jurusan: string): string => {
  const lower = (jurusan || "").toLowerCase();
  if (lower.includes("komputer") || lower.includes("jaringan") || lower.includes("tkj")) return "TKJ";
  if (lower.includes("mesin") || lower.includes("tpm")) return "TPM";
  if (lower.includes("listrik") || lower.includes("titl")) return "TITL";
  if (lower.includes("elektronika") || lower.includes("industri") || lower.includes("el")) return "EL";
  if (lower.includes("ringan") || lower.includes("mobil") || lower.includes("tkro")) return "TKRO";
  if (lower.includes("sepeda motor") || lower.includes("tbsm")) return "TBSM";
  return "SMK";
};

export const CekIjazahTab: React.FC = () => {
  const { user } = useAuthStore();
  const [searchNisn, setSearchNisn] = useState(user?.nisn || user?.nik || "");
  const [ijazahData, setIjazahData] = useState<IjazahStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load initial data for logged-in user
  useEffect(() => {
    const loadInitial = async () => {
      if (!user?.nisn && !user?.nik) return;
      setIsLoading(true);
      try {
        const data = await getMyIjazah();
        setIjazahData(data);
        setSearchNisn(data.nisn);
      } catch {
        // ignore, user can search manually
      } finally {
        setIsLoading(false);
      }
    };
    loadInitial();
  }, [user]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const query = searchNisn.trim();
    if (!query) {
      setError("Masukkan NISN (10 digit) atau NIK (16 digit)");
      return;
    }

    setIsSearching(true);
    try {
      const data = await getIjazahByNisn(query);
      setIjazahData(data);
      setError(null);
    } catch (err: any) {
      setIjazahData(null);
      setError(err.message || "Data alumni dengan NISN/NIK tersebut tidak ditemukan di database sekolah.");
    } finally {
      setIsSearching(false);
    }
  };

  const isSiap =
    ijazahData?.statusPengambilan === "SIAP_DIAMBIL" ||
    ijazahData?.statusPengambilan === "SUDAH_DIAMBIL";

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base sm:text-xl font-bold text-slate-900">
          Verifikasi & Pelacakan Status Ijazah
        </h2>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3"
      >
        <div className="flex-1">
          <Input
            placeholder="Ketik NISN (10 Digit) atau NIK (16 Digit) untuk melacak..."
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
          <span>Lacak Status</span>
        </Button>
      </form>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-700 rounded-xl">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-5 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="space-y-1.5">
              <div className="h-3 w-24 bg-slate-200/60 rounded-md animate-pulse animate-shimmer" />
              <div className="h-5 sm:h-6 w-52 bg-slate-200 rounded-md animate-pulse animate-shimmer" />
              <div className="h-3.5 w-64 bg-slate-200/70 rounded-md animate-pulse animate-shimmer" />
            </div>
            <div className="h-7 w-32 rounded-full bg-slate-100 animate-pulse animate-shimmer" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <div className="w-5 h-5 mx-auto rounded-full bg-slate-200 animate-pulse animate-shimmer" />
                <div className="h-3.5 w-24 mx-auto bg-slate-200 rounded-md animate-pulse animate-shimmer" />
                <div className="h-2.5 w-16 mx-auto bg-slate-200/60 rounded-md animate-pulse animate-shimmer" />
              </div>
            ))}
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-2 w-full sm:w-auto">
              <div className="h-3.5 w-60 bg-slate-200 rounded-md animate-pulse animate-shimmer" />
              <div className="h-3.5 w-52 bg-slate-200 rounded-md animate-pulse animate-shimmer" />
              <div className="h-3 w-64 bg-slate-200/70 rounded-md animate-pulse animate-shimmer" />
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-14 h-14 bg-slate-200 rounded-xl animate-pulse animate-shimmer" />
              <div className="h-8 w-36 bg-slate-200 rounded-xl animate-pulse animate-shimmer" />
            </div>
          </div>
        </div>
      ) : (
        ijazahData && (
          <div className="space-y-4 sm:space-y-6">
            {/* Main Status Tracker Card */}
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-5 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{ijazahData.nama}</h3>
                  <p className="text-xs text-slate-500">
                    {ijazahData.nisn} - {ijazahData.jurusan} (Lulus {ijazahData.tahunLulus})
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${
                      ijazahData.statusPengambilan === "SUDAH_DIAMBIL"
                        ? "bg-blue-100 text-blue-800"
                        : ijazahData.statusPengambilan === "SIAP_DIAMBIL"
                        ? "bg-blue-100 text-slate-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {ijazahData.statusPengambilan.replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* Timeline Milestones */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                  <CheckCircle2 className="w-5 h-5 text-slate-600 mx-auto mb-1" />
                  <h4 className="text-xs font-bold text-slate-900">1. Percetakan Ijazah</h4>
                  <p className="text-[10px] text-slate-700">Selesai & Valid</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                  <CheckCircle2 className="w-5 h-5 text-slate-600 mx-auto mb-1" />
                  <h4 className="text-xs font-bold text-slate-900">2. Sertifikat BNSP</h4>
                  <p className="text-[10px] text-slate-700">Lulus Uji Kompetensi</p>
                </div>
                <div className={`p-3 rounded-xl border ${isSiap ? "bg-blue-50 border-blue-200" : "bg-slate-50 border-slate-200"}`}>
                  <CheckCircle2 className={`w-5 h-5 mx-auto mb-1 ${isSiap ? "text-slate-600" : "text-slate-400"}`} />
                  <h4 className={`text-xs font-bold ${isSiap ? "text-slate-900" : "text-slate-700"}`}>3. Siap di Loket TU</h4>
                  <p className={`text-[10px] ${isSiap ? "text-slate-700" : "text-slate-400"}`}>{ijazahData.tanggalSiap || "Tersedia"}</p>
                </div>
                <div className={`p-3 rounded-xl border ${ijazahData.statusPengambilan === "SUDAH_DIAMBIL" ? "bg-slate-50 border-slate-200" : "bg-slate-50 border-slate-200"}`}>
                  <Clock className={`w-5 h-5 mx-auto mb-1 ${ijazahData.statusPengambilan === "SUDAH_DIAMBIL" ? "text-slate-600" : "text-slate-400"}`} />
                  <h4 className={`text-xs font-bold ${ijazahData.statusPengambilan === "SUDAH_DIAMBIL" ? "text-slate-900" : "text-slate-700"}`}>4. Pengambilan Fisik</h4>
                  <p className="text-[10px] text-slate-500">
                    {ijazahData.tanggalDiambil ? `Diambil: ${ijazahData.tanggalDiambil}` : "Menunggu Siswa"}
                  </p>
                </div>
              </div>

              {/* Nomor Ijazah & Barcode */}
              <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-xs text-slate-700">
                  <p>
                    <strong>Nomor Seri Ijazah:</strong>{" "}
                    <span className="font-mono text-blue-700 font-bold">{ijazahData.nomorIjazah}</span>
                  </p>
                  {ijazahData.nomorSertifikatBnsp && (
                    <p>
                      <strong>Nomor Registrasi BNSP:</strong>{" "}
                      <span className="font-mono text-blue-700 font-bold">{ijazahData.nomorSertifikatBnsp}</span>
                    </p>
                  )}
                  <p className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{ijazahData.lokasiPengambilan}</span>
                  </p>
                </div>
              </div>

              {/* Checklist Persyaratan */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold tracking-wider text-slate-700">Kelengkapan Berkas Pengambilan</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {ijazahData.persyaratan.map((syarat, i) => (
                    <div key={i} className="p-3 flex items-center gap-2.5 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-slate-600 shrink-0" />
                      <span>{syarat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};