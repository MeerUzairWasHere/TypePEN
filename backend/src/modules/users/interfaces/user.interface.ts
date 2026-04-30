import {
  TokenUserDto,
  UpdatePasswordInputDto,
  UserUpdateInputDto,
} from "../dto";

export interface IUserService {
  getCurrentUser(tokenUser: TokenUserDto): Promise<TokenUserDto | null>;
  updateUser(userId: string, data: UserUpdateInputDto): Promise<TokenUserDto>;
  updateUserPassword(
    userId: string,
    data: UpdatePasswordInputDto
  ): Promise<{ msg: string }>;
  deleteUser(userId: string): Promise<{ msg: string }>;
}
