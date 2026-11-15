import { Suspense } from "react";

import { Wordmark } from "@/components/ui/wordmark";
import { AuthButton } from "@/features/auth/components/auth-button";
import { ThemeToggle } from "@/features/theme/theme-toggle";

import { MainNav } from "./main-nav";

export function SiteHeader() {
  return (
    <header className="relative border-b border-line bg-canvas">
      <div className="container-page flex h-16 items-center justify-between gap-6 md:h-20">
        <div className="flex items-center gap-2 md:gap-12">
          {/* The nav reads the URL for its active link, so it sits in Suspense. */}
          <Suspense>
            <MainNav />
          </Suspense>
          <Wordmark className="order-first max-md:order-none" />
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
