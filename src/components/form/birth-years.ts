"use client";

import { useState } from "react";

import { currentJalaliYear } from "@/lib/jalali";

/** Oldest Persian year offered for a birth date. */
const FIRST_BIRTH_YEAR = 1300;

/**
 * Birth-year range for date pickers, ending at the current Persian year so newborns can travel.
 * Read once per mount (lazy state), never at module load, so it never goes stale in a long build.
 */
export function useBirthYearRange() {
  const [range] = useState(() => ({ from: FIRST_BIRTH_YEAR, to: currentJalaliYear() }));
  return range;
}
