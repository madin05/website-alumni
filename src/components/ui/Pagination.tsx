import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  itemName?: string;
  className?: string;
  showInfo?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  itemName = 'data',
  className,
  showInfo = true,
}) => {
  // Normalize totalPages and currentPage so they never break when there is only 1 page or 0 items
  const safeTotalPages = Math.max(1, totalPages || 1);
  const safeCurrentPage = Math.min(Math.max(1, currentPage || 1), safeTotalPages);

  // Calculate item range for information
  const startItem = totalItems === 0 ? 0 : (itemsPerPage ? (safeCurrentPage - 1) * itemsPerPage + 1 : 1);
  const endItem = itemsPerPage && totalItems !== undefined ? Math.min(safeCurrentPage * itemsPerPage, totalItems) : (totalItems || 0);

  // Generate page numbers limited to 3 main visible pages
  const getPageNumbers = () => {
    if (safeTotalPages <= 3) {
      return Array.from({ length: safeTotalPages }, (_, i) => i + 1);
    }

    if (safeCurrentPage <= 2) {
      return [1, 2, 3, '...', safeTotalPages];
    }

    if (safeCurrentPage >= safeTotalPages - 1) {
      return [1, '...', safeTotalPages - 2, safeTotalPages - 1, safeTotalPages];
    }

    return [1, '...', safeCurrentPage, '...', safeTotalPages];
  };

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= safeTotalPages && page !== safeCurrentPage) {
      onPageChange(page);
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-3 py-3 px-1 text-xs text-slate-500 font-normal select-none',
        className
      )}
    >
      {/* Information string */}
      {showInfo && totalItems !== undefined ? (
        <div className="order-2 sm:order-1 text-center sm:text-left">
          {totalItems === 0 ? (
            <>
              Menampilkan <span className="font-semibold text-slate-700">0</span> {itemName}
            </>
          ) : (
            <>
              Menampilkan <span className="font-semibold text-slate-700">{startItem}–{endItem}</span> dari{' '}
              <span className="font-semibold text-slate-700">{totalItems}</span> {itemName}
            </>
          )}
        </div>
      ) : (
        <div className="order-2 sm:order-1" />
      )}

      {/* Pagination controls */}
      <div className="flex items-center gap-1 order-1 sm:order-2">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => handlePageClick(safeCurrentPage - 1)}
          disabled={safeCurrentPage <= 1 || totalItems === 0}
          className={cn(
            'inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-medium transition-colors',
            safeCurrentPage <= 1 || totalItems === 0
              ? 'text-slate-300 border-slate-200 cursor-not-allowed'
              : 'text-slate-700 hover:text-slate-900 cursor-pointer active:bg-slate-100'
          )}
          aria-label="Halaman Sebelumnya"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, idx) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-7 h-8 flex items-center justify-center text-xs text-slate-400 font-medium"
                >
                  ...
                </span>
              );
            }

            const pageNum = Number(page);
            const isActive = pageNum === safeCurrentPage;

            return (
              <button
                key={`page-${pageNum}`}
                type="button"
                onClick={() => handlePageClick(pageNum)}
                disabled={totalItems === 0}
                className={cn(
                  'min-w-[32px] h-8 px-2 flex items-center justify-center rounded-full text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-slate-200 text-slate-600 border-blue-300 font-semibold rounded-full pointer-events-none'
                    : 'text-slate-600 border-slate-200 hover:text-slate-900 cursor-pointer active:bg-slate-100'
                )}
                aria-label={`Halaman ${pageNum}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => handlePageClick(safeCurrentPage + 1)}
          disabled={safeCurrentPage >= safeTotalPages || totalItems === 0}
          className={cn(
            'inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors',
            safeCurrentPage >= safeTotalPages || totalItems === 0
              ? 'text-slate-300 border-slate-200 cursor-not-allowed'
              : 'text-slate-700 hover:text-slate-900 cursor-pointer active:bg-slate-100'
          )}
          aria-label="Halaman Selanjutnya"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
