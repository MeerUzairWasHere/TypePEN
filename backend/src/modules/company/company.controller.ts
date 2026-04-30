import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Roles } from "../common/decorators";
import { AuthGuard, RolesGuard } from "../common/guards";
import { Role } from "../database/schema";
import { CompanyCreateInputDto, CompanyUpdateInputDto } from "./dto";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import {
  validateCompanyCreateInput,
  validateCompanyUpdateInput,
} from "./validators";
import { CompanyService } from "./company.service";

@Controller("api/v1/company")
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Admin)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createCompany(
    @Body(new ZodValidationPipe(validateCompanyCreateInput))
    body: CompanyCreateInputDto,
  ) {
    return this.companyService.createCompany(body);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getCompany() {
    return this.companyService.getCompany();
  }

  @Patch(":companyId")
  @HttpCode(HttpStatus.OK)
  updateCompany(
    @Param("companyId") companyId: string,
    @Body(new ZodValidationPipe(validateCompanyUpdateInput))
    body: CompanyUpdateInputDto,
  ) {
    return this.companyService.updateComany({
      companyId,
      data: body,
    });
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteCompany() {
    return this.companyService.deleteCompany();
  }
}
