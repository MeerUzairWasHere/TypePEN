// services/container.ts
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
    // Create services in the correct order
    this.prismaService = new PrismaService();
    this.companyService = new CompanyService(this.prismaService.client);
    this.emailService = new EmailService(nodemailerConfig, this.companyService);
    this.userService = new UserService(this.prismaService.client);
    this.authService = new AuthService(
      this.emailService,
      this.prismaService.client
    );
  }

  public static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  // For testing - allow resetting the container
  public static resetInstance(): void {
    ServiceContainer.instance = new ServiceContainer();
  }
}

// Export individual services for convenience
export const {
  companyService,
  emailService,
  authService,
  prismaService,
  userService,
} = ServiceContainer.getInstance();
