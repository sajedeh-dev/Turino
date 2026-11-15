import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

import { FieldError } from "./field-error";

/** Shared look for text inputs and selects. */
export const inputClassName =
  "min-h-12 w-full rounded-xl border border-line-strong bg-canvas px-4 text-body font-medium text-ink transition-colors placeholder:font-normal placeholder:text-faint hover:border-faint focus:border-accent focus:outline-none focus-visible:ring-3 focus-visible:ring-accent-soft aria-[invalid=true]:border-danger";

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  /** A short rule shown under the field, e.g. "۱۰ رقم". Linked with aria-describedby by the caller. */
  hint?: string;
  className?: string;
  children: ReactNode;
}

/** Label, control and error, stacked. The control itself is passed as children. */
export function Field({ id, label, error, hint, className, children }: FieldProps) {
  return (
    <div className={cn("grid content-start gap-2", className)}>
      <label htmlFor={id} className="text-small font-medium text-ink-soft">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      )}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

/** aria props for a control inside <Field>. */
export function fieldAria(id: string, error?: string, hint?: string) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return { id, "aria-invalid": Boolean(error), "aria-describedby": describedBy };
}
