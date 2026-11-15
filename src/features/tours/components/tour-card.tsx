import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";

import type { Tour } from "../types";
import { isAlmostFull, seatsLabel, tourMeta } from "../utils";

interface TourCardProps {
  tour: Tour;
  /** Heading level, so the card fits the page outline. */
  headingLevel?: "h2" | "h3";
  /** Load the image early; for cards in the first screen. */
  preload?: boolean;
  /** The tour has already left: shown muted, labelled, and without a booking call to action. */
  departed?: boolean;
}

/** Photo, title, date · nights · vehicle, then price and a booking link. */
export function TourCard({
  tour,
  headingLevel: Heading = "h3",
  preload = false,
  departed = false,
}: TourCardProps) {
  const href = `/tours/${tour.id}`;

  return (
    <article className={cn("group flex w-full flex-col", departed && "opacity-60")}>
      <Link href={href} tabIndex={-1} aria-hidden className="block overflow-hidden rounded-2xl">
        <Image
          src={tour.image}
          alt=""
          width={600}
          height={450}
          preload={preload}
          sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 100vw"
          className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </Link>
      <Heading className="mt-4 text-lead font-bold">
        <Link href={href} className="hover:text-accent">
          {tour.title}
        </Link>
      </Heading>
      <p className="mt-1 mb-4 text-small text-muted">{tourMeta(tour)}</p>
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4">
        <p className="grid">
          <span className="tabular font-extrabold">{formatPrice(tour.price)}</span>
          <span
            className={cn(
              "text-xs",
              !departed && isAlmostFull(tour) ? "text-warning" : "text-muted",
            )}
          >
            {!departed && isAlmostFull(tour) && (
              // A gentle pulse draws the eye to scarce seats.
              <span aria-hidden className="relative me-1.5 inline-flex size-2 align-middle">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-warning opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex size-2 rounded-full bg-warning" />
              </span>
            )}
            {departed ? "برگزار شده" : seatsLabel(tour)}
          </span>
        </p>
        <Link
          href={href}
          className="inline-flex min-h-10 items-center rounded-xl bg-accent-soft px-4 text-small font-bold text-accent transition-colors hover:bg-accent hover:text-on-accent"
        >
          {departed ? "جزئیات" : "رزرو"}
          <span className="sr-only"> {tour.title}</span>
        </Link>
      </div>
    </article>
  );
}
