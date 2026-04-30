import {
  createParamDecorator,
  ExecutionContext,
} from "@nestjs/common";
import { UnauthenticatedError } from "../../errors";

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user?: { id?: string } }>();

    if (!request.user?.id) {
      throw new UnauthenticatedError("User not authenticated");
    }

    return request.user;
  }
);
