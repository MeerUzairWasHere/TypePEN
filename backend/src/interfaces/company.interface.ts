import { CompanyCreateInput, CompanyUpdateInput } from "../types";
import { Company } from "@prisma/client";

export interface ICompanyService {
  createCompany(params: CompanyCreateInput): Promise<Company>;
  getCompany(): Promise<Company | null>;
  updateComany(params: {
    companyId: string;
    data: CompanyUpdateInput;
  }): Promise<Company>;
  deleteCompany(): Promise<void>;
}
