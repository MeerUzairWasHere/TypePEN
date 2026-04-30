import { TokenUserDto } from "../modules/users/dto";
import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: TokenUserDto;
    }
  }
}
