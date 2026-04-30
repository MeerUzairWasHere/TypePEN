import { Module } from "@nestjs/common";
import { SecurityModule } from "../security/security.module";
import { CompanyController } from "./company.controller";
import { CompanyRepository } from "./company.repository";
import { CompanyService } from "./company.service";

@Module({
  imports: [SecurityModule],
  controllers: [CompanyController],
  providers: [CompanyRepository, CompanyService],
  exports: [CompanyRepository, CompanyService],
})
export class CompanyModule {}
