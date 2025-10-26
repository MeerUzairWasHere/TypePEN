import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export const rateLimitExceptionFilter = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if error is from express-rate-limit
  if (
    err.statusCode === StatusCodes.TOO_MANY_REQUESTS ||
    err.statusCode === 429
  ) {
    const retryAfter = err.retryAfter || "15 minutes";

    return res.status(StatusCodes.TOO_MANY_REQUESTS).json({
      msg: err.message || "Too many requests. Please try again later.",
      retryAfter,
    });
  }

  // Handle rate limit errors from custom rate limiters
  if (err.name === "RateLimitError" || err.type === "rate-limit") {
    return res.status(StatusCodes.TOO_MANY_REQUESTS).json({
      msg:
        err.message ||
        "Too many requests from this IP. Please try again later.",
      retryAfter: err.retryAfter || "Unknown",
    });
  }

  // Handle errors with 'Too many' in the message (fallback)
  if (err.message && err.message.toLowerCase().includes("too many")) {
    return res.status(StatusCodes.TOO_MANY_REQUESTS).json({
      msg: err.message,
      retryAfter: err.retryAfter || "Please try again later",
    });
  }

  next(err);
};
