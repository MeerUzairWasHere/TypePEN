import { z } from "zod";

export interface TokenUser {
  name: string;
  userId: number;
  role: string;
}

export enum Role {
  USER = "user",
  ADMIN = "admin",
}

// Updated Zod schemas for each validation set
export const validateRegisterInput = z.object({
  name: z
    .string()
    .min(1, { message: "name is required" })
    .min(2, { message: "name must be at least 2 characters long" }),

  email: z.email().min(1, { message: "email is required" }),
  password: z
    .string()
    .min(1, { message: "password is required" })
    .min(8, { message: "password must be at least 8 characters long" })
    .max(20, { message: "password must be at most 20 characters long" }),
});

// Infer the TypeScript type for the `validateRegisterInput` schema
export type RegisterInput = z.infer<typeof validateRegisterInput>;

export const validateLoginInput = z.object({
  email: z.email({ message: "invalid email format" }),
  password: z.string(),
});
export type LoginInput = z.infer<typeof validateLoginInput>;

export const validateUpdateUserInput = z.object({
  name: z.string(),
  email: z.email({ message: "invalid email format" }),
});
export type UpdateUserInput = z.infer<typeof validateUpdateUserInput>;

export const validateUpdatePasswordInput = z.object({
  oldPassword: z.string(),
  newPassword: z
    .string()
    .min(8, { message: "password must be at least 8 characters long" }),
});
export type UpdatePasswordInput = z.infer<typeof validateUpdatePasswordInput>;

export const validateVerifyEmailInput = z.object({
  verificationToken: z.string(),
  email: z.email({ message: "invalid email format" }),
});
export type VerifyEmailInput = z.infer<typeof validateVerifyEmailInput>;

export const validateForgotPasswordInput = z.object({
  email: z.email({ message: "invalid email format" }),
});
export type ForgotPasswordInput = z.infer<typeof validateForgotPasswordInput>;

export const validateResetPasswordInput = z.object({
  token: z.string(),
  newPassword: z
    .string()
    .min(8, { message: "password must be at least 8 characters long" }),
  email: z.email({ message: "invalid email format" }),
});
export type ResetPasswordInput = z.infer<typeof validateResetPasswordInput>;

export const validateAddCompanyInput = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "name is required" }),
  address: z.string().min(1, { message: "address is required" }),
  website: z.string().min(1, { message: "website is required" }),
  phone: z.string().min(1, { message: "phone is required" }),
  email: z.email().min(1, { message: "email is required" }),
  createdAt: z.string().min(1, { message: "createdAt is required" }),
  updatedAt: z.string().min(1, { message: "updatedAt is required" }),
});
export type AddCompanyInput = z.infer<typeof validateAddCompanyInput>;
