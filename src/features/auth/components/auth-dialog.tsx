"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { CloseIcon } from "@/components/ui/icons";

import { useAuthDialog } from "../stores/auth-dialog-store";
import { CodeStep } from "./code-step";
import { MobileStep } from "./mobile-step";

type Step = { name: "mobile" } | { name: "code"; mobile: string; devCode?: string };

/**
 * The OTP sign-in dialog. Uses the native <dialog> element, which brings
 * focus trapping, Escape to close and an inert page behind it.
 */
export function AuthDialog() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { isOpen, redirectTo, close } = useAuthDialog();
  const [step, setStep] = useState<Step>({ name: "mobile" });
  const [lastMobile, setLastMobile] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  function handleClosed() {
    close();
    setStep({ name: "mobile" });
  }

  function handleSignedIn() {
    const target = redirectTo;
    close();
    setStep({ name: "mobile" });
    if (target) router.push(target);
    else router.refresh();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="auth-title"
      onClose={handleClosed}
      onClick={(event) => {
        // A click on the backdrop lands on the <dialog> itself.
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-[26rem] rounded-3xl bg-canvas p-0 text-ink shadow-float backdrop:bg-black/50"
    >
      <div className="relative px-6 pt-10 pb-8 sm:px-8">
        {isOpen && step.name === "mobile" && (
          <MobileStep
            defaultMobile={lastMobile}
            onCodeSent={(mobile, devCode) => {
              setLastMobile(mobile);
              setStep({ name: "code", mobile, devCode });
            }}
          />
        )}
        {isOpen && step.name === "code" && (
          <CodeStep
            key={step.mobile}
            mobile={step.mobile}
            devCode={step.devCode}
            onEditMobile={() => setStep({ name: "mobile" })}
            onCodeResent={(devCode) => setStep({ ...step, devCode })}
            onSignedIn={handleSignedIn}
          />
        )}
        {/* After the form in the DOM, so opening the dialog focuses the first field, not "close". */}
        <button
          type="button"
          aria-label="بستن"
          onClick={() => dialogRef.current?.close()}
          className="absolute end-4 top-4 flex size-10 items-center justify-center rounded-xl text-muted transition-colors hover:bg-surface hover:text-ink"
        >
          <CloseIcon />
        </button>
      </div>
    </dialog>
  );
}
