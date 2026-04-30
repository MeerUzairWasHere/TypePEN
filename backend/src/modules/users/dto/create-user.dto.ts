import { z } from "zod";
import { validateUserCreateInput } from "../validators";

export type UserCreateInputDto = z.infer<typeof validateUserCreateInput>;

export interface CreateTokenDto {
  refreshToken: string;
  ip: string;
  userAgent: string;
  userId: string;
}
