import { Response } from "express";
import pkg from "jsonwebtoken";
const { sign, verify } = pkg;

interface JWTOptions {
  payload: Record<string, unknown>;
}

interface AttachCookiesOptions {
  res: Response;
  user: object;
  refreshToken: string;
}

export const createJWT = ({ payload }: JWTOptions): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return sign(payload, process.env.JWT_SECRET);
};

export const isTokenValid = (token: string): unknown => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return verify(token, process.env.JWT_SECRET);
};

export const attachCookiesToResponse = ({
  res,
  user,
  refreshToken,
}: AttachCookiesOptions): void => {
  const accessTokenJWT = createJWT({ payload: { user } });
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });

  const oneDay = 1000 * 60 * 60 * 24;
  const longerExp = 1000 * 60 * 60 * 24 * 30;

  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + oneDay),
  });

  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + longerExp),
  });
};
