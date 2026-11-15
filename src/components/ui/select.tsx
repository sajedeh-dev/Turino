"use client";

import * as RadixSelect from "@radix-ui/react-select";
import { useState } from "react";

import { cn } from "@/lib/cn";

import { CheckIcon } from "./icons";

export interface SelectOption {
  value: string;
  label: string;
  /** What type-to-jump matches, when it differs from the label (e.g. "1375" for «۱۳۷۵»). */
  textValue?: string;
}

interface SelectProps {
  options: SelectOption[];
  /** Controlled value. Use "" for an "all / none" option. */
  value?: string;
  /** Uncontrolled starting value. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Submitted with the surrounding <form> under this name (also for value ""). */
  name?: string;
  id?: string;
  placeholder?: string;
  "aria-label"?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  /** "field": bordered like the other inputs. "bare": text only, for the search bar. */
  variant?: "field" | "bare";
  onBlur?: () => void;
  className?: string;
}

/**
 * Radix Select styled for the site: keyboard navigation, type-to-jump, screen-reader
 * semantics and RTL come from Radix; the look comes from the design tokens (so dark mode too).
 *
 * Radix rejects "" as an item value, so "" is mapped to an internal token here, and the real
 * value is submitted through a hidden input, so the select still works inside a plain <form>.
 */
const EMPTY = "__empty__";
const toRadix = (value: string) => (value === "" ? EMPTY : value);
const fromRadix = (value: string) => (value === EMPTY ? "" : value);

export function Select({
  options,
  value,
  defaultValue = "",
  onValueChange,
  name,
  id,
  placeholder,
  variant = "field",
  onBlur,
  className,
  ...aria
}: SelectProps) {
  const [inner, setInner] = useState(defaultValue);
  const current = value ?? inner;

  function change(next: string) {
    const real = fromRadix(next);
    if (value === undefined) setInner(real);
    onValueChange?.(real);
  }

  return (
    <RadixSelect.Root
      dir="rtl"
      value={toRadix(current)}
      onValueChange={change}
      onOpenChange={(open) => !open && onBlur?.()}
    >
      <RadixSelect.Trigger
        id={id}
        aria-label={aria["aria-label"]}
        aria-invalid={aria["aria-invalid"]}
        aria-describedby={aria["aria-describedby"]}
        className={cn(
          "group flex w-full cursor-pointer items-center justify-between gap-2 text-start outline-none",
          "data-[placeholder]:text-faint",
          variant === "field" &&
            "min-h-12 rounded-xl border border-line-strong bg-canvas px-4 text-body font-medium text-ink transition-colors hover:border-faint focus-visible:border-accent focus-visible:ring-3 focus-visible:ring-accent-soft aria-[invalid=true]:border-danger data-[state=open]:border-accent",
          variant === "bare" &&
            "rounded-md py-0.5 text-body font-bold text-ink focus-visible:ring-2 focus-visible:ring-accent",
          className,
        )}
      >
        <span className="min-w-0 truncate">
          <RadixSelect.Value placeholder={placeholder} />
        </span>
        <RadixSelect.Icon asChild>
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="size-4 shrink-0 text-faint transition-transform duration-200 group-data-[state=open]:rotate-180"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={8}
          collisionPadding={12}
          className={cn(
            "select-content z-50 max-h-[min(26rem,var(--radix-select-content-available-height))] min-w-[max(var(--radix-select-trigger-width),10rem)] overflow-hidden rounded-2xl border border-line bg-canvas p-1.5 text-ink shadow-float",
          )}
        >
          <RadixSelect.ScrollUpButton className="flex h-6 items-center justify-center text-faint">
            <Chevron up />
          </RadixSelect.ScrollUpButton>
          {/* min-h-0: as a flex child the viewport would otherwise never shrink below its
              content, so long lists (31 days, 100+ years) were clipped instead of scrolling. */}
          <RadixSelect.Viewport className="min-h-0 overscroll-contain">
            {options.map((option) => (
              <RadixSelect.Item
                key={option.value}
                value={toRadix(option.value)}
                textValue={option.textValue}
                className={cn(
                  "relative flex min-h-10 cursor-pointer items-center rounded-xl ps-9 pe-3 text-[0.9375rem] outline-none select-none",
                  "data-[highlighted]:bg-surface data-[state=checked]:font-bold data-[state=checked]:text-accent",
                  "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
                )}
              >
                <RadixSelect.ItemIndicator className="absolute start-3 flex items-center">
                  <CheckIcon width={16} height={16} />
                </RadixSelect.ItemIndicator>
                <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
          <RadixSelect.ScrollDownButton className="flex h-6 items-center justify-center text-faint">
            <Chevron />
          </RadixSelect.ScrollDownButton>
        </RadixSelect.Content>
      </RadixSelect.Portal>

      {/* The real value for <form> submission ("" included, which Radix cannot hold). */}
      {name && <input type="hidden" name={name} value={current} />}
    </RadixSelect.Root>
  );
}

function Chevron({ up = false }: { up?: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={cn("size-4", up && "rotate-180")}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
