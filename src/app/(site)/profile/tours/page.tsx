import type { Metadata } from "next";

import { MyTours } from "@/features/user/components/my-tours";

export const metadata: Metadata = { title: "تورهای من" };

export default function MyToursPage() {
  return (
    <>
      <h1 className="text-head font-extrabold tracking-tight">تورهای من</h1>
      <MyTours />
    </>
  );
}
