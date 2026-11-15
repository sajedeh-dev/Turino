"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/features/auth/stores/auth-store";
import type { ApiError } from "@/lib/api/api-error";
import { queryKeys } from "@/lib/query/query-keys";

import { getProfile, getTransactions, getUserTours, updateProfile } from "./api";
import { toUserTrips } from "./trip-status";
import type { UpdateProfileDto } from "./types";

/** Queries run only once a signed-in user is known in the browser. */
function useSignedIn() {
  return useAuthStore((state) => state.hasHydrated && state.user !== null);
}

export function useProfile() {
  return useQuery({ queryKey: queryKeys.profile, queryFn: getProfile, enabled: useSignedIn() });
}

/** Bought tours with their status. `select` runs only once data exists, never while prerendering. */
export function useUserTrips() {
  return useQuery({
    queryKey: queryKeys.userTours,
    queryFn: getUserTours,
    enabled: useSignedIn(),
    select: (tours) => toUserTrips(tours, Date.now()),
  });
}

export function useTransactions() {
  return useQuery({
    queryKey: queryKeys.transactions,
    queryFn: getTransactions,
    enabled: useSignedIn(),
  });
}

/** Saves part of the profile, then reloads it and keeps the header's user in step. */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiError, UpdateProfileDto>({
    mutationFn: updateProfile,
    onSuccess: async (_data, changes) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.profile });
      if (changes.firstName !== undefined || changes.lastName !== undefined) {
        useAuthStore.setState((state) =>
          state.user
            ? {
                user: {
                  ...state.user,
                  firstName: changes.firstName ?? state.user.firstName,
                  lastName: changes.lastName ?? state.user.lastName,
                },
              }
            : state,
        );
      }
    },
  });
}
