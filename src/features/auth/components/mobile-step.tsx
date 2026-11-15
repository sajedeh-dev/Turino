"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";

import { useSendOtp } from "../hooks/use-auth-mutations";
import { type MobileFormInput, type MobileFormValues, mobileSchema } from "../schemas";
import { FieldError } from "@/components/form/field-error";

interface MobileStepProps {
  defaultMobile: string;
  onCodeSent: (mobile: string, devCode?: string) => void;
}

export function MobileStep({ defaultMobile, onCodeSent }: MobileStepProps) {
  const sendOtp = useSendOtp();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MobileFormInput, unknown, MobileFormValues>({
    resolver: zodResolver(mobileSchema),
    defaultValues: { mobile: defaultMobile },
  });

  const onSubmit = handleSubmit(({ mobile }) =>
    sendOtp.mutate(mobile, { onSuccess: (data) => onCodeSent(mobile, data.code) }),
  );

  const error = errors.mobile?.message ?? sendOtp.error?.message;

  return (
    <form onSubmit={onSubmit} noValidate>
      <h2 id="auth-title" className="text-title font-extrabold">
        ورود به تورینو
      </h2>
      <p className="mt-2 text-body text-muted">
        شماره موبایل خود را بنویسید تا کد ورود را پیامک کنیم. اگر حساب نداشته باشید، ساخته می‌شود.
      </p>

      <label htmlFor="auth-mobile" className="mt-7 block text-small font-medium text-ink-soft">
        شماره موبایل
      </label>
      <input
        id="auth-mobile"
        type="tel"
        dir="ltr"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder="09xxxxxxxxx"
        autoFocus
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "auth-mobile-error" : undefined}
        className="tabular mt-2 min-h-14 w-full rounded-xl border border-line-strong bg-canvas px-4 text-center text-lead font-bold tracking-widest placeholder:font-normal placeholder:text-faint focus:border-accent focus:outline-none focus-visible:ring-3 focus-visible:ring-accent-soft aria-[invalid=true]:border-danger"
        {...register("mobile")}
      />
      <FieldError id="auth-mobile-error" message={error} />

      <Button type="submit" disabled={sendOtp.isPending} className="mt-6 w-full">
        {sendOtp.isPending ? "در حال ارسال…" : "ارسال کد ورود"}
      </Button>
    </form>
  );
}
