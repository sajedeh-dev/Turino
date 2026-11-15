export interface User {
  id: string;
  firstName: string;
  lastName: string;
  mobile: string;
}

/** POST /api/auth/send-otp. `code` is only present in development. */
export interface SendOtpResponse {
  message: string;
  code?: string;
}

/** POST /api/auth/check-otp. The tokens stay on the server, in HttpOnly cookies. */
export interface CheckOtpResponse {
  user: User;
}
