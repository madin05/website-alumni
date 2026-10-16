import jsPDF from 'jspdf';
import { IdentitasAlumni } from '@/types/tracer';
import { YAYASAN_LOGO_BASE64, SMK_LOGO_BASE64 } from './pdfAssets';

interface GenerateReceiptPdfParams {
  submissionId: string;
  identitas: Partial<IdentitasAlumni>;
  statusKegiatan: string;
  submittedAt?: string;
}

export const formatStatusKegiatan = (status?: string): string => {
  if (!status) return 'ALUMNI';
  const clean = status.trim().toUpperCase();
  switch (clean) {
    case 'KERJA_KULIAH':
    case 'KERJA KULIAH':
      return 'KULIAH & KERJA';
    case 'WIRAUSAHA_KULIAH':
    case 'WIRAUSAHA KULIAH':
      return 'KULIAH & WIRAUSAHA';
    case 'KERJA':
      return 'BEKERJA';
    case 'KULIAH':
      return 'KULIAH';
    case 'WIRAUSAHA':
      return 'WIRAUSAHA';
    case 'BELUM_KERJA':
    case 'BELUM KERJA':
      return 'BELUM BEKERJA';
    default:
      return clean.replace(/_/g, ' & ');
  }
};

export const generateTracerReceiptPdf = ({
  submissionId,
  identitas,
  statusKegiatan,
  submittedAt,
}: GenerateReceiptPdfParams) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // Format tanggal formal Indonesia
  const dateObj = submittedAt ? new Date(submittedAt) : new Date();
  const waktuPengisian =
    dateObj.toLocaleString('id-ID', {
      dateStyle: 'long',
      timeStyle: 'short',
    }) + ' WIB';

  // 1. KOP SURAT FORMAL RESMI
  // Gambar Logo Resmi (Yayasan di sisi kiri, SMK Sasmita Jaya 2 di sisi kanan)
  try {
    doc.addImage(YAYASAN_LOGO_BASE64, 'PNG', margin, 15, 23, 23);
  } catch (e) {
    console.warn('Failed to add Yayasan logo to PDF:', e);
  }

  try {
    doc.addImage(SMK_LOGO_BASE64, 'PNG', pageWidth - margin - 23, 15, 23, 23);
  } catch (e) {
    console.warn('Failed to add SMK logo to PDF:', e);
  }

  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text('YAYASAN SASMITA JAYA', pageWidth / 2, 16, { align: 'center' });

  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.text('SMK SASMITA JAYA 2 (LABSCHOOL UNPAM)', pageWidth / 2, 21.5, { align: 'center' });

  doc.setFont('times', 'bold');
  doc.setFontSize(8.5);
  doc.text('AKREDITASI : A', pageWidth / 2, 26, { align: 'center' });

  doc.setFont('times', 'normal');
  doc.setFontSize(8);
  doc.text(
    'NSS : 322020417010, NDS : 42040005, NPSN : 20603287',
    pageWidth / 2,
    30,
    { align: 'center' }
  );
  doc.text(
    'Jl. Surya Kencana No. 1 Kelurahan Pamulang Barat, Kecamatan Pamulang',
    pageWidth / 2,
    33.5,
    { align: 'center' }
  );
  doc.setFontSize(7.5);
  doc.text(
    'Kota Tangerang Selatan, Provinsi Banten. Kode Pos : 15417, Telp. : (021) 7427375',
    pageWidth / 2,
    37,
    { align: 'center' }
  );
  doc.text(
    'e-mail : sasmitajaya2pml@gmail.com - website : smk2sasmitajaya.sch.id',
    pageWidth / 2,
    40.5,
    { align: 'center' }
  );

  // Garis Ganda Kop Surat
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.8);
  doc.line(margin, 43.5, pageWidth - margin, 43.5);
  doc.setLineWidth(0.2);
  doc.line(margin, 44.7, pageWidth - margin, 44.7);

  // Strict Numeric Only Registration ID [YYYYMM####] (contoh: 2026102498)
  const numericOnly = (submissionId || '').replace(/\D/g, '');
  const cleanRegistrationId = numericOnly.length >= 6 ? numericOnly : '2026102498';

  // 2. JUDUL DOKUMEN & NOMOR REGISTRASI
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('SURAT KETERANGAN BUKTI PENGISIAN TRACER STUDY', pageWidth / 2, 53.5, {
    align: 'center',
  });

  // Garis Bawah Judul
  const titleText = 'SURAT KETERANGAN BUKTI PENGISIAN TRACER STUDY';
  const titleWidth = doc.getTextWidth(titleText);
  doc.setLineWidth(0.4);
  doc.line((pageWidth - titleWidth) / 2, 54.5, (pageWidth + titleWidth) / 2, 54.5);

  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.text(`Nomor Registrasi: ${cleanRegistrationId}`, pageWidth / 2, 60, {
    align: 'center',
  });

  // 3. PARAGRAF PEMBUKA FORMAL
  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  const openingText =
    'Bursa Kerja Khusus (BKK) SMK Sasmita Jaya 2 menerangkan bahwa alumni berikut:';
  doc.text(openingText, margin, 69, { maxWidth: contentWidth });

  // 4. RINCIAN DATA ALUMNI (TABEL / FORMAT FORMAL TITIK DUA SEJAJAR)
  const yTableStart = 76;
  const colLabelX = margin + 4;
  const colColonX = margin + 54;
  const colValueX = margin + 58;

  const dataRows: [string, string][] = [
    ['Nama Lengkap', identitas.nama_lengkap || '-'],
    ['NISN', identitas.nisn || '-'],
    ['NIK (KTP)', identitas.nik || '-'],
    ['Program Keahlian', identitas.jurusan || '-'],
    [
      'Tahun Masuk / Lulus',
      `${identitas.tahun_masuk || 2021} / ${identitas.tahun_lulus || 2024}`,
    ],
    ['Nomor Kontak (WhatsApp)', identitas.no_whatsapp || '-'],
    ['Alamat Email', identitas.email || '-'],
    [
      'Status Aktivitas Terdata',
      formatStatusKegiatan(statusKegiatan),
    ],
    ['Waktu Pengisian Sistem', waktuPengisian],
  ];

  let currentY = yTableStart;
  dataRows.forEach(([label, value]) => {
    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(label, colLabelX, currentY);
    doc.text(':', colColonX, currentY);

    doc.setFont('times', 'bold');
    doc.text(value, colValueX, currentY);

    currentY += 6.5;
  });

  // 5. PARAGRAF PENJELASAN & PENUTUP FORMAL (Tanpa Box Hijau Santai)
  currentY += 4;
  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  const p1 =
    'Telah menyelesaikan seluruh instrumen penelusuran tamatan (Tracer Study) Tahun Akademik 2025/2026 secara lengkap, sah, dan terdata pada pangkalan data sekolah.';
  doc.text(p1, margin, currentY, { maxWidth: contentWidth, align: 'justify' });

  currentY += 10;
  const p2 =
    'Surat keterangan ini merupakan dokumen resmi yang diterbitkan secara elektronik oleh Sistem Informasi Alumni SMK Sasmita Jaya 2 dan dapat dipergunakan sebagai salah satu syarat verifikasi administrasi pengambilan Ijazah asli.';
  doc.text(p2, margin, currentY, { maxWidth: contentWidth, align: 'justify' });

  currentY += 12;
  const p3 =
    'Demikian surat keterangan bukti pengisian ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.';
  doc.text(p3, margin, currentY, { maxWidth: contentWidth, align: 'justify' });

  // 7. FOOTER / CATATAN KAKI RESMI
  const yFooter = 275;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, yFooter, pageWidth - margin, yFooter);

  doc.setFont('times', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(90, 90, 90);
  doc.text(
    'Dokumen ini sah dan diterbitkan secara digital oleh Sistem Tracer Study SMK Sasmita Jaya 2.',
    margin,
    yFooter + 4
  );
  doc.text(
    `Kode Verifikasi: ${cleanRegistrationId}`,
    pageWidth - margin,
    yFooter + 4,
    { align: 'right' }
  );

  // Unduh PDF
  const cleanNisn = (identitas.nisn || 'alumni').trim();
  doc.save(`Bukti_Tracer_Study_${cleanNisn}_${cleanRegistrationId}.pdf`);
};

