import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { Prisma } from "@prisma/client";

interface CustomError {
  statusCode: number;
  msg: string;
}

const errorHandlerMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  let customError: CustomError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, try again later",
  };

  // Handle Prisma known request errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        // @ts-ignore
        customError.msg = `Duplicate entry: A record with the same ${err.meta.target.join(
          ", "
        )} already exists.`;
        customError.statusCode = StatusCodes.BAD_REQUEST;
        break;

      case "P2003":
        customError.msg = `Foreign key constraint failed: Invalid reference to another table.`;
        customError.statusCode = StatusCodes.BAD_REQUEST;
        break;

      case "P2025":
        customError.msg = `Record not found: The requested record does not exist.`;
        customError.statusCode = StatusCodes.NOT_FOUND;
        break;

      case "P2016":
        customError.msg = `Query interpretation error: ${
          err.meta?.message || "Invalid query syntax or missing fields."
        }`;
        customError.statusCode = StatusCodes.BAD_REQUEST;
        break;

      case "P2001":
        customError.msg = `Record does not exist: The filtered record does not exist.`;
        customError.statusCode = StatusCodes.NOT_FOUND;
        break;

      case "P2014":
        customError.msg = `Required relation violation: ${
          err.meta?.message || "A required relation is missing."
        }`;
        customError.statusCode = StatusCodes.BAD_REQUEST;
        break;

      case "P2015":
        customError.msg = `Missing required value: ${
          err.meta?.message || "A required field is NULL or missing."
        }`;
        customError.statusCode = StatusCodes.BAD_REQUEST;
        break;

      default:
        customError.msg = `Prisma error: ${err.message}`;
        customError.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        break;
    }
  }

  // Handle Prisma unknown request errors
  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    customError.msg = `Database error: ${err.message}`;
    customError.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }

  // Handle Prisma validation errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    customError.msg = `Validation error: ${err.message}`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // Handle validation errors (e.g., Mongoose)
  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item: any) => item.message)
      .join(",");
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // Handle cast errors (e.g., invalid ObjectId)
  if (err.name === "CastError") {
    customError.msg = `Invalid value: ${err.value}`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // Handle rate-limiting errors
  if (err.statusCode === 429) {
    customError.msg = "Too many requests. Please try again later.";
    customError.statusCode = StatusCodes.TOO_MANY_REQUESTS;
  }

  // Log detailed errors in development mode
  if (process.env.NODE_ENV === "development") {
    console.error("Error Stack:", err.stack);
  }

  // Send the error response
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

export default errorHandlerMiddleware;
