import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "text-[1.625rem] leading-none font-extrabold tracking-tight text-accent",
        className,
      )}
    >
      {siteConfig.name}
    </Link>
  );
}
