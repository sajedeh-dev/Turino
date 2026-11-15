import type { Tour } from "@/features/tours/types";

export type TripStatus = "upcoming" | "ongoing" | "finished";

export const tripStatusLabels: Record<TripStatus, string> = {
  upcoming: "در انتظار حرکت",
  ongoing: "در حال سفر",
  finished: "به پایان رسیده",
};

export interface UserTrip {
  tour: Tour;
  status: TripStatus;
}

/** Where each bought tour stands at `now`, newest departure first. */
export function toUserTrips(tours: Tour[], now: number): UserTrip[] {
  return [...tours]
    .sort((a, b) => b.startDate.localeCompare(a.startDate))
    .map((tour) => ({
      tour,
      status:
        now < new Date(tour.startDate).getTime()
          ? "upcoming"
          : now <= new Date(tour.endDate).getTime()
            ? "ongoing"
            : "finished",
    }));
}
