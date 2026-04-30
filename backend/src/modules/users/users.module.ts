import { Module } from "@nestjs/common";
import { SecurityModule } from "../security/security.module";
import { UsersController } from "./users.controller";
import { UserRepository } from "./users.repository";
import { UsersService } from "./users.service";

@Module({
  imports: [SecurityModule],
  controllers: [UsersController],
  providers: [UserRepository, UsersService],
  exports: [UserRepository, UsersService],
})
export class UsersModule {}
