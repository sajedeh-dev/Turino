/**
 * Returns `next` as a same-site path ("/profile?tab=1#x"), or null when it would leave the site.
 * Resolving against the current origin catches every trick a prefix check misses:
 * "//evil.com", "/\\evil.com", "https://evil.com", "javascript:…".
 */
export function safeRedirectPath(next: string | null | undefined, origin: string) {
  if (!next) return null;
  try {
    const url = new URL(next, origin);
    if (url.origin !== origin) return null;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}
