import type { NextConfig } from "next";

// Tour images are served by the backend, e.g. http://localhost:6500/static/images/x.png
const configuredApiUrl = process.env.API_BASE_URL;
const apiUrl = new URL(configuredApiUrl ?? "http://localhost:6500");

// URL.hostname keeps the brackets of an IPv6 literal: "[::1]".
const LOCAL_HOSTS = ["localhost", "127.0.0.1", "[::1]"];

// Only when the API is *explicitly* configured as a local address (development, a local preview).
// A missing variable never opens the SSRF guard, so a misconfigured production build stays safe.
const allowLocalApiImages = configuredApiUrl !== undefined && LOCAL_HOSTS.includes(apiUrl.hostname);

const isDev = process.env.NODE_ENV === "development";

/**
 * Content-Security-Policy without nonces (nonces would force every page to render per request
 * and are incompatible with Partial Prerendering). The strongest line is connect-src 'self':
 * the browser may only call this site (the BFF), so even injected script cannot send data
 * elsewhere. 'unsafe-inline' scripts are needed for Next's inline bootstrap and the theme script.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  // Browsers only honour this over https; harmless on http://localhost.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [
      {
        protocol: apiUrl.protocol === "https:" ? "https" : "http",
        hostname: apiUrl.hostname,
        port: apiUrl.port,
        pathname: "/static/**",
      },
    ],
    // Next.js refuses to optimise images from local addresses (SSRF protection).
    dangerouslyAllowLocalIP: allowLocalApiImages,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
