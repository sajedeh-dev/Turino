import Form from "next/form";
import type { ReactNode } from "react";

import { CalendarIcon, OriginIcon, PinIcon } from "@/components/ui/icons";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/cn";

import type { Place } from "../types";

export interface TourSearchValues {
  origin?: string;
  destination?: string;
  month?: string;
}

interface SearchBarProps {
  origins: Place[];
  destinations: Place[];
  months: { value: string; label: string }[];
  defaults?: TourSearchValues;
  className?: string;
}

function SearchField({
  id,
  label,
  icon,
  divider,
  children,
}: {
  id: string;
  label: string;
  icon: ReactNode;
  divider?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center gap-3 px-4 py-2.5 md:px-5",
        divider && "border-b border-line md:border-b-0 md:border-l",
      )}
    >
      <span className="text-faint">{icon}</span>
      <div className="grid min-w-0 flex-1">
        <label htmlFor={id} className="text-xs text-muted">
          {label}
        </label>
        {children}
      </div>
    </div>
  );
}

/**
 * Origin, destination and departure month. A plain GET form to /tours: it works without
 * JavaScript, and with it next/form navigates on the client.
 */
export function SearchBar({
  origins,
  destinations,
  months,
  defaults = {},
  className,
}: SearchBarProps) {
  return (
    <Form
      action="/tours"
      role="search"
      aria-label="جستجوی تور"
      className={cn(
        "grid rounded-3xl border border-line-strong bg-canvas p-2 shadow-float md:grid-cols-[repeat(3,minmax(0,1fr))_auto] md:items-center",
        className,
      )}
    >
      <SearchField
        id="search-origin"
        label="مبدأ"
        icon={<OriginIcon width={22} height={22} />}
        divider
      >
        <Select
          id="search-origin"
          name="origin"
          variant="bare"
          defaultValue={defaults.origin ?? ""}
          options={[
            { value: "", label: "همه‌ی شهرها" },
            ...origins.map((place) => ({ value: place.id, label: place.name })),
          ]}
        />
      </SearchField>
      <SearchField
        id="search-destination"
        label="مقصد"
        icon={<PinIcon width={22} height={22} />}
        divider
      >
        <Select
          id="search-destination"
          name="destination"
          variant="bare"
          defaultValue={defaults.destination ?? ""}
          options={[
            { value: "", label: "همه‌ی مقصدها" },
            ...destinations.map((place) => ({ value: place.id, label: place.name })),
          ]}
        />
      </SearchField>
      <SearchField
        id="search-month"
        label="تاریخ حرکت"
        icon={<CalendarIcon width={22} height={22} />}
      >
        <Select
          id="search-month"
          name="month"
          variant="bare"
          defaultValue={defaults.month ?? ""}
          options={[
            { value: "", label: "همه‌ی تاریخ‌ها" },
            ...months.map((month) => ({ value: month.value, label: month.label })),
          ]}
        />
      </SearchField>
      <button
        type="submit"
        className="mt-2 min-h-14 rounded-2xl bg-accent px-10 text-body font-bold text-on-accent transition-colors hover:bg-accent-hover md:mt-0"
      >
        جستجو
      </button>
    </Form>
  );
}
