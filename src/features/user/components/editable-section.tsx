"use client";

import { type ReactNode, useId, useState } from "react";

import { Button } from "@/components/ui/button";

export interface SectionRow {
  label: string;
  value?: string;
  /** Show the value left-to-right (numbers, email, IBAN). */
  ltr?: boolean;
}

interface EditableSectionProps {
  title: string;
  rows: SectionRow[];
  /** The edit form; call `done()` after a successful save to return to the read view. */
  renderForm: (done: () => void) => ReactNode;
}

/** A profile card that turns into its own form when edited. */
export function EditableSection({ title, rows, renderForm }: EditableSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const headingId = useId();
  const isEmpty = rows.every((row) => !row.value);

  return (
    <section aria-labelledby={headingId} className="rounded-3xl border border-line p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 id={headingId} className="text-lead font-bold">
          {title}
        </h2>
        {!isEditing && (
          <Button variant="outline" size="md" onClick={() => setIsEditing(true)}>
            {isEmpty ? "افزودن" : "ویرایش"}
            <span className="sr-only"> {title}</span>
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="mt-6">{renderForm(() => setIsEditing(false))}</div>
      ) : (
        <dl className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2">
          {rows.map((row) => (
            <div key={row.label} className="flex flex-wrap justify-between gap-x-4 gap-y-1">
              <dt className="text-body text-muted">{row.label}</dt>
              <dd className="text-body font-bold">
                {row.value ? (
                  row.ltr ? (
                    <bdi dir="ltr" className="tabular">
                      {row.value}
                    </bdi>
                  ) : (
                    row.value
                  )
                ) : (
                  <span className="font-normal text-faint">ثبت نشده</span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}

/** Save and cancel, shared by every section form. */
export function FormActions({ isSaving, onCancel }: { isSaving: boolean; onCancel: () => void }) {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Button type="submit" size="md" disabled={isSaving}>
        {isSaving ? "در حال ذخیره…" : "ذخیره"}
      </Button>
      <Button type="button" variant="ghost" size="md" onClick={onCancel}>
        انصراف
      </Button>
    </div>
  );
}
