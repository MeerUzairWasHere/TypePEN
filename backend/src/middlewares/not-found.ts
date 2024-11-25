import { Request, Response, NextFunction } from "express";

const notFound = (req: Request, res: Response, next: NextFunction): void => {
  res.status(404).send("Route does not exist");
  next(); // Optional, if you want to signal that the request was handled.
};

export default notFound;
