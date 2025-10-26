import { NextFunction, Request, Response } from "express";
import { UnauthenticatedError } from "../errors";
import { attachCookiesToResponse, isTokenValid } from "../utils";
import { prismaService } from "../container";

export const authGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { refreshToken, accessToken } = req.signedCookies;

  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken);
      req.user = payload.user;
      return next();
    }

    const payload = isTokenValid(refreshToken);

    const existingToken = await prismaService.token.findFirst({
      where: {
        userId: payload.user.userId,
        refreshToken: payload.refreshToken,
        isValid: true,
      },
    });

    if (!existingToken) {
      throw new UnauthenticatedError("Authentication Invalid");
    }

    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });
    req.user = payload.user;
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
};
