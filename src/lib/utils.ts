import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num);
}

export function formatTimeAgo(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} mnt lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays === 1) return 'Kemarin';
    return `${diffDays} hari lalu`;
  } catch {
    return dateStr;
  }
}

export function formatNameTitleCase(raw?: string): string {
  if (!raw) return '';
  return raw
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word) => {
      if (!word) return '';
      if (/^[a-z]\.$/i.test(word)) return word.toUpperCase();
      if (word.includes("'")) {
        return word
          .split("'")
          .map((p) => (p ? p.charAt(0).toUpperCase() + p.slice(1) : ''))
          .join("'");
      }
      if (word.includes('-')) {
        return word
          .split('-')
          .map((p) => (p ? p.charAt(0).toUpperCase() + p.slice(1) : ''))
          .join('-');
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

