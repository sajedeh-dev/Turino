"use client";

import { QueryState } from "@/components/ui/query-state";

import { useProfile } from "../hooks";
import { AccountSection, BankSection, PersonalSection } from "./profile-sections";

export function ProfileOverview() {
  const profile = useProfile();

  return (
    <div className="mt-8">
      <QueryState isPending={profile.isPending} error={profile.error} onRetry={profile.refetch}>
        {profile.data && (
          <div className="grid gap-6">
            <AccountSection profile={profile.data} />
            <PersonalSection profile={profile.data} />
            <BankSection profile={profile.data} />
          </div>
        )}
      </QueryState>
    </div>
  );
}
