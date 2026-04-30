import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { sql } from "drizzle-orm";
import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres, { Sql } from "postgres";
import { IDatabaseService } from "./interfaces";
import * as schema from "./schema";

export type DrizzleDatabase = PostgresJsDatabase<typeof schema>;

@Injectable()
export class DatabaseService
  implements IDatabaseService, OnModuleInit, OnModuleDestroy
{
  private readonly client: Sql;
  readonly db: DrizzleDatabase;

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error("DATABASE_URL is required");
    }

    this.client = postgres(databaseUrl);
    this.db = drizzle(this.client, { schema });
  }

  async onModuleInit(): Promise<void> {
    await this.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
  }

  async connect(): Promise<void> {
    await this.db.execute(sql`SELECT 1`);
  }

  async disconnect(): Promise<void> {
    await this.client.end({ timeout: 5 });
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.db.execute(sql`SELECT 1`);
      return true;
    } catch {
      return false;
    }
  }
}
