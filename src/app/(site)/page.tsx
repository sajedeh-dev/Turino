import { connection } from "next/server";
import { Suspense } from "react";

import { ScrollProgress } from "@/components/motion/scroll-progress";
import { FlightPath } from "@/features/home/components/flight-path";
import { Hero } from "@/features/home/components/hero";
import { NextDepartureCard } from "@/features/home/components/next-departure-card";
import { PhoneBooking } from "@/features/home/components/phone-booking";
import { UpcomingTours } from "@/features/home/components/upcoming-tours";
import { WhyTurino } from "@/features/home/components/why-turino";
import { getDestinations, getOrigins, getTours } from "@/features/tours/api";
import { SearchBar } from "@/features/tours/components/search-bar";
import { getDepartureMonths, hasDeparted, sortByDeparture } from "@/features/tours/utils";
import { requestTime } from "@/lib/clock";

/**
 * Seats and prices change, so tours are read per request (cached briefly in the tours service),
 * never at build time. The page shell is static; the tour-driven parts stream in.
 */
export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      {/* The hero itself is static and renders once; only its data-driven slots stream in. */}
      <Hero
        highlight={
          <Suspense>
            <NextDepartureWithTours />
          </Suspense>
        }
        search={
          <Suspense fallback={<SearchBarPlaceholder />}>
            <SearchWithTours />
          </Suspense>
        }
      />
      <Suspense fallback={<ToursFallback />}>
        <UpcomingWithTours />
      </Suspense>
      <PhoneBooking />
      <WhyTurino />
    </>
  );
}

/** All tours, plus the ones still ahead (departed tours are never promoted as "upcoming"). */
async function loadTours() {
  await connection();
  const tours = sortByDeparture(await getTours());
  const now = await requestTime();
  return { tours, upcoming: tours.filter((tour) => !hasDeparted(tour, now)) };
}

/** The nearest departure on the photo, and the paper plane that flies to it. */
async function NextDepartureWithTours() {
  const { upcoming } = await loadTours();
  if (!upcoming[0]) return null;
  return (
    <>
      <NextDepartureCard tour={upcoming[0]} />
      <FlightPath />
    </>
  );
}

async function SearchWithTours() {
  const { tours } = await loadTours();
  return (
    <SearchBar
      origins={getOrigins(tours)}
      destinations={getDestinations(tours)}
      months={getDepartureMonths(tours)}
    />
  );
}

async function UpcomingWithTours() {
  const { upcoming } = await loadTours();
  return <UpcomingTours tours={upcoming.slice(0, 8)} />;
}

/** Holds the search bar's place while tours load, so nothing below jumps. */
function SearchBarPlaceholder() {
  return (
    <div aria-hidden className="h-[4.75rem] rounded-3xl border border-line-strong md:h-[4.5rem]" />
  );
}

function ToursFallback() {
  return (
    <div role="status" className="container-page pt-24 text-body text-muted">
      در حال آوردن تورها…
    </div>
  );
}
