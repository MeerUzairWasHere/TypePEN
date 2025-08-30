import { Request, Response } from "express";
import { AddCompanyInput } from "../types";
import { companyService } from "../services/company.service";
import { StatusCodes } from "http-status-codes";

export const createCompany = async (
  req: Request<{}, {}, AddCompanyInput>,
  res: Response
) => {
  const result = await companyService.createCompany(req.body);

  res.status(StatusCodes.CREATED).json(result);
};
