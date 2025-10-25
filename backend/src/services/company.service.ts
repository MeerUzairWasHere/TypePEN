import { ConflictError, NotFoundError } from "../errors";
import { CompanyInput } from "../types";
import { CompanyInfo } from "../types/email.types";
import { ICompanyService } from "../types/interfaces";
import { CompanyRepository } from "../repositories/company.repository";

export class CompanyService implements ICompanyService {
  constructor(private companyRepository: CompanyRepository) {}

  async createCompany({ data }: { data: CompanyInput }) {
    const companyAlreadyExists = await this.companyRepository.findFirst();

    if (companyAlreadyExists) {
      throw new ConflictError("Company already exists");
    }

    const company = await this.companyRepository.create(data);

    return company;
  }

  async getCompany(): Promise<CompanyInfo> {
    const company = await this.companyRepository.findFirst();

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

    const company = await this.companyRepository.update(companyId, data);

    return company;
  }

  async deleteCompany() {
    await this.companyRepository.deleteAll();
    return;
  }
}
