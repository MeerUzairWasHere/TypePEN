import { Request, Response, NextFunction } from "express";
import { UnauthenticatedError, UnauthorizedError } from "../errors";
import { attachCookiesToResponse, isTokenValid } from "../utils/index.js";
import { prismaClient } from "../db";

// Middleware to authenticate a user
export const authenticateUser = async (
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

    const existingToken = await prismaClient.token.findFirst({
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

// Middleware to authorize a user based on roles
export const authorizePermissions = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req?.user) {
      throw new UnauthorizedError("Unauthorized to access this route");
    }
    if (!roles.includes(req?.user?.role)) {
      throw new UnauthorizedError("Unauthorized to access this route");
    }
    next();
  };
};
