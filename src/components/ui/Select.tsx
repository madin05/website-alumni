import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  requiredStar?: boolean;
  options?: Array<{ value: string | number; label: string }>;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement> | { target: { value: string; name?: string } }) => void;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      requiredStar,
      options,
      children,
      id,
      value,
      defaultValue,
      onChange,
      disabled,
      placeholder = 'Pilih opsi...',
      name,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const internalSelectRef = useRef<HTMLSelectElement | null>(null);

    // Extract options from options prop or children (<option>)
    const parsedOptions: Array<{ value: string | number; label: string }> = [];
    if (options && options.length > 0) {
      parsedOptions.push(...options);
    } else if (children) {
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child) && child.props) {
          const optVal = child.props.value !== undefined ? child.props.value : child.props.children;
          const optLabel = child.props.children ? String(child.props.children) : String(optVal);
          parsedOptions.push({ value: optVal, label: optLabel });
        }
      });
    }

    // Determine current selected value
    const currentVal =
      value !== undefined
        ? String(value)
        : defaultValue !== undefined
        ? String(defaultValue)
        : parsedOptions[0]?.value !== undefined
        ? String(parsedOptions[0].value)
        : '';

    const selectedOption = parsedOptions.find(
      (opt) => String(opt.value) === String(currentVal)
    );

    // Close on outside click
    useEffect(() => {
      const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('touchstart', handleOutsideClick);
      }
      return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
        document.removeEventListener('touchstart', handleOutsideClick);
      };
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsOpen(false);
      };
      if (isOpen) {
        window.addEventListener('keydown', handleKeyDown);
      }
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    const handleSelectOption = (optVal: string | number) => {
      if (disabled) return;
      setIsOpen(false);

      if (internalSelectRef.current) {
        internalSelectRef.current.value = String(optVal);
        const event = new Event('change', { bubbles: true });
        internalSelectRef.current.dispatchEvent(event);
      }

      if (onChange) {
        onChange({
          target: {
            value: String(optVal),
            name: name,
          },
        } as any);
      }
    };

    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={cn('w-full space-y-1.5', className)} ref={containerRef}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-slate-700"
          >
            {label}
            {requiredStar && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {/* Hidden Native Select for standard form & react-hook-form bindings */}
          <select
            ref={(el) => {
              internalSelectRef.current = el;
              if (typeof ref === 'function') {
                ref(el);
              } else if (ref) {
                (ref as React.MutableRefObject<HTMLSelectElement | null>).current = el;
              }
            }}
            id={selectId}
            name={name}
            value={currentVal}
            onChange={onChange as any}
            disabled={disabled}
            tabIndex={-1}
            aria-hidden="true"
            className="sr-only"
            {...props}
          >
            {parsedOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Custom Styled Trigger Button */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsOpen((prev) => !prev)}
            className={cn(
              'w-full flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 font-medium shadow-xs transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0d2346]/10 focus:border-[#0d2346] hover:border-slate-300 text-left',
              isOpen && 'border-[#0d2346] ring-2 ring-[#0d2346]/10',
              error && 'border-rose-500 focus:ring-rose-500/20 text-rose-900',
              disabled && 'cursor-not-allowed bg-slate-50 text-slate-400'
            )}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <span className={cn('truncate', !selectedOption && 'text-slate-400')}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown
              className={cn(
                'w-4 h-4 text-slate-400 shrink-0 ml-2 transition-transform duration-200',
                isOpen && 'rotate-180 text-[#0d2346]'
              )}
            />
          </button>

          {/* Custom Animated Popup Menu */}
          {isOpen && (
            <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-xl border border-slate-200 shadow-xl py-1.5 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
              {parsedOptions.length === 0 ? (
                <div className="px-4 py-3 text-xs text-slate-400 text-center">
                  Tidak ada pilihan tersedia
                </div>
              ) : (
                parsedOptions.map((opt) => {
                  const isSelected = String(opt.value) === String(currentVal);

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelectOption(opt.value)}
                      className={cn(
                        'w-full px-3.5 py-2.5 text-left text-xs sm:text-sm flex items-center justify-between transition-colors cursor-pointer',
                        isSelected
                          ? 'bg-slate-100 text-[#0d2346] font-bold'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-[#0d2346]'
                      )}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <span className="truncate">{opt.label}</span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-[#0d2346] shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-xs font-medium text-rose-600 flex items-center gap-1">
            <svg
              className="w-3.5 h-3.5 inline-block shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
