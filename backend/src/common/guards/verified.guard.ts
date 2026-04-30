import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ForbiddenError } from "../../errors";

@Injectable()
export class VerifiedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      user?: { isVerified?: boolean };
    }>();

    if (!request.user) {
      throw new ForbiddenError("User not authenticated");
    }

    if (!request.user.isVerified) {
      throw new ForbiddenError("Please verify your email first");
    }

    return true;
  }
}
