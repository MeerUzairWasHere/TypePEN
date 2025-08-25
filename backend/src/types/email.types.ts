export interface CompanyInfo {
  name: string;
  email: string;
  website?: string;
  address?: string;
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
