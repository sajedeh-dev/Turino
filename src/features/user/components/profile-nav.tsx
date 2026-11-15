"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { LogoutIcon, PinIcon, ReceiptIcon, UserIcon } from "@/components/ui/icons";
import { signOut } from "@/features/auth/session-actions";
import { cn } from "@/lib/cn";

const links = [
  { href: "/profile", label: "اطلاعات حساب", icon: UserIcon },
  { href: "/profile/tours", label: "تورهای من", icon: PinIcon },
  { href: "/profile/transactions", label: "تراکنش‌ها", icon: ReceiptIcon },
];

const itemClass =
  "flex min-h-12 w-full items-center gap-3 rounded-xl px-4 text-[0.9375rem] font-medium transition-colors";

/** Account navigation: the three profile pages and sign-out. */
export function ProfileNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav aria-label="حساب کاربری" className="lg:rounded-3xl lg:border lg:border-line lg:p-3">
      <ul className="flex gap-2 overflow-x-auto lg:grid">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <li key={href} className="shrink-0">
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  itemClass,
                  isActive
                    ? "bg-accent-soft font-bold text-accent"
                    : "text-ink-soft hover:bg-surface hover:text-ink",
                )}
              >
                <Icon />
                {label}
              </Link>
            </li>
          );
        })}
        <li className="shrink-0 lg:mt-2 lg:border-t lg:border-line lg:pt-2">
          <button
            type="button"
            onClick={async () => {
              await signOut();
              router.push("/");
              router.refresh();
            }}
            className={cn(itemClass, "text-muted hover:bg-surface hover:text-danger")}
          >
            <LogoutIcon />
            خروج از حساب
          </button>
        </li>
      </ul>
    </nav>
  );
}
