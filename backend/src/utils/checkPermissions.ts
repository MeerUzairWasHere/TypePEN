import { UnauthorizedError } from "../errors";

interface RequestUser {
  role: string;
  userId: string;
}

export const checkPermissions = (
  requestUser: RequestUser,
  resourceUserId: string
): void => {
  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new UnauthorizedError("Not authorized to access this route");
};
