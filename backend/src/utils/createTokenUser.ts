import { TokenUserDto } from "../modules/users/dto";
import { User } from "../modules/database/schema";

export const createTokenUser = (user: User): TokenUserDto => {
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email,
    isVerified: user.isVerified,
  };
};
