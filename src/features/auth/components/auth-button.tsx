"use client";

import { Button, ButtonLink } from "@/components/ui/button";
import { UserIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

import { useAuthDialog } from "../stores/auth-dialog-store";
import { useAuthStore } from "../stores/auth-store";

/** "Sign in" for visitors; the account link, showing the mobile number, for signed-in users. */
export function AuthButton({ className }: { className?: string }) {
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const openDialog = useAuthDialog((state) => state.open);

  if (hasHydrated && user) {
    return (
      <ButtonLink
        href="/profile"
        variant="ghost"
        size="md"
        className={cn("bg-surface max-sm:px-3", className)}
      >
        <span className="sr-only">حساب کاربری </span>
        <bdi dir="ltr" className="tabular max-sm:hidden">
          {user.mobile}
        </bdi>
        <UserIcon />
      </ButtonLink>
    );
  }

  return (
    <Button
      variant="outline"
      size="md"
      onClick={() => openDialog()}
      aria-label="ورود یا ثبت‌نام"
      // Hidden until the stored session is read, so a signed-in user never sees "sign in" flash.
      className={cn("max-sm:px-3", !hasHydrated && "invisible", className)}
    >
      <UserIcon />
      <span className="max-sm:hidden">ورود | ثبت‌نام</span>
    </Button>
  );
}
