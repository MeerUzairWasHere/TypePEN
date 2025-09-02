import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const notFound = (req: Request, res: Response, next: NextFunction): void => {
  res.status(StatusCodes.NOT_FOUND).json("Route does not exist");
  next();
};

export default notFound;
