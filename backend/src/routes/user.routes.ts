import { NextFunction, Router, Request, Response } from "express";
import { authenticateUser } from "../middlewares/authentication";
import {
  showCurrentUser,
  updateUser,
  updateUserPassword,
} from "../controllers/user.controller";

const router = Router();

import {
  validateUpdateUserInput,
  validateUpdatePasswordInput,
} from "../middlewares/validationMiddleware";

router.route("/current-user").get(
  (req: Request, res: Response, next: NextFunction) =>
    authenticateUser(req, res, next),
  (req: Request, res: Response, next: NextFunction) => showCurrentUser(req, res)
);

router.route("/updateUser").patch(
  (req: Request, res: Response, next: NextFunction) =>
    authenticateUser(req, res, next),
  validateUpdateUserInput,
  (req: Request, res: Response, next: NextFunction) => updateUser(req, res)
);
router.route("/updateUserPassword").patch(
  (req: Request, res: Response, next: NextFunction) =>
    authenticateUser(req, res, next),
  validateUpdatePasswordInput,
  (req: Request, res: Response, next: NextFunction) =>
    updateUserPassword(req, res)
);

export default router;
