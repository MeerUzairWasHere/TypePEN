import { Injectable } from "@nestjs/common";
import { Company } from "@prisma/client";
import { CompanyCreateInputDto, CompanyUpdateInputDto } from "./dto";
import { ConflictError } from "../errors";
import { CompanyRepository } from "./company.repository";

@Injectable()
export class CompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async createCompany(data: CompanyCreateInputDto) {
    const companyAlreadyExists = await this.companyRepository.findFirst();

    if (companyAlreadyExists) {
      throw new ConflictError("Company already exists");
    }

    return this.companyRepository.create(data);
  }

  async getCompany(): Promise<Company | null> {
    return this.companyRepository.findFirst();
  }

  async updateComany(params: {
    companyId: string;
    data: CompanyUpdateInputDto;
  }) {
    await this.getCompany();

    return this.companyRepository.update(params.companyId, params.data);
  }

  async deleteCompany() {
    await this.companyRepository.deleteAll();
  }
}
