import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors";
import { attachCookiesToResponse } from "../utils";
import {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  TokenUser,
  VerifyEmailInput,
} from "../types";

import { AuthService } from "../services/auth.service";

export class AuthController {
  constructor(private authService: AuthService) {}

  registerUser = async (
    req: Request<{}, {}, RegisterInput>,
    res: Response
  ): Promise<void> => {
    const result = await this.authService.registerUser(
      req.body,
      req.get("origin") || process.env.BASE_URL!
    );

    res.status(StatusCodes.CREATED).json(result);
  };

  login = async (
    req: Request<{}, {}, LoginInput>,
    res: Response<TokenUser>
  ): Promise<void> => {
    const userAgent = req.headers["user-agent"] || "unknown";
    const ip = req.ip;

    if (!ip) {
      throw new BadRequestError("IP address is required");
    }

    const { user, refreshToken } = await this.authService.login(
      req.body,
      userAgent,
      ip
    );

    attachCookiesToResponse({ res, user, refreshToken });

    res.status(StatusCodes.OK).json(user);
  };

  verifyEmail = async (
    req: Request<{}, {}, VerifyEmailInput>,
    res: Response
  ): Promise<void> => {
    const result = await this.authService.verifyEmail(req.body);
    res.status(StatusCodes.OK).json(result);
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    if (!req.user?.id) {
      throw new UnauthenticatedError("User not authenticated");
    }

    const result = await this.authService.logout(req.user);

    res.cookie("accessToken", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.cookie("refreshToken", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json(result);
  };

  forgotPassword = async (
    req: Request<{}, {}, ForgotPasswordInput>,
    res: Response
  ): Promise<void> => {
    const result = await this.authService.forgotPassword(
      req.body,
      req.get("origin") || process.env.BASE_URL!
    );

    res.status(StatusCodes.OK).json(result);
  };

  resetPassword = async (
    req: Request<{}, {}, ResetPasswordInput>,
    res: Response
  ): Promise<void> => {
    const result = await this.authService.resetPassword(req.body);
    res.status(StatusCodes.OK).json(result);
  };
}
