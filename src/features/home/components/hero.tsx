import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

import { Parallax } from "@/components/motion/parallax";
import { PhoneIcon, ShieldIcon } from "@/components/ui/icons";

interface HeroProps {
  /** Over the photo: the next-departure card and the plane that flies to it; streams in. */
  highlight?: ReactNode;
  /** The search bar under the hero; streams in with the tours. */
  search?: ReactNode;
}

/** Stagger index for the entrance animations in globals.css (.hero-word, .hero-rise). */
const step = (i: number) => ({ "--i": i }) as CSSProperties;

const headline = [
  ["سفرهای", "گروهی،"],
  ["ساده", "و", "مطمئن"],
];

/**
 * The first screen. It is static (no data), so it renders once and its CSS entrance plays once;
 * only the `highlight` and `search` slots wait for tours.
 */
export function Hero({ highlight, search }: HeroProps) {
  let wordIndex = 0;

  return (
    <section className="relative container-page pt-10 md:pt-16">
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
        <div>
          <h1 className="text-display font-extrabold tracking-tight">
            {headline.map((line, lineIndex) => (
              <span key={lineIndex} className="block">
                {line.map((word, index) => (
                  <span key={word}>
                    <span className="hero-word" style={step(wordIndex++)}>
                      {word}
                    </span>
                    {index < line.length - 1 && " "}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <p className="hero-rise mt-5 max-w-[30rem] text-lead text-ink-soft" style={step(5)}>
            تورهای داخلی و خارجی با تاریخ مشخص، قیمت شفاف و پشتیبانی تا پایان سفر. مقصد را انتخاب
            کنید و در چند دقیقه رزرو کنید.
          </p>
          <ul
            data-flight-start=""
            className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-small text-ink-soft"
          >
            <li className="hero-rise flex items-center gap-2" style={step(7)}>
              <ShieldIcon className="text-accent" />
              بیمه‌ی مسافرتی در همه‌ی تورها
            </li>
            <li className="hero-rise flex items-center gap-2" style={step(8)}>
              <PhoneIcon className="text-accent" />
              پشتیبانی ۹ تا ۲۱
            </li>
          </ul>
        </div>

        <div className="hero-fade relative">
          {/* The frame clips the photo, which is a little larger so Ken Burns and parallax
              never show an edge. */}
          <div className="h-60 overflow-hidden rounded-3xl sm:h-80 lg:h-[27.5rem] lg:rounded-4xl">
            <Parallax strength={0.08} max={22}>
              <Image
                src="/images/destinations/isfahan.jpg"
                alt="سی‌وسه‌پل اصفهان روی زاینده‌رود"
                width={1200}
                height={880}
                preload
                sizes="(min-width: 1024px) 560px, 100vw"
                className="hero-ken-burns h-full w-full object-cover"
              />
            </Parallax>
          </div>
          {highlight}
        </div>
      </div>

      {search && (
        <div
          className="hero-rise relative z-10 mt-8 max-lg:-mt-10 max-lg:px-2 lg:mt-12"
          style={step(9)}
        >
          {search}
        </div>
      )}
    </section>
  );
}
