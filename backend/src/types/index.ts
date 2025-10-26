import { z } from "zod";

export interface TokenUser {
  id: string;
  name: string;
  role: string;
  email: string;
}

export const validateRegisterInput = z.object({
  name: z
    .string("name is required")
    .min(1, { message: "Name is required" })
    .min(2, { message: "Name must be at least 2 characters long" }),
  username: z
    .string("username is required")
    .min(1, { message: "Name is required" })
    .min(4, { message: "Name must be at least 2 characters long" })
    .max(20, { message: "Name must be at most 20 characters long" }),

  email: z
    .email({ message: "Invalid email format" })
    .min(1, { message: "Email is required" }),

  password: z
    .string("password is required")
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password must be at most 20 characters long" }),
});

// Infer the TypeScript type for the `validateRegisterInput` schema
export type RegisterInput = z.infer<typeof validateRegisterInput>;

export const validateLoginInput = z.object({
  email: z
    .email({ message: "Invalid email format" })
    .min(1, { message: "Email is required" }),

  password: z.string().min(1, { message: "Password is required" }),
});
export type LoginInput = z.infer<typeof validateLoginInput>;

export const validateUpdateUserInput = z
  .object({
    name: z
      .string()
      .min(1, { message: "Name is required" })
      .min(2, { message: "Name must be at least 2 characters long" })
      .optional(),

    email: z
      .string()
      .email({ message: "Invalid email format" })
      .min(1, { message: "Email is required" })
      .optional(),
  })
  .refine((data) => data.name || data.email, {
    message: "At least one field (name or email) must be provided",
  });
export type UpdateUserInput = z.infer<typeof validateUpdateUserInput>;

export const validateUpdatePasswordInput = z.object({
  oldPassword: z.string().min(1, { message: "Current password is required" }),

  newPassword: z
    .string()
    .min(1, { message: "New password is required" })
    .min(8, { message: "New password must be at least 8 characters long" }),
});
export type UpdatePasswordInput = z.infer<typeof validateUpdatePasswordInput>;

export const validateVerifyEmailInput = z.object({
  verificationToken: z
    .string()
    .min(1, { message: "Verification token is required" }),

  email: z
    .email({ message: "Invalid email format" })
    .min(1, { message: "Email is required" }),
});
export type VerifyEmailInput = z.infer<typeof validateVerifyEmailInput>;

export const validateForgotPasswordInput = z.object({
  email: z
    .email({ message: "Invalid email format" })
    .min(1, { message: "Email is required" }),
});
export type ForgotPasswordInput = z.infer<typeof validateForgotPasswordInput>;

export const validateResetPasswordInput = z.object({
  token: z.string().min(1, { message: "Token is required" }),

  newPassword: z
    .string()
    .min(1, { message: "New password is required" })
    .min(8, { message: "New password must be at least 8 characters long" }),

  email: z
    .email({ message: "Invalid email format" })
    .min(1, { message: "Email is required" }),
});
export type ResetPasswordInput = z.infer<typeof validateResetPasswordInput>;

export const validateCompanyInput = z.object({
  id: z.string().min(1, { message: "ID is required" }).optional(),

  name: z.string().min(1, { message: "Company name is required" }),

  address: z.string().min(1, { message: "Address is required" }),

  website: z
    .url({ message: "Invalid website URL format" })
    .min(1, { message: "Website is required" }),

  phone: z.string().min(1, { message: "Phone number is required" }),

  email: z
    .email({ message: "Invalid email format" })
    .min(1, { message: "Email is required" }),

  createdAt: z.iso.datetime({ message: "Invalid date format" }).optional(),

  updatedAt: z.iso.datetime({ message: "Invalid date format" }).optional(),
});

export type CompanyInput = z.infer<typeof validateCompanyInput>;
