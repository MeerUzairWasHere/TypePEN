import { StatusCodes } from "http-status-codes";

export class NotFoundError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

export class BadRequestError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export class UnauthenticatedError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "UnauthenticatedError";
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export class UnauthorizedError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

export class ConflictError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
    this.statusCode = StatusCodes.CONFLICT;
  }
}

export class ForbiddenError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "ForbiddenError";
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

export class NoContent extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "NoContent";
    this.statusCode = StatusCodes.NO_CONTENT;
  }
}
