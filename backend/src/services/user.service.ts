import { PrismaClient, User } from "@prisma/client";
import { createTokenUser, comparePassword, hashPassword } from "../utils";
import { TokenUser, UpdatePasswordInput, UpdateUserInput } from "../types";
import { UnauthenticatedError } from "../errors";

export class UserService {
  constructor(private prismaService: PrismaClient) {}
  // Get current user
  async getCurrentUser(userId: number): Promise<TokenUser | null> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return null;
    }

    return createTokenUser(user as User);
  }

  // Update user information
  async updateUser(userId: number, data: UpdateUserInput): Promise<TokenUser> {
    const { email, name } = data;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await this.prismaService.user.findFirst({
        where: {
          email,
          id: { not: userId },
        },
      });

      if (existingUser) {
        throw new UnauthenticatedError("Email already exists");
      }
    }

    // Update the user with Prisma
    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: { email, name },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return createTokenUser(user as User);
  }

  // Update user password
  async updateUserPassword(
    userId: number,
    data: UpdatePasswordInput
  ): Promise<{ msg: string }> {
    const { oldPassword, newPassword } = data;

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthenticatedError("User not found");
    }

    // Check if the old password is correct
    const isPasswordCorrect = await comparePassword(oldPassword, user.password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid Credentials");
    }

    // Validate that new password is different from old password
    if (oldPassword === newPassword) {
      throw new UnauthenticatedError(
        "New password must be different from old password"
      );
    }

    // Hash the new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update the password with Prisma
    await this.prismaService.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return { msg: "Success! Password Updated." };
  }

  // Delete user account (optional utility method)
  async deleteUser(userId: number): Promise<{ msg: string }> {
    await this.prismaService.user.delete({
      where: { id: userId },
    });

    return { msg: "User account deleted successfully" };
  }

  // Utility method to get user profile
  async getUserProfile(userId: number) {
    return await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
