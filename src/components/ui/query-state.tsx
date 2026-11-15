import type { ReactNode } from "react";

import { Button } from "./button";

interface QueryStateProps {
  isPending: boolean;
  error: Error | null;
  onRetry: () => void;
  isEmpty?: boolean;
  empty?: ReactNode;
  children: ReactNode;
}

/** Loading, error (with retry), empty and success, in one place for every client query. */
export function QueryState({
  isPending,
  error,
  onRetry,
  isEmpty,
  empty,
  children,
}: QueryStateProps) {
  if (isPending) {
    return (
      <div role="status" aria-label="در حال بارگذاری" className="grid gap-4">
        <div className="h-24 animate-pulse rounded-3xl bg-surface" />
        <div className="h-24 animate-pulse rounded-3xl bg-surface" />
      </div>
    );
  }
  if (error) {
    return (
      <div role="alert" className="grid justify-items-start gap-4 rounded-3xl bg-surface p-8">
        <p className="text-body">{error.message}</p>
        <Button variant="outline" size="md" onClick={onRetry}>
          تلاش دوباره
        </Button>
      </div>
    );
  }
  if (isEmpty) return <>{empty}</>;
  return <>{children}</>;
}

/** A friendly empty state: a sentence and an optional action. */
export function EmptyState({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="grid justify-items-center gap-5 rounded-3xl bg-surface px-6 py-12 text-center">
      <p className="text-lead font-bold">{title}</p>
      {action}
    </div>
  );
}
