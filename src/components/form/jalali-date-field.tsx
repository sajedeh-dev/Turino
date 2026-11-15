"use client";

import { useState } from "react";

import { daysInJalaliMonth, isoToJalali, jalaliMonthNames, jalaliToIso } from "@/lib/jalali";
import { formatNumber, formatYear } from "@/lib/format";

import { Select } from "@/components/ui/select";

interface JalaliDateFieldProps {
  id: string;
  legend: string;
  /** ISO date ("2022-10-02") or empty. */
  value: string | undefined;
  onChange: (iso: string) => void;
  onBlur?: () => void;
  /** Range of Jalali years offered, newest first. */
  fromYear: number;
  toYear: number;
  error?: string;
}

/**
 * A Persian date as three dropdowns (day, month, year), stored as an ISO Gregorian date.
 * The site's Select keeps it keyboard-friendly; typing digits jumps to a day or year.
 */
export function JalaliDateField(props: JalaliDateFieldProps) {
  const { id, legend, value, onChange, onBlur, fromYear, toYear, error } = props;
  const initial = value ? isoToJalali(value) : null;
  const [parts, setParts] = useState({
    year: initial?.year ?? 0,
    month: initial?.month ?? 0,
    day: initial?.day ?? 0,
  });

  const maxDay = parts.year && parts.month ? daysInJalaliMonth(parts.year, parts.month) : 31;
  const years = Array.from({ length: toYear - fromYear + 1 }, (_, index) => toYear - index);

  function update(next: Partial<typeof parts>) {
    const merged = { ...parts, ...next };
    if (merged.year && merged.month && merged.day > daysInJalaliMonth(merged.year, merged.month)) {
      merged.day = daysInJalaliMonth(merged.year, merged.month);
    }
    setParts(merged);
    onChange(merged.year && merged.month && merged.day ? jalaliToIso(merged) : "");
  }

  const describedBy = error ? `${id}-error` : undefined;
  const common = { onBlur, "aria-invalid": Boolean(error), "aria-describedby": describedBy };
  const pick = (key: keyof typeof parts) => (value: string) =>
    update({ [key]: Number(value) || 0 });

  return (
    <fieldset className="grid gap-2" aria-describedby={describedBy}>
      <legend className="mb-2 text-small font-medium text-ink-soft">{legend}</legend>
      <div className="grid grid-cols-[1fr_1.4fr_1.2fr] gap-2">
        <Select
          id={id}
          aria-label="روز"
          value={parts.day ? String(parts.day) : ""}
          onValueChange={pick("day")}
          options={[
            { value: "", label: "روز" },
            ...Array.from({ length: maxDay }, (_, index) => ({
              value: String(index + 1),
              label: formatNumber(index + 1),
              textValue: String(index + 1),
            })),
          ]}
          {...common}
        />
        <Select
          aria-label="ماه"
          value={parts.month ? String(parts.month) : ""}
          onValueChange={pick("month")}
          options={[
            { value: "", label: "ماه" },
            ...jalaliMonthNames.map((name, index) => ({ value: String(index + 1), label: name })),
          ]}
          {...common}
        />
        <Select
          aria-label="سال"
          value={parts.year ? String(parts.year) : ""}
          onValueChange={pick("year")}
          options={[
            { value: "", label: "سال" },
            ...years.map((year) => ({
              value: String(year),
              label: formatYear(year),
              textValue: String(year),
            })),
          ]}
          {...common}
        />
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-small font-medium text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}
