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
      // Use next(error) instead of throw
      return next(new UnauthenticatedError("Authentication Invalid"));
    }

    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });
    req.user = payload.user;
    next();
  } catch (error) {
    // Pass error to next() instead of throwing
    next(new UnauthenticatedError("Authentication Invalid"));
  }
};
