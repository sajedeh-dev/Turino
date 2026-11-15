import { httpClient } from "@/lib/api/http-client";
import type { TourDto } from "@/features/tours/dto";
import { toTour } from "@/features/tours/mapper";

import type { TransactionDto, UpdateProfileDto, UserProfileDto } from "./types";

/**
 * Through the BFF proxy (src/app/api/backend): the server adds the session token from the
 * HttpOnly cookie and refreshes it when it expires.
 */
const endpoints = {
  profile: "/backend/user/profile",
  tours: "/backend/user/tours",
  transactions: "/backend/user/transactions",
} as const;

export async function getProfile() {
  const { data } = await httpClient.get<UserProfileDto>(endpoints.profile);
  return data;
}

export async function updateProfile(changes: UpdateProfileDto) {
  const { data } = await httpClient.put<unknown>(endpoints.profile, changes);
  return data;
}

/** Tours the user has bought, mapped like any other tour. */
export async function getUserTours() {
  const { data } = await httpClient.get<TourDto[]>(endpoints.tours);
  return data.map(toTour);
}

export async function getTransactions() {
  const { data } = await httpClient.get<TransactionDto[]>(endpoints.transactions);
  return data;
}
