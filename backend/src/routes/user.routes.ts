import { Router } from "express";

import { validate } from "../decorators";

import {
  validateUpdatePasswordInput,
  validateUserUpdateInput,
} from "../validators";
import { authGuard } from "../guards";
import { userController } from "../container";

const router = Router();

router.route("/current-user").get(authGuard, userController.showCurrentUser);

router
  .route("/update-user")
  .patch(
    authGuard,
    validate(validateUserUpdateInput),
    userController.updateUser
  );
router
  .route("/update-user-password")
  .patch(
    authGuard,
    validate(validateUpdatePasswordInput),
    userController.updateUserPassword
  );

export default router;
