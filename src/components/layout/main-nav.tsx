"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

function isActive(pathname: string, href: string) {
  if (href.includes("#")) return false;
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/** Desktop links inline; on small screens a menu button opens the same links in a panel. */
export function MainNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = siteConfig.nav.map((item) => (
    <li key={item.href}>
      <Link
        href={item.href}
        aria-current={isActive(pathname, item.href) ? "page" : undefined}
        onClick={() => setIsOpen(false)}
        className={cn(
          "block py-2 font-medium transition-colors hover:text-accent",
          isActive(pathname, item.href) ? "text-accent" : "text-ink-soft",
        )}
      >
        {item.label}
      </Link>
    </li>
  ));

  return (
    <>
      <nav aria-label="منوی اصلی" className="hidden md:block">
        <ul className="flex gap-8 text-[0.9375rem]">{links}</ul>
      </nav>

      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? "بستن منو" : "باز کردن منو"}
        onClick={() => setIsOpen((open) => !open)}
        className="-ms-2 flex size-11 items-center justify-center rounded-xl md:hidden"
      >
        {isOpen ? <CloseIcon width={24} height={24} /> : <MenuIcon width={24} height={24} />}
      </button>

      {isOpen && (
        <nav
          id="mobile-menu"
          aria-label="منوی اصلی"
          className="absolute inset-x-0 top-full z-40 border-b border-line bg-canvas md:hidden"
        >
          <ul className="container-page grid gap-1 py-4 text-body">{links}</ul>
        </nav>
      )}
    </>
  );
}
