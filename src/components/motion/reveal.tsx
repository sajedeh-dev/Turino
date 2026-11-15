"use client";

import { type CSSProperties, type ReactNode, type Ref, useEffect, useRef, useState } from "react";

type RevealTag = "div" | "li" | "section" | "p" | "h1";

interface RevealProps {
  as?: RevealTag;
  /** Position in its group; each step adds 70ms of delay. */
  index?: number;
  /** "pop" also starts slightly smaller, for cards. */
  variant?: "rise" | "pop";
  className?: string;
  children: ReactNode;
}

/**
 * Rises and fades in once when it enters the viewport.
 * The state lives in React (data-reveal="" → "shown"), so nothing outside React touches the
 * element and server and client HTML always match. Content stays visible without JavaScript:
 * hiding only applies under html.motion-ready (see globals.css and MotionProvider).
 */
export function Reveal({
  as: Tag = "div",
  index = 0,
  variant = "rise",
  className,
  children,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || !("IntersectionObserver" in window)) {
      // No observer support: show at once (from a callback, not the effect body).
      queueMicrotask(() => setIsShown(true));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setIsShown(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      // The ref type differs per tag; all of them are HTMLElements.
      ref={ref as Ref<never>}
      data-reveal={isShown ? "shown" : ""}
      data-reveal-variant={variant}
      className={className}
      style={{ "--reveal-index": index } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
