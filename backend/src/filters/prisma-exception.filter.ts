// ============================================
// src/filters/prisma-exception.filter.ts
// ============================================
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { Prisma } from "@prisma/client";

export const prismaExceptionFilter = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Handle Prisma known request errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    let message = err.message;

    switch (err.code) {
      case "P2002":
        // Unique constraint violation
        const target = (err.meta?.target as string[]) || [];
        message = `Duplicate entry: A record with the same ${target.join(
          ", "
        )} already exists.`;
        statusCode = StatusCodes.BAD_REQUEST;
        break;

      case "P2003":
        // Foreign key constraint failed
        message = `Foreign key constraint failed: Invalid reference to another table.`;
        statusCode = StatusCodes.BAD_REQUEST;
        break;

      case "P2025":
        // Record not found
        message = `Record not found: The requested record does not exist.`;
        statusCode = StatusCodes.NOT_FOUND;
        break;

      case "P2016":
        // Query interpretation error
        message = `Query interpretation error: ${
          err.meta?.message || "Invalid query syntax or missing fields."
        }`;
        statusCode = StatusCodes.BAD_REQUEST;
        break;

      case "P2001":
        // Record does not exist
        message = `Record does not exist: The filtered record does not exist.`;
        statusCode = StatusCodes.NOT_FOUND;
        break;

      case "P2014":
        // Required relation violation
        message = `Required relation violation: ${
          err.meta?.message || "A required relation is missing."
        }`;
        statusCode = StatusCodes.BAD_REQUEST;
        break;

      case "P2015":
        // Missing required value
        message = `Missing required value: ${
          err.meta?.message || "A required field is NULL or missing."
        }`;
        statusCode = StatusCodes.BAD_REQUEST;
        break;

      default:
        message = `Prisma error: ${err.message}`;
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        break;
    }

    return res.status(statusCode).json({ msg: message });
  }

  // Handle Prisma unknown request errors
  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: `Database error: ${err.message}`,
    });
  }

  // Handle Prisma validation errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: `Validation error: ${err.message}`,
    });
  }

  // Pass to next error handler
  next(err);
};
