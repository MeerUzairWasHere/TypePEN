import { Router } from "express";
import { Role } from "@prisma/client";
import { companyController } from "../container";

import { validate } from "../decorators";
import {
  validateCompanyCreateInput,
  validateCompanyUpdateInput,
} from "../validators";
import { authGuard, rolesGuard } from "../guards";

const router = Router();

router
  .route("/")
  .post(validate(validateCompanyCreateInput), companyController.createCompany)
  .get(authGuard, rolesGuard(Role.Admin), companyController.getCompany)
  .delete(authGuard, rolesGuard(Role.Admin), companyController.deleteCompany);

router
  .route("/:companyId")
  .patch(
    authGuard,
    rolesGuard(Role.Admin),
    validate(validateCompanyUpdateInput),
    companyController.updateCompany
  );

export default router;
