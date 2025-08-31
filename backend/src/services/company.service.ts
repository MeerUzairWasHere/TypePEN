import { prismaClient } from "../db";
import { ConflictError, NotFoundError } from "../errors";
import { CompanyInput } from "../types";
import { CompanyInfo } from "../types/email.types";

export class CompanyService {
  async createCompany({ data }: { data: CompanyInput }) {
    const companyAlreadyExists = await prismaClient.company.findFirst();

    if (companyAlreadyExists) {
      throw new ConflictError("Company already exists");
    }

    const company = await prismaClient.company.create({
      data,
    });

    return company;
  }

  async getCompany(): Promise<CompanyInfo> {
    const company = await prismaClient.company.findFirst();

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

    const company = await prismaClient.company.update({
      data: data,
      where: {
        id: companyId,
      },
    });

    return company;
  }

  async deleteCompany() {
    await prismaClient.company.deleteMany();
    return;
  }
}

export const companyService = new CompanyService();
