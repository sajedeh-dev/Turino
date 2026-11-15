import "server-only";

import { type NextRequest, NextResponse } from "next/server";

import { type BackendRequest, callBackend, readJson } from "../backend";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "./cookie-names";
import { badGateway, sessionEnded } from "./request-guards";
import { clearSessionCookies, setSessionCookies } from "./session-cookies";

/** The backend answers a missing token with 401 and an expired or invalid one with 403. */
const AUTH_FAILURE = [401, 403];
/** Statuses with which the backend refuses a refresh token for good. */
const REFRESH_REJECTED = [400, 401, 403];

type RefreshResult =
  | { kind: "ok"; accessToken: string; refreshToken?: string }
  | { kind: "rejected" }
  | { kind: "unavailable" };

async function refresh(refreshToken: string): Promise<RefreshResult> {
  try {
    const response = await callBackend({
      method: "POST",
      path: "/auth/refresh-token",
      body: { refreshToken },
    });
    if (REFRESH_REJECTED.includes(response.status)) return { kind: "rejected" };
    if (!response.ok) return { kind: "unavailable" };

    const data = (await readJson(response)) as { accessToken?: string; refreshToken?: string };
    return data?.accessToken
      ? { kind: "ok", accessToken: data.accessToken, refreshToken: data.refreshToken }
      : { kind: "unavailable" };
  } catch {
    // Timeout or network failure: the refresh token may still be valid, so keep it.
    return { kind: "unavailable" };
  }
}

function endSession() {
  const response = sessionEnded();
  clearSessionCookies(response);
  return response;
}

/**
 * Calls the backend for the signed-in visitor, using the tokens from their HttpOnly cookies.
 * An expired access token is refreshed here, on the server, and the request replayed once;
 * the browser only ever sees the final answer and, if refreshed, a new HttpOnly cookie.
 */
export async function forwardWithSession(
  request: NextRequest,
  backendRequest: Omit<BackendRequest, "accessToken">,
) {
  let accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  let renewed: { accessToken: string; refreshToken?: string } | null = null;

  if (!accessToken && !refreshToken) return endSession();

  async function renew() {
    if (!refreshToken) return "rejected" as const;
    const result = await refresh(refreshToken);
    if (result.kind !== "ok") return result.kind;
    renewed = { accessToken: result.accessToken, refreshToken: result.refreshToken };
    accessToken = result.accessToken;
    return "ok" as const;
  }

  try {
    // The access cookie expires with its token, so a missing one usually just needs a refresh.
    if (!accessToken) {
      const outcome = await renew();
      if (outcome === "rejected") return endSession();
      if (outcome === "unavailable") return badGateway();
    }

    let upstream = await callBackend({ ...backendRequest, accessToken });

    if (AUTH_FAILURE.includes(upstream.status) && !renewed) {
      const outcome = await renew();
      if (outcome === "rejected") return endSession();
      if (outcome === "unavailable") return badGateway();
      upstream = await callBackend({ ...backendRequest, accessToken });
    }

    // Still refused with a fresh token: the session is no longer valid.
    if (AUTH_FAILURE.includes(upstream.status)) return endSession();

    const body = await readJson(upstream);
    const response = NextResponse.json(body, { status: upstream.status });
    if (renewed) setSessionCookies(response, renewed);
    return response;
  } catch {
    return badGateway();
  }
}
