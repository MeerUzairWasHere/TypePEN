import { Company } from "@prisma/client";
import { IPrismaService } from "../types/interfaces";
import { CompanyCreateInput, CompanyUpdateInput } from "../types";

export class CompanyRepository {
  constructor(private prismaService: IPrismaService) {}

  async findFirst(): Promise<Company | null> {
    return await this.prismaService.company.findFirst();
  }

  async findById(companyId: string): Promise<Company | null> {
    return await this.prismaService.company.findUnique({
      where: { id: companyId },
    });
  }

  async create(data: CompanyCreateInput): Promise<Company> {
    return await this.prismaService.company.create({
      data,
    });
  }

  async update(companyId: string, data: CompanyUpdateInput): Promise<Company> {
    return await this.prismaService.company.update({
      where: { id: companyId },
      data,
    });
  }

  async deleteAll(): Promise<void> {
    await this.prismaService.company.deleteMany();
  }
}
