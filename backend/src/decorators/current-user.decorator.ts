import { Request } from "express";
import { UnauthenticatedError } from "../errors";

export const currentUser = (req: Request) => {
  if (!req.user?.id) {
    throw new UnauthenticatedError("User not authenticated");
  }
  return req.user;
};
