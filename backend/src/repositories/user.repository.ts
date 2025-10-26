import { User, Token } from "@prisma/client";
import { IPrismaService } from "../types/interfaces";
import { UserCreateInput, UserUpdateInput } from "../types";
import {
  CreateTokenDto,
  UpdatePasswordDto,
  UpdatePasswordTokenDto,
  UpdateUserPasswordDto,
  UpdateUserVerificationDto,
} from "../dto";

export class UserRepository {
  constructor(private prismaService: IPrismaService) {}

  // ==================== User Query Operations ====================

  async getUserCount(): Promise<number> {
    return await this.prismaService.user.count();
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: { email },
    });
  }

  async findById(userId: string): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: { id: userId },
    });
  }

  async findByIdBasic(userId: string): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: { id: userId },
    });
  }

  async findByIdProfile(userId: string): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: { id: userId },
    });
  }

  async findByEmailExcludingUser(
    email: string,
    excludeUserId: string
  ): Promise<User | null> {
    return await this.prismaService.user.findFirst({
      where: {
        email,
        id: { not: excludeUserId },
      },
    });
  }

  async checkEmailExists(email: string): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return !!user;
  }

  // ==================== User Mutation Operations ====================

  async createUser(data: UserCreateInput): Promise<User> {
    return await this.prismaService.user.create({
      data,
    });
  }

  async update(userId: string, data: UserUpdateInput): Promise<User> {
    return await this.prismaService.user.update({
      where: { id: userId },
      data,
    });
  }

  async updatePassword(
    userId: string,
    data: UpdateUserPasswordDto
  ): Promise<void> {
    await this.prismaService.user.update({
      where: { id: userId },
      data,
    });
  }

  async updateUserVerification(
    email: string,
    data: UpdateUserVerificationDto
  ): Promise<void> {
    await this.prismaService.user.update({
      where: { email },
      data,
    });
  }

  async updateUserPasswordToken(
    email: string,
    data: UpdatePasswordTokenDto
  ): Promise<void> {
    await this.prismaService.user.update({
      where: { email },
      data,
    });
  }

  async updateUserPassword(
    email: string,
    data: UpdatePasswordDto
  ): Promise<void> {
    await this.prismaService.user.update({
      where: { email },
      data,
    });
  }

  async delete(userId: string): Promise<void> {
    await this.prismaService.user.delete({
      where: { id: userId },
    });
  }

  // ==================== Token Operations ====================

  async findTokenByUserId(userId: string): Promise<Token | null> {
    return await this.prismaService.token.findFirst({
      where: { user: { id: userId } },
    });
  }

  async createToken(data: CreateTokenDto): Promise<Token> {
    return await this.prismaService.token.create({
      data,
    });
  }

  async deleteUserTokens(userId: string): Promise<void> {
    await this.prismaService.token.deleteMany({
      where: {
        userId: userId,
      },
    });
  }
}
