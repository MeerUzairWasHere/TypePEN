import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { CurrentUser } from "../common/decorators";
import { AuthGuard } from "../common/guards";
import {
  TokenUserDto,
  UpdatePasswordInputDto,
  UserUpdateInputDto,
} from "./dto";
import { ZodValidationPipe } from "../pipes/zod-validation.pipe";
import { attachCookiesToResponse } from "../../utils";
import {
  validateUpdatePasswordInput,
  validateUserUpdateInput,
} from "./validators";
import { UsersService } from "./users.service";

@Controller("api/v1/users")
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("current-user")
  @HttpCode(HttpStatus.OK)
  showCurrentUser(@CurrentUser() loggedInUser: TokenUserDto) {
    return this.usersService.getCurrentUser(loggedInUser);
  }

  @Patch("update-user")
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @CurrentUser() loggedInUser: TokenUserDto,
    @Body(new ZodValidationPipe(validateUserUpdateInput))
    body: UserUpdateInputDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const tokenUser = await this.usersService.updateUser(loggedInUser.id, body);

    attachCookiesToResponse({ res, user: tokenUser, refreshToken: "" });

    return { user: tokenUser };
  }

  @Patch("update-user-password")
  @HttpCode(HttpStatus.OK)
  updateUserPassword(
    @CurrentUser() loggedInUser: TokenUserDto,
    @Body(new ZodValidationPipe(validateUpdatePasswordInput))
    body: UpdatePasswordInputDto
  ) {
    return this.usersService.updateUserPassword(loggedInUser.id, body);
  }
}
