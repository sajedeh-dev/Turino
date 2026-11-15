"use client";

import { useMutation } from "@tanstack/react-query";

import type { ApiError } from "@/lib/api/api-error";

import { checkOtp, sendOtp } from "../api";
import { startSession } from "../session-actions";
import type { CheckOtpResponse, SendOtpResponse } from "../types";

export function useSendOtp() {
  return useMutation<SendOtpResponse, ApiError, string>({
    mutationFn: sendOtp,
  });
}

/** Checks the code and, on success, starts the session. */
export function useCheckOtp() {
  return useMutation<CheckOtpResponse, ApiError, { mobile: string; code: string }>({
    mutationFn: checkOtp,
    onSuccess: ({ user }) => startSession(user),
  });
}
