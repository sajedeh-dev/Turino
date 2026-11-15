import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main
      id="main"
      className="container-page grid min-h-svh place-content-center gap-4 text-center"
    >
      <p className="tabular text-[5rem] leading-none font-extrabold text-accent">۴۰۴</p>
      <h1 className="text-title font-bold">این صفحه پیدا نشد</h1>
      <p className="text-body text-muted">شاید آدرس اشتباه است یا این تور دیگر برگزار نمی‌شود.</p>
      <ButtonLink href="/" className="mt-2 justify-self-center">
        بازگشت به صفحه اصلی
      </ButtonLink>
    </main>
  );
}
