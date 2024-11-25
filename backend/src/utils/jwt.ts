import pkg from "jsonwebtoken";
const { sign, verify } = pkg;

interface JWTOptions {
  payload: Record<string, any>;
}

interface AttachCookiesOptions {
  res: any; // Adjust this type based on your framework (e.g., `Response` from Express)
  user: Record<string, any>;
  refreshToken: string;
}

export const createJWT = ({ payload }: JWTOptions): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  const token = sign(payload, process.env.JWT_SECRET);
  return token;
};

export const isTokenValid = (token: string): any => {
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

// // Optional: Attach a single cookie (Uncomment and use if needed)
// export const attachSingleCookieToResponse = ({
//   res,
//   user,
// }: {
//   res: any; // Adjust this type based on your framework
//   user: Record<string, any>;
// }): void => {
//   const token = createJWT({ payload: user });

//   const oneDay = 1000 * 60 * 60 * 24;

//   res.cookie("token", token, {
//     httpOnly: true,
//     expires: new Date(Date.now() + oneDay),
//     secure: process.env.NODE_ENV === "production",
//     signed: true,
//   });
// };
