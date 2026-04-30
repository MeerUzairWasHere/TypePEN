import { PrismaClient } from "@prisma/client";

export interface IDatabaseService extends PrismaClient {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  healthCheck(): Promise<boolean>;
}
