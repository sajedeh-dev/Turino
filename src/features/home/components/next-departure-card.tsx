import Link from "next/link";

import { PinIcon } from "@/components/ui/icons";
import type { Tour } from "@/features/tours/types";
import { formatDayMonth } from "@/lib/format";
import { seatsLabel } from "@/features/tours/utils";

/** The nearest departure, floating on the hero photo. */
export function NextDepartureCard({ tour }: { tour: Tour }) {
  return (
    <Link
      href={`/tours/${tour.id}`}
      data-flight-end=""
      className="absolute end-4 bottom-4 flex items-center gap-3 rounded-2xl bg-canvas px-4 py-3 shadow-float transition-transform hover:-translate-y-0.5 max-sm:hidden"
    >
      <span
        data-flight-target=""
        className="flex size-10 items-center justify-center rounded-xl bg-accent-soft text-accent"
      >
        <PinIcon />
      </span>
      <span className="grid leading-6">
        <span className="text-small font-bold">{tour.title}</span>
        <span className="text-xs text-muted">
          حرکت {formatDayMonth(tour.startDate)} · {seatsLabel(tour)}
        </span>
      </span>
    </Link>
  );
}
