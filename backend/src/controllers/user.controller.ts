import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { attachCookiesToResponse } from "../utils";
import {
  TokenUserDto,
  UpdatePasswordInputDto,
  UserUpdateInputDto,
} from "../dto";
import { userService } from "../container";
import { currentUser } from "../decorators";

export const showCurrentUser = async (
  req: Request,
  res: Response<TokenUserDto | null>
) => {
  const loggedInUser = currentUser(req);

  const user = await userService.getCurrentUser(loggedInUser);

  res.status(StatusCodes.OK).json(user);
};

export const updateUser = async (
  req: Request<{}, {}, UserUpdateInputDto>,
  res: Response<{ user: TokenUserDto }>
) => {
  const { id } = currentUser(req);

  const tokenUser = await userService.updateUser(id, req.body);

  attachCookiesToResponse({ res, user: tokenUser, refreshToken: "" });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

export const updateUserPassword = async (
  req: Request<{}, {}, UpdatePasswordInputDto>,
  res: Response<{ msg: string }>
) => {
  const { id } = currentUser(req);

  const result = await userService.updateUserPassword(id, req.body);

  res.status(StatusCodes.OK).json(result);
};
