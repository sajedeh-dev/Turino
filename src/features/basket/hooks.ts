"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/features/auth/stores/auth-store";
import type { ApiError } from "@/lib/api/api-error";
import { queryKeys } from "@/lib/query/query-keys";

import { addToBasket, getBasket } from "./api";

export function useBasket() {
  const isSignedIn = useAuthStore((state) => state.hasHydrated && state.user !== null);
  return useQuery({ queryKey: queryKeys.basket, queryFn: getBasket, enabled: isSignedIn });
}

export function useAddToBasket() {
  const queryClient = useQueryClient();
  return useMutation<unknown, ApiError, string>({
    mutationFn: addToBasket,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.basket }),
  });
}
