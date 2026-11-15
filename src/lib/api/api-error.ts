import { isAxiosError } from "axios";

/** One error shape for the whole app, whatever the transport threw. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number | null,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const fallbackMessage = "ارتباط با سرور برقرار نشد. لطفا دوباره تلاش کنید.";

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    return new ApiError(data?.message ?? fallbackMessage, error.response?.status ?? null, data);
  }

  return new ApiError(fallbackMessage, null, error);
}
