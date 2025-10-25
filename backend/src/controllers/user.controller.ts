import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { UnauthenticatedError } from "../errors";
import { attachCookiesToResponse } from "../utils";
import { TokenUser, UpdatePasswordInput, UpdateUserInput } from "../types";
import { userService } from "../services/container";

export const showCurrentUser = async (
  req: Request,
  res: Response<{ user: TokenUser | null }>
) => {
  if (!req.user?.userId) {
    throw new UnauthenticatedError("User not authenticated");
  }

  const user = await userService.getCurrentUser(Number(req.user.userId));
  res.status(StatusCodes.OK).json({ user });
};

export const updateUser = async (
  req: Request<{}, {}, UpdateUserInput>,
  res: Response<{ user: TokenUser }>
) => {
  if (!req.user?.userId) {
    throw new UnauthenticatedError("User not authenticated");
  }

  const tokenUser = await userService.updateUser(
    Number(req.user.userId),
    req.body
  );

  // Refresh the cookies with updated user info
  attachCookiesToResponse({ res, user: tokenUser, refreshToken: "" });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

export const updateUserPassword = async (
  req: Request<{}, {}, UpdatePasswordInput>,
  res: Response<{ msg: string }>
) => {
  if (!req.user?.userId) {
    throw new UnauthenticatedError("User not authenticated");
  }

  const result = await userService.updateUserPassword(
    Number(req.user.userId),
    req.body
  );

  res.status(StatusCodes.OK).json(result);
};
