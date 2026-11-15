import { create } from "zustand";

interface AuthDialogState {
  isOpen: boolean;
  /** Where to go after a successful sign-in, e.g. the protected page the visitor asked for. */
  redirectTo: string | null;
  open: (redirectTo?: string | null) => void;
  close: () => void;
}

export const useAuthDialog = create<AuthDialogState>()((set) => ({
  isOpen: false,
  redirectTo: null,
  open: (redirectTo = null) => set({ isOpen: true, redirectTo }),
  close: () => set({ isOpen: false, redirectTo: null }),
}));
