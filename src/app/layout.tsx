import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import { Suspense } from "react";

import { MotionProvider } from "@/components/motion/motion-provider";
import { siteConfig } from "@/config/site";
import { AuthDialog } from "@/features/auth/components/auth-dialog";
import { AuthSession } from "@/features/auth/components/auth-session";
import { themeInitScript } from "@/features/theme/theme";
import { AppProviders } from "@/providers/app-providers";

import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: siteConfig.title, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the theme script below may add `dark` to <html> before React loads.
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Applies the saved or system theme before the first paint (no white flash). */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      {/* Browser extensions (e.g. ColorZilla's cz-shortcut-listen) add attributes to <body>
          before React loads; this ignores attribute differences on this one element only. */}
      <body className="min-h-dvh" suppressHydrationWarning>
        <a
          href="#main"
          className="fixed start-4 top-4 z-50 -translate-y-24 rounded-xl bg-accent px-4 py-2 text-on-accent focus:translate-y-0"
        >
          پرش به محتوای اصلی
        </a>
        <AppProviders>
          <MotionProvider />
          {/* Reads the URL (?auth=login), so it sits in Suspense under Cache Components. */}
          <Suspense fallback={null}>
            <AuthSession />
          </Suspense>
          {children}
          <AuthDialog />
        </AppProviders>
      </body>
    </html>
  );
}
