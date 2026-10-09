import * as XLSX from 'xlsx';

export interface ExcelExportOptions {
  sheetName?: string;
  columnWidths?: number[];
}

/**
 * Utility helper to export structured JSON data to a downloadable Excel (.xlsx) file.
 */
export function exportJsonToExcel<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  options?: ExcelExportOptions
): void {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  const sheetName = options?.sheetName || 'Data';

  if (options?.columnWidths && options.columnWidths.length > 0) {
    ws['!cols'] = options.columnWidths.map((wch) => ({ wch }));
  } else if (data.length > 0) {
    // Auto-detect column widths based on keys and contents
    const keys = Object.keys(data[0]);
    ws['!cols'] = keys.map((key) => {
      let maxLen = key.length;
      for (const row of data) {
        const val = row[key];
        const valLen = val !== null && val !== undefined ? String(val).length : 0;
        if (valLen > maxLen) maxLen = valLen;
      }
      return { wch: Math.min(Math.max(maxLen + 3, 10), 60) };
    });
  }

  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
}
