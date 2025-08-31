import { Router } from "express";
import {
  authenticateUser,
  authorizePermissions,
} from "../middlewares/authentication";
import { validateCompanyInputMiddleware } from "../middlewares/validationMiddleware";
import {
  createCompany,
  deleteCompany,
  getCompany,
  updateCompany,
} from "../controllers/company.controller";
import { Role } from "../types";

const router = Router();

router
  .route("/")
  .post(
    authenticateUser,
    authorizePermissions(Role.ADMIN),
    validateCompanyInputMiddleware,
    createCompany
  )
  .get(authenticateUser, authorizePermissions(Role.ADMIN), getCompany)
  .delete(authenticateUser, authorizePermissions(Role.ADMIN), deleteCompany);

router
  .route("/:companyId")
  .patch(
    authenticateUser,
    authorizePermissions(Role.ADMIN),
    validateCompanyInputMiddleware,
    updateCompany
  );

export default router;
