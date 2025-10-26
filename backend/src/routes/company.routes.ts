import { Router } from "express";
import { Role } from "@prisma/client";
import {
  createCompany,
  deleteCompany,
  getCompany,
  updateCompany,
} from "../controllers/company.controller";
import { validate } from "../decorators";
import {
  validateCompanyCreateInput,
  validateCompanyUpdateInput,
} from "../validators";
import { authGuard, rolesGuard } from "../guards";

const router = Router();

router
  .route("/")
  .post(
    authGuard,
    rolesGuard(Role.Admin),
    validate(validateCompanyCreateInput),
    createCompany
  )
  .get(authGuard, rolesGuard(Role.Admin), getCompany)
  .delete(authGuard, rolesGuard(Role.Admin), deleteCompany);

router
  .route("/:companyId")
  .patch(
    authGuard,
    rolesGuard(Role.Admin),
    validate(validateCompanyUpdateInput),
    updateCompany
  );

export default router;
