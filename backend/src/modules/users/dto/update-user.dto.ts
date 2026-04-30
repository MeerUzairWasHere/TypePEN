import { z } from "zod";
import {
  validateUpdatePasswordInput,
  validateUserUpdateInput,
} from "../validators";

export type UserUpdateInputDto = z.infer<typeof validateUserUpdateInput>;

export type UpdatePasswordInputDto = z.infer<
  typeof validateUpdatePasswordInput
>;

export interface UpdatePasswordTokenDto {
  passwordToken: string;
  passwordTokenExpirationDate: Date;
}

export interface UpdatePasswordDto {
  password: string;
  passwordToken: null;
  passwordTokenExpirationDate: null;
}

export interface UpdateUserPasswordDto {
  password: string;
}

export interface UpdateUserVerificationDto {
  isVerified: boolean;
  verified: Date;
  verificationToken: string;
}
