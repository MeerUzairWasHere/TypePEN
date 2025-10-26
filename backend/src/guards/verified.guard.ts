import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../errors";

export const verifiedGuard = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new ForbiddenError("User not authenticated"));
  }

  if (!req.user.isVerified) {
    return next(new ForbiddenError("Please verify your email first"));
  }

  next();
};
