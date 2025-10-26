import { User } from "@prisma/client";
import { TokenUserDto } from "../dto";

export const createTokenUser = (user: User): TokenUserDto => {
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email,
    isVerified: user.isVerified,
  };
};
