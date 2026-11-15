import { Reveal } from "@/components/motion/reveal";
import { ClockIcon, HeadsetIcon, ReceiptIcon } from "@/components/ui/icons";

const reasons = [
  {
    icon: ReceiptIcon,
    title: "قیمت شفاف",
    text: "هتل، وعده‌ها، وسیله و بیمه پیش از پرداخت روی صفحه‌ی هر تور نوشته شده است.",
  },
  {
    icon: ClockIcon,
    title: "رزرو در چند دقیقه",
    text: "ورود با کد پیامکی، مشخصات مسافر و پرداخت آنلاین؛ بدون مراجعه‌ی حضوری.",
  },
  {
    icon: HeadsetIcon,
    title: "همراه تا پایان سفر",
    text: "راهنمای تور در مقصد و پشتیبانی تلفنی هر روز از ۹ تا ۲۱.",
  },
];

export function WhyTurino() {
  return (
    <section id="why" aria-labelledby="why-title" className="container-page scroll-mt-8 pt-24">
      <h2 id="why-title" className="heading-draw text-head font-extrabold tracking-tight">
        چرا تورینو؟
      </h2>
      <ul className="mt-8 grid gap-6 md:grid-cols-3">
        {reasons.map(({ icon: Icon, title, text }, index) => (
          <Reveal as="li" key={title} index={index} className="rounded-3xl border border-line p-7">
            <span className="icon-draw flex size-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
              <Icon width={24} height={24} />
            </span>
            <h3 className="mt-5 text-lead font-bold">{title}</h3>
            <p className="mt-2 text-[0.9375rem] text-muted">{text}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
