import { Router } from "express";
import {
  showCurrentUser,
  updateUser,
  updateUserPassword,
} from "../controllers/user.controller";

import { validate } from "../decorators";

import {
  validateUpdatePasswordInput,
  validateUserUpdateInput,
} from "../validators";
import { authGuard } from "../guards";

const router = Router();

router.route("/current-user").get(authGuard, showCurrentUser);

router
  .route("/update-user")
  .patch(authGuard, validate(validateUserUpdateInput), updateUser);
router
  .route("/update-user-password")
  .patch(authGuard, validate(validateUpdatePasswordInput), updateUserPassword);

export default router;
