import { z } from "zod";
import { validateCompanyCreateInput } from "../validators";

export type CompanyCreateInputDto = z.infer<typeof validateCompanyCreateInput>;
