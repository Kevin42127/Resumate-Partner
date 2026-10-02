import type { ResumeLocale } from "./schema";

const EN_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatMonth(value: string, locale: ResumeLocale): string {
  const v = value.trim();
  if (!v) return "";
  const m = v.match(/^(\d{4})(?:[-/.](\d{1,2}))?$/);
  if (!m) return v;
  const [, year, month] = m;
  if (!month) return year;
  const mm = Number(month);
  if (mm < 1 || mm > 12) return year;
  return locale === "en" ? `${EN_MONTHS[mm - 1]} ${year}` : `${year}/${String(mm).padStart(2, "0")}`;
}

export function formatRange(start: string, end: string, current: boolean, locale: ResumeLocale): string {
  const s = formatMonth(start, locale);
  const e = current ? (locale === "en" ? "Present" : "至今") : formatMonth(end, locale);
  if (s && e) return `${s} – ${e}`;
  return s || e;
}
