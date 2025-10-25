import { EmailService } from "./email.service";
import { AuthService } from "./auth.service";
import { CompanyService } from "./company.service";
import { nodemailerConfig } from "../configs/nodemailer";
import { PrismaService } from "./prisma.service";
import { UserService } from "./user.service";

export class ServiceContainer {
  private static instance: ServiceContainer;

  public readonly companyService: CompanyService;
  public readonly emailService: EmailService;
  public readonly authService: AuthService;
  public readonly prismaService: PrismaService;
  public readonly userService: UserService;

  private constructor() {
    this.prismaService = new PrismaService();
    this.companyService = new CompanyService(this.prismaService);
    this.emailService = new EmailService(nodemailerConfig, this.companyService);
    this.userService = new UserService(this.prismaService);
    this.authService = new AuthService(this.emailService, this.prismaService);
  }

  public static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  public static resetInstance(): void {
    ServiceContainer.instance = new ServiceContainer();
  }
}

export const {
  companyService,
  emailService,
  authService,
  prismaService,
  userService,
} = ServiceContainer.getInstance();
