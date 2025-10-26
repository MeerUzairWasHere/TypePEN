import { User, Token, Role } from "@prisma/client";
import { IPrismaService } from "../types/interfaces";
import { TokenUser } from "../types";

// User Update Interfaces
export interface UpdateUserData {
  email?: string;
  name?: string;
}

export interface UpdateUserPasswordData {
  password: string;
}

export interface UpdatePasswordTokenData {
  passwordToken: string;
  passwordTokenExpirationDate: Date;
}

export interface UpdatePasswordData {
  password: string;
  passwordToken: null;
  passwordTokenExpirationDate: null;
}

export interface UpdateUserVerificationData {
  isVerified: boolean;
  verified: Date;
  verificationToken: string;
}

// User Create Interface
export interface CreateUserData {
  name: string;
  email: string;
  username: string;
  password: string;
  role: Role;
  verificationToken: string;
}

// Token Interface
export interface CreateTokenData {
  refreshToken: string;
  ip: string;
  userAgent: string;
  userId: string;
}

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

  async createUser(data: CreateUserData): Promise<User> {
    return await this.prismaService.user.create({
      data,
    });
  }

  async update(userId: string, data: UpdateUserData): Promise<User> {
    return await this.prismaService.user.update({
      where: { id: userId },
      data,
    });
  }

  async updatePassword(
    userId: string,
    data: UpdateUserPasswordData
  ): Promise<void> {
    await this.prismaService.user.update({
      where: { id: userId },
      data,
    });
  }

  async updateUserVerification(
    email: string,
    data: UpdateUserVerificationData
  ): Promise<void> {
    await this.prismaService.user.update({
      where: { email },
      data,
    });
  }

  async updateUserPasswordToken(
    email: string,
    data: UpdatePasswordTokenData
  ): Promise<void> {
    await this.prismaService.user.update({
      where: { email },
      data,
    });
  }

  async updateUserPassword(
    email: string,
    data: UpdatePasswordData
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

  async createToken(data: CreateTokenData): Promise<Token> {
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
