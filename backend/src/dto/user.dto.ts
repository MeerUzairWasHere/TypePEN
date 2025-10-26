import { z } from "zod";
import {
  validateUserCreateInput,
  validateUserUpdateInput,
} from "../validators";

export interface TokenUserDto {
  id: string;
  name: string;
  role: string;
  email: string;
}

export type UserCreateInputDto = z.infer<typeof validateUserCreateInput>;

export type UserUpdateInputDto = z.infer<typeof validateUserUpdateInput>;

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

export interface CreateTokenDto {
  refreshToken: string;
  ip: string;
  userAgent: string;
  userId: string;
}
