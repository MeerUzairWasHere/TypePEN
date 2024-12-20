import { User } from "@prisma/client";
import { TokenUser } from "../types";

export const createTokenUser = (user: User): TokenUser => {
  return { name: user.name, userId: user.id, role: user.role };
};
