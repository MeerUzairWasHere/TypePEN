import { createTokenUser, comparePassword, hashPassword } from "../utils";
import {
  TokenUserDto,
  UserUpdateInputDto,
  UpdatePasswordInputDto,
} from "../dto";
import { UnauthenticatedError } from "../errors";
import { IUserService } from "../interfaces";
import { UserRepository } from "../repositories";

export class UserService implements IUserService {
  constructor(private userRepository: UserRepository) {}

  async getCurrentUser(tokenUser: TokenUserDto): Promise<TokenUserDto | null> {
    const user = await this.userRepository.findByIdBasic(tokenUser.id);

    if (!user) {
      return null;
    }

    return createTokenUser(user);
  }

  async updateUser(
    userId: string,
    data: UserUpdateInputDto
  ): Promise<TokenUserDto> {
    const { email, name } = data;

    if (email) {
      const existingUser = await this.userRepository.findByEmailExcludingUser(
        email,
        userId
      );

      if (existingUser) {
        throw new UnauthenticatedError("Email already exists");
      }
    }

    const user = await this.userRepository.update(userId, { email, name });

    return createTokenUser(user);
  }

  async updateUserPassword(
    userId: string,
    data: UpdatePasswordInputDto
  ): Promise<{ msg: string }> {
    const { oldPassword, newPassword } = data;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UnauthenticatedError("User not found");
    }

    const isPasswordCorrect = await comparePassword(oldPassword, user.password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid Credentials");
    }

    if (oldPassword === newPassword) {
      throw new UnauthenticatedError(
        "New password must be different from old password"
      );
    }

    const hashedNewPassword = await hashPassword(newPassword);

    await this.userRepository.updatePassword(userId, {
      password: hashedNewPassword,
    });

    return { msg: "Success! Password Updated." };
  }

  async deleteUser(userId: string): Promise<{ msg: string }> {
    await this.userRepository.delete(userId);

    return { msg: "User account deleted successfully" };
  }

  async getUsersCount(): Promise<number> {
    return await this.userRepository.getUserCount();
  }
}
