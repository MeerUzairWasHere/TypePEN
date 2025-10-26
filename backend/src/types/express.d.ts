import * as express from "express";
import { TokenUser } from ".";

declare global {
  namespace Express {
    interface Request {
      user?: TokenUser;
    }
  }
}
