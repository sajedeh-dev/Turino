import type { Metadata } from "next";

import { CheckoutView } from "@/features/order/components/checkout-view";

export const metadata: Metadata = { title: "رزرو و پرداخت" };

// Signed-out visitors never reach this page: src/proxy.ts sends them to the login dialog first.
export default function CheckoutPage() {
  return (
    <div className="container-page pt-10 md:pt-14">
      <h1 className="text-head font-extrabold tracking-tight">رزرو و پرداخت</h1>
      <CheckoutView />
    </div>
  );
}
