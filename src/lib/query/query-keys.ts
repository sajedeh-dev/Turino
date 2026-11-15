/** Every TanStack Query key in one place, so invalidation never misses a spelling. */
export const queryKeys = {
  profile: ["user", "profile"] as const,
  userTours: ["user", "tours"] as const,
  transactions: ["user", "transactions"] as const,
  basket: ["basket"] as const,
};
