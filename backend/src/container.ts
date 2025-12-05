import { AuthController } from "./controllers/auth.controller";
import { CompanyController } from "./controllers/company.controller";
import { UserController } from "./controllers/user.controller";
import { CompanyRepository, UserRepository } from "./repositories";

import {
  AuthService,
  CompanyService,
  EmailService,
  PrismaService,
  UserService,
} from "./services";

// Container to hold all instances
class Container {
  // Database
  public prismaService: PrismaService;

  // Repositories
  public userRepository: UserRepository;
  public companyRepository: CompanyRepository;

  // Services
  public emailService: EmailService;
  public authService: AuthService;
  public userService: UserService;
  public companyService: CompanyService;

  // Controllers
  public authController: AuthController;
  public userController: UserController;
  public companyController: CompanyController;

  constructor() {
    // Initialize Database
    this.prismaService = new PrismaService();

    // Initialize Repositories
    this.userRepository = new UserRepository(this.prismaService);
    this.companyRepository = new CompanyRepository(this.prismaService);

    // Initialize Services
    this.companyService = new CompanyService(this.companyRepository);
    this.emailService = new EmailService(
      process.env.EMAIL_SERVICE_API_KEY!,
      this.companyService
    );
    this.authService = new AuthService(
      this.emailService,
      this.userRepository,
      this.companyService
    );
    this.userService = new UserService(this.userRepository);

    // Initialize Controllers
    this.authController = new AuthController(this.authService);
    this.userController = new UserController(this.userService);
    this.companyController = new CompanyController(this.companyService);
  }
}

// Export singleton instance
export const container = new Container();

// Export individual instances for convenience
export const {
  prismaService,
  userRepository,
  companyRepository,
  emailService,
  authService,
  userService,
  companyService,
  authController,
  userController,
  companyController,
} = container;
