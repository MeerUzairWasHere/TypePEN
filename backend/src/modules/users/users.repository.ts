import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { and, count, eq, ne } from "drizzle-orm";
import { NotFoundError } from "../errors";
import {
  CreateTokenDto,
  UpdatePasswordDto,
  UpdatePasswordTokenDto,
  UpdateUserPasswordDto,
  UpdateUserVerificationDto,
  UserCreateInputDto,
  UserUpdateInputDto,
} from "./dto";
import { DatabaseService } from "../database/database.service";
import { Token, tokens, User, users } from "../database/schema";

@Injectable()
export class UserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async getUserCount(): Promise<number> {
    const [result] = await this.databaseService.db
      .select({ value: count() })
      .from(users);

    return result?.value ?? 0;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const [user] = await this.databaseService.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user ?? null;
  }

  async findById(userId: string): Promise<User | null> {
    const [user] = await this.databaseService.db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return user ?? null;
  }

  async findByIdBasic(userId: string): Promise<User | null> {
    return this.findById(userId);
  }

  async findByIdProfile(userId: string): Promise<User | null> {
    return this.findById(userId);
  }

  async findByEmailExcludingUser(
    email: string,
    excludeUserId: string,
  ): Promise<User | null> {
    const [user] = await this.databaseService.db
      .select()
      .from(users)
      .where(and(eq(users.email, email), ne(users.id, excludeUserId)))
      .limit(1);

    return user ?? null;
  }

  async checkEmailExists(email: string): Promise<boolean> {
    const [user] = await this.databaseService.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return !!user;
  }

  async checkUsernameExists(username: string): Promise<boolean> {
    const [user] = await this.databaseService.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    return !!user;
  }

  async createUser(data: UserCreateInputDto): Promise<User> {
    const [user] = await this.databaseService.db
      .insert(users)
      .values({
        ...data,
        id: randomUUID(),
        updatedAt: new Date(),
      })
      .returning();

    if (!user) {
      throw new Error("Failed to create user");
    }

    return user;
  }

  async update(userId: string, data: UserUpdateInputDto): Promise<User> {
    const [user] = await this.databaseService.db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();

    if (!user) {
      throw new NotFoundError("Record not found");
    }

    return user;
  }

  async updatePassword(
    userId: string,
    data: UpdateUserPasswordDto,
  ): Promise<void> {
    const [user] = await this.databaseService.db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning({ id: users.id });

    if (!user) {
      throw new NotFoundError("Record not found");
    }
  }

  async updateUserVerification(
    email: string,
    data: UpdateUserVerificationDto,
  ): Promise<void> {
    const [user] = await this.databaseService.db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.email, email))
      .returning({ id: users.id });

    if (!user) {
      throw new NotFoundError("Record not found");
    }
  }

  async updateUserPasswordToken(
    email: string,
    data: UpdatePasswordTokenDto,
  ): Promise<void> {
    const [user] = await this.databaseService.db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.email, email))
      .returning({ id: users.id });

    if (!user) {
      throw new NotFoundError("Record not found");
    }
  }

  async updateUserPassword(
    email: string,
    data: UpdatePasswordDto,
  ): Promise<void> {
    const [user] = await this.databaseService.db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.email, email))
      .returning({ id: users.id });

    if (!user) {
      throw new NotFoundError("Record not found");
    }
  }

  async delete(userId: string): Promise<void> {
    const [user] = await this.databaseService.db
      .delete(users)
      .where(eq(users.id, userId))
      .returning({ id: users.id });

    if (!user) {
      throw new NotFoundError("Record not found");
    }
  }

  async findTokenByUserId(userId: string): Promise<Token | null> {
    const [token] = await this.databaseService.db
      .select()
      .from(tokens)
      .where(eq(tokens.userId, userId))
      .limit(1);

    return token ?? null;
  }

  async createToken(data: CreateTokenDto): Promise<Token> {
    const [token] = await this.databaseService.db
      .insert(tokens)
      .values({
        ...data,
        id: randomUUID(),
        updatedAt: new Date(),
      })
      .returning();

    if (!token) {
      throw new Error("Failed to create token");
    }

    return token;
  }

  async deleteUserTokens(userId: string): Promise<void> {
    await this.databaseService.db.delete(tokens).where(eq(tokens.userId, userId));
  }
}
