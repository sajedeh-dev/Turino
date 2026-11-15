import "server-only";

import type { NextResponse } from "next/server";

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "./cookie-names";

/** Seconds until a JWT's `exp`, or the fallback when the token cannot be read. */
function secondsUntilExpiry(token: string, fallbackSeconds: number) {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8"));
    if (typeof payload.exp === "number") {
      return Math.max(0, payload.exp - Math.floor(Date.now() / 1000));
    }
  } catch {
    // Not a readable JWT: use the fallback lifetime.
  }
  return fallbackSeconds;
}

/**
 * HttpOnly: page JavaScript (and so any XSS) cannot read the tokens.
 * Secure in production: never sent over plain http. SameSite=Lax: not sent on cross-site
 * POST/PUT, which (with the Origin check in the routes) blocks CSRF.
 */
function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export function setSessionCookies(
  response: NextResponse,
  tokens: { accessToken: string; refreshToken?: string },
) {
  response.cookies.set(
    ACCESS_TOKEN_COOKIE,
    tokens.accessToken,
    cookieOptions(secondsUntilExpiry(tokens.accessToken, 60 * 60)),
  );
  if (tokens.refreshToken) {
    response.cookies.set(
      REFRESH_TOKEN_COOKIE,
      tokens.refreshToken,
      cookieOptions(secondsUntilExpiry(tokens.refreshToken, 7 * 24 * 60 * 60)),
    );
  }
}

export function clearSessionCookies(response: NextResponse) {
  response.cookies.set(ACCESS_TOKEN_COOKIE, "", cookieOptions(0));
  response.cookies.set(REFRESH_TOKEN_COOKIE, "", cookieOptions(0));
}
