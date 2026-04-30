export interface EmailOptionsDto {
  to: string;
  subject: string;
  html: string;
}

export interface VerificationEmailDto {
  name: string;
  email: string;
  verificationToken: string;
  origin: string;
  expirationHours?: number;
}

export interface ResetPasswordEmailDto {
  name: string;
  email: string;
  token: string;
  origin: string;
  expirationHours?: number;
}

export enum EmailTypeDto {
  VERIFICATION = "verification",
  WELCOME = "welcome",
  RESET_PASSWORD = "reset-password",
}

export interface WelcomeEmailDto {
  name: string;
  email: string;
}

export type EmailJobDto =
  | { type: EmailTypeDto.VERIFICATION; payload: VerificationEmailDto }
  | { type: EmailTypeDto.RESET_PASSWORD; payload: ResetPasswordEmailDto }
  | { type: EmailTypeDto.WELCOME; payload: WelcomeEmailDto };
