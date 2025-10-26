import { Role } from "@prisma/client";
import { UnauthorizedError } from "../errors";
import { TokenUserDto } from "../dto";

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
