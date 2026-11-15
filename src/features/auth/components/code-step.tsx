"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { toEnglishDigits } from "@/lib/digits";
import { formatCountdown, formatNumber } from "@/lib/format";

import { useCountdown } from "../hooks/use-countdown";
import { useCheckOtp, useSendOtp } from "../hooks/use-auth-mutations";
import { OTP_LENGTH, type OtpFormInput, type OtpFormValues, otpSchema } from "../schemas";
import { FieldError } from "@/components/form/field-error";

const RESEND_AFTER_SECONDS = 120;

interface CodeStepProps {
  mobile: string;
  /** Code echoed by the development backend, shown only in development. */
  devCode?: string;
  onEditMobile: () => void;
  onCodeResent: (devCode?: string) => void;
  onSignedIn: () => void;
}

export function CodeStep({
  mobile,
  devCode,
  onEditMobile,
  onCodeResent,
  onSignedIn,
}: CodeStepProps) {
  const checkOtp = useCheckOtp();
  const resendOtp = useSendOtp();
  const countdown = useCountdown(RESEND_AFTER_SECONDS);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormInput, unknown, OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: "" },
  });

  const onSubmit = handleSubmit(({ code }) =>
    checkOtp.mutate({ mobile, code }, { onSuccess: onSignedIn }),
  );

  const codeField = register("code", {
    // Submit as soon as the last digit is typed or a pasted code is complete.
    onChange: (event) => {
      if (toEnglishDigits(event.target.value).length === OTP_LENGTH && !checkOtp.isPending) {
        void onSubmit();
      }
    },
  });

  function resend() {
    resendOtp.mutate(mobile, {
      onSuccess: (data) => {
        countdown.restart();
        onCodeResent(data.code);
      },
    });
  }

  const error = errors.code?.message ?? checkOtp.error?.message ?? resendOtp.error?.message;

  return (
    <form onSubmit={onSubmit} noValidate>
      <h2 id="auth-title" className="text-title font-extrabold">
        کد ورود
      </h2>
      <p className="mt-2 text-body text-muted">
        کد {formatNumber(OTP_LENGTH)} رقمی به{" "}
        <bdi dir="ltr" className="tabular font-bold text-ink">
          {mobile}
        </bdi>{" "}
        پیامک شد.{" "}
        <button
          type="button"
          onClick={onEditMobile}
          className="font-bold text-accent hover:text-accent-hover"
        >
          ویرایش شماره
        </button>
      </p>

      <label htmlFor="auth-code" className="mt-7 block text-small font-medium text-ink-soft">
        کد تایید
      </label>
      <input
        id="auth-code"
        type="text"
        dir="ltr"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={OTP_LENGTH}
        autoFocus
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "auth-code-error" : undefined}
        className="tabular mt-2 min-h-14 w-full rounded-xl border border-line-strong bg-canvas px-4 text-center indent-[0.6em] text-title font-bold tracking-[0.6em] focus:border-accent focus:outline-none focus-visible:ring-3 focus-visible:ring-accent-soft aria-[invalid=true]:border-danger"
        {...codeField}
      />
      <FieldError id="auth-code-error" message={error} />

      {process.env.NODE_ENV === "development" && devCode && (
        <p className="mt-2 text-small text-muted">
          کد آزمایشی سرور: <bdi className="tabular font-bold">{devCode}</bdi>
        </p>
      )}

      <Button type="submit" disabled={checkOtp.isPending} className="mt-6 w-full">
        {checkOtp.isPending ? "در حال بررسی…" : "ورود"}
      </Button>

      <p aria-live="polite" className="mt-5 text-center text-small">
        {countdown.isDone ? (
          <button
            type="button"
            onClick={resend}
            disabled={resendOtp.isPending}
            className="min-h-11 font-bold text-accent hover:text-accent-hover"
          >
            {resendOtp.isPending ? "در حال ارسال…" : "ارسال دوباره‌ی کد"}
          </button>
        ) : (
          <span className="text-muted">
            ارسال دوباره تا{" "}
            <bdi dir="ltr" className="tabular font-bold">
              {formatCountdown(countdown.remaining)}
            </bdi>
          </span>
        )}
      </p>
    </form>
  );
}
