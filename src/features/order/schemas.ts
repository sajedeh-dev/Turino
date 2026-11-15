import { z } from "zod";

import { birthDateField, genderField, nationalCodeField } from "@/features/user/schemas";

export const passengerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(5, "نام و نام خانوادگی را کامل بنویسید.")
    .refine((value) => value.split(/\s+/).length >= 2, "نام و نام خانوادگی را با فاصله بنویسید."),
  nationalCode: nationalCodeField,
  gender: genderField,
  birthDate: birthDateField,
});

export type PassengerInput = z.input<typeof passengerSchema>;
export type PassengerValues = z.output<typeof passengerSchema>;
