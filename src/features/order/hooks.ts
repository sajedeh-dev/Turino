"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ApiError } from "@/lib/api/api-error";
import { queryKeys } from "@/lib/query/query-keys";

import { createOrder, type CreateOrderDto } from "./api";

/** Places the order, then refreshes everything it changes. */
export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation<{ message?: string }, ApiError, CreateOrderDto>({
    mutationFn: createOrder,
    onSuccess: () =>
      Promise.all(
        [queryKeys.basket, queryKeys.userTours, queryKeys.transactions].map((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        ),
      ),
  });
}
