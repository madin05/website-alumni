import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidths = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
    '3xl': 'sm:max-w-3xl',
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog (Bottom sheet on mobile, centered card on desktop) */}
      <div
        className={cn(
          'relative z-10 w-full max-h-[92vh] sm:max-h-[90vh] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl transition-all border-t border-slate-100 sm:border sm:border-slate-100 flex flex-col my-0 sm:my-8 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200 overflow-hidden',
          maxWidths[maxWidth]
        )}
      >
        {/* Mobile Pull Bar Indicator */}
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mt-2.5 -mb-1 sm:hidden shrink-0" />

        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4 sm:px-6 sm:py-4.5 bg-slate-50/70 shrink-0">
          <div className="pr-3">
            {title && (
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 sm:line-clamp-none">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer shrink-0 -mr-1.5"
            aria-label="Tutup modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 sm:px-6 sm:py-6 pb-8 sm:pb-6 flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
