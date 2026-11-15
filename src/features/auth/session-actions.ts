import { getQueryClient } from "@/lib/query/query-client";

import { logout } from "./api";
import { announceSessionChange } from "./session-channel";
import { useAuthStore } from "./stores/auth-store";
import type { User } from "./types";

/** After a successful sign-in: show the user, drop anything cached for whoever came before. */
export function startSession(user: User) {
  getQueryClient().clear();
  useAuthStore.getState().setSession(user);
  announceSessionChange();
}

/** Forget the user locally (the server has already ended the session, or is about to). */
export function clearLocalSession() {
  getQueryClient().clear();
  useAuthStore.getState().setSession(null);
}

/** Sign out: the server expires the HttpOnly cookies; this tab and the others forget the user. */
export async function signOut() {
  try {
    await logout();
  } finally {
    clearLocalSession();
    announceSessionChange();
  }
}
