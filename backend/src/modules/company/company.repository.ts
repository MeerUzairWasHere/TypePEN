import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { DatabaseService } from "../database/database.service";
import { companies, Company } from "../database/schema";
import { NotFoundError } from "../errors";
import { CompanyCreateInputDto, CompanyUpdateInputDto } from "./dto";

@Injectable()
export class CompanyRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findFirst(): Promise<Company | null> {
    const [company] = await this.databaseService.db
      .select()
      .from(companies)
      .limit(1);

    return company ?? null;
  }

  async findById(companyId: string): Promise<Company | null> {
    const [company] = await this.databaseService.db
      .select()
      .from(companies)
      .where(eq(companies.id, companyId))
      .limit(1);

    return company ?? null;
  }

  async create(data: CompanyCreateInputDto): Promise<Company> {
    const [company] = await this.databaseService.db
      .insert(companies)
      .values({
        ...data,
        id: randomUUID(),
        updatedAt: new Date(),
      })
      .returning();

    if (!company) {
      throw new Error("Failed to create company");
    }

    return company;
  }

  async update(
    companyId: string,
    data: CompanyUpdateInputDto
  ): Promise<Company> {
    const [company] = await this.databaseService.db
      .update(companies)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(companies.id, companyId))
      .returning();

    if (!company) {
      throw new NotFoundError("Record not found");
    }

    return company;
  }

  async deleteAll(): Promise<void> {
    await this.databaseService.db.delete(companies);
  }
}
