import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge must know the custom type steps from globals.css (@theme --text-*);
 * otherwise it reads `text-small` as a colour and drops the real colour class beside it.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["small", "body", "lead", "title", "head", "display"],
    },
  },
});

/** Joins class names and resolves conflicting Tailwind utilities (last one wins). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
