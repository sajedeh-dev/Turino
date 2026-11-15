/**
 * Tells other open tabs that the session changed (sign-in or sign-out), so they re-check it.
 * The session cookies are shared by all tabs but HttpOnly, so tabs cannot watch them directly.
 */
const CHANNEL = "turino.session";

export function announceSessionChange() {
  if (typeof BroadcastChannel === "undefined") return;
  const channel = new BroadcastChannel(CHANNEL);
  channel.postMessage("changed");
  channel.close();
}

export function onSessionChangeElsewhere(listener: () => void) {
  if (typeof BroadcastChannel === "undefined") return () => {};
  const channel = new BroadcastChannel(CHANNEL);
  channel.onmessage = listener;
  return () => channel.close();
}
