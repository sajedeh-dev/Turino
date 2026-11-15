import type { Gender } from "@/components/form/gender-field";

/** Bank details for refunds, as the API names them. */
export interface PaymentInfoDto {
  shaba_code?: string;
  debitCard_code?: string;
  accountIdentifier?: string;
}

/**
 * GET /user/profile. A new account returns only `id` and `mobile`; the rest appear once saved.
 */
export interface UserProfileDto {
  id: string;
  mobile: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  gender?: Gender;
  /** ISO date, e.g. "2022-10-02". */
  birthDate?: string;
  nationalCode?: string | number;
  payment?: PaymentInfoDto;
}

/** PUT /user/profile. Every field is optional; each profile section sends only its own. */
export type UpdateProfileDto = Partial<Omit<UserProfileDto, "id">>;

/** GET /user/transactions (shape confirmed against the backend's orderController). */
export interface TransactionDto {
  id: string;
  amount: number;
  type?: string;
  createdAt: string;
}
