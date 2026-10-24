import React, { useState } from "react";
import { JobVacancy } from "@/types/tracer";
import { useAuthStore } from "@/store/authStore";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
  ShieldCheck,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  FileText,
  MessageCircle,
  Mail,
} from "lucide-react";

interface JobReferralModalProps {
  job: JobVacancy | null;
  isOpen: boolean;
  onClose: () => void;
}

export const JobReferralModal: React.FC<JobReferralModalProps> = ({
  job,
  isOpen,
  onClose,
}) => {
  const { user } = useAuthStore();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey((curr) => (curr === key ? null : curr));
    }, 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Akses Pendaftaran Mandiri"
      subtitle={job ? `${job.title} - ${job.company}` : undefined}
      maxWidth="lg"
    >
      {job && (
        <div className="space-y-5 text-xs text-slate-700">
          {/* Top Notification Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <p className="font-bold text-slate-900">
                Layanan Rujukan Langsung Mitra Industri (BKK Hub)
              </p>
              <p className="text-slate-600 leading-relaxed">
                BKK SMK Sasmita Jaya 2 menghubungkan Anda langsung ke kanal
                pendaftaran resmi mitra. Gunakan etika komunikasi profesional
                dan sertakan identitas alumni Anda.
              </p>
            </div>
          </div>

          {/* CASE 1: WALK-IN INTERVIEW */}
          {job.applyType === "walk_in" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900 text-xs">
                    Jadwal & Lokasi Walk-in Interview
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-emerald-800 block">
                    Waktu Kedatangan:
                  </span>
                  <p className="text-slate-800 font-medium">
                    {job.walkInSchedule ||
                      "Senin s/d Jumat, Pukul 08.30 - 11.00 WIB"}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-emerald-800 block">
                    Alamat Lengkap Tujuan:
                  </span>
                  <p className="text-slate-800 leading-relaxed bg-white/80 p-2.5 rounded-lg border border-emerald-100 font-mono text-[11px]">
                    {job.locationAddress || job.location}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        job.locationAddress || job.location,
                        "address",
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-semibold transition text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    {copiedKey === "address" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-blue-600" />
                        <span>Alamat Disalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Alamat Lengkap</span>
                      </>
                    )}
                  </button>

                  <a
                    href={
                      job.mapsUrl ||
                      `https://maps.google.com/?q=${encodeURIComponent(
                        job.locationAddress || job.location,
                      )}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 font-semibold transition text-xs flex items-center gap-1.5 shadow-2xs"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Buka di Google Maps</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </div>
              </div>

              {/* Persyaratan Berkas Fisik */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-600" />
                  <span>Daftar Berkas Fisik yang Wajib Dibawa:</span>
                </h4>
                <ul className="space-y-1.5 list-disc pl-4 text-slate-700 text-[11px]">
                  <li>
                    Surat Lamaran Kerja & Curriculum Vitae (CV) cetak rapi
                  </li>
                  <li>
                    Pas foto formal terbaru (ukuran 3x4 atau 4x6 latar
                    belakang merah/biru)
                  </li>
                  <li>
                    Salinan Ijazah SMK Sasmita Jaya 2 atau Surat Keterangan
                    Lulus (SKL)
                  </li>
                  <li>
                    Salinan Sertifikat Uji Kompetensi Keahlian (UKK) / BNSP
                    jika ada
                  </li>
                  <li>
                    Fotokopi Kartu Tanda Penduduk (KTP) dan Kartu Keluarga
                    (KK)
                  </li>
                </ul>
                <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  Ketentuan busana: Kemeja formal putih, celana bahan hitam,
                  dan sepatu tertutup. Harap hadir minimal 15 menit sebelum
                  waktu jadwal.
                </p>
              </div>
            </div>
          )}

          {/* CASE 2: WHATSAPP HRD */}
          {job.applyType === "whatsapp" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-green-50/70 border border-green-200 space-y-3">
                <div>
                  <span className="font-bold text-green-900 text-xs">
                    Pendaftaran Melalui WhatsApp HRD Mitra
                  </span>
                </div>

                <div className="space-y-1">
                  {(() => {
                    const templateMsg =
                      job.whatsappTemplate ||
                      `Halo Tim Rekrutmen ${job.company},\n\nSaya ${
                        user?.nama || "Alumni Sasmita"
                      }, alumni SMK Sasmita Jaya 2 program keahlian ${
                        user?.jurusan || "Teknik"
                      } (Lulusan ${
                        user?.tahun_lulus || 2024
                      }). Saya bermaksud mengajukan lamaran untuk posisi ${
                        job.title
                      } sebagaimana diinformasikan pada portal BKK SMK Sasmita Jaya 2.\n\nBerikut saya lampirkan dokumen pendukung dan Curriculum Vitae (CV) saya. Terima kasih.`;

                    const cleanPhone = (
                      job.whatsappNumber || "6281298765432"
                    ).replace(/\D/g, "");

                    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                      templateMsg,
                    )}`;

                    return (
                      <div className="flex items-center gap-2 pt-2">
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-lg bg-green-700 text-white hover:bg-green-800 font-semibold transition text-xs flex items-center gap-1.5 shadow-2xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Hubungi via WhatsApp</span>
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </a>
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-2">
                <p className="font-semibold text-slate-800">
                  Petunjuk Pengiriman:
                </p>
                <p className="leading-relaxed">
                  Kirim pesan pada jam operasional kerja (08.00 - 17.00 WIB).
                  Siapkan berkas CV dalam format PDF dengan format nama file
                  berikut:
                </p>
                <div className="bg-white p-2 rounded-lg border border-slate-200 font-mono text-[10px] text-slate-700 break-all select-all leading-relaxed">
                  CV_{user?.nama?.replace(/\s+/g, "_") || "Alumni"}_
                  {job.title.replace(/\s+/g, "_")}.pdf
                </div>
              </div>
            </div>
          )}

          {/* CASE 3: EMAIL RECRUITMENT */}
          {(!job.applyType || job.applyType === "email") && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div>
                  <span className="font-bold text-slate-900 text-xs">
                    Pengiriman Lamaran via Email Resmi Mitra
                  </span>
                </div>

                {(() => {
                  const targetEmail =
                    job.emailAddress ||
                    job.contactPerson ||
                    "recruitment@partner.id";

                  const targetSubject =
                    job.emailSubject ||
                    `Lamaran Pekerjaan - ${job.title} - ${
                      user?.nama || "Alumni Sasmita"
                    }`;

                  const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(
                    targetSubject,
                  )}`;

                  return (
                    <>
                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-slate-700 block">
                          Alamat Email Tujuan:
                        </span>
                        <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200 gap-2">
                          <span className="font-mono text-slate-900 font-semibold text-[11px] truncate min-w-0">
                            {targetEmail}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(targetEmail, "email_addr")
                            }
                            className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer shrink-0"
                          >
                            {copiedKey === "email_addr" ? (
                              <>
                                <Check className="w-3 h-3 text-blue-600" />
                                <span>Tersalin</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Salin</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-slate-700 block">
                          Format Subjek Email Wajib:
                        </span>
                        <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200 gap-2">
                          <span className="font-mono text-slate-900 text-[11px] truncate min-w-0">
                            {targetSubject}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(targetSubject, "email_subj")
                            }
                            className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer shrink-0"
                          >
                            {copiedKey === "email_subj" ? (
                              <>
                                <Check className="w-3 h-3 text-blue-600" />
                                <span>Tersalin</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Salin</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="pt-2">
                        <a
                          href={mailtoUrl}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold transition text-xs shadow-2xs"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Buka Aplikasi Email Anda</span>
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </a>
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1.5">
                <p className="font-semibold text-slate-800">
                  Panduan Lampiran Email:
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>
                    Lampirkan berkas CV dalam format PDF (maksimal ukuran 2MB).
                  </li>
                  <li>
                    Sertakan portofolio keahlian dan salinan ijazah/SKL SMK
                    Sasmita Jaya 2.
                  </li>
                  <li>
                    Tulis kalimat pembuka sopan pada isi email dengan menyebutkan
                    nama lengkap dan tahun kelulusan.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* CASE 4: EXTERNAL PORTAL LINK */}
          {job.applyType === "external_url" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">
                    Pendaftaran Melalui Portal Karir Resmi Mitra
                  </span>
                </div>

                <p className="text-slate-700 leading-relaxed text-xs">
                  Mitra industri mengelola proses seleksi calon karyawan melalui
                  portal rekrutmen atau Google Form resmi berikut:
                </p>

                <div className="pt-2">
                  <a
                    href={job.externalUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold transition text-xs shadow-2xs"
                  >
                    <span>Buka Portal Pendaftaran Resmi</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl text-[11px] text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">
                  Catatan Pengisian:
                </p>
                <p className="leading-relaxed">
                  Pastikan Anda mencantumkan asal sekolah SMK Sasmita Jaya 2
                  secara lengkap agar memudahkan tim HRD mitra memvalidasi
                  rujukan rekomendasi dari Bursa Kerja Khusus.
                </p>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-200 flex justify-end">
            <Button variant="outline" size="sm" onClick={onClose}>
              Selesai & Tutup
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
