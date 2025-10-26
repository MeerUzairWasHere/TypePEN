import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export const jwtExceptionFilter = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Handle JWT token expired
  if (err instanceof TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      msg: "Token has expired. Please login again.",
    });
  }

  // Handle invalid JWT token
  if (err instanceof JsonWebTokenError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      msg: "Invalid token. Please login again.",
    });
  }

  // Pass to next error handler
  next(err);
};
