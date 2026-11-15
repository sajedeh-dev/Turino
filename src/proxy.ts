import { type NextRequest, NextResponse } from "next/server";

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/server/auth/cookie-names";

/**
 * Optimistic route guard: pages that need an account redirect signed-out visitors to the home
 * page with the login dialog open, then send them back after they sign in.
 * The backend still checks the token on every request; this only decides what to render.
 */
export function proxy(request: NextRequest) {
  // Optimistic only: the BFF verifies the session on every data request anyway.
  if (request.cookies.has(REFRESH_TOKEN_COOKIE) || request.cookies.has(ACCESS_TOKEN_COOKIE)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/";
  url.search = "";
  url.searchParams.set("auth", "login");
  url.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/profile/:path*", "/checkout/:path*"],
};
