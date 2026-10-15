import React, { useState, useRef } from 'react';
import {
  Upload,
  Download,
  AlertCircle,
  CheckCircle2,
  X,
  HelpCircle,
  ClipboardList,
} from 'lucide-react';
import {
  ALUMNI_CSV_HEADERS,
  ParsedAlumniRow,
  downloadAlumniTemplate,
  parseAlumniCsv,
  readAlumniSpreadsheet,
} from '@/lib/alumniCsv';

const SolidFileSpreadsheetIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 text-[#0d2346]" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
    <path d="M8 12h8v2H8zm0 4h8v2H8zm0-8h4v2H8z" />
  </svg>
);

interface AdminImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (count: number, detail?: { duplicateCount?: number; invalidCount?: number }) => void;
}

export const AdminImportModal: React.FC<AdminImportModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fileName, setFileName] = useState<string>('');
  const [parsedRows, setParsedRows] = useState<ParsedAlumniRow[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isReadingFile, setIsReadingFile] = useState<boolean>(false);
  const [showColumns, setShowColumns] = useState<boolean>(false);

  if (!isOpen) return null;

  const processFile = async (file: File) => {
    setFileName(file.name);
    setParsedRows([]);
    setErrorMessage('');
    setIsReadingFile(true);

    try {
      const csvText = await readAlumniSpreadsheet(file);
      const result = parseAlumniCsv(csvText);

      if (result.rows.length === 0) {
        setErrorMessage(result.message || 'Berkas tidak dapat diproses.');
        return;
      }

      setParsedRows(result.rows);
      if (result.message) setErrorMessage(result.message);
    } catch (err: any) {
      console.error('[AdminImportModal] Gagal membaca berkas:', err);
      setErrorMessage(err.message || 'Gagal membaca berkas. Pastikan berkas tidak rusak.');
    } finally {
      setIsReadingFile(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleCommitImport = async () => {
    if (parsedRows.length === 0 || isProcessing) return;

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const { adminMasterAlumniApi } = await import('@/services/adminService');

      const records = parsedRows.map((row) => row.dbFields);
      const res = await adminMasterAlumniApi.importCsv(records, true);

      if (!res.success || !res.data) {
        setErrorMessage(res.message || 'Gagal menyimpan data ke basis data.');
        return;
      }

      const { importedCount, duplicateCount, invalidCount } = res.data;

      // Segarkan data dari basis data agar tabel langsung menampilkan hasil impor
      const { useAdminStore } = await import('@/store/adminStore');
      await useAdminStore.getState().fetchMasterAlumniFromBackend();

      onSuccess(importedCount ?? records.length, { duplicateCount, invalidCount });
      onClose();
    } catch (err: any) {
      console.error('[AdminImportModal] Import gagal:', err);
      setErrorMessage(err.message || 'Terjadi kesalahan saat menyimpan data ke basis data.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0d2346] flex items-center justify-center shrink-0">
              <SolidFileSpreadsheetIcon className="w-5 h-5 text-[#0d2346]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Impor Data Siswa Lulusan
              </h2>
              <p className="text-xs text-slate-500">
                Unggah berkas data alumni dari Dapodik atau buku induk sekolah
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Instruction & Template Action */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div className="text-slate-700">
                  <p className="font-semibold text-slate-800">
                    Format Kolom: {ALUMNI_CSV_HEADERS.length} kolom (format ekspor Dapodik)
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Baris pertama wajib memakai header Dapodik. NISN wajib 10 digit dan
                    Tahun Lulus wajib terisi; baris yang tidak valid akan dilewati otomatis.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => downloadAlumniTemplate('csv')}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  title="Unduh template dalam format CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh CSV</span>
                </button>
                <button
                  onClick={() => downloadAlumniTemplate('xlsx')}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  title="Unduh template dalam format Excel (XLSX)"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh XLSX</span>
                </button>
              </div>
            </div>

            {/* Rincian kolom (ringkas, tampil saat dibuka) */}
            <div className="border-t border-slate-200 pt-3">
              <button
                onClick={() => setShowColumns((prev) => !prev)}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 hover:text-[#0d2346] transition cursor-pointer"
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>
                  {showColumns ? 'Sembunyikan rincian kolom' : `Lihat rincian ${ALUMNI_CSV_HEADERS.length} kolom`}
                </span>
              </button>

              {showColumns && (
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {ALUMNI_CSV_HEADERS.map((column, idx) => (
                    <span
                      key={column}
                      className="px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-700 font-mono text-[10px] leading-4"
                      title={`Kolom ke-${idx + 1}: ${column}`}
                    >
                      {column}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Upload Dropzone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-[#0d2346] bg-slate-50/50 hover:bg-slate-100/50 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt,.xlsx,.xls"
              className="hidden"
              onChange={handleFileUpload}
            />
            <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center transition group-hover:bg-slate-300/60 group-hover:text-[#0d2346]">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-800">
                {isReadingFile
                  ? 'Membaca berkas...'
                  : fileName
                    ? fileName
                    : 'Pilih berkas CSV, XLSX, atau tarik berkas ke area ini'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Mendukung berkas CSV, TXT, dan Excel (.xlsx/.xls) hasil ekspor Dapodik
              </p>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Parsed Preview Table */}
          {parsedRows.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Pratinjau Data ({parsedRows.length} Siswa Terbaca)
                </span>
                <span className="text-[11px] text-slate-500">
                  Data NISN yang sudah ada akan dilewati secara otomatis
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 sticky top-0">
                    <tr>
                      <th className="p-2.5">NISN</th>
                      <th className="p-2.5">Nama Lengkap</th>
                      <th className="p-2.5">Program Keahlian</th>
                      <th className="p-2.5">Tahun Lulus</th>
                      <th className="p-2.5">Nomor WhatsApp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {parsedRows.slice(0, 15).map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2.5 font-mono text-slate-800 font-semibold">{row.nisn}</td>
                        <td className="p-2.5 font-medium text-slate-900">{row.nama}</td>
                        <td className="p-2.5 text-slate-600">{row.jurusan}</td>
                        <td className="p-2.5 text-slate-600">{row.tahunLulus}</td>
                        <td className="p-2.5 text-slate-600 font-mono">{row.noWhatsapp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold border border-slate-200 transition cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={handleCommitImport}
            disabled={parsedRows.length === 0 || isProcessing || isReadingFile}
            className="px-5 py-2.5 rounded-xl bg-[#0d2346] hover:bg-[#163868] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {isProcessing
                ? 'Menyimpan...'
                : `Simpan ${parsedRows.length > 0 ? parsedRows.length : ''} Data Siswa`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
