import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ICompanyService } from "../interfaces";
import { CompanyCreateInputDto, CompanyUpdateInputDto } from "../dto";

export class CompanyController {
  constructor(private companyService: ICompanyService) {}

  public createCompany = async (
    req: Request<{}, {}, CompanyCreateInputDto>,
    res: Response
  ): Promise<void> => {
    const result = await this.companyService.createCompany(req.body);
    res.status(StatusCodes.CREATED).json(result);
  };

  public getCompany = async (req: Request, res: Response): Promise<void> => {
    const result = await this.companyService.getCompany();
    res.status(StatusCodes.OK).json(result);
  };

  public updateCompany = async (
    req: Request<{ companyId: string }, {}, CompanyUpdateInputDto>,
    res: Response
  ): Promise<void> => {
    const result = await this.companyService.updateComany({
      companyId: req.params.companyId,
      data: req.body,
    });
    res.status(StatusCodes.OK).json(result);
  };

  public deleteCompany = async (req: Request, res: Response): Promise<void> => {
    await this.companyService.deleteCompany();
    res.status(StatusCodes.NO_CONTENT).send();
  };
}
