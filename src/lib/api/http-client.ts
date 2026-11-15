import axios from "axios";

import { toApiError } from "./api-error";
import { endSession } from "./session";

/**
 * The browser's only HTTP client. It talks to this app's own /api routes (the BFF), never to
 * the backend directly: the session lives in HttpOnly cookies the browser sends by itself, and
 * the server adds the token and refreshes it. Page JavaScript never sees a token.
 */
export const httpClient = axios.create({
  baseURL: "/api",
  timeout: 20_000,
  headers: { "Content-Type": "application/json" },
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 from the BFF means the session is over (it already tried to refresh it).
    if (error.response?.status === 401 && !error.config?.url?.startsWith("/auth/")) endSession();
    return Promise.reject(toApiError(error));
  },
);
