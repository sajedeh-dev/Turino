import type { Metadata } from "next";

import { ProfileOverview } from "@/features/user/components/profile-overview";

export const metadata: Metadata = { title: "حساب کاربری" };

export default function ProfilePage() {
  return (
    <>
      <h1 className="text-head font-extrabold tracking-tight">حساب کاربری</h1>
      <ProfileOverview />
    </>
  );
}
