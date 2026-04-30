import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { Request, Response } from "express";
import { UnauthenticatedError } from "../../errors";
import { DatabaseService } from "../../database/database.service";
import { tokens } from "../../database/schema";
import { attachCookiesToResponse, isTokenValid } from "../../../utils";
import { TokenUserDto } from "../../users/dto";

interface TokenPayload {
  user: TokenUserDto;
  refreshToken?: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly databaseService: DatabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { refreshToken, accessToken } = request.signedCookies as {
      refreshToken?: string;
      accessToken?: string;
    };

    try {
      if (accessToken) {
        const payload = isTokenValid(accessToken) as TokenPayload;
        request.user = payload.user;
        return true;
      }

      if (!refreshToken) {
        throw new UnauthenticatedError("Authentication Invalid");
      }

      const payload = isTokenValid(refreshToken) as TokenPayload;

      const [existingToken] = await this.databaseService.db
        .select()
        .from(tokens)
        .where(
          and(
            eq(tokens.userId, payload.user.id),
            eq(tokens.refreshToken, payload.refreshToken ?? ""),
            eq(tokens.isValid, true),
          ),
        )
        .limit(1);

      if (!existingToken) {
        throw new UnauthenticatedError("Authentication Invalid");
      }

      attachCookiesToResponse({
        res: response,
        user: payload.user,
        refreshToken: existingToken.refreshToken,
      });
      request.user = payload.user;

      return true;
    } catch {
      throw new UnauthenticatedError("Authentication Invalid");
    }
  }
}
