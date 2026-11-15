import { type NextRequest, NextResponse } from "next/server";

import {
  badGateway,
  forbidden,
  isSameOriginRequest,
  readSmallJson,
} from "@/server/auth/request-guards";
import { setSessionCookies } from "@/server/auth/session-cookies";
import { callBackend, readJson } from "@/server/backend";

interface CheckOtpBody {
  accessToken?: string;
  refreshToken?: string;
  user?: { id: string; mobile: string; firstName?: string; lastName?: string };
  message?: string;
}

/**
 * Verifies the code with the backend and starts the session: the tokens go into HttpOnly
 * cookies and only the public user profile is returned to the page.
 */
export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) return forbidden();

  const parsed = await readSmallJson(request, 512);
  const input = parsed.ok ? (parsed.value as { mobile?: unknown; code?: unknown }) : null;
  if (
    typeof input?.mobile !== "string" ||
    !/^09\d{9}$/.test(input.mobile) ||
    typeof input.code !== "string" ||
    !/^\d{6}$/.test(input.code)
  ) {
    return NextResponse.json({ message: "شماره یا کد معتبر نیست." }, { status: 400 });
  }

  try {
    const upstream = await callBackend({
      method: "POST",
      path: "/auth/check-otp",
      body: { mobile: input.mobile, code: input.code },
    });
    const data = (await readJson(upstream)) as CheckOtpBody | null;

    if (!upstream.ok || !data?.accessToken || !data.user) {
      return NextResponse.json(
        { message: data?.message ?? "کد وارد شده معتبر نیست." },
        { status: upstream.ok ? 502 : upstream.status },
      );
    }

    const { id, mobile, firstName = "", lastName = "" } = data.user;
    const response = NextResponse.json({ user: { id, mobile, firstName, lastName } });
    setSessionCookies(response, { accessToken: data.accessToken, refreshToken: data.refreshToken });
    return response;
  } catch {
    return badGateway();
  }
}
