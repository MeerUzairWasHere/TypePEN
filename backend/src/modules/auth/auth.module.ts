import { Module } from "@nestjs/common";
import { CompanyModule } from "../company/company.module";
import { EmailModule } from "../email/email.module";
import { SecurityModule } from "../security/security.module";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [UsersModule, CompanyModule, EmailModule, SecurityModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
