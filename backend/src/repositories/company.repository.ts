import { Company } from "@prisma/client";
import { IPrismaService } from "../types/interfaces";
import { CompanyInput } from "../types";

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

  async create(data: CompanyInput): Promise<Company> {
    return await this.prismaService.company.create({
      data,
    });
  }

  async update(companyId: string, data: CompanyInput): Promise<Company> {
    return await this.prismaService.company.update({
      where: { id: companyId },
      data,
    });
  }

  async deleteAll(): Promise<void> {
    await this.prismaService.company.deleteMany();
  }

  async exists(): Promise<boolean> {
    const company = await this.prismaService.company.findFirst({
      select: { id: true },
    });
    return !!company;
  }

  async count(): Promise<number> {
    return await this.prismaService.company.count();
  }
}
