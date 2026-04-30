import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";
import type postgres from "postgres";
import { ZodError } from "zod";

interface ErrorResponse {
  statusCode: number;
  message: string;
  errors?: unknown;
  stack?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { statusCode, errorResponse } = this.formatException(exception);

    if (process.env.NODE_ENV === "development") {
      errorResponse.stack =
        exception instanceof Error ? exception.stack : undefined;
      console.error({
        error: exception,
        path: request.url,
        method: request.method,
      });
    }

    response.status(statusCode).json(errorResponse);
  }

  private formatException(exception: unknown): {
    statusCode: number;
    errorResponse: ErrorResponse;
  } {
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const response = exception.getResponse();

      return {
        statusCode,
        errorResponse: {
          statusCode,
          message:
            typeof response === "string"
              ? response
              : (
                  response as { message?: string | string[] }
                ).message?.toString() || exception.message,
        },
      };
    }

    if (exception instanceof ZodError) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        errorResponse: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Validation failed",
          errors: exception.issues,
        },
      };
    }

    if (this.isPostgresError(exception)) {
      return this.formatPostgresError(exception);
    }

    const error = exception as Error & {
      statusCode?: number;
      retryAfter?: string;
    };
    const statusCode = error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

    return {
      statusCode,
      errorResponse: {
        statusCode,
        message: error.message || "Internal server error",
      },
    };
  }

  private isPostgresError(error: unknown): error is postgres.PostgresError {
    return (
      error instanceof Error &&
      error.name === "PostgresError" &&
      typeof (error as Partial<postgres.PostgresError>).code === "string"
    );
  }

  private formatPostgresError(error: postgres.PostgresError): {
    statusCode: number;
    errorResponse: ErrorResponse;
  } {
    if (error.code === "23505") {
      return {
        statusCode: HttpStatus.CONFLICT,
        errorResponse: {
          statusCode: HttpStatus.CONFLICT,
          message: "Duplicate value violates unique constraint",
          errors: {
            constraint: error.constraint_name,
            detail: error.detail,
          },
        },
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      errorResponse: {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Database error",
      },
    };
  }
}
