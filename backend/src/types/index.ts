import { z } from "zod";
import { Role } from "@prisma/client";

export interface TokenUser {
  id: string;
  name: string;
  role: string;
  email: string;
}

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
export type RegisterInput = z.infer<typeof validateRegisterInput>;

export const validateLoginInput = z.object({
  email: z
    .email({ message: "Invalid email format" })
    .min(1, { message: "email is required" }),
  password: z
    .string("password is required")
    .min(1, { message: "password is required" }),
});
export type LoginInput = z.infer<typeof validateLoginInput>;

export const validateUpdatePasswordInput = z.object({
  oldPassword: z
    .string("oldPassword is required")
    .min(1, { message: "oldPassword is required" }),
  newPassword: z
    .string("newPassword is required")
    .min(8, { message: "newPassword must be at least 8 characters long" })
    .max(20, { message: "newPassword must be at most 20 characters long" }),
});
export type UpdatePasswordInput = z.infer<typeof validateUpdatePasswordInput>;

export const validateVerifyEmailInput = z.object({
  verificationToken: z
    .string("verificationToken is required")
    .min(1, { message: "verificationToken is required" }),
  email: z
    .email({ message: "Invalid email format" })
    .min(1, { message: "email is required" }),
});
export type VerifyEmailInput = z.infer<typeof validateVerifyEmailInput>;

export const validateForgotPasswordInput = z.object({
  email: z
    .email({ message: "Invalid email format" })
    .min(1, { message: "email is required" }),
});
export type ForgotPasswordInput = z.infer<typeof validateForgotPasswordInput>;

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
export type ResetPasswordInput = z.infer<typeof validateResetPasswordInput>;

//#endregion

//#region User

export const validateUserCreateInput = z.object({
  username: z
    .string("username is required")
    .min(4, { message: "username must be at least 4 characters long" })
    .max(20, { message: "username must be at most 20 characters long" }),
  name: z
    .string("name is required")
    .min(2, { message: "name must be at least 2 characters long" })
    .max(255, { message: "name must be at most 255 characters long" }),
  email: z
    .email({ message: "Invalid email format" })
    .min(1, { message: "email is required" }),
  password: z
    .string("password is required")
    .min(8, { message: "password must be at least 8 characters long" })
    .max(255, { message: "password must be at most 255 characters long" }),
  role: z.enum(Role).default(Role.User),
  isVerified: z.boolean().default(false).optional(),
  verificationToken: z.string().max(255).optional().nullable(),
  passwordToken: z.string().max(255).optional().nullable(),
  passwordTokenExpirationDate: z.date().optional().nullable(),
  verified: z.date().optional().nullable(),
});
export type UserCreateInput = z.infer<typeof validateUserCreateInput>;

export const validateUserUpdateInput = z.object({
  username: z
    .string()
    .min(4, { message: "username must be at least 4 characters long" })
    .max(20, { message: "username must be at most 20 characters long" })
    .optional(),
  name: z
    .string()
    .min(2, { message: "name must be at least 2 characters long" })
    .max(255, { message: "name must be at most 255 characters long" })
    .optional(),
  email: z.email({ message: "Invalid email format" }).optional(),
  password: z
    .string()
    .min(8, { message: "password must be at least 8 characters long" })
    .max(255, { message: "password must be at most 255 characters long" })
    .optional(),
  role: z.enum(Role).optional(),
  isVerified: z.boolean().optional(),
  verificationToken: z.string().max(255).optional().nullable(),
  passwordToken: z.string().max(255).optional().nullable(),
  passwordTokenExpirationDate: z.date().optional().nullable(),
  verified: z.date().optional().nullable(),
});
export type UserUpdateInput = z.infer<typeof validateUserUpdateInput>;

//#endregion

//#region Company

export const validateCompanyCreateInput = z.object({
  name: z
    .string("name is required")
    .min(1, { message: "name is required" })
    .max(255, { message: "name must be at most 255 characters long" }),
  address: z
    .string("address is required")
    .min(1, { message: "address is required" })
    .max(255, { message: "address must be at most 255 characters long" }),
  website: z
    .url({ message: "Invalid website URL format" })
    .min(1, { message: "website is required" })
    .max(255, { message: "website must be at most 255 characters long" }),
  phone: z
    .string("phone is required")
    .min(1, { message: "phone is required" })
    .max(255, { message: "phone must be at most 255 characters long" }),
  email: z
    .email({ message: "Invalid email format" })
    .min(1, { message: "email is required" })
    .max(255, { message: "email must be at most 255 characters long" }),
});
export type CompanyCreateInput = z.infer<typeof validateCompanyCreateInput>;

export const validateCompanyUpdateInput = validateCompanyCreateInput.partial();
export type CompanyUpdateInput = z.infer<typeof validateCompanyUpdateInput>;

//#endregion
