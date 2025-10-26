import { z } from "zod";

import {
  validateForgotPasswordInput,
  validateLoginInput,
  validateRegisterInput,
  validateResetPasswordInput,
  validateUpdatePasswordInput,
  validateVerifyEmailInput,
} from "../validators";

export type RegisterInputDto = z.infer<typeof validateRegisterInput>;
export type LoginInputDto = z.infer<typeof validateLoginInput>;
export type UpdatePasswordInputDto = z.infer<
  typeof validateUpdatePasswordInput
>;
export type VerifyEmailInputDto = z.infer<typeof validateVerifyEmailInput>;
export type ForgotPasswordInputDto = z.infer<
  typeof validateForgotPasswordInput
>;
export type ResetPasswordInputDto = z.infer<typeof validateResetPasswordInput>;
