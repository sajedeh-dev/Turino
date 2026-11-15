"use client";

import { useSyncExternalStore } from "react";

import { MonitorIcon, MoonIcon, SunIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

import {
  readThemePreference,
  setThemePreference,
  subscribeToTheme,
  type ThemePreference,
} from "./theme";

const order: ThemePreference[] = ["light", "dark", "system"];

const labels: Record<ThemePreference, string> = {
  light: "تم روشن",
  dark: "تم تیره",
  system: "هماهنگ با سیستم",
};

const icons = { light: SunIcon, dark: MoonIcon, system: MonitorIcon };

/** One button that steps through light → dark → system. */
export function ThemeToggle({ className }: { className?: string }) {
  // null on the server and during hydration, so the first client render matches the HTML.
  const preference = useSyncExternalStore<ThemePreference | null>(
    subscribeToTheme,
    readThemePreference,
    () => null,
  );

  const current = preference ?? "system";
  const next = order[(order.indexOf(current) + 1) % order.length];
  const Icon = icons[current];

  return (
    <button
      type="button"
      onClick={() => setThemePreference(next)}
      aria-label={`${labels[current]}؛ تغییر به ${labels[next]}`}
      title={labels[current]}
      className={cn(
        "flex size-11 items-center justify-center rounded-xl text-ink-soft transition-colors hover:bg-surface hover:text-ink",
        preference === null && "invisible",
        className,
      )}
    >
      <Icon />
    </button>
  );
}
