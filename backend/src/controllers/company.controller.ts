import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { companyService } from "../container";
import { CompanyCreateInputDto, CompanyUpdateInputDto } from "../dto";

export const createCompany = async (
  req: Request<{}, {}, CompanyCreateInputDto>,
  res: Response
) => {
  const result = await companyService.createCompany(req.body);

  res.status(StatusCodes.CREATED).json(result);
};

export const getCompany = async (req: Request, res: Response) => {
  const result = await companyService.getCompany();
  res.status(StatusCodes.OK).json(result);
};

export const updateCompany = async (
  req: Request<{ companyId: string }, {}, CompanyUpdateInputDto>,
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
