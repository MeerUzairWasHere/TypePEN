import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors";
import { attachCookiesToResponse } from "../utils";
import { authService } from "../services/auth.service";
import {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  TokenUser,
  VerifyEmailInput,
} from "../types";

export const registerUser = async (
  req: Request<{}, {}, RegisterInput>,
  res: Response
) => {
  const result = await authService.registerUser(req.body);
  res.status(StatusCodes.CREATED).json(result);
};

export const login = async (
  req: Request<{}, {}, LoginInput>,
  res: Response<{ user: TokenUser }>
) => {
  const userAgent = req.headers["user-agent"] || "unknown";
  const ip = req.ip;

  if (!ip) {
    throw new BadRequestError("IP address is required");
  }

  const { user, refreshToken } = await authService.login(
    req.body,
    userAgent,
    ip
  );

  attachCookiesToResponse({ res, user, refreshToken });

  res.status(StatusCodes.OK).json({ user });
};

export const verifyEmail = async (
  req: Request<{}, {}, VerifyEmailInput>,
  res: Response
) => {
  const result = await authService.verifyEmail(req.body);
  res.status(StatusCodes.OK).json(result);
};

export const logout = async (req: Request, res: Response) => {
  if (!req.user?.userId) {
    throw new BadRequestError("User ID is required");
  }

  const result = await authService.logout(Number(req.user.userId));

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

export const forgotPassword = async (
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response
) => {
  const result = await authService.forgotPassword(req.body);
  res.status(StatusCodes.OK).json(result);
};

export const resetPassword = async (
  req: Request<{}, {}, ResetPasswordInput>,
  res: Response
) => {
  const result = await authService.resetPassword(req.body);
  res.status(StatusCodes.OK).json(result);
};
