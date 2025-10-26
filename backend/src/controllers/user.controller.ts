import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { UnauthenticatedError } from "../errors";
import { attachCookiesToResponse } from "../utils";
import { TokenUser, UpdatePasswordInput, UserUpdateInput } from "../types";
import { userService } from "../container";

export const showCurrentUser = async (
  req: Request,
  res: Response<TokenUser | null>
) => {
  if (!req.user?.id) {
    throw new UnauthenticatedError("User not authenticated");
  }

  const user = await userService.getCurrentUser(req.user);
  res.status(StatusCodes.OK).json(user);
};

export const updateUser = async (
  req: Request<{}, {}, UserUpdateInput>,
  res: Response<{ user: TokenUser }>
) => {
  if (!req.user?.id) {
    throw new UnauthenticatedError("User not authenticated");
  }

  const tokenUser = await userService.updateUser(req.user.id, req.body);

  attachCookiesToResponse({ res, user: tokenUser, refreshToken: "" });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

export const updateUserPassword = async (
  req: Request<{}, {}, UpdatePasswordInput>,
  res: Response<{ msg: string }>
) => {
  if (!req.user?.id) {
    throw new UnauthenticatedError("User not authenticated");
  }

  const result = await userService.updateUserPassword(req.user.id, req.body);

  res.status(StatusCodes.OK).json(result);
};
