import { Role } from "@prisma/client";
import { UnauthorizedError } from "../modules/errors";
import { TokenUserDto } from "../modules/users/dto";

export const checkPermissions = (
  requestUser: TokenUserDto,
  resourceUserId: string
): void => {
  if (requestUser.role === Role.Admin) return;
  if (requestUser.id === resourceUserId.toString()) return;
  throw new UnauthorizedError(
    "You don't have permission to access this resource."
  );
};
