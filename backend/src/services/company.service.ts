import { PrismaClient } from "@prisma/client";
import { ConflictError, NotFoundError } from "../errors";
import { CompanyInput } from "../types";
import { CompanyInfo } from "../types/email.types";
import { ICompanyService } from "../types/interfaces";

export class CompanyService implements ICompanyService {
  constructor(private prismaService: PrismaClient) {}
  async createCompany({ data }: { data: CompanyInput }) {
    const companyAlreadyExists = await this.prismaService.company.findFirst();

    if (companyAlreadyExists) {
      throw new ConflictError("Company already exists");
    }

    const company = await this.prismaService.company.create({
      data,
    });

    return company;
  }

  async getCompany(): Promise<CompanyInfo> {
    const company = await this.prismaService.company.findFirst();

    if (!company) {
      throw new NotFoundError(
        `Company does not exist, Please create a new one.`
      );
    }

    return company;
  }

  async updateComany({
    companyId,
    data,
  }: {
    companyId: string;
    data: CompanyInput;
  }) {
    await this.getCompany();

    const company = await this.prismaService.company.update({
      data: data,
      where: {
        id: companyId,
      },
    });

    return company;
  }

  async deleteCompany() {
    await this.prismaService.company.deleteMany();
    return;
  }
}
