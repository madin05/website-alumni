/**
 * Helper utility to normalize Indonesian phone numbers into international WhatsApp format (628xxx)
 * and generate ready-to-use WhatsApp chat links.
 */
export function getCleanWaNumber(phone: string = ''): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '6281213514323';
  if (digits.startsWith('0')) return '62' + digits.slice(1);
  if (digits.startsWith('62')) return digits;
  return '62' + digits;
}

export function getHelpdeskWaUrl(
  phone: string = '',
  message: string = 'Halo Helpdesk Tracer Study SMK Sasmita Jaya 2, saya butuh bantuan'
): string {
  const cleanNumber = getCleanWaNumber(phone);
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
