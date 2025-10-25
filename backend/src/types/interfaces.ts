import {
  CompanyInput,
  TokenUser,
  UpdatePasswordInput,
  UpdateUserInput,
} from ".";
import { CompanyService } from "../services/company.service";
import { PrismaClient } from "@prisma/client";
import {
  CompanyInfo,
  ResetPasswordEmailParams,
  VerificationEmailParams,
  WelcomeEmailParams,
} from "./email.types";

export interface IEmailService {
  loadCompany(companyService: CompanyService): Promise<void>;
  sendResetPasswordEmail(params: ResetPasswordEmailParams): Promise<void>;
  sendVerificationEmail(params: VerificationEmailParams): Promise<void>;
  sendWelcomeEmail(params: WelcomeEmailParams): Promise<void>;
}

export interface ICompanyService {
  createCompany(params: { data: CompanyInput }): Promise<CompanyInfo>;
  getCompany(): Promise<CompanyInfo>;
  updateComany(params: {
    companyId: string;
    data: CompanyInput;
  }): Promise<CompanyInfo>;
  deleteCompany(): Promise<void>;
}

export interface IPrismaService extends PrismaClient {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  healthCheck(): Promise<boolean>;
}

export interface IUserService {
  getCurrentUser(userId: number): Promise<TokenUser | null>;
  updateUser(userId: number, data: UpdateUserInput): Promise<TokenUser>;
  updateUserPassword(
    userId: number,
    data: UpdatePasswordInput
  ): Promise<{ msg: string }>;
  deleteUser(userId: number): Promise<{ msg: string }>;
  getUserProfile(userId: number): Promise<{
    id: number;
    name: string;
    email: string;
    role: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  } | null>;
}
