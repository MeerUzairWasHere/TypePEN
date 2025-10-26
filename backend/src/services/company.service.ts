import { Company } from "@prisma/client";
import { ConflictError } from "../errors";
import { CompanyCreateInputDto, CompanyUpdateInputDto } from "../dto";
import { ICompanyService } from "../interfaces";
import { CompanyRepository } from "../repositories";

export class CompanyService implements ICompanyService {
  constructor(private companyRepository: CompanyRepository) {}

  async createCompany(data: CompanyCreateInputDto) {
    const companyAlreadyExists = await this.companyRepository.findFirst();

    if (companyAlreadyExists) {
      throw new ConflictError("Company already exists");
    }

    const company = await this.companyRepository.create(data);

    return company;
  }

  async getCompany(): Promise<Company | null> {
    const company = await this.companyRepository.findFirst();

    return company;
  }

  async updateComany({
    companyId,
    data,
  }: {
    companyId: string;
    data: CompanyUpdateInputDto;
  }) {
    await this.getCompany();

    const company = await this.companyRepository.update(companyId, data);

    return company;
  }

  async deleteCompany() {
    await this.companyRepository.deleteAll();
    return;
  }
}
