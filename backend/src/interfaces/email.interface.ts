import { CompanyService } from "../services/company.service";
import {
  ResetPasswordEmailParams,
  VerificationEmailParams,
  WelcomeEmailParams,
} from "../types/email.types";

export interface IEmailService {
  loadCompany(companyService: CompanyService): Promise<void>;
  sendResetPasswordEmail(params: ResetPasswordEmailParams): Promise<void>;
  sendVerificationEmail(params: VerificationEmailParams): Promise<void>;
  sendWelcomeEmail(params: WelcomeEmailParams): Promise<void>;
}
