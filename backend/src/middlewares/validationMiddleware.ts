import { Request, Response, NextFunction } from "express";
import { BadRequestError, UnauthorizedError } from "../errors";
import { z, ZodSchema } from "zod";
import {
  validateForgotPasswordInput,
  validateLoginInput,
  validateRegisterInput,
  validateResetPasswordInput,
  validateUpdatePasswordInput,
  validateUpdateUserInput,
  validateVerifyEmailInput,
} from "../types";

// Utility function to handle Zod validation errors
const withValidationErrors =
  <T>(schema: ZodSchema<T>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse and validate the request body with the provided schema
      await schema.parseAsync(req.body);
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorMessages = err.errors.map((error) => error.message);
        const firstMessage = errorMessages[0];

        if (firstMessage.startsWith("not authorized")) {
          throw new UnauthorizedError("not authorized to access this route");
        }
        throw new BadRequestError(errorMessages.join(", "));
      }
      next(err);
    }
  };

// Apply validation middleware
export const validateRegisterInputMiddleware = withValidationErrors(
  validateRegisterInput
);

export const validateResetPasswordInputMiddleware = withValidationErrors(
  validateResetPasswordInput
);

export const validateForgotPasswordInputMiddleware = withValidationErrors(
  validateForgotPasswordInput
);

export const validateVerifyEmailInputMiddleware = withValidationErrors(
  validateVerifyEmailInput
);

export const validateUpdatePasswordInputMiddleware = withValidationErrors(
  validateUpdatePasswordInput
);

export const validateUpdateUserInputMiddleware = withValidationErrors(
  validateUpdateUserInput
);

export const validateLoginInputMiddleware =
  withValidationErrors(validateLoginInput);
