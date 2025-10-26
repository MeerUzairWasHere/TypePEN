import { User } from "@prisma/client";
import { TokenUser } from "../types";

export const createTokenUser = (user: User): TokenUser => {
  return { id: user.id, name: user.name, role: user.role, email: user.email };
};
