import { User, Token } from "@prisma/client";
import { IPrismaService } from "../types/interfaces";

// User Data Transfer Objects
export interface UserSelectBasic {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface UserSelectWithDates extends UserSelectBasic {
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSelectProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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
  password: string;
  role: string;
  verificationToken: string;
}

// Token Interface
export interface CreateTokenData {
  refreshToken: string;
  ip: string;
  userAgent: string;
  userId: number;
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

  async findById(userId: number): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: { id: userId },
    });
  }

  async findByIdBasic(userId: number): Promise<UserSelectBasic | null> {
    return await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  }

  async findByIdProfile(userId: number): Promise<UserSelectProfile | null> {
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

  async findByEmailExcludingUser(
    email: string,
    excludeUserId: number
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

  async exists(userId: number): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    return !!user;
  }

  // ==================== User Mutation Operations ====================

  async createUser(data: CreateUserData): Promise<UserSelectWithDates> {
    return await this.prismaService.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(userId: number, data: UpdateUserData): Promise<UserSelectBasic> {
    return await this.prismaService.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  }

  async updatePassword(
    userId: number,
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

  async delete(userId: number): Promise<void> {
    await this.prismaService.user.delete({
      where: { id: userId },
    });
  }

  // ==================== Token Operations ====================

  async findTokenByUserId(userId: number): Promise<Token | null> {
    return await this.prismaService.token.findFirst({
      where: { user: { id: userId } },
    });
  }

  async createToken(data: CreateTokenData): Promise<Token> {
    return await this.prismaService.token.create({
      data,
    });
  }

  async deleteUserTokens(userId: number): Promise<void> {
    await this.prismaService.token.deleteMany({
      where: {
        userId: Number(userId),
      },
    });
  }
}
