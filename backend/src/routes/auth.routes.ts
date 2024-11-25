import { Router } from "express";
import { Request, Response, NextFunction } from "express";
// import { authenticateUser } from "../middleware/authentication";

// import {
//   validateRegisterInput,
//   validateLoginInput,
//   validateVerifyEmailInput,
//   validateForgotPasswordInput,
//   validateResetPasswordInput,
// } from "../middleware/validationMiddleware";

import {
  registerUser,
  //   login,
  //   logout,
  //   verifyEmail,
  //   forgotPassword,
  //   resetPassword,
} from "../controllers/auth.controller";

const router = Router();

router.post(
  "/register",
  //   validateRegisterInput,
  (req: Request, res: Response, next: NextFunction) => registerUser(req, res)
);

// router.post(
//   "/login",
//   validateLoginInput,
//   (req: Request, res: Response, next: NextFunction) => login(req, res, next)
// );

// router.delete(
//   "/logout",
//   authenticateUser,
//   (req: Request, res: Response, next: NextFunction) => logout(req, res, next)
// );

// router.post(
//   "/verify-email",
//   validateVerifyEmailInput,
//   (req: Request, res: Response, next: NextFunction) =>
//     verifyEmail(req, res, next)
// );

// router.post(
//   "/forgot-password",
//   validateForgotPasswordInput,
//   (req: Request, res: Response, next: NextFunction) =>
//     forgotPassword(req, res, next)
// );

// router.post(
//   "/reset-password",
//   validateResetPasswordInput,
//   (req: Request, res: Response, next: NextFunction) =>
//     resetPassword(req, res, next)
// );

export default router;
