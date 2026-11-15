import { type NextRequest, NextResponse } from "next/server";

import {
  badGateway,
  forbidden,
  isSameOriginRequest,
  readSmallJson,
} from "@/server/auth/request-guards";
import { callBackend, readJson } from "@/server/backend";

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) return forbidden();

  const parsed = await readSmallJson(request, 512);
  const mobile = (parsed.ok ? (parsed.value as { mobile?: unknown })?.mobile : undefined) ?? "";
  if (typeof mobile !== "string" || !/^09\d{9}$/.test(mobile)) {
    return NextResponse.json({ message: "شماره موبایل معتبر نیست." }, { status: 400 });
  }

  try {
    const upstream = await callBackend({
      method: "POST",
      path: "/auth/send-otp",
      body: { mobile },
    });
    const data = (await readJson(upstream)) as { message?: string; code?: string } | null;

    // The development backend echoes the code for testing. Never pass it on in production:
    // anyone could otherwise sign in to any phone number.
    const exposeCode = process.env.NODE_ENV === "development" && data?.code;
    return NextResponse.json(
      { message: data?.message ?? "", ...(exposeCode && { code: data.code }) },
      { status: upstream.status },
    );
  } catch {
    return badGateway();
  }
}
