import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export const notFoundFilter = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(StatusCodes.NOT_FOUND).json({
    msg: `Route ${req.originalUrl} not found`,
  });
};
