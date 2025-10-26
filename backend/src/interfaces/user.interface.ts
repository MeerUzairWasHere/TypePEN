import { TokenUser, UpdatePasswordInput, UserUpdateInput } from "../types";

export interface IUserService {
  getCurrentUser(tokenUser: TokenUser): Promise<TokenUser | null>;
  updateUser(userId: string, data: UserUpdateInput): Promise<TokenUser>;
  updateUserPassword(
    userId: string,
    data: UpdatePasswordInput
  ): Promise<{ msg: string }>;
  deleteUser(userId: string): Promise<{ msg: string }>;
}
