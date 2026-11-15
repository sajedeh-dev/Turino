import "server-only";

import { cacheLife } from "next/cache";

import { env } from "@/config/env";
import { ApiError } from "@/lib/api/api-error";
import { callBackend, readJson } from "@/server/backend";

import { mockTourDtos } from "./data/mock-tours";
import type { TourDto, TourQueryDto } from "./dto";
import { toTour } from "./mapper";
import type { Place, Tour, TourFilters } from "./types";

/**
 * Tours service (server only). Pages call these functions; tours are public, so no session.
 * Mock and real modes return the same DTOs and go through the same mapper.
 */
const endpoints = {
  list: "/tour",
  detail: (id: string) => `/tour/${encodeURIComponent(id)}`,
};

/** GET from the backend; non-2xx answers and network failures become an ApiError. */
async function fetchJson<T>(path: string, query?: URLSearchParams): Promise<T> {
  let response: Response;
  try {
    response = await callBackend({ path, query });
  } catch (error) {
    throw new ApiError("ارتباط با سرور برقرار نشد. لطفا دوباره تلاش کنید.", null, error);
  }
  const body = await readJson(response);
  if (!response.ok) {
    const message = (body as { message?: string } | null)?.message ?? "خطای سرور.";
    throw new ApiError(message, response.status, body);
  }
  return body as T;
}

/** Drops empty filters so they are not sent as `?destinationId=`. */
function toQuery(filters: TourFilters): TourQueryDto {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => Boolean(value)),
  ) as TourQueryDto;
}

/** Mirrors the backend's filtering, for mock mode. */
function filterMocks(tours: TourDto[], query: TourQueryDto) {
  return tours.filter(
    (tour) =>
      (!query.destinationId || tour.destination.id === query.destinationId) &&
      (!query.originId || tour.origin.id === query.originId) &&
      (!query.startDate || tour.startDate.slice(0, 10) >= query.startDate) &&
      (!query.endDate || tour.endDate.slice(0, 10) <= query.endDate),
  );
}

export async function getTours(filters: TourFilters = {}): Promise<Tour[]> {
  "use cache";
  cacheLife("minutes");

  const query = toQuery(filters);
  if (env.useMocks) return filterMocks(mockTourDtos, query).map(toTour);

  const params = new URLSearchParams(query as Record<string, string>);
  const data = await fetchJson<TourDto[]>(endpoints.list, params);
  return data.map(toTour);
}

export async function getTourById(id: string): Promise<Tour | null> {
  "use cache";
  cacheLife("minutes");

  if (env.useMocks) {
    const dto = mockTourDtos.find((tour) => tour.id === id);
    return dto ? toTour(dto) : null;
  }

  try {
    return toTour(await fetchJson<TourDto>(endpoints.detail(id)));
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

/** Distinct places, in the order of the tours given. */
function distinctPlaces(tours: Tour[], pick: (tour: Tour) => Place): Place[] {
  const seen = new Map<string, Place>();
  for (const tour of tours) {
    const place = pick(tour);
    if (!seen.has(place.id)) seen.set(place.id, place);
  }
  return [...seen.values()];
}

export const getDestinations = (tours: Tour[]) => distinctPlaces(tours, (tour) => tour.destination);
export const getOrigins = (tours: Tour[]) => distinctPlaces(tours, (tour) => tour.origin);
