const expiredListeners = new Set<() => void>();

/** Called when the server reports the session is over, e.g. to clear the signed-in user. */
export function onSessionExpired(listener: () => void) {
  expiredListeners.add(listener);
  return () => {
    expiredListeners.delete(listener);
  };
}

export function endSession() {
  expiredListeners.forEach((listener) => listener());
}
