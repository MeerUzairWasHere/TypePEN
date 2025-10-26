import { Router } from "express";
import {
  authenticateUser,
  authorizePermissions,
} from "../middlewares/authentication-middleware";
import { validateCompanyInputMiddleware } from "../middlewares/validation-middleware";
import {
  createCompany,
  deleteCompany,
  getCompany,
  updateCompany,
} from "../controllers/company.controller";
import { Role } from "@prisma/client";

const router = Router();

router
  .route("/")
  .post(
    authenticateUser,
    authorizePermissions(Role.Admin),
    validateCompanyInputMiddleware,
    createCompany
  )
  .get(authenticateUser, authorizePermissions(Role.Admin), getCompany)
  .delete(authenticateUser, authorizePermissions(Role.Admin), deleteCompany);

router
  .route("/:companyId")
  .patch(
    authenticateUser,
    authorizePermissions(Role.Admin),
    validateCompanyInputMiddleware,
    updateCompany
  );

export default router;
