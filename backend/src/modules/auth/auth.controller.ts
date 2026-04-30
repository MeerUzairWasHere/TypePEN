import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Request, Response } from "express";
import {
  ForgotPasswordInputDto,
  LoginInputDto,
  RegisterInputDto,
  ResetPasswordInputDto,
  TokenUserDto,
  VerifyEmailInputDto,
} from "./dto";
import { CurrentUser } from "../common/decorators";
import { AuthGuard } from "../common/guards";
import { attachCookiesToResponse } from "../../utils";
import { ZodValidationPipe } from "../pipes/zod-validation.pipe";
import {
  validateForgotPasswordInput,
  validateLoginInput,
  validateRegisterInput,
  validateResetPasswordInput,
  validateVerifyEmailInput,
} from "./validators";
import { AuthService } from "./auth.service";

@Controller("api/v1/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  registerUser(
    @Body(new ZodValidationPipe(validateRegisterInput)) body: RegisterInputDto,
    @Req() req: Request
  ) {
    return this.authService.registerUser(
      body,
      req.get("origin") || process.env.BASE_URL || ""
    );
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(new ZodValidationPipe(validateLoginInput)) body: LoginInputDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const userAgent = req.headers["user-agent"] || "unknown";
    const ip = req.ip;

    if (!ip) {
      throw new BadRequestException("IP address is required");
    }

    const { user, refreshToken } = await this.authService.login(
      body,
      userAgent,
      ip
    );

    attachCookiesToResponse({ res, user, refreshToken });

    return user;
  }

  @Delete("logout")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser() loggedInUser: TokenUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.logout(loggedInUser);

    res.cookie("accessToken", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.cookie("refreshToken", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });

    return result;
  }

  @Post("verify-email")
  @HttpCode(HttpStatus.OK)
  verifyEmail(
    @Body(new ZodValidationPipe(validateVerifyEmailInput))
    body: VerifyEmailInputDto
  ) {
    return this.authService.verifyEmail(body);
  }

  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  forgotPassword(
    @Body(new ZodValidationPipe(validateForgotPasswordInput))
    body: ForgotPasswordInputDto,
    @Req() req: Request
  ) {
    return this.authService.forgotPassword(
      body,
      req.get("origin") || process.env.BASE_URL || ""
    );
  }

  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  resetPassword(
    @Body(new ZodValidationPipe(validateResetPasswordInput))
    body: ResetPasswordInputDto
  ) {
    return this.authService.resetPassword(body);
  }
}
