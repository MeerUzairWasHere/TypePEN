import { PrismaClient } from "@prisma/client";
import { IPrismaService } from "../types/interfaces";

export class PrismaService extends PrismaClient implements IPrismaService {
  constructor() {
    super();
  }

  async connect(): Promise<void> {
    await this.$connect();
  }

  async disconnect(): Promise<void> {
    await this.$disconnect();
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}
