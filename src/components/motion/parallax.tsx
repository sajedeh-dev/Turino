"use client";

import { type ReactNode, useEffect, useRef } from "react";

import { cn } from "@/lib/cn";

import { useReducedMotion } from "./use-reduced-motion";

interface ParallaxProps {
  children: ReactNode;
  /** Share of the scroll distance the content moves against; 0.1 is subtle. */
  strength?: number;
  /** Cap in px, so the content never slides past its frame. */
  max?: number;
  className?: string;
}

/**
 * Moves its content slightly against the scroll while it is on screen.
 * The frame (the parent) should clip it and the content should be a little larger than the frame.
 * Writes only `transform` on its own element, once per animation frame.
 */
export function Parallax({ children, strength = 0.1, max = 24, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    const frame = element?.parentElement;
    if (!element || !frame || reduceMotion) return;

    let pending = 0;
    const update = () => {
      pending = 0;
      const rect = frame.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      // 0 when the frame is centred in the viewport; signed distance otherwise.
      const fromCentre = rect.top + rect.height / 2 - window.innerHeight / 2;
      const y = Math.max(-max, Math.min(max, -fromCentre * strength));
      element.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
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
      element.style.transform = "";
    };
  }, [max, reduceMotion, strength]);

  return (
    <div ref={ref} className={cn("h-full will-change-transform", className)}>
      {children}
    </div>
  );
}
