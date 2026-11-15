"use client";

import { ButtonLink } from "@/components/ui/button";
import { EmptyState, QueryState } from "@/components/ui/query-state";
import { TourSummary } from "@/features/tours/components/tour-summary";
import { cn } from "@/lib/cn";

import { useUserTrips } from "../hooks";
import { type TripStatus, tripStatusLabels } from "../trip-status";

const statusStyles: Record<TripStatus, string> = {
  upcoming: "bg-accent-soft text-accent",
  ongoing: "bg-warning-soft text-warning",
  finished: "bg-surface text-muted",
};

/** The user's bought tours, newest departure first, each with where it stands today. */
export function MyTours() {
  const userTrips = useUserTrips();
  const trips = userTrips.data ?? [];

  return (
    <div className="mt-8">
      <QueryState
        isPending={userTrips.isPending}
        error={userTrips.error}
        onRetry={userTrips.refetch}
        isEmpty={trips.length === 0}
        empty={
          <EmptyState
            title="هنوز توری نخریده‌اید."
            action={<ButtonLink href="/tours">دیدن تورها</ButtonLink>}
          />
        }
      >
        <ul className="grid gap-4">
          {trips.map(({ tour, status }) => (
            <li key={tour.id}>
              <TourSummary
                tour={tour}
                headingLevel="h2"
                badge={
                  <span
                    className={cn(
                      "w-fit rounded-lg px-2.5 py-0.5 text-xs font-bold",
                      statusStyles[status],
                    )}
                  >
                    {tripStatusLabels[status]}
                  </span>
                }
              />
            </li>
          ))}
        </ul>
      </QueryState>
    </div>
  );
}
