import { type NextRequest, NextResponse } from "next/server";

import { forwardWithSession } from "@/server/auth/forward";

/**
 * Who is signed in, from the HttpOnly session cookies (the page cannot read them itself).
 * 200 { user } or 401. Refreshes an expired access token on the way, like any proxied call.
 */
export async function GET(request: NextRequest) {
  const upstream = await forwardWithSession(request, { path: "/user/profile" });
  if (!upstream.ok) return upstream;

  const profile = (await upstream.json()) as {
    id: string;
    mobile: string;
    firstName?: string;
    lastName?: string;
  };
  const response = NextResponse.json(
    {
      user: {
        id: profile.id,
        mobile: profile.mobile,
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
  // Keep any renewed session cookie that forwardWithSession attached.
  for (const cookie of upstream.cookies.getAll()) response.cookies.set(cookie);
  return response;
}
