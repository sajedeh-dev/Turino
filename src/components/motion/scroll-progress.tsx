"use client";

import { useEffect, useRef } from "react";

/**
 * A hairline at the top of the window that fills as the page is read, with the brand's paper
 * plane at its tip. RTL: it fills from the right edge, the plane flying leftwards.
 * Purely decorative (aria-hidden). Updates one CSS variable per animation frame.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let pending = 0;
    const update = () => {
      pending = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      element.style.setProperty("--progress", progress.toFixed(4));
    };
    const schedule = () => {
      if (!pending) pending = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(pending);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="scroll-progress pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px]"
    >
      <div className="scroll-progress-bar h-full origin-right bg-accent" />
      <svg
        viewBox="0 0 24 24"
        className="scroll-progress-plane absolute top-1/2 size-5 text-accent"
      >
        <path
          d="M22 2 15 22 11 13 2 9Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M22 2 11 13"
          fill="none"
          stroke="var(--color-canvas)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
