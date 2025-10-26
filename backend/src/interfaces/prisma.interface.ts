import { PrismaClient } from "@prisma/client";

export interface IPrismaService extends PrismaClient {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  healthCheck(): Promise<boolean>;
}
