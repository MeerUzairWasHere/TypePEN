import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { attachCookiesToResponse } from "../utils";
import {
  TokenUserDto,
  UpdatePasswordInputDto,
  UserUpdateInputDto,
} from "../dto";
import { IUserService } from "../interfaces";
import { currentUser } from "../decorators";

export class UserController {
  constructor(private userService: IUserService) {}

  public showCurrentUser = async (
    req: Request,
    res: Response<TokenUserDto | null>
  ): Promise<void> => {
    const loggedInUser = currentUser(req);

    const user = await this.userService.getCurrentUser(loggedInUser);

    res.status(StatusCodes.OK).json(user);
  };

  public updateUser = async (
    req: Request<{}, {}, UserUpdateInputDto>,
    res: Response<{ user: TokenUserDto }>
  ): Promise<void> => {
    const { id } = currentUser(req);

    const tokenUser = await this.userService.updateUser(id, req.body);

    attachCookiesToResponse({ res, user: tokenUser, refreshToken: "" });

    res.status(StatusCodes.OK).json({ user: tokenUser });
  };

  public updateUserPassword = async (
    req: Request<{}, {}, UpdatePasswordInputDto>,
    res: Response<{ msg: string }>
  ): Promise<void> => {
    const { id } = currentUser(req);

    const result = await this.userService.updateUserPassword(id, req.body);

    res.status(StatusCodes.OK).json(result);
  };
}
