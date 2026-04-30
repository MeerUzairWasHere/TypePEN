import { CompanyCreateInputDto, CompanyUpdateInputDto } from "../dto";
import { Company } from "../../database/schema";

export interface ICompanyService {
  createCompany(params: CompanyCreateInputDto): Promise<Company>;
  getCompany(): Promise<Company | null>;
  updateComany(params: {
    companyId: string;
    data: CompanyUpdateInputDto;
  }): Promise<Company>;
  deleteCompany(): Promise<void>;
}
