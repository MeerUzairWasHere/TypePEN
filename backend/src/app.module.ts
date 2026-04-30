import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module";
import { CompanyModule } from "./modules/company/company.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
  imports: [AuthModule, UsersModule, CompanyModule],
})
export class AppModule {}
