import { z } from "zod";

import { toEnglishDigits } from "@/lib/digits";
import { isValidCardNumber, isValidNationalCode, isValidShaba } from "@/lib/validators";

/** Digits typed on a Persian keyboard, spaces and dashes removed. */
const digitsOnly = z
  .string()
  .trim()
  .transform((value) => toEnglishDigits(value).replace(/[\s-]/g, ""));

export const nationalCodeField = digitsOnly.pipe(
  z.string().refine(isValidNationalCode, "کد ملی معتبر نیست؛ ۱۰ رقم را دوباره بررسی کنید."),
);

export const fullNamePart = (label: string) =>
  z.string().trim().min(2, `${label} را دست‌کم با ۲ حرف بنویسید.`).max(40, `${label} طولانی است.`);

export const genderField = z.enum(["male", "female"], { error: "جنسیت را انتخاب کنید." });

export const birthDateField = z.iso.date({ error: "تاریخ تولد را کامل انتخاب کنید." });

export const accountSchema = z.object({
  email: z.email("ایمیل معتبر نیست.").trim().or(z.literal("")),
});

export const personalSchema = z.object({
  firstName: fullNamePart("نام"),
  lastName: fullNamePart("نام خانوادگی"),
  nationalCode: nationalCodeField,
  gender: genderField,
  birthDate: birthDateField,
});

export const bankSchema = z.object({
  shaba: z
    .string()
    .trim()
    .transform((value) => {
      const digits = toEnglishDigits(value).replace(/[\s-]/g, "").toUpperCase();
      return digits.startsWith("IR") ? digits : `IR${digits}`;
    })
    .pipe(z.string().refine(isValidShaba, "شماره شبا معتبر نیست؛ ۲۴ رقم بعد از IR.")),
  cardNumber: digitsOnly.pipe(
    z.string().refine(isValidCardNumber, "شماره کارت معتبر نیست؛ ۱۶ رقم روی کارت."),
  ),
  accountIdentifier: digitsOnly.pipe(
    z.string().regex(/^\d{6,20}$/, "شماره حساب را با ۶ تا ۲۰ رقم بنویسید."),
  ),
});

export type AccountInput = z.input<typeof accountSchema>;
export type AccountValues = z.output<typeof accountSchema>;
export type PersonalInput = z.input<typeof personalSchema>;
export type PersonalValues = z.output<typeof personalSchema>;
export type BankInput = z.input<typeof bankSchema>;
export type BankValues = z.output<typeof bankSchema>;
