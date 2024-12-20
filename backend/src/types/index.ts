import { z } from "zod";
import { prismaClient } from "../db";

export interface TokenUser {
  name: string;
  userId: number;
  role: string;
}

// Updated Zod schemas for each validation set
export const validateRegisterInput = z.object({
  name: z.string({ required_error: "name is required" }),
  email: z
    .string({ required_error: "email is required" })
    .email({ message: "invalid email format" })
    .refine(
      async (email) => {
        const user = await prismaClient.user.findUnique({ where: { email } });
        return !user;
      },
      { message: "email already exists" }
    ),
  password: z
    .string({ required_error: "password is required" })
    .min(8, { message: "password must be at least 8 characters long" }),
});

// Infer the TypeScript type for the `validateRegisterInput` schema
export type RegisterInput = z.infer<typeof validateRegisterInput>;



export const validateLoginInput = z.object({
  email: z
    .string({ required_error: "email is required" })
    .email({ message: "invalid email format" }),
  password: z.string({ required_error: "password is required" }),
});
export type LoginInput = z.infer<typeof validateLoginInput>;


export const validateUpdateUserInput = z.object({
  name: z.string({ required_error: "name is required" }),
  email: z
    .string({ required_error: "email is required" })
    .email({ message: "invalid email format" })
    .superRefine(async (email, ctx) => {
      const user = await prismaClient.user.findUnique({ where: { email } });
      const reqUserId = user?.id;
      if (user && user.id !== reqUserId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "email already exists",
        });
      }
    }),
});
export type UpdateUserInput = z.infer<typeof validateUpdateUserInput>;


export const validateUpdatePasswordInput = z.object({
  oldPassword: z.string({ required_error: "oldPassword is required" }),
  newPassword: z
    .string({ required_error: "newPassword is required" })
    .min(8, { message: "password must be at least 8 characters long" }),
});
export type UpdatePasswordInput = z.infer<typeof validateUpdatePasswordInput>;


export const validateVerifyEmailInput = z.object({
  verificationToken: z.string({
    required_error: "verificationToken is required",
  }),
  email: z
    .string({ required_error: "email is required" })
    .email({ message: "invalid email format" }),
});
export type VerifyEmailInput = z.infer<typeof validateVerifyEmailInput>;


export const validateForgotPasswordInput = z.object({
  email: z
    .string({ required_error: "email is required" })
    .email({ message: "invalid email format" }),
});
export type ForgotPasswordInput = z.infer<typeof validateForgotPasswordInput>;



export const validateResetPasswordInput = z.object({
  token: z.string({ required_error: "token is required" }),
  newPassword: z
    .string({ required_error: "newPassword is required" })
    .min(8, { message: "password must be at least 8 characters long" }),
  email: z
    .string({ required_error: "email is required" })
    .email({ message: "invalid email format" }),
});
export type ResetPasswordInput = z.infer<typeof validateResetPasswordInput>;
