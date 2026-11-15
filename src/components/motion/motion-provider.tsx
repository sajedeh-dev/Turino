"use client";

import { useEffect } from "react";

/**
 * Marks <html> once script runs, which switches on the hidden starting state of every <Reveal>.
 * Without JavaScript the class never appears and all content simply stays visible.
 * (<html> has suppressHydrationWarning, so changing its class is safe.)
 */
export function MotionProvider() {
  useEffect(() => {
    document.documentElement.classList.add("motion-ready");
  }, []);

  return null;
}
