"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { onSessionExpired } from "@/lib/api/session";
import { safeRedirectPath } from "@/lib/safe-redirect";

import { getSession } from "../api";
import { clearLocalSession } from "../session-actions";
import { onSessionChangeElsewhere } from "../session-channel";
import { useAuthDialog } from "../stores/auth-dialog-store";
import { useAuthStore } from "../stores/auth-store";

/**
 * Keeps the page's idea of "who is signed in" in step with the server's HttpOnly session,
 * and opens the login dialog when the proxy sent the visitor here with ?auth=login&next=…
 */
export function AuthSession() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const openDialog = useAuthDialog((state) => state.open);

  useEffect(() => {
    let isCurrent = true;

    async function checkSession() {
      try {
        const user = await getSession();
        if (isCurrent) useAuthStore.getState().setSession(user);
      } catch {
        // Server unreachable: treat as signed out for now; the next check will correct it.
        if (isCurrent) useAuthStore.getState().setSession(null);
      }
    }

    void checkSession();
    const stopChannel = onSessionChangeElsewhere(() => void checkSession());
    const stopExpired = onSessionExpired(clearLocalSession);

    return () => {
      isCurrent = false;
      stopChannel();
      stopExpired();
    };
  }, []);

  useEffect(() => {
    if (searchParams.get("auth") !== "login") return;

    // The proxy sends visitors here only when it found no session cookie: forget any user
    // this tab still shows, so the header and the dialog agree.
    if (useAuthStore.getState().user) clearLocalSession();

    // Only same-site paths, so the parameter cannot redirect to another website.
    openDialog(safeRedirectPath(searchParams.get("next"), window.location.origin));

    const params = new URLSearchParams(searchParams);
    params.delete("auth");
    params.delete("next");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [searchParams, pathname, router, openDialog]);

  return null;
}
