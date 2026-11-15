import { z } from "zod";

import { toEnglishDigits } from "@/lib/digits";

export const OTP_LENGTH = 6;

export const mobileSchema = z.object({
  mobile: z
    .string()
    .trim()
    .transform(toEnglishDigits)
    .pipe(z.string().regex(/^09\d{9}$/, "شماره موبایل را با ۰۹ و یازده رقم وارد کنید.")),
});

export const otpSchema = z.object({
  code: z
    .string()
    .trim()
    .transform(toEnglishDigits)
    .pipe(z.string().regex(new RegExp(`^\\d{${OTP_LENGTH}}$`), "کد ۶ رقمی پیامک را وارد کنید.")),
});

export type MobileFormInput = z.input<typeof mobileSchema>;
export type MobileFormValues = z.output<typeof mobileSchema>;
export type OtpFormInput = z.input<typeof otpSchema>;
export type OtpFormValues = z.output<typeof otpSchema>;
