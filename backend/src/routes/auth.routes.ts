import { Router } from "express";
import { authenticateUser } from "../middlewares/authentication";

import {
  validateForgotPasswordInputMiddleware,
  validateLoginInputMiddleware,
  validateRegisterInputMiddleware,
  validateResetPasswordInputMiddleware,
  validateVerifyEmailInputMiddleware,
} from "../middlewares/validationMiddleware";

import { authController } from "../container";

const router = Router();

router.post(
  "/register",
  validateRegisterInputMiddleware,
  authController.registerUser
);

router.post("/login", validateLoginInputMiddleware, authController.login);

router.delete("/logout", authenticateUser, authController.logout);

router.post(
  "/verify-email",
  validateVerifyEmailInputMiddleware,
  authController.verifyEmail
);

router.post(
  "/forgot-password",
  validateForgotPasswordInputMiddleware,
  authController.forgotPassword
);

router.post(
  "/reset-password",
  validateResetPasswordInputMiddleware,
  authController.resetPassword
);

export default router;
