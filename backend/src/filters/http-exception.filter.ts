import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export const httpExceptionFilter = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log detailed errors in development mode
  if (process.env.NODE_ENV === "development") {
    console.error("Error Stack:", err.stack);
    console.error("Error Details:", err);
  }

  // Default error response
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || "Something went wrong, try again later";

  return res.status(statusCode).json({
    msg: message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      details: err,
    }),
  });
};
