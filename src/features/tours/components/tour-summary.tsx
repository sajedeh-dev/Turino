import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";

import type { Tour } from "../types";
import { tourMeta } from "../utils";

interface TourSummaryProps {
  tour: Tour;
  headingLevel?: "h2" | "h3";
  /** Extra line under the meta, e.g. a trip status. */
  badge?: ReactNode;
  className?: string;
}

/** A compact tour row: thumbnail, title, meta and price. Used in checkout and "my tours". */
export function TourSummary({
  tour,
  headingLevel: Heading = "h3",
  badge,
  className,
}: TourSummaryProps) {
  return (
    <article className={cn("flex gap-4 rounded-3xl border border-line p-4", className)}>
      <Image
        src={tour.image}
        alt=""
        width={240}
        height={180}
        sizes="120px"
        className="aspect-[4/3] w-28 shrink-0 rounded-2xl object-cover sm:w-32"
      />
      <div className="grid min-w-0 content-center gap-1">
        {badge}
        <Heading className="text-body font-bold">
          <Link href={`/tours/${tour.id}`} className="hover:text-accent">
            {tour.title}
          </Link>
        </Heading>
        <p className="text-small text-muted">
          از {tour.origin.name} به {tour.destination.name}
        </p>
        <p className="text-small text-muted">{tourMeta(tour)}</p>
        <p className="tabular text-small font-bold">{formatPrice(tour.price)}</p>
      </div>
    </article>
  );
}
