import { Reveal } from "@/components/motion/reveal";
import { buttonClassName } from "@/components/ui/button";
import { PhoneIcon } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";

export function PhoneBooking() {
  const { contact } = siteConfig;

  return (
    <section
      id="contact"
      aria-labelledby="phone-title"
      className="container-page scroll-mt-8 pt-24"
    >
      <Reveal className="flex flex-wrap items-center justify-between gap-6 rounded-4xl bg-surface p-7 md:px-12 md:py-10">
        <div>
          <h2 id="phone-title" className="text-title font-extrabold md:text-[1.75rem]">
            خرید تلفنی از تورینو
          </h2>
          <p className="mt-1 text-body text-muted">
            {contact.hours[0].days}، ساعت {contact.hours[0].time} پاسخ‌گوی شما هستیم.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <span
            dir="ltr"
            className="tabular text-[1.625rem] font-extrabold tracking-wide max-sm:hidden"
          >
            {contact.phone}
          </span>
          <a href={contact.phoneHref} className={buttonClassName("primary", "lg", "max-sm:w-full")}>
            <PhoneIcon width={18} height={18} className="phone-ring" />
            تماس بگیرید
          </a>
        </div>
      </Reveal>
    </section>
  );
}
