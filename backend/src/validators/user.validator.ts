import { Role } from "@prisma/client";
import { z } from "zod";

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

//#endregion
