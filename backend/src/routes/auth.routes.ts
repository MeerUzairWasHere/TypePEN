import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticateUser } from "../middlewares/authentication";
import {
  validateForgotPasswordInputMiddleware,
  validateLoginInputMiddleware,
  validateRegisterInputMiddleware,
  validateResetPasswordInputMiddleware,
  validateVerifyEmailInputMiddleware,
} from "../middlewares/validationMiddleware";

export class AuthRoutes {
  public router: Router;

  constructor(private authController: AuthController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Public routes
    this.router.post(
      "/register",
      validateRegisterInputMiddleware,
      this.authController.registerUser
    );

    this.router.post(
      "/login",
      validateLoginInputMiddleware,
      this.authController.login
    );

    this.router.post(
      "/verify-email",
      validateVerifyEmailInputMiddleware,
      this.authController.verifyEmail
    );

    this.router.post(
      "/forgot-password",
      validateForgotPasswordInputMiddleware,
      this.authController.forgotPassword
    );

    this.router.post(
      "/reset-password",
      validateResetPasswordInputMiddleware,
      this.authController.resetPassword
    );

    // Protected routes
    this.router.delete("/logout",  this.authController.logout);
  }
}
