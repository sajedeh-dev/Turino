"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Field, fieldAria, inputClassName } from "@/components/form/field";
import { FieldError } from "@/components/form/field-error";
import { GenderField, genderLabels } from "@/components/form/gender-field";
import { useBirthYearRange } from "@/components/form/birth-years";
import { JalaliDateField } from "@/components/form/jalali-date-field";
import { formatDate } from "@/lib/format";

import { useUpdateProfile } from "../hooks";
import {
  type AccountInput,
  type AccountValues,
  accountSchema,
  type BankInput,
  type BankValues,
  bankSchema,
  type PersonalInput,
  type PersonalValues,
  personalSchema,
} from "../schemas";
import type { UserProfileDto } from "../types";
import { EditableSection, FormActions } from "./editable-section";

export function AccountSection({ profile }: { profile: UserProfileDto }) {
  return (
    <EditableSection
      title="اطلاعات حساب"
      rows={[
        { label: "شماره موبایل", value: profile.mobile, ltr: true },
        { label: "ایمیل", value: profile.email, ltr: true },
      ]}
      renderForm={(done) => <AccountForm profile={profile} onDone={done} />}
    />
  );
}

function AccountForm({ profile, onDone }: { profile: UserProfileDto; onDone: () => void }) {
  const update = useUpdateProfile();
  const { register, handleSubmit, formState } = useForm<AccountInput, unknown, AccountValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: { email: profile.email ?? "" },
  });
  const error = formState.errors.email?.message;

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => update.mutate(values, { onSuccess: onDone }))}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="profile-mobile" label="شماره موبایل" hint="شماره‌ی ورود است و تغییر نمی‌کند.">
          <input
            {...fieldAria("profile-mobile", undefined, "شماره‌ی ورود")}
            value={profile.mobile}
            readOnly
            dir="ltr"
            className={`${inputClassName} tabular bg-surface text-muted`}
          />
        </Field>
        <Field id="profile-email" label="ایمیل" error={error}>
          <input
            {...fieldAria("profile-email", error)}
            type="email"
            dir="ltr"
            autoComplete="email"
            placeholder="name@example.com"
            className={inputClassName}
            {...register("email")}
          />
        </Field>
      </div>
      <FieldError id="account-save-error" message={update.error?.message} />
      <FormActions isSaving={update.isPending} onCancel={onDone} />
    </form>
  );
}

export function PersonalSection({ profile }: { profile: UserProfileDto }) {
  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(" ");

  return (
    <EditableSection
      title="اطلاعات شخصی"
      rows={[
        { label: "نام و نام خانوادگی", value: fullName },
        {
          label: "کد ملی",
          value: profile.nationalCode ? String(profile.nationalCode) : undefined,
          ltr: true,
        },
        { label: "جنسیت", value: profile.gender ? genderLabels[profile.gender] : undefined },
        {
          label: "تاریخ تولد",
          value: profile.birthDate ? formatDate(profile.birthDate) : undefined,
        },
      ]}
      renderForm={(done) => <PersonalForm profile={profile} onDone={done} />}
    />
  );
}

function PersonalForm({ profile, onDone }: { profile: UserProfileDto; onDone: () => void }) {
  const birthYears = useBirthYearRange();
  const update = useUpdateProfile();
  const { register, control, handleSubmit, formState } = useForm<
    PersonalInput,
    unknown,
    PersonalValues
  >({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      firstName: profile.firstName ?? "",
      lastName: profile.lastName ?? "",
      nationalCode: profile.nationalCode ? String(profile.nationalCode) : "",
      gender: profile.gender,
      birthDate: profile.birthDate?.slice(0, 10) ?? "",
    },
  });
  const { errors } = formState;

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => update.mutate(values, { onSuccess: onDone }))}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="profile-first-name" label="نام" error={errors.firstName?.message}>
          <input
            {...fieldAria("profile-first-name", errors.firstName?.message)}
            autoComplete="given-name"
            className={inputClassName}
            {...register("firstName")}
          />
        </Field>
        <Field id="profile-last-name" label="نام خانوادگی" error={errors.lastName?.message}>
          <input
            {...fieldAria("profile-last-name", errors.lastName?.message)}
            autoComplete="family-name"
            className={inputClassName}
            {...register("lastName")}
          />
        </Field>
        <Field
          id="profile-national-code"
          label="کد ملی"
          hint="۱۰ رقم"
          error={errors.nationalCode?.message}
        >
          <input
            {...fieldAria("profile-national-code", errors.nationalCode?.message, "۱۰ رقم")}
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
              id="profile-birth-date"
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
      <FieldError id="personal-save-error" message={update.error?.message} />
      <FormActions isSaving={update.isPending} onCancel={onDone} />
    </form>
  );
}

/** Shows only the last four digits of a stored number. */
function masked(value?: string) {
  return value ? `•••• ${value.slice(-4)}` : undefined;
}

export function BankSection({ profile }: { profile: UserProfileDto }) {
  const payment = profile.payment ?? {};

  return (
    <EditableSection
      title="اطلاعات حساب بانکی"
      rows={[
        { label: "شماره شبا", value: masked(payment.shaba_code), ltr: true },
        { label: "شماره کارت", value: masked(payment.debitCard_code), ltr: true },
        { label: "شماره حساب", value: masked(payment.accountIdentifier), ltr: true },
      ]}
      renderForm={(done) => <BankForm profile={profile} onDone={done} />}
    />
  );
}

function BankForm({ profile, onDone }: { profile: UserProfileDto; onDone: () => void }) {
  const update = useUpdateProfile();
  const { register, handleSubmit, formState } = useForm<BankInput, unknown, BankValues>({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      shaba: profile.payment?.shaba_code ?? "",
      cardNumber: profile.payment?.debitCard_code ?? "",
      accountIdentifier: profile.payment?.accountIdentifier ?? "",
    },
  });
  const { errors } = formState;

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) =>
        update.mutate(
          {
            payment: {
              shaba_code: values.shaba,
              debitCard_code: values.cardNumber,
              accountIdentifier: values.accountIdentifier,
            },
          },
          { onSuccess: onDone },
        ),
      )}
    >
      <p className="mb-6 text-body">برای برگشت پول در صورت لغو تور استفاده می‌شود.</p>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="profile-shaba"
          label="شماره شبا"
          hint="IR و ۲۴ رقم"
          error={errors.shaba?.message}
        >
          <input
            {...fieldAria("profile-shaba", errors.shaba?.message, "IR و ۲۴ رقم")}
            dir="ltr"
            placeholder="IR000000000000000000000000"
            className={`${inputClassName} tabular`}
            {...register("shaba")}
          />
        </Field>
        <Field
          id="profile-card"
          label="شماره کارت"
          hint="۱۶ رقم"
          error={errors.cardNumber?.message}
        >
          <input
            {...fieldAria("profile-card", errors.cardNumber?.message, "۱۶ رقم")}
            inputMode="numeric"
            dir="ltr"
            autoComplete="cc-number"
            className={`${inputClassName} tabular`}
            {...register("cardNumber")}
          />
        </Field>
        <Field id="profile-account" label="شماره حساب" error={errors.accountIdentifier?.message}>
          <input
            {...fieldAria("profile-account", errors.accountIdentifier?.message)}
            inputMode="numeric"
            dir="ltr"
            className={`${inputClassName} tabular`}
            {...register("accountIdentifier")}
          />
        </Field>
      </div>
      <FieldError id="bank-save-error" message={update.error?.message} />
      <FormActions isSaving={update.isPending} onCancel={onDone} />
    </form>
  );
}
