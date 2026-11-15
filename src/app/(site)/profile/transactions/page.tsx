import type { Metadata } from "next";

import { TransactionsTable } from "@/features/user/components/transactions-table";

export const metadata: Metadata = { title: "تراکنش‌ها" };

export default function TransactionsPage() {
  return (
    <>
      <h1 className="text-head font-extrabold tracking-tight">تراکنش‌ها</h1>
      <TransactionsTable />
    </>
  );
}
