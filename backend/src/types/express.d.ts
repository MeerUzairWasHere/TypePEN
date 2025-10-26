import { TokenUserDto } from "../dto";
import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: TokenUserDto;
    }
  }
}
