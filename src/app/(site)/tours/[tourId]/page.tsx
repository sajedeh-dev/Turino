import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CheckIcon } from "@/components/ui/icons";
import { BookTourButton } from "@/features/basket/components/book-tour-button";
import { getTourById } from "@/features/tours/api";
import { vehicleLabels } from "@/features/tours/constants";
import type { Tour } from "@/features/tours/types";
import { hasDeparted, isAlmostFull, seatsLabel } from "@/features/tours/utils";
import { cn } from "@/lib/cn";
import { requestTime } from "@/lib/clock";
import {
  formatDayMonth,
  formatFullDate,
  formatNumber,
  formatPrice,
  nightsBetween,
} from "@/lib/format";

export async function generateMetadata({
  params,
}: PageProps<"/tours/[tourId]">): Promise<Metadata> {
  const { tourId } = await params;
  const tour = await getTourById(tourId);
  return { title: tour?.title ?? "تور پیدا نشد" };
}

export default function TourPage({ params }: PageProps<"/tours/[tourId]">) {
  return (
    <Suspense
      fallback={<p className="container-page pt-10 text-body text-muted">در حال بارگذاری…</p>}
    >
      <TourDetails params={params} />
    </Suspense>
  );
}

async function TourDetails({ params }: Pick<PageProps<"/tours/[tourId]">, "params">) {
  const { tourId } = await params;
  const tour = await getTourById(tourId);
  if (!tour) notFound();

  const unavailableLabel = hasDeparted(tour, await requestTime())
    ? "این تور برگزار شده است"
    : tour.availableSeats <= 0
      ? "ظرفیت تکمیل است"
      : undefined;

  const facts = [
    { label: "مدت", value: `${formatNumber(nightsBetween(tour.startDate, tour.endDate))} شب` },
    { label: "وسیله", value: vehicleLabels[tour.vehicle] },
    { label: "ظرفیت", value: `${formatNumber(tour.capacity)} نفر` },
    { label: "بیمه", value: tour.insurance ? "دارد" : "ندارد" },
  ];

  return (
    <article className="container-page pt-8">
      <nav aria-label="مسیر صفحه" className="text-small text-muted">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/" className="hover:text-accent">
              صفحه اصلی
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/tours" className="hover:text-accent">
              تورها
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-ink">
            {tour.title}
          </li>
        </ol>
      </nav>

      <Image
        src={tour.image}
        alt={tour.imageAlt}
        width={1400}
        height={600}
        preload
        sizes="(min-width: 1200px) 1152px, 100vw"
        className="mt-6 h-64 w-full rounded-3xl object-cover sm:h-96 lg:h-[26rem]"
      />

      <div className="mt-10 flex flex-wrap items-start gap-10 lg:gap-12">
        <div className="min-w-0 flex-[999_1_34rem]">
          <h1 className="text-head font-extrabold tracking-tight md:text-[2.5rem]">{tour.title}</h1>
          <p className="mt-2 text-lead text-ink-soft">
            از {tour.origin.name} به {tour.destination.name} · {formatFullDate(tour.startDate)} تا{" "}
            {formatFullDate(tour.endDate)}
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label} className="rounded-2xl bg-surface p-4">
                <dt className="text-small text-muted">{fact.label}</dt>
                <dd className="mt-1 font-bold">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <section aria-labelledby="included-title" className="mt-12">
            <h2 id="included-title" className="text-title font-extrabold">
              خدمات این تور
            </h2>
            <ul className="mt-5 grid gap-3.5 sm:grid-cols-2">
              {[...tour.options, ...(tour.insurance ? ["بیمه‌ی مسافرتی"] : [])].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <CheckIcon className="shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="cancel-title" className="mt-12 border-t border-line pt-8">
            <h2 id="cancel-title" className="text-title font-extrabold">
              شرایط لغو
            </h2>
            {/* SAMPLE policy text; confirm with the agency. */}
            <p className="mt-3 text-ink-soft">
              تا ۷ روز پیش از حرکت کل مبلغ و پس از آن ۷۰ درصد مبلغ به حساب ثبت‌شده در پروفایل
              برمی‌گردد.
            </p>
          </section>
        </div>

        <BookingCard tour={tour} unavailableLabel={unavailableLabel} />
      </div>

      {/* On phones the booking card sits far down; this bar keeps price and action in reach. */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-canvas/95 px-4 py-3 lg:hidden">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
          <p className="grid leading-6">
            <span className="text-xs text-muted">قیمت برای هر نفر</span>
            <span className="tabular font-extrabold">{formatPrice(tour.price)}</span>
          </p>
          <BookTourButton
            tourId={tour.id}
            unavailableLabel={unavailableLabel}
            className="w-44 [&_button]:h-12"
          />
        </div>
      </div>
      <div aria-hidden className="h-20 lg:hidden" />
    </article>
  );
}

function BookingCard({ tour, unavailableLabel }: { tour: Tour; unavailableLabel?: string }) {
  return (
    <aside
      aria-label="رزرو این تور"
      className="w-full flex-[1_1_20rem] rounded-3xl border border-line-strong p-7 shadow-float lg:sticky lg:top-8"
    >
      <p className="text-small text-muted">قیمت برای هر نفر</p>
      <p className="tabular mt-1 text-[1.875rem] font-extrabold">
        {formatNumber(tour.price)} <span className="text-body font-medium text-muted">تومان</span>
      </p>
      <dl className="mt-6 grid gap-3 border-y border-line py-5 text-[0.9375rem]">
        <div className="flex justify-between">
          <dt className="text-muted">رفت</dt>
          <dd className="font-bold">{formatDayMonth(tour.startDate)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">برگشت</dt>
          <dd className="font-bold">{formatDayMonth(tour.endDate)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">صندلی خالی</dt>
          <dd className={cn("font-bold", isAlmostFull(tour) && "text-warning")}>
            {seatsLabel(tour)}
          </dd>
        </div>
      </dl>
      <BookTourButton tourId={tour.id} unavailableLabel={unavailableLabel} className="mt-6" />
      <p className="mt-3 text-center text-xs text-muted">
        پرداخت امن{tour.insurance ? " · بیمه‌ی مسافرتی همراه تور" : ""}
      </p>
    </aside>
  );
}
