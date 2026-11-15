import type { Metadata } from "next";
import { Suspense } from "react";

import { Reveal } from "@/components/motion/reveal";
import { Tilt } from "@/components/motion/tilt";
import { getDestinations, getOrigins, getTours } from "@/features/tours/api";
import { SearchBar, type TourSearchValues } from "@/features/tours/components/search-bar";
import { TourCard } from "@/features/tours/components/tour-card";
import {
  departureMonthKey,
  getDepartureMonths,
  hasDeparted,
  upcomingFirst,
} from "@/features/tours/utils";
import { requestTime } from "@/lib/clock";
import { formatNumber } from "@/lib/format";

export const metadata: Metadata = {
  title: "همه‌ی تورها",
};

export default function ToursPage({ searchParams }: PageProps<"/tours">) {
  return (
    <div className="container-page pt-10 md:pt-14">
      <h1 className="text-head font-extrabold tracking-tight">همه‌ی تورها</h1>
      <p className="mt-1 text-body text-muted">مبدأ، مقصد یا ماه حرکت را انتخاب کنید.</p>
      <Suspense fallback={<p className="mt-10 text-body text-muted">در حال بارگذاری تورها…</p>}>
        <TourResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

const pick = (value: string | string[] | undefined) =>
  typeof value === "string" && value ? value : undefined;

async function TourResults({ searchParams }: Pick<PageProps<"/tours">, "searchParams">) {
  const params = await searchParams;
  const search: TourSearchValues = {
    origin: pick(params.origin),
    destination: pick(params.destination),
    month: pick(params.month),
  };

  // One request: the full list feeds both the search options and the results, filtered here.
  // (getTours also accepts originId/destinationId for the API's own filter when lists get large.)
  const allTours = await getTours();
  const now = await requestTime();
  const tours = upcomingFirst(allTours, now).filter(
    (tour) =>
      (!search.origin || tour.origin.id === search.origin) &&
      (!search.destination || tour.destination.id === search.destination) &&
      (!search.month || departureMonthKey(tour) === search.month),
  );

  return (
    <>
      <SearchBar
        className="mt-8"
        origins={getOrigins(allTours)}
        destinations={getDestinations(allTours)}
        months={getDepartureMonths(allTours)}
        defaults={search}
      />

      <p role="status" className="mt-10 text-small text-muted">
        {tours.length === 0 ? "" : `${formatNumber(tours.length)} تور`}
      </p>

      {tours.length === 0 ? (
        <div className="mt-2 rounded-3xl bg-surface p-10 text-center">
          <p className="text-lead font-bold">با این جستجو توری پیدا نشد.</p>
          <p className="mt-1 text-body text-muted">مبدأ، مقصد یا ماه دیگری را امتحان کنید.</p>
        </div>
      ) : (
        <ul className="mt-4 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {tours.map((tour, index) => (
            <Reveal as="li" key={tour.id} index={index % 4} variant="pop" className="flex">
              <Tilt className="flex w-full">
                <TourCard
                  tour={tour}
                  headingLevel="h2"
                  preload={index < 4}
                  departed={hasDeparted(tour, now)}
                />
              </Tilt>
            </Reveal>
          ))}
        </ul>
      )}
    </>
  );
}
