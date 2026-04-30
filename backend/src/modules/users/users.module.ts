import { Module } from "@nestjs/common";
import { UserRepository } from "../../repositories";
import { SecurityModule } from "../security/security.module";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [SecurityModule],
  controllers: [UsersController],
  providers: [UserRepository, UsersService],
  exports: [UserRepository, UsersService],
})
export class UsersModule {}
