import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        name: string;
        role: string;
      };
    }
  }
}
declare module "express";
declare module "morgan";
declare module "cookie-parser";
declare module "cors";
declare module "swagger-ui-express";
declare module "multer";
declare module "jsonwebtoken";
declare module "bcryptjs";
declare module "nodemailer";
