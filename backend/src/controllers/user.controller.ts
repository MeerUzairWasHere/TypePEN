import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { UnauthenticatedError } from "../errors";
import { attachCookiesToResponse } from "../utils";
import {
  TokenUserDto,
  UpdatePasswordInputDto,
  UserUpdateInputDto,
} from "../dto";
import { userService } from "../container";

export const showCurrentUser = async (
  req: Request,
  res: Response<TokenUserDto | null>
) => {
  if (!req.user?.id) {
    throw new UnauthenticatedError("User not authenticated");
  }

  const user = await userService.getCurrentUser(req.user);
  res.status(StatusCodes.OK).json(user);
};

export const updateUser = async (
  req: Request<{}, {}, UserUpdateInputDto>,
  res: Response<{ user: TokenUserDto }>
) => {
  if (!req.user?.id) {
    throw new UnauthenticatedError("User not authenticated");
  }

  const tokenUser = await userService.updateUser(req.user.id, req.body);

  attachCookiesToResponse({ res, user: tokenUser, refreshToken: "" });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

export const updateUserPassword = async (
  req: Request<{}, {}, UpdatePasswordInputDto>,
  res: Response<{ msg: string }>
) => {
  if (!req.user?.id) {
    throw new UnauthenticatedError("User not authenticated");
  }

  const result = await userService.updateUserPassword(req.user.id, req.body);

  res.status(StatusCodes.OK).json(result);
};
