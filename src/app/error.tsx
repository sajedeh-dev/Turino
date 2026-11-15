"use client";

import { Button, ButtonLink } from "@/components/ui/button";

/** Shown when a page fails to render, most often because the API could not be reached. */
export default function ErrorPage({ retry }: { error: unknown; retry: () => void }) {
  return (
    <main
      id="main"
      className="container-page grid min-h-svh place-content-center gap-4 text-center"
    >
      <h1 className="text-head font-extrabold">ارتباط با سرور برقرار نشد</h1>
      <p className="max-w-[28rem] text-body text-muted">
        اطلاعات تورها از سرور نرسید. چند لحظه بعد دوباره امتحان کنید.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Button onClick={() => retry()}>تلاش دوباره</Button>
        <ButtonLink href="/" variant="outline">
          صفحه اصلی
        </ButtonLink>
      </div>
    </main>
  );
}
