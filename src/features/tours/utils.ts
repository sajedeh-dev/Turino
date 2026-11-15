import { formatDayMonth, formatNumber, formatYear, nightsBetween } from "@/lib/format";
import { isoToJalali, jalaliMonthNames } from "@/lib/jalali";

import { vehicleLabels } from "./constants";
import type { Tour } from "./types";

export function sortByDeparture(tours: Tour[]) {
  return [...tours].sort((a, b) => a.startDate.localeCompare(b.startDate));
}

/** True once the tour's departure time has passed; it can no longer be booked. */
export function hasDeparted(tour: Tour, now: number) {
  return new Date(tour.startDate).getTime() <= now;
}

/** Upcoming tours first (soonest first), then departed ones (most recent first). */
export function upcomingFirst(tours: Tour[], now: number) {
  const sorted = sortByDeparture(tours);
  return [
    ...sorted.filter((tour) => !hasDeparted(tour, now)),
    ...sorted.filter((tour) => hasDeparted(tour, now)).reverse(),
  ];
}

export function isAlmostFull(tour: Tour) {
  return tour.availableSeats > 0 && tour.availableSeats <= 5;
}

/** "۱۳ آذر · ۳ شب · اتوبوس" */
export function tourMeta(tour: Tour) {
  const nights = nightsBetween(tour.startDate, tour.endDate);
  return `${formatDayMonth(tour.startDate)} · ${formatNumber(nights)} شب · ${vehicleLabels[tour.vehicle]}`;
}

/** "فقط ۳ صندلی مانده" when almost full, otherwise "۱۱ صندلی خالی". */
export function seatsLabel(tour: Tour) {
  if (tour.availableSeats <= 0) return "ظرفیت تکمیل";
  const seats = formatNumber(tour.availableSeats);
  return isAlmostFull(tour) ? `فقط ${seats} صندلی مانده` : `${seats} صندلی خالی`;
}

/** The Persian month a tour departs in, as "1405-9". */
export function departureMonthKey(tour: Tour) {
  const date = isoToJalali(tour.startDate);
  return date ? `${date.year}-${date.month}` : "";
}

/** Distinct departure months, in date order, for the search bar. */
export function getDepartureMonths(tours: Tour[]) {
  const months = new Map<string, string>();
  for (const tour of sortByDeparture(tours)) {
    const date = isoToJalali(tour.startDate);
    if (!date) continue;
    const key = `${date.year}-${date.month}`;
    if (!months.has(key)) {
      months.set(key, `${jalaliMonthNames[date.month - 1]} ${formatYear(date.year)}`);
    }
  }
  return [...months.entries()].map(([value, label]) => ({ value, label }));
}
