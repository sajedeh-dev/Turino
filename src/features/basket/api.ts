import { ApiError } from "@/lib/api/api-error";
import { httpClient } from "@/lib/api/http-client";
import type { TourDto } from "@/features/tours/dto";
import { toTour } from "@/features/tours/mapper";
import type { Tour } from "@/features/tours/types";

/** Through the BFF proxy: PUT basket/:tourId puts a tour in the basket; GET basket returns it. */
const endpoints = {
  basket: "/backend/basket",
  add: (tourId: string) => `/backend/basket/${encodeURIComponent(tourId)}`,
} as const;

export async function addToBasket(tourId: string) {
  const { data } = await httpClient.put<unknown>(endpoints.add(tourId));
  return data;
}

/**
 * The tour waiting in the basket, or null when the basket is empty.
 * The backend answers an empty basket with 404 («سبد خرید شما خالی است»), not an empty body.
 */
export async function getBasket(): Promise<Tour | null> {
  try {
    const { data } = await httpClient.get<TourDto | null>(endpoints.basket);
    return data?.id ? toTour(data) : null;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
