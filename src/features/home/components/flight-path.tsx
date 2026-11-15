"use client";

import { useEffect, useRef, useState } from "react";

/**
 * "Fly to the next departure": on load, the brand's paper plane takes off beside the hero text,
 * flies a dotted route that draws itself behind it, and lands on the next-departure card,
 * which pops in. The route then stays, faintly drifting, like a flight path on a map.
 *
 * The route is built from where the two anchor elements really are ([data-flight-start] and
 * [data-flight-target] inside the hero section), so it fits every viewport and resize. It is
 * drawn in its own overlay, which sits over the photo column and may extend past it.
 * Only the Web Animations API touches the anchors: no React-managed attribute changes, so no
 * hydration mismatch. Reduced motion shows the route without the flight; no JS shows neither.
 */

/** Take off once the hero entrance (headline, badges, photo) has settled. */
const TAKE_OFF_DELAY = 1300;
const FLIGHT_DURATION = 1900;
const FLIGHT_EASING = "cubic-bezier(0.45, 0, 0.2, 1)";

interface Route {
  d: string;
  width: number;
  height: number;
}

/** An element's position inside an ancestor, from layout offsets (unaffected by transforms). */
function offsetWithin(element: HTMLElement, ancestor: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = element;
  while (node && node !== ancestor) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

/** A gentle arc from the text to the card, lifted above both like a flight over a map. */
function buildRoute(section: HTMLElement, overlay: HTMLElement): Route | null {
  const start = section.querySelector<HTMLElement>("[data-flight-start]");
  const target = section.querySelector<HTMLElement>("[data-flight-target]");
  // The card is hidden on small screens, and the two-column layout starts at lg.
  if (!start || !target || target.offsetParent === null) return null;
  if (!window.matchMedia("(min-width: 1024px)").matches) return null;

  // Layout offsets, not getBoundingClientRect: they ignore transforms, so entrance animations
  // still sliding things into place cannot bend the route.
  const base = offsetWithin(overlay, section);
  const startAt = offsetWithin(start, section);
  const targetAt = offsetWithin(target, section);
  const from = { x: startAt.x - base.x, y: startAt.y - base.y };
  const to = { x: targetAt.x - base.x, y: targetAt.y - base.y };

  // In RTL the text column is on the right and the photo on the left.
  const sx = from.x - 12;
  const sy = from.y + start.offsetHeight / 2;
  const ex = to.x + target.offsetWidth / 2;
  const ey = to.y + target.offsetHeight / 2;
  // A wide, shallow arc: rises out of the text column, crosses the photo, settles on the card.
  const span = Math.abs(sx - ex);
  const lift = Math.min(260, Math.max(150, span * 0.6));
  const d = `M ${sx} ${sy} C ${sx - span * 0.25} ${sy - lift}, ${ex + span * 0.55} ${ey - lift * 1.1}, ${ex} ${ey}`;
  return { d, width: overlay.offsetWidth, height: overlay.offsetHeight };
}

export function FlightPath() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const routeRef = useRef<SVGPathElement>(null);
  const revealRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<HTMLSpanElement>(null);
  const hasFlown = useRef(false);
  const running = useRef<{ animations: Animation[]; landing?: number }>({ animations: [] });
  const [route, setRoute] = useState<Route | null>(null);
  const [hasLanded, setHasLanded] = useState(false);

  // Measure now and whenever the section changes size.
  useEffect(() => {
    const overlay = overlayRef.current;
    const section = overlay?.closest("section");
    if (!overlay || !section) return;

    // Only a real change re-renders (ResizeObserver and font loading both fire early on).
    const measure = () => {
      const next = buildRoute(section, overlay);
      setRoute((current) => (current?.d === next?.d ? current : next));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(section);
    // Fonts and the photo can shift the layout after first paint.
    void document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, []);

  // Stop everything only when the hero unmounts: a re-measured route must not cancel a flight.
  useEffect(
    () => () => {
      running.current.animations.forEach((animation) => animation.cancel());
      window.clearTimeout(running.current.landing);
    },
    [],
  );

  // Fly once, the first time a route exists.
  useEffect(() => {
    const section = overlayRef.current?.closest("section");
    const plane = planeRef.current;
    const glyph = plane?.firstElementChild;
    const reveal = revealRef.current;
    if (!route || hasFlown.current || !section || !plane || !glyph || !reveal) return;
    hasFlown.current = true;

    const card = section.querySelector<HTMLElement>("[data-flight-end]");
    const pin = section.querySelector<HTMLElement>("[data-flight-target]");
    const landsAt = TAKE_OFF_DELAY + FLIGHT_DURATION;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // No flight: just show the finished route (the CSS never hid the card in this mode).
      queueMicrotask(() => setHasLanded(true));
      return;
    }

    const timing = { delay: TAKE_OFF_DELAY, duration: FLIGHT_DURATION, easing: FLIGHT_EASING };
    const animations = [
      // The route draws itself behind the plane: a solid mask stroke (pathLength 1) slides in.
      reveal.animate([{ strokeDashoffset: "1" }, { strokeDashoffset: "0" }], {
        ...timing,
        fill: "both",
      }),
      // Position along the route lives on the outer element and size on the inner glyph:
      // CSS applies `scale` before `offset-path`, so scaling the moving element itself would
      // also scale its distance along the route and pull it off the line.
      plane.animate(
        [
          { offsetDistance: "0%", opacity: 0 },
          { offsetDistance: "6%", opacity: 1, offset: 0.06 },
          { offsetDistance: "100%", opacity: 1 },
        ],
        { ...timing, fill: "both" },
      ),
      glyph.animate([{ scale: "0.6" }, { scale: "1", offset: 0.06 }, { scale: "0.9" }], {
        ...timing,
        fill: "both",
      }),
      // Touch-down: the plane shrinks into the card's pin.
      plane.animate([{ opacity: 1 }, { opacity: 0 }], {
        delay: landsAt - 60,
        duration: 260,
        easing: "ease-in",
        fill: "forwards",
      }),
      glyph.animate([{ scale: "0.9" }, { scale: "0.3" }], {
        delay: landsAt - 60,
        duration: 260,
        easing: "ease-in",
        fill: "forwards",
      }),
      // The card waits hidden, then springs in as the plane lands.
      // The card is hidden by CSS from first paint (no flash); it springs in as the plane lands.
      // Opacity holds afterwards (fill forwards); the transform does not, so hover still works.
      ...(card
        ? [
            card.animate([{ opacity: 0 }, { opacity: 1 }], {
              delay: landsAt - 120,
              duration: 320,
              easing: "ease-out",
              fill: "forwards",
            }),
            card.animate(
              [
                { transform: "translateY(10px) scale(0.92)" },
                { transform: "translateY(-3px) scale(1.02)", offset: 0.7 },
                { transform: "none" },
              ],
              { delay: landsAt - 120, duration: 520, easing: "ease-out", fill: "backwards" },
            ),
          ]
        : []),
      // A ripple on the pin: "you are here".
      ...(pin
        ? [
            pin.animate(
              [
                { boxShadow: "0 0 0 0 color-mix(in srgb, var(--color-accent) 45%, transparent)" },
                { boxShadow: "0 0 0 14px color-mix(in srgb, var(--color-accent) 0%, transparent)" },
              ],
              { delay: landsAt + 120, duration: 700, easing: "ease-out" },
            ),
          ]
        : []),
    ];

    running.current = {
      animations,
      landing: window.setTimeout(() => setHasLanded(true), landsAt + 200),
    };
  }, [route]);

  return (
    <div
      ref={overlayRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20 overflow-visible max-lg:hidden"
    >
      {route && (
        <>
          <svg
            width={route.width}
            height={route.height}
            viewBox={`0 0 ${route.width} ${route.height}`}
            className="absolute inset-0 overflow-visible"
          >
            <defs>
              <mask id="flight-route-reveal" maskUnits="userSpaceOnUse">
                <path
                  ref={revealRef}
                  d={route.d}
                  fill="none"
                  stroke="#fff"
                  strokeWidth="12"
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray="1 1"
                  strokeDashoffset={hasLanded ? 0 : 1}
                />
              </mask>
            </defs>
            <g
              mask="url(#flight-route-reveal)"
              className={hasLanded ? "opacity-60 transition-opacity duration-1000" : ""}
            >
              {/* A soft halo keeps the dots readable over the photo. */}
              <path
                d={route.d}
                fill="none"
                stroke="var(--color-canvas)"
                strokeOpacity="0.9"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="0.1 12"
              />
              <path
                ref={routeRef}
                d={route.d}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="0.1 12"
                className={hasLanded ? "flight-route-drift" : ""}
              />
            </g>
          </svg>

          <span
            ref={planeRef}
            className="absolute top-0 left-0 block size-10 text-accent opacity-0 motion-reduce:hidden"
            style={{
              offsetPath: `path("${route.d}")`,
              // The glyph points up-right (-45°); turn it to face along the route.
              offsetRotate: "auto 45deg",
              offsetAnchor: "center",
            }}
          >
            <svg viewBox="0 0 24 24" className="size-10 drop-shadow-md">
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
          </span>
        </>
      )}
    </div>
  );
}
