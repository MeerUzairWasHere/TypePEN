import { z } from "zod";

//#region Auth

export const validateRegisterInput = z.object({
  name: z
    .string("name is required")
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(255, { message: "Name must be at most 255 characters long" }),
  username: z
    .string("username is required")
    .min(4, { message: "username must be at least 4 characters long" })
    .max(20, { message: "username must be at most 20 characters long" }),
  email: z
    .email({ message: "Invalid email format" })
    .min(1, { message: "email is required" }),
  password: z
    .string("password is required")
    .min(8, { message: "password must be at least 8 characters long" })
    .max(20, { message: "password must be at most 20 characters long" }),
});

export const validateLoginInput = z.object({
  email: z
    .email({ message: "Invalid email format" })
    .min(1, { message: "email is required" }),
  password: z
    .string("password is required")
    .min(1, { message: "password is required" }),
});

export const validateUpdatePasswordInput = z.object({
  oldPassword: z
    .string("oldPassword is required")
    .min(1, { message: "oldPassword is required" }),
  newPassword: z
    .string("newPassword is required")
    .min(8, { message: "newPassword must be at least 8 characters long" })
    .max(20, { message: "newPassword must be at most 20 characters long" }),
});

export const validateVerifyEmailInput = z.object({
  verificationToken: z
    .string("verificationToken is required")
    .min(1, { message: "verificationToken is required" }),
  email: z
    .email({ message: "Invalid email format" })
    .min(1, { message: "email is required" }),
});

export const validateForgotPasswordInput = z.object({
  email: z
    .email({ message: "Invalid email format" })
    .min(1, { message: "email is required" }),
});

export const validateResetPasswordInput = z.object({
  token: z.string("token is required").min(1, { message: "Token is required" }),
  newPassword: z
    .string("newPassword is required")
    .min(8, { message: "newPassword must be at least 8 characters long" })
    .max(20, { message: "newPassword must be at most 20 characters long" }),
  email: z
    .email({ message: "Invalid email format" })
    .min(1, { message: "email is required" }),
});

//#endregion
