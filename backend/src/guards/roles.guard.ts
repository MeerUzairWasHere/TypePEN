import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { ForbiddenError } from "../errors";

export const rolesGuard = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ForbiddenError("User not authenticated"));
    }

    if (req.user.role === Role.SuperAdmin) {
      return next();
    }

    const userRole = req.user.role as Role;

    if (!allowedRoles.includes(userRole)) {
      return next(
        new ForbiddenError(
          `Access denied. Required roles: ${allowedRoles.join(", ")}`
        )
      );
    }

    next();
  };
};
