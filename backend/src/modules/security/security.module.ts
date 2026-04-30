import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { AuthGuard, RolesGuard, VerifiedGuard } from "../common/guards";

@Module({
  imports: [DatabaseModule],
  providers: [AuthGuard, RolesGuard, VerifiedGuard],
  exports: [AuthGuard, RolesGuard, VerifiedGuard],
})
export class SecurityModule {}
