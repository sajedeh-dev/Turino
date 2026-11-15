import { create } from "zustand";

import type { User } from "../types";

interface AuthState {
  /** The signed-in user's public profile. Nothing is persisted in the browser. */
  user: User | null;
  /** False until the session has been checked with the server; avoids a signed-out flash. */
  hasHydrated: boolean;
  setSession: (user: User | null) => void;
}

/**
 * Who is signed in, as last reported by the server (/api/auth/session or a sign-in).
 * Tokens never live here: they are HttpOnly cookies the page cannot read.
 */
export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  hasHydrated: false,
  setSession: (user) => set({ user, hasHydrated: true }),
}));

export const useCurrentUser = () => useAuthStore((state) => state.user);
