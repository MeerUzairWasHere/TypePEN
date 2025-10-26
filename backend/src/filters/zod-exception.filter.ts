import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";

export const zodExceptionFilter = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const errors = err.issues.map((error) => ({
      field: error.path.join("."),
      message: error.message,
    }));

    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Validation failed",
      errors,
    });
  }

  // Pass to next error handler
  next(err);
};
