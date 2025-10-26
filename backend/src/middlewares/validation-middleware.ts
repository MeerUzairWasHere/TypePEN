import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors";
import { z, ZodType } from "zod";
import {
  validateCompanyCreateInput,
  validateForgotPasswordInput,
  validateLoginInput,
  validateRegisterInput,
  validateResetPasswordInput,
  validateUpdatePasswordInput,
  validateUserUpdateInput,
  validateVerifyEmailInput,
} from "../types";

const isEmpty = (obj: object): boolean => {
  return Object.keys(obj).length === 0;
};

// Utility function to handle Zod validation errors
const withValidationErrors =
  <T>(schema: ZodType<T>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (isEmpty(req.body)) {
        throw new BadRequestError("Please provide a valid request body");
      }
      await schema.parseAsync(req.body);

      next();
    } catch (err) {
      if (err instanceof z.core.$ZodError) {
        const errorMessages = err.issues.map(
          (error: z.core.$ZodIssue) => error.message
        );

        throw new BadRequestError(errorMessages.join(", "));
      }
      next(err);
    }
  };

// Apply validation middleware
export const validateRegisterInputMiddleware = withValidationErrors(
  validateRegisterInput
);

export const validateLoginInputMiddleware =
  withValidationErrors(validateLoginInput);

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
  validateUserUpdateInput
);

export const validateCompanyInputMiddleware = withValidationErrors(
  validateCompanyCreateInput
);
