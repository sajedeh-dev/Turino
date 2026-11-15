"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Field, fieldAria, inputClassName } from "@/components/form/field";
import { FieldError } from "@/components/form/field-error";
import { GenderField } from "@/components/form/gender-field";
import { useBirthYearRange } from "@/components/form/birth-years";
import { JalaliDateField } from "@/components/form/jalali-date-field";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState, QueryState } from "@/components/ui/query-state";
import { CheckIcon } from "@/components/ui/icons";
import { useBasket } from "@/features/basket/hooks";
import { TourSummary } from "@/features/tours/components/tour-summary";
import type { Tour } from "@/features/tours/types";
import { useProfile } from "@/features/user/hooks";
import type { UserProfileDto } from "@/features/user/types";
import { formatPrice } from "@/lib/format";

import { useCreateOrder } from "../hooks";
import { type PassengerInput, type PassengerValues, passengerSchema } from "../schemas";

/** Checkout: the basket's ticket, the passenger form and the total, or the receipt once paid. */
export function CheckoutView() {
  const basket = useBasket();
  const profile = useProfile();
  const order = useCreateOrder();

  if (order.isSuccess) {
    return (
      <section
        aria-labelledby="order-done"
        className="mt-8 grid max-w-[36rem] justify-items-start gap-4 rounded-3xl border border-line p-8"
      >
        <span className="flex size-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
          <CheckIcon width={24} height={24} />
        </span>
        <h2 id="order-done" className="text-title font-extrabold">
          سفر شما ثبت شد
        </h2>
        <p className="text-body text-muted">
          {order.data?.message ?? "پرداخت انجام شد."} بلیت در «تورهای من» است و برنامه‌ی حرکت یک روز
          پیش از سفر پیامک می‌شود.
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          <ButtonLink href="/profile/tours">تورهای من</ButtonLink>
          <ButtonLink href="/tours" variant="outline">
            تورهای دیگر
          </ButtonLink>
        </div>
      </section>
    );
  }

  return (
    <div className="mt-8">
      <QueryState
        isPending={basket.isPending || profile.isPending}
        error={basket.error ?? profile.error}
        onRetry={() => {
          void basket.refetch();
          void profile.refetch();
        }}
        isEmpty={!basket.data}
        empty={
          <EmptyState
            title="سبد خرید خالی است."
            action={<ButtonLink href="/tours">انتخاب تور</ButtonLink>}
          />
        }
      >
        {basket.data && (
          <div className="flex flex-wrap items-start gap-8 lg:gap-12">
            <PassengerForm
              tour={basket.data}
              profile={profile.data}
              isSubmitting={order.isPending}
              error={order.error?.message}
              onSubmit={(values) => order.mutate(values)}
            />
            <aside
              aria-label="تور انتخاب‌شده"
              className="w-full flex-[1_1_20rem] lg:sticky lg:top-8"
            >
              <TourSummary tour={basket.data} headingLevel="h2" />
            </aside>
          </div>
        )}
      </QueryState>
    </div>
  );
}

interface PassengerFormProps {
  tour: Tour;
  profile?: UserProfileDto;
  isSubmitting: boolean;
  error?: string;
  onSubmit: (values: PassengerValues) => void;
}

function PassengerForm({ tour, profile, isSubmitting, error, onSubmit }: PassengerFormProps) {
  const birthYears = useBirthYearRange();
  const { register, control, handleSubmit, formState } = useForm<
    PassengerInput,
    unknown,
    PassengerValues
  >({
    resolver: zodResolver(passengerSchema),
    // Filled from the profile when the user has saved it, so most people only press pay.
    defaultValues: {
      fullName: [profile?.firstName, profile?.lastName].filter(Boolean).join(" "),
      nationalCode: profile?.nationalCode ? String(profile.nationalCode) : "",
      gender: profile?.gender,
      birthDate: profile?.birthDate?.slice(0, 10) ?? "",
    },
  });
  const { errors } = formState;

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      aria-labelledby="passenger-title"
      className="min-w-0 flex-[999_1_32rem] rounded-3xl border border-line p-6 sm:p-8"
    >
      <h2 id="passenger-title" className="text-title font-extrabold">
        مشخصات مسافر
      </h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field id="passenger-name" label="نام و نام خانوادگی" error={errors.fullName?.message}>
          <input
            {...fieldAria("passenger-name", errors.fullName?.message)}
            autoComplete="name"
            className={inputClassName}
            {...register("fullName")}
          />
        </Field>
        <Field
          id="passenger-national-code"
          label="کد ملی"
          hint="۱۰ رقم"
          error={errors.nationalCode?.message}
        >
          <input
            {...fieldAria("passenger-national-code", errors.nationalCode?.message, "۱۰ رقم")}
            inputMode="numeric"
            dir="ltr"
            maxLength={10}
            className={`${inputClassName} tabular`}
            {...register("nationalCode")}
          />
        </Field>
        <GenderField registration={register("gender")} error={errors.gender?.message} />
        <Controller
          control={control}
          name="birthDate"
          render={({ field, fieldState }) => (
            <JalaliDateField
              id="passenger-birth-date"
              legend="تاریخ تولد"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              fromYear={birthYears.from}
              toYear={birthYears.to}
              error={fieldState.error?.message}
            />
          )}
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-surface px-5 py-4">
        <p>
          <span className="block text-small text-muted">مبلغ قابل پرداخت</span>
          <span className="tabular text-title font-extrabold">{formatPrice(tour.price)}</span>
        </p>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "در حال پرداخت…" : "ثبت و پرداخت"}
        </Button>
      </div>
      <FieldError id="order-error" message={error} />
    </form>
  );
}
