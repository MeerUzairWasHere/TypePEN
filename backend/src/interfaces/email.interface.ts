import { CompanyService } from "../services/company.service";
import {
  ResetPasswordEmailDto,
  VerificationEmailDto,
  WelcomeEmailDto,
} from "../dto";

export interface IEmailService {
  loadCompany(companyService: CompanyService): Promise<void>;
  sendResetPasswordEmail(params: ResetPasswordEmailDto): Promise<void>;
  sendVerificationEmail(params: VerificationEmailDto): Promise<void>;
  sendWelcomeEmail(params: WelcomeEmailDto): Promise<void>;
}
