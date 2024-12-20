import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        name: string;
        role: string;
      };
    }
  }
}
