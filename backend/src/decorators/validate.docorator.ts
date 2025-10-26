import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { BadRequestError } from "../errors";

const isEmpty = (obj: object): boolean => {
  return Object.keys(obj).length === 0;
};

export const validate =
  <T>(schema: ZodType<T>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (isEmpty(req.body)) {
        throw new BadRequestError("Please provide a valid request body");
      }
      await schema.parseAsync(req.body);

      next();
    } catch (err) {
      next(err);
    }
  };
