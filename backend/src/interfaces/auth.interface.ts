import { TokenUser } from "../types";

import {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  VerifyEmailInput,
} from "../types";

export interface IAuthService {
  registerUser(
    data: RegisterInput,
    origin: string
  ): Promise<{
    msg: string;
  }>;

  login(
    data: LoginInput,
    userAgent: string,
    ip: string
  ): Promise<{
    user: TokenUser;
    refreshToken: string;
  }>;

  verifyEmail(data: VerifyEmailInput): Promise<{ msg: string }>;

  logout(tokenUser: TokenUser): Promise<{ msg: string }>;

  forgotPassword(
    data: ForgotPasswordInput,
    origin: string
  ): Promise<
    | { msg: string }
    | { name: string; email: string; token: string; origin: string }
  >;

  resetPassword(data: ResetPasswordInput): Promise<{ msg: string }>;
}
