import { z } from "zod";
import {
  validateCompanyCreateInput,
  validateCompanyUpdateInput,
} from "../validators";

export type CompanyCreateInputDto = z.infer<typeof validateCompanyCreateInput>;
export type CompanyUpdateInputDto = z.infer<typeof validateCompanyUpdateInput>;
