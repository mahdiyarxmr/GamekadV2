// Persian numbers and formatters for Gamekad / Rokad

export function toPersianDigits(num: number | string | null | undefined): string {
  if (num === null || num === undefined) return '';
  const str = String(num);
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/[0-9]/g, (w) => persianDigits[+w]);
}

export function formatTomans(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return '۰ تومان';
  const num = Math.floor(Number(amount));
  if (isNaN(num)) return '۰ تومان';
  const formatted = num.toLocaleString('fa-IR');
  return `${formatted} تومان`;
}

export function formatShamsiDate(iso: string | null | undefined): string {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return iso;
  }
}

export function formatShamsiTime(iso: string | null | undefined): string {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat('fa-IR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return iso;
  }
}
