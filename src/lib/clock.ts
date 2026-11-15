import { connection } from "next/server";

/**
 * The current time, for Server Components. Awaiting connection() first tells Next.js this part
 * depends on the request, so it is rendered per request and never frozen into a prerender
 * (where Date.now() would be the build time, and Next.js rejects it).
 */
export async function requestTime() {
  await connection();
  return Date.now();
}
