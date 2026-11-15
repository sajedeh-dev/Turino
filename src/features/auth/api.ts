import { ApiError } from "@/lib/api/api-error";
import { httpClient } from "@/lib/api/http-client";

import type { CheckOtpResponse, SendOtpResponse, User } from "./types";

/** This app's own auth routes (src/app/api/auth); they talk to the backend on the server. */
const endpoints = {
  sendOtp: "/auth/send-otp",
  checkOtp: "/auth/check-otp",
  session: "/auth/session",
  logout: "/auth/logout",
} as const;

export async function sendOtp(mobile: string) {
  const { data } = await httpClient.post<SendOtpResponse>(endpoints.sendOtp, { mobile });
  return data;
}

export async function checkOtp(input: { mobile: string; code: string }) {
  const { data } = await httpClient.post<CheckOtpResponse>(endpoints.checkOtp, input);
  return data;
}

/** The signed-in user, or null when there is no valid session. */
export async function getSession(): Promise<User | null> {
  try {
    const { data } = await httpClient.get<{ user: User }>(endpoints.session);
    return data.user;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}

export async function logout() {
  await httpClient.post(endpoints.logout);
}
