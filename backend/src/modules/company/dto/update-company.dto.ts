import { z } from "zod";
import { validateCompanyUpdateInput } from "../validators";

export type CompanyUpdateInputDto = z.infer<typeof validateCompanyUpdateInput>;
