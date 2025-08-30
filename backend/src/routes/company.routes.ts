import { Router } from "express";
import {
  authenticateUser,
  authorizePermissions,
} from "../middlewares/authentication";
import { validateAddCompanyInputMiddleware } from "../middlewares/validationMiddleware";
import { createCompany } from "../controllers/company.controller";
import { Role } from "../types";

const router = Router();

router
  .route("/")
  .post(
    authenticateUser,
    authorizePermissions(Role.ADMIN),
    validateAddCompanyInputMiddleware,
    createCompany
  );

export default router;
