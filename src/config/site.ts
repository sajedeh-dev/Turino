/**
 * Site-wide copy and contact details. Values marked SAMPLE must be confirmed before launch.
 */
export const siteConfig = {
  name: "تورینو",
  title: "تورینو | تورهای گروهی داخلی و خارجی",
  description:
    "تورهای گروهی داخلی و خارجی: مبدأ، تاریخ، قیمت و صندلی خالی هر تور را ببینید و آنلاین رزرو کنید.",
  nav: [
    { label: "صفحه اصلی", href: "/" },
    { label: "تورها", href: "/tours" },
    { label: "چرا تورینو", href: "/#why" },
    { label: "تماس با ما", href: "/#contact" },
  ],
  contact: {
    // SAMPLE
    phone: "021-8574",
    phoneHref: "tel:+98218574",
    email: "hello@turino.ir",
    address: ["تهران، میدان آزادی", "خیابان آزادی، پلاک ۱۸۰، طبقه‌ی دوم"],
    hours: [
      { days: "شنبه تا چهارشنبه", time: "۹ تا ۲۱" },
      { days: "پنجشنبه", time: "۹ تا ۱۸" },
      { days: "جمعه", time: "۱۰ تا ۱۴" },
    ],
    instagram: "https://instagram.com/turino",
  },
} as const;
