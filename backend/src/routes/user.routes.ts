import { Router } from "express";
import { authenticateUser } from "../middlewares/authentication-middleware";
import {
  showCurrentUser,
  updateUser,
  updateUserPassword,
} from "../controllers/user.controller";

const router = Router();

import {
  validateUpdateUserInputMiddleware,
  validateUpdatePasswordInputMiddleware,
} from "../middlewares/validation-middleware";

router.route("/current-user").get(authenticateUser, showCurrentUser);

router
  .route("/update-user")
  .patch(authenticateUser, validateUpdateUserInputMiddleware, updateUser);
router
  .route("/update-user-password")
  .patch(
    authenticateUser,
    validateUpdatePasswordInputMiddleware,
    updateUserPassword
  );

export default router;
