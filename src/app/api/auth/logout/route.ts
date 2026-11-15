import { type NextRequest, NextResponse } from "next/server";

import { forbidden, isSameOriginRequest } from "@/server/auth/request-guards";
import { clearSessionCookies } from "@/server/auth/session-cookies";

/** Ends the session by expiring both HttpOnly cookies (the page cannot delete them itself). */
export function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) return forbidden();
  const response = new NextResponse(null, { status: 204 });
  clearSessionCookies(response);
  return response;
}
