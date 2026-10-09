import jsPDF from 'jspdf';
import { IdentitasAlumni } from '@/types/tracer';

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
  const optionsDate: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  const tanggalSurat = dateObj.toLocaleDateString('id-ID', optionsDate);
  const waktuPengisian = dateObj.toLocaleString('id-ID', {
    dateStyle: 'long',
    timeStyle: 'short',
  }) + ' WIB';

  // 1. KOP SURAT FORMAL RESMI
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text('YAYASAN SASMITA JAYA', pageWidth / 2, 17, { align: 'center' });

  doc.setFont('times', 'bold');
  doc.setFontSize(14);
  doc.text('SMK SASMITA JAYA 2 PAMULANG', pageWidth / 2, 23, { align: 'center' });

  doc.setFont('times', 'normal');
  doc.setFontSize(8.5);
  doc.text(
    'STATUS AKREDITASI "A" (UNGGUL) | NPSN: 20607839 | NSS: 322280305012',
    pageWidth / 2,
    27.5,
    { align: 'center' }
  );
  doc.setFontSize(8);
  doc.text(
    'Jl. Surya Kencana No. 1, Pamulang Barat, Kec. Pamulang, Kota Tangerang Selatan, Banten 15417',
    pageWidth / 2,
    31.5,
    { align: 'center' }
  );
  doc.setFontSize(7.5);
  doc.text(
    'Telp: (021) 7402661 | Website: https://smksasmitajaya2.sch.id | Email: bkk@smksasmitajaya2.sch.id',
    pageWidth / 2,
    35.5,
    { align: 'center' }
  );

  // Garis Ganda Kop Surat
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.8);
  doc.line(margin, 38.5, pageWidth - margin, 38.5);
  doc.setLineWidth(0.2);
  doc.line(margin, 39.7, pageWidth - margin, 39.7);

  // Strict Numeric Only Registration ID [YYYYMM####] (contoh: 2026102498)
  const numericOnly = (submissionId || '').replace(/\D/g, '');
  const cleanRegistrationId = numericOnly.length >= 6 ? numericOnly : '2026102498';

  // 2. JUDUL DOKUMEN & NOMOR REGISTRASI
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('SURAT KETERANGAN BUKTI PENGISIAN TRACER STUDY', pageWidth / 2, 49, {
    align: 'center',
  });

  // Garis Bawah Judul
  const titleText = 'SURAT KETERANGAN BUKTI PENGISIAN TRACER STUDY';
  const titleWidth = doc.getTextWidth(titleText);
  doc.setLineWidth(0.4);
  doc.line((pageWidth - titleWidth) / 2, 50, (pageWidth + titleWidth) / 2, 50);

  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.text(`Nomor Registrasi: ${cleanRegistrationId}`, pageWidth / 2, 55.5, {
    align: 'center',
  });

  // 3. PARAGRAF PEMBUKA FORMAL
  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  const openingText =
    'Yang bertanda tangan di bawah ini, Koordinator Bursa Kerja Khusus (BKK) SMK Sasmita Jaya 2 Pamulang menerangkan bahwa alumni berikut:';
  doc.text(openingText, margin, 65, { maxWidth: contentWidth });

  // 4. RINCIAN DATA ALUMNI (TABEL / FORMAT FORMAL TITIK DUA SEJAJAR)
  const yTableStart = 72;
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
    'Surat keterangan ini merupakan dokumen resmi yang diterbitkan secara elektronik oleh Sistem Informasi Alumni SMK Sasmita Jaya 2 dan dapat dipergunakan sebagai salah satu syarat verifikasi administrasi pengambilan Ijazah asli serta Sertifikat Uji Kompetensi Keahlian (BNSP).';
  doc.text(p2, margin, currentY, { maxWidth: contentWidth, align: 'justify' });

  currentY += 12;
  const p3 =
    'Demikian surat keterangan bukti pengisian ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.';
  doc.text(p3, margin, currentY, { maxWidth: contentWidth, align: 'justify' });

  // 6. BAGIAN TANDA TANGAN & PENGESAHAN RESMI
  const ySign = currentY + 14;
  const colRightX = pageWidth - margin - 65;

  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.text(`Pamulang, ${tanggalSurat}`, colRightX, ySign);
  doc.text('Mengetahui,', colRightX, ySign + 5);
  doc.text('Koordinator BKK SMK Sasmita Jaya 2,', colRightX, ySign + 10);

  // Garis Tanda Tangan
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.4);
  doc.line(colRightX, ySign + 38, colRightX + 58, ySign + 38);

  // Baca data ketua BKK dari pengaturan jika tersedia
  let ketuaBkk = 'Ahmad Fauzi, S.Pd., M.Kom.';
  let nipKetuaBkk = 'NIP. 19840219 200902 1 002';
  try {
    const rawStorage = localStorage.getItem('tracer_study_admin_sasmita2');
    if (rawStorage) {
      const parsed = JSON.parse(rawStorage);
      if (parsed?.state?.settings?.ketuaBkk) {
        ketuaBkk = parsed.state.settings.ketuaBkk;
      }
      if (parsed?.state?.settings?.nipKetuaBkk) {
        nipKetuaBkk = `NIP. ${parsed.state.settings.nipKetuaBkk.replace(/^NIP\.?\s*/i, '')}`;
      }
    }
  } catch {
    // ignore
  }

  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.text(ketuaBkk, colRightX, ySign + 42.5);
  doc.setFont('times', 'normal');
  doc.setFontSize(8.5);
  doc.text(nipKetuaBkk, colRightX, ySign + 46.5);

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

