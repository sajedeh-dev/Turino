"use client";

import { usePathname, useRouter } from "next/navigation";
import { useId } from "react";

import { FieldError } from "@/components/form/field-error";
import { Button } from "@/components/ui/button";
import { useAuthDialog } from "@/features/auth/stores/auth-dialog-store";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { cn } from "@/lib/cn";

import { useAddToBasket } from "../hooks";

/**
 * Puts the tour in the basket and goes to checkout. A signed-out visitor signs in first and
 * comes back to this tour.
 */
export function BookTourButton({
  tourId,
  unavailableLabel,
  className,
}: {
  tourId: string;
  /** Set when the tour cannot be booked (full, departed); shown on a disabled button. */
  unavailableLabel?: string;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isSignedIn = useAuthStore((state) => state.user !== null);
  const openLogin = useAuthDialog((state) => state.open);
  const addToBasket = useAddToBasket();
  const errorId = useId();

  function book() {
    if (!isSignedIn) {
      openLogin(pathname);
      return;
    }
    addToBasket.mutate(tourId, { onSuccess: () => router.push("/checkout") });
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Button
        onClick={book}
        disabled={Boolean(unavailableLabel) || addToBasket.isPending}
        aria-describedby={addToBasket.error ? errorId : undefined}
        className="h-14 w-full"
      >
        {unavailableLabel ?? (addToBasket.isPending ? "در حال رزرو…" : "رزرو و پرداخت")}
      </Button>
      <FieldError id={errorId} message={addToBasket.error?.message} />
    </div>
  );
}
