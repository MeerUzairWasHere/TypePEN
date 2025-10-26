import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors";
import { attachCookiesToResponse } from "../utils";
import {
  ForgotPasswordInputDto,
  LoginInputDto,
  RegisterInputDto,
  ResetPasswordInputDto,
  TokenUserDto,
  VerifyEmailInputDto,
} from "../dto";

import { IAuthService } from "../interfaces";
import { currentUser } from "../decorators";

export class AuthController {
  constructor(private authService: IAuthService) {}

  registerUser = async (
    req: Request<{}, {}, RegisterInputDto>,
    res: Response
  ): Promise<void> => {
    const result = await this.authService.registerUser(
      req.body,
      req.get("origin") || process.env.BASE_URL!
    );

    res.status(StatusCodes.CREATED).json(result);
  };

  login = async (
    req: Request<{}, {}, LoginInputDto>,
    res: Response<TokenUserDto>
  ): Promise<void> => {
    // TODO: create one decorator for this
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
    req: Request<{}, {}, VerifyEmailInputDto>,
    res: Response
  ): Promise<void> => {
    const result = await this.authService.verifyEmail(req.body);
    res.status(StatusCodes.OK).json(result);
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    const loggedInUser = currentUser(req);

    const result = await this.authService.logout(loggedInUser);

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
    req: Request<{}, {}, ForgotPasswordInputDto>,
    res: Response
  ): Promise<void> => {
    const result = await this.authService.forgotPassword(
      req.body,
      req.get("origin") || process.env.BASE_URL!
    );

    res.status(StatusCodes.OK).json(result);
  };

  resetPassword = async (
    req: Request<{}, {}, ResetPasswordInputDto>,
    res: Response
  ): Promise<void> => {
    const result = await this.authService.resetPassword(req.body);
    res.status(StatusCodes.OK).json(result);
  };
}
