import { Injectable } from "@nestjs/common";
import { Token, User } from "@prisma/client";
import {
  CreateTokenDto,
  UpdatePasswordDto,
  UpdatePasswordTokenDto,
  UpdateUserPasswordDto,
  UpdateUserVerificationDto,
  UserCreateInputDto,
  UserUpdateInputDto,
} from "./dto";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserCount(): Promise<number> {
    return this.prismaService.user.count();
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  async findById(userId: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { id: userId },
    });
  }

  async findByIdBasic(userId: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { id: userId },
    });
  }

  async findByIdProfile(userId: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { id: userId },
    });
  }

  async findByEmailExcludingUser(
    email: string,
    excludeUserId: string,
  ): Promise<User | null> {
    return this.prismaService.user.findFirst({
      where: {
        email,
        id: { not: excludeUserId },
      },
    });
  }

  async checkEmailExists(email: string): Promise<boolean> {
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
      },
      select: { id: true },
    });

    return !!user;
  }

  async checkUsernameExists(username: string): Promise<boolean> {
    const user = await this.prismaService.user.findFirst({
      where: {
        username,
      },
      select: { id: true },
    });

    return !!user;
  }

  async createUser(data: UserCreateInputDto): Promise<User> {
    return this.prismaService.user.create({
      data,
    });
  }

  async update(userId: string, data: UserUpdateInputDto): Promise<User> {
    return this.prismaService.user.update({
      where: { id: userId },
      data,
    });
  }

  async updatePassword(
    userId: string,
    data: UpdateUserPasswordDto,
  ): Promise<void> {
    await this.prismaService.user.update({
      where: { id: userId },
      data,
    });
  }

  async updateUserVerification(
    email: string,
    data: UpdateUserVerificationDto,
  ): Promise<void> {
    await this.prismaService.user.update({
      where: { email },
      data,
    });
  }

  async updateUserPasswordToken(
    email: string,
    data: UpdatePasswordTokenDto,
  ): Promise<void> {
    await this.prismaService.user.update({
      where: { email },
      data,
    });
  }

  async updateUserPassword(
    email: string,
    data: UpdatePasswordDto,
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

  async findTokenByUserId(userId: string): Promise<Token | null> {
    return this.prismaService.token.findFirst({
      where: { user: { id: userId } },
    });
  }

  async createToken(data: CreateTokenDto): Promise<Token> {
    return this.prismaService.token.create({
      data,
    });
  }

  async deleteUserTokens(userId: string): Promise<void> {
    await this.prismaService.token.deleteMany({
      where: { userId },
    });
  }
}
