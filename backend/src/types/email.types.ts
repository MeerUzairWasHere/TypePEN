import { CompanyService } from "../services/company.service";

export interface CompanyInfo {
  id: string;
  name: string;
  email: string;
  website: string;
  address: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export interface VerificationEmailParams {
  name: string;
  email: string;
  verificationToken: string;
  origin: string;
  expirationHours?: number;
}

export interface ResetPasswordEmailParams {
  name: string;
  email: string;
  token: string;
  origin: string;
  expirationHours?: number;
}

export enum EmailType {
  VERIFICATION = "verification",
  WELCOME = "welcome",
  RESET_PASSWORD = "reset-password",
}

export interface WelcomeEmailParams {
  name: string;
  email: string;
}

export type EmailJobData =
  | { type: EmailType.VERIFICATION; payload: VerificationEmailParams }
  | { type: EmailType.RESET_PASSWORD; payload: ResetPasswordEmailParams }
  | { type: EmailType.WELCOME; payload: WelcomeEmailParams };

// types/email.types.ts
export interface IEmailService {
  loadCompany(companyService: CompanyService): Promise<void>;
  sendResetPasswordEmail(params: ResetPasswordEmailParams): Promise<void>;
  sendVerificationEmail(params: VerificationEmailParams): Promise<void>;
  sendWelcomeEmail(params: WelcomeEmailParams): Promise<void>;
}
