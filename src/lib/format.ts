/** Every date on the site is shown in Iran time, wherever the server or the visitor is. */
export const TIME_ZONE = "Asia/Tehran";

const numberFormatter = new Intl.NumberFormat("fa-IR");

// fa-IR uses the Persian (Solar Hijri) calendar by default.
const dayMonthFormatter = new Intl.DateTimeFormat("fa-IR", {
  timeZone: TIME_ZONE,
  day: "numeric",
  month: "long",
});
const fullDateFormatter = new Intl.DateTimeFormat("fa-IR", {
  timeZone: TIME_ZONE,
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});
const dateFormatter = new Intl.DateTimeFormat("fa-IR", {
  timeZone: TIME_ZONE,
  day: "numeric",
  month: "long",
  year: "numeric",
});

/** "2022-10-02" → "۱۰ مهر ۱۴۰۱" (built from parts for a stable Persian order). */
export function formatDate(isoDate: string) {
  const parts = Object.fromEntries(
    dateFormatter.formatToParts(new Date(isoDate)).map((part) => [part.type, part.value]),
  );
  return `${parts.day} ${parts.month} ${parts.year}`;
}

const monthFormatter = new Intl.DateTimeFormat("fa-IR", {
  timeZone: TIME_ZONE,
  month: "long",
});

export function formatNumber(value: number) {
  return numberFormatter.format(value);
}

/** 12500000 → "۱۲٬۵۰۰٬۰۰۰ تومان" */
export function formatPrice(toman: number) {
  return `${numberFormatter.format(toman)} تومان`;
}

/** "2026-12-04" → "۱۳ آذر" */
export function formatDayMonth(isoDate: string) {
  return dayMonthFormatter.format(new Date(isoDate));
}

/**
 * "2026-12-04" → "پنجشنبه ۱۳ آذر ۱۴۰۵".
 * Built from parts because ICU's own fa-IR pattern for this combination comes out in a
 * mixed order with a Latin comma.
 */
export function formatFullDate(isoDate: string) {
  const parts = Object.fromEntries(
    fullDateFormatter.formatToParts(new Date(isoDate)).map((part) => [part.type, part.value]),
  );
  return `${parts.weekday} ${parts.day} ${parts.month} ${parts.year}`;
}

/** "2026-12-04" → "آذر" */
export function formatMonth(isoDate: string) {
  return monthFormatter.format(new Date(isoDate));
}

/** Inclusive number of nights between two ISO dates. */
export function nightsBetween(startIso: string, endIso: string) {
  const day = 24 * 60 * 60 * 1000;
  return Math.round((new Date(endIso).getTime() - new Date(startIso).getTime()) / day);
}

const twoDigitFormatter = new Intl.NumberFormat("fa-IR", { minimumIntegerDigits: 2 });

/** 119 → "۱:۵۹" */
export function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  return `${numberFormatter.format(minutes)}:${twoDigitFormatter.format(totalSeconds % 60)}`;
}

/** ["الف", "ب", "ج"] → "الف، ب و ج" (ICU's fa list pattern adds a stray comma before «و»). */
export function formatList(items: string[]) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join("، ")} و ${items.at(-1)}`;
}

const yearFormatter = new Intl.NumberFormat("fa-IR", { useGrouping: false });

/** 1401 → "۱۴۰۱" (no thousands separator). */
export function formatYear(year: number) {
  return yearFormatter.format(year);
}
