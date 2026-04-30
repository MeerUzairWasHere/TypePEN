import { Module } from "@nestjs/common";
import { CompanyModule } from "../company/company.module";
import { EmailService } from "./email.service";

@Module({
  imports: [CompanyModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
