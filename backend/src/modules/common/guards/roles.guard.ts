import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "../../database/schema";
import { ForbiddenError } from "../../errors";
import { ROLES_KEY } from "../decorators";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: { role: Role } }>();

    if (!request.user) {
      throw new ForbiddenError("User not authenticated");
    }

    if (request.user.role === Role.SuperAdmin) {
      return true;
    }

    if (!allowedRoles.includes(request.user.role)) {
      throw new ForbiddenError(
        `Access denied. Required roles: ${allowedRoles.join(", ")}`
      );
    }

    return true;
  }
}
