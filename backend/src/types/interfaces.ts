import {
  CompanyCreateInput,
  CompanyUpdateInput,
  TokenUser,
  UpdatePasswordInput,
  UserUpdateInput,
} from ".";

import { CompanyService } from "../services/company.service";
import { Company, PrismaClient } from "@prisma/client";
import {
  ResetPasswordEmailParams,
  VerificationEmailParams,
  WelcomeEmailParams,
} from "./email.types";
import {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  VerifyEmailInput,
} from "../types";

export interface IEmailService {
  loadCompany(companyService: CompanyService): Promise<void>;
  sendResetPasswordEmail(params: ResetPasswordEmailParams): Promise<void>;
  sendVerificationEmail(params: VerificationEmailParams): Promise<void>;
  sendWelcomeEmail(params: WelcomeEmailParams): Promise<void>;
}

export interface ICompanyService {
  createCompany(params: CompanyCreateInput): Promise<Company>;
  getCompany(): Promise<Company | null>;
  updateComany(params: {
    companyId: string;
    data: CompanyUpdateInput;
  }): Promise<Company>;
  deleteCompany(): Promise<void>;
}

export interface IPrismaService extends PrismaClient {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  healthCheck(): Promise<boolean>;
}

export interface IUserService {
  getCurrentUser(tokenUser: TokenUser): Promise<TokenUser | null>;
  updateUser(userId: string, data: UserUpdateInput): Promise<TokenUser>;
  updateUserPassword(
    userId: string,
    data: UpdatePasswordInput
  ): Promise<{ msg: string }>;
  deleteUser(userId: string): Promise<{ msg: string }>;
}

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
