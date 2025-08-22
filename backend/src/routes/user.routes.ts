import { Router } from "express";
import { authenticateUser } from "../middlewares/authentication";
import {
  showCurrentUser,
  updateUser,
  updateUserPassword,
} from "../controllers/user.controller";

const router = Router();

import {
  validateUpdateUserInputMiddleware,
  validateUpdatePasswordInputMiddleware,
} from "../middlewares/validationMiddleware";

router.route("/current-user").get(authenticateUser, showCurrentUser);

router
  .route("/updateUser")
  .patch(authenticateUser, validateUpdateUserInputMiddleware, updateUser);
router
  .route("/updateUserPassword")
  .patch(
    authenticateUser,
    validateUpdatePasswordInputMiddleware,
    updateUserPassword
  );

export default router;
