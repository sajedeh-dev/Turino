import type { NextRequest } from "next/server";

import { forwardWithSession } from "@/server/auth/forward";
import { forbidden, isSameOriginRequest, readSmallJson } from "@/server/auth/request-guards";

type Method = "GET" | "POST" | "PUT";

/**
 * The only backend endpoints the browser may reach through this proxy, and with which methods.
 * The upstream path is built from this table, never copied from the request URL, so the
 * visitor's token can never be sent anywhere else (e.g. the backend's /truncate).
 */
const ROUTES: {
  pattern: RegExp;
  methods: Method[];
  toBackend: (match: RegExpMatchArray) => string;
}[] = [
  { pattern: /^user\/profile$/, methods: ["GET", "PUT"], toBackend: () => "/user/profile" },
  { pattern: /^user\/tours$/, methods: ["GET"], toBackend: () => "/user/tours" },
  { pattern: /^user\/transactions$/, methods: ["GET"], toBackend: () => "/user/transactions" },
  { pattern: /^basket$/, methods: ["GET"], toBackend: () => "/basket" },
  {
    pattern: /^basket\/([A-Za-z0-9-]{1,64})$/,
    methods: ["PUT"],
    toBackend: (match) => `/basket/${match[1]}`,
  },
  { pattern: /^order$/, methods: ["POST"], toBackend: () => "/order" },
];

function notFound() {
  return Response.json({ message: "مسیر پیدا نشد." }, { status: 404 });
}

async function handle(
  request: NextRequest,
  { params }: RouteContext<"/api/backend/[...path]">,
  method: Method,
) {
  const { path } = await params;
  const joined = path.join("/");

  for (const route of ROUTES) {
    const match = joined.match(route.pattern);
    if (!match) continue;
    if (!route.methods.includes(method)) {
      return Response.json({ message: "این عملیات مجاز نیست." }, { status: 405 });
    }

    let body: unknown;
    if (method !== "GET") {
      if (!isSameOriginRequest(request)) return forbidden();
      const parsed = await readSmallJson(request);
      if (!parsed.ok) return Response.json({ message: "درخواست نامعتبر است." }, { status: 400 });
      body = parsed.value;
    }

    return forwardWithSession(request, { method, path: route.toBackend(match), body });
  }

  return notFound();
}

export function GET(request: NextRequest, context: RouteContext<"/api/backend/[...path]">) {
  return handle(request, context, "GET");
}

export function POST(request: NextRequest, context: RouteContext<"/api/backend/[...path]">) {
  return handle(request, context, "POST");
}

export function PUT(request: NextRequest, context: RouteContext<"/api/backend/[...path]">) {
  return handle(request, context, "PUT");
}
