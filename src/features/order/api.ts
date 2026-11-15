import { httpClient } from "@/lib/api/http-client";

/** POST /order: books and pays for the basket's tour for this passenger. */
export interface CreateOrderDto {
  nationalCode: string;
  fullName: string;
  gender: "male" | "female";
  /** ISO date, e.g. "2022-10-10". */
  birthDate: string;
}

export async function createOrder(order: CreateOrderDto) {
  const { data } = await httpClient.post<{ message?: string }>("/backend/order", order);
  return data;
}
