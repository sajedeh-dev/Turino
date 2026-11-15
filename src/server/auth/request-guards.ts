import "server-only";

import { type NextRequest, NextResponse } from "next/server";

/**
 * CSRF guard for state-changing requests: they must come from this site's own pages.
 * Browsers always send Origin on cross-site POST/PUT, and Sec-Fetch-Site on modern browsers.
 */
export function isSameOriginRequest(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin) return origin === request.nextUrl.origin;
  return request.headers.get("sec-fetch-site") === "same-origin";
}

export function forbidden() {
  return NextResponse.json({ message: "درخواست نامعتبر است." }, { status: 403 });
}

export function sessionEnded() {
  return NextResponse.json(
    { message: "نشست شما به پایان رسیده است؛ دوباره وارد شوید." },
    { status: 401 },
  );
}

export function badGateway() {
  return NextResponse.json(
    { message: "ارتباط با سرور برقرار نشد. لطفا دوباره تلاش کنید." },
    { status: 502 },
  );
}

/** Small JSON bodies only; protects the routes from oversized payloads. */
export async function readSmallJson(request: NextRequest, maxBytes = 16_384) {
  const text = await request.text();
  if (text.length > maxBytes) return { ok: false as const };
  if (!text) return { ok: true as const, value: undefined };
  try {
    return { ok: true as const, value: JSON.parse(text) as unknown };
  } catch {
    return { ok: false as const };
  }
}
