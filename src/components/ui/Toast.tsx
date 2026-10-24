import React from 'react';
import { Info, Check, AlertCircle, X } from 'lucide-react';

export interface ToastProps {
  message: string | null | undefined;
  onClose?: () => void;
  type?: 'success' | 'info' | 'error';
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  onClose,
  type = 'info',
  className = '',
}) => {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 z-50 max-w-[92vw] sm:max-w-md bg-[#3b82f6] text-white px-4 py-3 rounded-2xl shadow-xl shadow-blue-500/20 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200 border border-blue-400/20 ${className}`}
    >
      {/* White circle icon container */}
      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs">
        {type === 'success' ? (
          <Check className="w-3.5 h-3.5 text-[#3b82f6] stroke-[3]" />
        ) : type === 'error' ? (
          <AlertCircle className="w-3.5 h-3.5 text-[#3b82f6] stroke-[2.5]" />
        ) : (
          <Info className="w-3.5 h-3.5 text-[#3b82f6] stroke-[2.5]" />
        )}
      </div>

      {/* Message Text */}
      <p className="text-xs sm:text-sm font-medium text-white flex-1 leading-snug">
        {message}
      </p>

      {/* Close Button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup notifikasi"
          className="p-1 -mr-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
