import { User } from "@prisma/client";
import { createTokenUser, comparePassword, hashPassword } from "../utils";
import { TokenUser, UpdatePasswordInput, UpdateUserInput } from "../types";
import { UnauthenticatedError } from "../errors";
import { IUserService } from "../types/interfaces";
import { UserRepository } from "../repositories/user.repository";

export class UserService implements IUserService {
  constructor(private userRepository: UserRepository) {}

  async getCurrentUser(userId: number): Promise<TokenUser | null> {
    const user = await this.userRepository.findByIdBasic(userId);

    if (!user) {
      return null;
    }

    return createTokenUser(user as User);
  }

  async updateUser(userId: number, data: UpdateUserInput): Promise<TokenUser> {
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

    return createTokenUser(user as User);
  }

  async updateUserPassword(
    userId: number,
    data: UpdatePasswordInput
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

  async deleteUser(userId: number): Promise<{ msg: string }> {
    await this.userRepository.delete(userId);

    return { msg: "User account deleted successfully" };
  }

  async getUserProfile(userId: number) {
    return await this.userRepository.findByIdProfile(userId);
  }
}
