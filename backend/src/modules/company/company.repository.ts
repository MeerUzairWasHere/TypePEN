import { Injectable } from "@nestjs/common";
import { Company } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import { CompanyCreateInputDto, CompanyUpdateInputDto } from "./dto";

@Injectable()
export class CompanyRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findFirst(): Promise<Company | null> {
    return this.prismaService.company.findFirst();
  }

  async findById(companyId: string): Promise<Company | null> {
    return this.prismaService.company.findUnique({
      where: { id: companyId },
    });
  }

  async create(data: CompanyCreateInputDto): Promise<Company> {
    return this.prismaService.company.create({
      data,
    });
  }

  async update(
    companyId: string,
    data: CompanyUpdateInputDto
  ): Promise<Company> {
    return this.prismaService.company.update({
      where: { id: companyId },
      data,
    });
  }

  async deleteAll(): Promise<void> {
    await this.prismaService.company.deleteMany();
  }
}
