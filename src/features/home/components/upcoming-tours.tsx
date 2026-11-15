import { Reveal } from "@/components/motion/reveal";
import { Tilt } from "@/components/motion/tilt";
import { ChevronStartIcon } from "@/components/ui/icons";
import { TourCard } from "@/features/tours/components/tour-card";
import type { Tour } from "@/features/tours/types";
import Link from "next/link";

export function UpcomingTours({ tours }: { tours: Tour[] }) {
  return (
    <section aria-labelledby="tours-title" className="container-page pt-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="tours-title" className="heading-draw text-head font-extrabold tracking-tight">
            تورهای پیش رو
          </h2>
          <p className="mt-1 text-body text-muted">حرکت‌های بعدی، به ترتیب تاریخ</p>
        </div>
        <Link
          href="/tours"
          className="flex items-center gap-1 text-[0.9375rem] font-bold text-accent hover:text-accent-hover"
        >
          مشاهده همه
          <ChevronStartIcon width={18} height={18} />
        </Link>
      </div>

      {tours.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-surface p-10 text-center">
          <p className="text-lead font-bold">فعلا حرکت تازه‌ای نداریم.</p>
          <p className="mt-1 text-body text-muted">
            تورهای جدید به‌زودی اضافه می‌شوند؛ تورهای قبلی را در صفحه‌ی تورها ببینید.
          </p>
        </div>
      ) : (
        <ul className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {tours.map((tour, index) => (
            <Reveal as="li" key={tour.id} index={index % 4} variant="pop" className="flex">
              <Tilt className="flex w-full">
                <TourCard tour={tour} />
              </Tilt>
            </Reveal>
          ))}
        </ul>
      )}
    </section>
  );
}
