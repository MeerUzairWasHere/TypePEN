import { User } from "../../database/schema";
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
