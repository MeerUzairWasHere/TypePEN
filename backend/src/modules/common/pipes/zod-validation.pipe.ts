import { Injectable, PipeTransform } from "@nestjs/common";
import { ZodSchema } from "zod";
import { BadRequestError } from "../../errors";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  async transform(value: unknown) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value as Record<string, unknown>).length === 0
    ) {
      throw new BadRequestError("Please provide a valid request body");
    }

    return this.schema.parseAsync(value);
  }
}
