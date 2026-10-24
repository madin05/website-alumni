import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useTracerStore } from '@/store/tracerStore';
import { useNavigate } from 'react-router-dom';
import { generateTracerReceiptPdf, formatStatusKegiatan } from '@/lib/pdfGenerator';
import { FileText, ArrowRight, Download } from 'lucide-react';

interface SubmissionReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  submissionId: string;
}

export const SubmissionReceiptModal: React.FC<SubmissionReceiptModalProps> = ({
  isOpen,
  onClose,
  submissionId,
}) => {
  const { identitas, status_kegiatan, lastSubmittedAt } = useTracerStore();
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();

  const numericReg = (submissionId || '').replace(/\D/g, '');
  const formattedRegId = numericReg.length >= 6 ? numericReg : '2026102498';
  const dateObj = lastSubmittedAt ? new Date(lastSubmittedAt) : new Date();
  const waktuPengisian =
    dateObj.toLocaleString('id-ID', {
      dateStyle: 'long',
      timeStyle: 'short',
    }) + ' WIB';

  const handleDownloadPdf = () => {
    try {
      setIsDownloading(true);
      generateTracerReceiptPdf({
        submissionId: formattedRegId,
        identitas,
        statusKegiatan: status_kegiatan || 'Alumni',
        submittedAt: lastSubmittedAt || undefined,
      });
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleGoDashboard = () => {
    onClose();
    navigate('/dashboard');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="space-y-5 text-center">
        <div>
          <h2 className="text-lg sm:text-xl font-medium text-slate-900 tracking-tight">
            Pengisian Tracer Study Berhasil
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Dokumen tanda bukti resmi telah diterbitkan. Simpan atau cetak berkas ini untuk verifikasi.
          </p>
        </div>

        {/* Formal Official Document Card - Times New Roman */}
        <div
          style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
          className="p-5 sm:p-8 rounded-lg bg-white border border-slate-300 text-left text-black shadow-xs space-y-4 print:border-none"
        >
          {/* KOP SURAT RESMI */}
          <div className="flex items-center justify-between gap-2 sm:gap-4 border-b-2 border-black pb-2.5">
            {/* Logo Yayasan Sasmita Jaya (Kiri) */}
            <div className="shrink-0 w-12 sm:w-16 flex items-center justify-center">
              <img
                src="/logo-yayasan.png"
                alt="Logo Yayasan Sasmita Jaya"
                className="w-11 sm:w-14 h-auto object-contain"
              />
            </div>

            {/* Teks Kop Surat Resmi (Tengah) */}
            <div className="text-center flex-1 space-y-0.5">
              <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-black">
                YAYASAN SASMITA JAYA
              </h3>
              <h2 className="text-sm sm:text-base font-extrabold uppercase text-black tracking-tight">
                SMK SASMITA JAYA 2 (LABSCHOOL UNPAM)
              </h2>
              <p className="text-[10px] sm:text-[11px] font-semibold text-black">
                AKREDITASI : A
              </p>
              <p className="text-[8.5px] sm:text-[10px] text-slate-800">
                NSS : 322020417010, NDS : 42040005, NPSN : 20603287
              </p>
              <p className="text-[8px] sm:text-[9.5px] text-slate-700 leading-tight">
                Jl. Surya Kencana No. 1 Kelurahan Pamulang Barat, Kecamatan Pamulang
              </p>
              <p className="text-[8px] sm:text-[9.5px] text-slate-700 leading-tight">
                Kota Tangerang Selatan, Provinsi Banten. Kode Pos : 15417, Telp. : (021) 7427375
              </p>
              <p className="text-[8px] sm:text-[9.5px] text-slate-700 leading-tight">
                e-mail : sasmitajaya2pml@gmail.com - website : smk2sasmitajaya.sch.id
              </p>
            </div>

            {/* Logo SMK Sasmita Jaya 2 (Kanan) */}
            <div className="shrink-0 w-12 sm:w-16 flex items-center justify-center">
              <img
                src="/logo-emblem.png"
                alt="Logo SMK Sasmita Jaya 2"
                className="w-11 sm:w-14 h-auto object-contain"
              />
            </div>
          </div>

          {/* Garis Ganda Pembatas Kop */}
          <div className="-mt-3 border-b border-black pt-0.5" />

          {/* JUDUL DOKUMEN & NOMOR REGISTRASI */}
          <div className="text-center pt-1 space-y-0.5">
            <h4 className="font-bold text-xs sm:text-sm uppercase underline">
              Surat Keterangan Bukti Pengisian Tracer Study
            </h4>
            <p className="text-xs font-mono font-medium">
              Nomor Registrasi: <span className="font-medium">{formattedRegId}</span>
            </p>
          </div>

          {/* KALIMAT PEMBUKA */}
          <p className="text-xs leading-relaxed text-justify">
            Bursa Kerja Khusus (BKK) SMK Sasmita Jaya 2 menerangkan bahwa alumni berikut:
          </p>

          {/* TABEL DATA FORMAL TITIK DUA SEJAJAR */}
          <div className="text-xs space-y-1.5 pl-2 sm:pl-4">
            <div className="grid grid-cols-12 gap-1">
              <span className="col-span-5 sm:col-span-4 font-normal">Nama Lengkap</span>
              <span className="col-span-1 text-center">:</span>
              <span className="col-span-6 sm:col-span-7 font-medium">{identitas.nama_lengkap || '-'}</span>
            </div>
            <div className="grid grid-cols-12 gap-1">
              <span className="col-span-5 sm:col-span-4 font-normal">NISN / NIK</span>
              <span className="col-span-1 text-center">:</span>
              <span className="col-span-6 sm:col-span-7 font-medium font-mono">{identitas.nisn || '-'} / {identitas.nik || '-'}</span>
            </div>
            <div className="grid grid-cols-12 gap-1">
              <span className="col-span-5 sm:col-span-4 font-normal">Program Keahlian</span>
              <span className="col-span-1 text-center">:</span>
              <span className="col-span-6 sm:col-span-7 font-medium">{identitas.jurusan || '-'}</span>
            </div>
            <div className="grid grid-cols-12 gap-1">
              <span className="col-span-5 sm:col-span-4 font-normal">Tahun Masuk / Lulus</span>
              <span className="col-span-1 text-center">:</span>
              <span className="col-span-6 sm:col-span-7 font-semibold">{identitas.tahun_masuk || 2021} / {identitas.tahun_lulus || 2024}</span>
            </div>
            <div className="grid grid-cols-12 gap-1">
              <span className="col-span-5 sm:col-span-4 font-normal">Nomor Kontak (WhatsApp)</span>
              <span className="col-span-1 text-center">:</span>
              <span className="col-span-6 sm:col-span-7 font-mono">{identitas.no_whatsapp || '-'}</span>
            </div>
            <div className="grid grid-cols-12 gap-1">
              <span className="col-span-5 sm:col-span-4 font-normal">Alamat Email</span>
              <span className="col-span-1 text-center">:</span>
              <span className="col-span-6 sm:col-span-7">{identitas.email || '-'}</span>
            </div>
            <div className="grid grid-cols-12 gap-1">
              <span className="col-span-5 sm:col-span-4 font-normal">Status Aktivitas Terdata</span>
              <span className="col-span-1 text-center">:</span>
              <span className="col-span-6 sm:col-span-7 font-medium ">{formatStatusKegiatan(status_kegiatan)}</span>
            </div>
            <div className="grid grid-cols-12 gap-1">
              <span className="col-span-5 sm:col-span-4 font-normal">Waktu Pengisian Sistem</span>
              <span className="col-span-1 text-center">:</span>
              <span className="col-span-6 sm:col-span-7">{waktuPengisian}</span>
            </div>
          </div>

          {/* PARAGRAF KETERANGAN FORMAL & PENUTUP */}
          <div className="text-xs leading-relaxed space-y-2 pt-1 text-justify">
            <p>
              Telah menyelesaikan pengisian seluruh instrumen penelusuran tamatan (Tracer Study) Tahun Akademik 2025/2026 secara lengkap, sah, dan terdata pada pangkalan data sekolah.
            </p>
            <p>
              Surat keterangan ini merupakan dokumen resmi yang diterbitkan secara elektronik oleh Sistem Informasi Alumni SMK Sasmita Jaya 2 dan dapat dipergunakan sebagai salah satu syarat verifikasi administrasi pengambilan Ijazah asli.
            </p>
            <p>
              Demikian surat keterangan bukti pengisian ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.
            </p>
          </div>

          {/* FOOTER VERIFIKASI */}
          <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 italic">
            <span>Dokumen ini sah dan diterbitkan secara digital oleh Sistem Tracer Study SMK Sasmita Jaya 2.</span>
            <span className="font-mono font-medium not-italic">{formattedRegId}-SASMITA-VALID</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <Button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            isLoading={isDownloading}
            variant="outline"
            size="md"
            className="w-full sm:w-auto font-semibold flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? 'Menyiapkan Dokumen...' : 'Unduh Berkas PDF'}</span>
          </Button>

          <Button
            type="button"
            onClick={handleGoDashboard}
            variant="primary"
            size="md"
            className="w-full sm:w-auto bg-[#0d2346] hover:bg-[#163868] font-semibold flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Buka Dashboard Alumni</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Modal>
  );
};

