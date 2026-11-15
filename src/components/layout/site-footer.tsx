import Link from "next/link";

import { Wordmark } from "@/components/ui/wordmark";
import { photoCredits } from "@/config/photo-credits";
import { siteConfig } from "@/config/site";

const columns = [
  {
    title: "تورینو",
    links: [
      { label: "همه‌ی تورها", href: "/tours" },
      { label: "چرا تورینو", href: "/#why" },
      { label: "تماس با ما", href: "/#contact" },
    ],
  },
  {
    title: "حساب کاربری",
    links: [
      { label: "اطلاعات حساب", href: "/profile" },
      { label: "تورهای من", href: "/profile/tours" },
      { label: "تراکنش‌ها", href: "/profile/transactions" },
    ],
  },
];

export function SiteFooter() {
  const { contact } = siteConfig;

  return (
    <footer className="mt-28 border-t border-line">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Wordmark className="text-2xl" />
          <p className="mt-3 text-small text-muted">برگزارکننده‌ی تورهای گروهی داخلی و خارجی.</p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h2 className="text-[0.9375rem] font-bold">{column.title}</h2>
            <ul className="mt-4 grid gap-2.5 text-small">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted transition-colors hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h2 className="text-[0.9375rem] font-bold">تماس</h2>
          <ul className="mt-4 grid gap-2.5 text-small text-muted">
            <li>
              <a href={contact.phoneHref} dir="ltr" className="hover:text-accent">
                {contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="hover:text-accent">
                {contact.email}
              </a>
            </li>
            <li>{contact.address[0]}</li>
          </ul>
        </div>
      </div>

      <div className="container-page flex flex-wrap items-start justify-between gap-4 border-t border-line py-6 text-small text-muted">
        <p>© ۱۴۰۵ {siteConfig.name}. همه‌ی حقوق محفوظ است.</p>
        <details className="max-w-xl">
          <summary className="cursor-pointer hover:text-accent">منبع عکس‌ها</summary>
          <ul dir="ltr" className="mt-2 grid gap-1 text-start text-xs">
            {photoCredits.map((credit) => (
              <li key={credit.file}>
                <a href={credit.page} rel="noreferrer" className="hover:text-accent">
                  {credit.title}
                </a>{" "}
                by {credit.creator},{" "}
                <a href={credit.licenseUrl} rel="noreferrer" className="hover:text-accent">
                  {credit.license}
                </a>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </footer>
  );
}
