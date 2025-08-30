import { prismaClient } from "../db";
import { AddCompanyInput } from "../types";

export class CompanyService {
  async createCompany(data: AddCompanyInput) {
    const company = await prismaClient.company.create({
      data,
    });

    return company;
  }
}

export const companyService = new CompanyService();
