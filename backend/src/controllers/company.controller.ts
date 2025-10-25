import { Request, Response } from "express";
import { CompanyInput } from "../types";
import { StatusCodes } from "http-status-codes";
import { companyService } from "../services/container";

export const createCompany = async (
  req: Request<{}, {}, CompanyInput>,
  res: Response
) => {
  const result = await companyService.createCompany({ data: req.body });

  res.status(StatusCodes.CREATED).json(result);
};

export const getCompany = async (req: Request, res: Response) => {
  const result = await companyService.getCompany();
  res.status(StatusCodes.OK).json(result);
};

export const updateCompany = async (
  req: Request<{ companyId: string }, {}, CompanyInput>,
  res: Response
) => {
  const result = await companyService.updateComany({
    companyId: req.params.companyId,
    data: req.body,
  });

  res.status(StatusCodes.OK).json(result);
};

export const deleteCompany = async (req: Request, res: Response) => {
  await companyService.deleteCompany();

  res.status(StatusCodes.NO_CONTENT).send();
};
