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
  if (totalPages <= 1) {
    if (!showInfo || !totalItems || totalItems === 0) return null;
    return (
      <div
        className={cn(
          'flex items-center justify-between py-3.5 px-4 text-xs text-slate-500 font-medium select-none',
          className
        )}
      >
        <div>
          Menampilkan <strong className="text-slate-800">{totalItems}</strong> {itemName}
        </div>
      </div>
    );
  }

  // Calculate item range for information
  const startItem = itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : 1;
  const endItem = itemsPerPage && totalItems ? Math.min(currentPage * itemsPerPage, totalItems) : totalItems;

  // Generate page numbers limited to 3 main visible pages
  const getPageNumbers = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 2) {
      return [1, 2, 3, '...', totalPages];
    }

    if (currentPage >= totalPages - 1) {
      return [1, '...', totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage, '...', totalPages];
  };

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
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
          Menampilkan <span className="font-semibold text-slate-700">{startItem}–{endItem}</span> dari{' '}
          <span className="font-semibold text-slate-700">{totalItems}</span> {itemName}
        </div>
      ) : (
        <div className="order-2 sm:order-1" />
      )}

      {/* Pagination controls */}
      <div className="flex items-center gap-1 order-1 sm:order-2">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage <= 1}
          className={cn(
            'inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-medium transition-colors',
            currentPage <= 1
              ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
              : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 cursor-pointer active:bg-slate-100'
          )}
          aria-label="Halaman Sebelumnya"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sebelumnya</span>
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
            const isActive = pageNum === currentPage;

            return (
              <button
                key={`page-${pageNum}`}
                type="button"
                onClick={() => handlePageClick(pageNum)}
                className={cn(
                  'min-w-[32px] h-8 px-2 flex items-center justify-center rounded-md text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-slate-200 text-slate-600 border-blue-300 font-semibold rounded-full pointer-events-none'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900 cursor-pointer active:bg-slate-100'
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
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={cn(
            'inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors',
            currentPage >= totalPages
              ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 cursor-pointer active:bg-slate-100'
          )}
          aria-label="Halaman Selanjutnya"
        >
          <span className="hidden sm:inline">Berikutnya</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
