"use client";

import { EmptyState, QueryState } from "@/components/ui/query-state";
import { formatDate, formatPrice, TIME_ZONE } from "@/lib/format";

import { useTransactions } from "../hooks";

/** Known transaction types; anything else is shown as the API sent it. */
const typeLabels: Record<string, string> = {
  purchase: "خرید تور",
  refund: "برگشت وجه",
};

const timeFormatter = new Intl.DateTimeFormat("fa-IR", {
  timeZone: TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
});

export function TransactionsTable() {
  const transactions = useTransactions();
  const rows = [...(transactions.data ?? [])].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <div className="mt-8">
      <QueryState
        isPending={transactions.isPending}
        error={transactions.error}
        onRetry={transactions.refetch}
        isEmpty={rows.length === 0}
        empty={<EmptyState title="هنوز تراکنشی ندارید." />}
      >
        <div className="overflow-x-auto rounded-3xl border border-line">
          <table className="w-full min-w-[36rem] text-start text-body">
            <caption className="sr-only">تراکنش‌های حساب، جدیدترین اول</caption>
            <thead className="bg-surface text-small text-muted">
              <tr>
                <th scope="col" className="px-5 py-3 text-start font-medium">
                  تاریخ و ساعت
                </th>
                <th scope="col" className="px-5 py-3 text-start font-medium">
                  مبلغ
                </th>
                <th scope="col" className="px-5 py-3 text-start font-medium">
                  نوع
                </th>
                <th scope="col" className="px-5 py-3 text-start font-medium">
                  شماره
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-line">
                  <td className="px-5 py-4">
                    {formatDate(row.createdAt)}، {timeFormatter.format(new Date(row.createdAt))}
                  </td>
                  <td className="tabular px-5 py-4 font-bold">{formatPrice(row.amount)}</td>
                  <td className="px-5 py-4">
                    {(row.type && typeLabels[row.type.toLowerCase()]) ?? row.type ?? "—"}
                  </td>
                  <td className="px-5 py-4">
                    <bdi dir="ltr" className="tabular text-small text-muted">
                      {row.id.slice(0, 8)}
                    </bdi>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </QueryState>
    </div>
  );
}
