import { Suspense } from "react";

import { ProfileNav } from "@/features/user/components/profile-nav";

// Signed-out visitors never reach these pages: src/proxy.ts sends them to the login dialog first.
export default function ProfileLayout({ children }: LayoutProps<"/profile">) {
  return (
    <div className="container-page grid gap-8 pt-10 md:pt-14 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12">
      <aside className="lg:sticky lg:top-8 lg:self-start">
        <Suspense>
          <ProfileNav />
        </Suspense>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
