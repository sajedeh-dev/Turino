"use client";

import { useEffect, useState } from "react";

/** Counts down from `seconds` once per second; `restart()` starts it again. */
export function useCountdown(seconds: number) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) return;
    const timer = window.setTimeout(() => setRemaining((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [remaining]);

  return { remaining, isDone: remaining <= 0, restart: () => setRemaining(seconds) };
}
