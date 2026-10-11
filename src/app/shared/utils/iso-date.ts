const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseIsoDate(isoDate: string): Date | null {
  const match = ISO_DATE_PATTERN.exec(isoDate);
  if (!match) {
    return null;
  }

  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(year, month - 1, day);
  const isRealDate =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;

  return isRealDate ? date : null;
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function todayIsoDate(): string {
  return toIsoDate(new Date());
}

export function addYears(isoDate: string, years: number): string | null {
  const date = parseIsoDate(isoDate);
  if (!date) {
    return null;
  }

  const targetYear = date.getFullYear() + years;
  const lastDayOfTargetMonth = new Date(targetYear, date.getMonth() + 1, 0).getDate();
  const day = Math.min(date.getDate(), lastDayOfTargetMonth);

  return toIsoDate(new Date(targetYear, date.getMonth(), day));
}
