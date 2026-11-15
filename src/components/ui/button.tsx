import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

type Variant = "primary" | "soft" | "outline" | "ghost";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-on-accent hover:bg-accent-hover",
  soft: "bg-accent-soft text-accent hover:bg-accent hover:text-on-accent",
  outline: "border border-line-strong bg-canvas text-ink hover:border-ink",
  ghost: "text-ink-soft hover:bg-surface hover:text-ink",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 rounded-xl px-5 text-small",
  lg: "min-h-13 rounded-xl px-7 text-body",
};

const base =
  "inline-flex items-center justify-center gap-2 font-bold whitespace-nowrap transition-[background-color,color,border-color,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

export function buttonClassName(
  variant: Variant = "primary",
  size: Size = "lg",
  className?: string,
) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant; size?: Size };

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClassName(variant, size, className)} {...props} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant; size?: Size };

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClassName(variant, size, className)} {...props} />;
}
