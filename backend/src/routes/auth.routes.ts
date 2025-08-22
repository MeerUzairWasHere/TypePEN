import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { authenticateUser } from "../middlewares/authentication";

import {
  validateForgotPasswordInputMiddleware,
  validateLoginInputMiddleware,
  validateRegisterInputMiddleware,
  validateResetPasswordInputMiddleware,
  validateVerifyEmailInputMiddleware,
} from "../middlewares/validationMiddleware";

import {
  registerUser,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller";

const router = Router();

router.post("/register", validateRegisterInputMiddleware, registerUser);

router.post("/login", validateLoginInputMiddleware, login);

router.delete("/logout", authenticateUser, logout);

router.post("/verify-email", validateVerifyEmailInputMiddleware, verifyEmail);

router.post(
  "/forgot-password",
  validateForgotPasswordInputMiddleware,
  forgotPassword
);

router.post(
  "/reset-password",
  validateResetPasswordInputMiddleware,
  resetPassword
);

export default router;
