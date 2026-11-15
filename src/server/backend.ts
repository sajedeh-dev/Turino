import "server-only";

import { env } from "@/config/env";

/** Upper bound for any backend call, so a hung backend never hangs a page or an /api route. */
const TIMEOUT_MS = 15_000;

export interface BackendRequest {
  method?: "GET" | "POST" | "PUT";
  /** Path on the backend, e.g. "/user/profile". Always built from a fixed map, never from input. */
  path: string;
  query?: URLSearchParams;
  body?: unknown;
  accessToken?: string;
}

/**
 * The one place this server talks to the backend.
 * Only the headers it needs are sent: never the visitor's cookies or other incoming headers.
 */
export async function callBackend({
  method = "GET",
  path,
  query,
  body,
  accessToken,
}: BackendRequest) {
  const url = new URL(path, env.apiBaseUrl);
  if (query) url.search = query.toString();

  return fetch(url, {
    method,
    redirect: "error",
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: {
      Accept: "application/json",
      ...(body !== undefined && { "Content-Type": "application/json" }),
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

/** Reads a JSON body, or null when there is none or it is not JSON. */
export async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
