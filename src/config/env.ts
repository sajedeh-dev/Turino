import "server-only";

import { z } from "zod";

/**
 * Server-only environment, validated once at start-up.
 * None of these reach the browser: it talks only to this app's own /api routes (BFF),
 * so the backend address stays private.
 */
const envSchema = z.object({
  API_BASE_URL: z.url().default("http://localhost:6500"),
  USE_MOCKS: z
    .enum(["true", "false"])
    .default("true")
    .transform((value) => value === "true"),
});

const parsed = envSchema.safeParse({
  API_BASE_URL: process.env.API_BASE_URL,
  USE_MOCKS: process.env.USE_MOCKS,
});

if (!parsed.success) {
  throw new Error(`Invalid environment variables:\n${z.prettifyError(parsed.error)}`);
}

export const env = {
  apiBaseUrl: parsed.data.API_BASE_URL,
  useMocks: parsed.data.USE_MOCKS,
} as const;
