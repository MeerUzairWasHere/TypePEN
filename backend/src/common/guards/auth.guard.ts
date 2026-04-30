import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { UnauthenticatedError } from "../../errors";
import { PrismaService } from "../../modules/database/prisma.service";
import { attachCookiesToResponse, isTokenValid } from "../../utils";
import { TokenUserDto } from "../../dto";

interface TokenPayload {
  user: TokenUserDto;
  refreshToken?: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

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

      const existingToken = await this.prismaService.token.findFirst({
        where: {
          userId: payload.user.id,
          refreshToken: payload.refreshToken,
          isValid: true,
        },
      });

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
