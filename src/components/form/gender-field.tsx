import type { UseFormRegisterReturn } from "react-hook-form";

import { cn } from "@/lib/cn";

export type Gender = "male" | "female";

export const genderLabels: Record<Gender, string> = { male: "مرد", female: "زن" };

/** Two filled radio tiles; the native radios keep keyboard and screen-reader behaviour. */
export function GenderField({
  registration,
  error,
  legend = "جنسیت",
}: {
  registration: UseFormRegisterReturn;
  error?: string;
  legend?: string;
}) {
  return (
    <fieldset className="grid gap-2">
      <legend className="mb-2 text-small font-medium text-ink-soft">{legend}</legend>
      <div className="grid grid-cols-2 gap-2">
        {(Object.keys(genderLabels) as Gender[]).map((gender) => (
          <label
            key={gender}
            className={cn(
              "flex min-h-12 cursor-pointer items-center justify-center rounded-xl border border-line-strong text-body font-medium transition-colors hover:border-faint",
              "has-[:checked]:border-accent has-[:checked]:bg-accent-soft has-[:checked]:font-bold has-[:checked]:text-accent has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent",
            )}
          >
            <input type="radio" value={gender} className="sr-only" {...registration} />
            {genderLabels[gender]}
          </label>
        ))}
      </div>
      {error && (
        <p role="alert" className="text-small font-medium text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}
