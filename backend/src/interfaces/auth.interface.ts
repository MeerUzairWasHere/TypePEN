import {
  ForgotPasswordInputDto,
  LoginInputDto,
  RegisterInputDto,
  ResetPasswordInputDto,
  VerifyEmailInputDto,
  TokenUserDto,
} from "../dto";

export interface IAuthService {
  registerUser(
    data: RegisterInputDto,
    origin: string
  ): Promise<{
    msg: string;
  }>;

  login(
    data: LoginInputDto,
    userAgent: string,
    ip: string
  ): Promise<{
    user: TokenUserDto;
    refreshToken: string;
  }>;

  verifyEmail(data: VerifyEmailInputDto): Promise<{ msg: string }>;

  logout(tokenUser: TokenUserDto): Promise<{ msg: string }>;

  forgotPassword(
    data: ForgotPasswordInputDto,
    origin: string
  ): Promise<
    | { msg: string }
    | { name: string; email: string; token: string; origin: string }
  >;

  resetPassword(data: ResetPasswordInputDto): Promise<{ msg: string }>;
}
