import { z } from "zod";

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

export const validateCompanyUpdateInput = validateCompanyCreateInput.partial();
