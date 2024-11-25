import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors/customError";
import { randomBytes } from "crypto";

// import {
//   hashString,
//   sendResetPasswordEmail,
//   sendVerificationEmail,
//   createTokenUser,
//   attachCookiesToResponse,
// } from "../utils";

import { comparePassword, hashPassword } from "../utils/passwordUtils";
import { prismaClient } from "../db";

// Define types for requests containing user and token information
interface UserRequest extends Request {
  user?: {
    userId: string;
  };
}

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, name, password } = req.body;

  // Check if this is the first account to set role as admin
  const userCount = await prismaClient.user.count();
  const role = userCount === 0 ? "admin" : "user";

  // Hash the password and generate a verification token
  const hashedPassword = await hashPassword(password);
  const verificationToken = randomBytes(40).toString("hex");

  // Create a new user in the database
  const user = await prismaClient.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      verificationToken,
    },
  });

  //   const origin = "http://localhost:5000";

  //   await sendVerificationEmail({
  //     name: user.name,
  //     email: user.email,
  //     verificationToken: user.verificationToken,
  //     origin,
  //   });

  res.status(StatusCodes.CREATED).json({
    msg: "User created successfully",
    user,
  });
};

// export const verifyEmail = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const { verificationToken, email } = req.body;
//   const user = await User.findOne({ email });

//   if (!user) {
//     throw new UnauthenticatedError("Verification Failed");
//   }

//   if (user.verificationToken !== verificationToken) {
//     throw new UnauthenticatedError("Verification Failed");
//   }

//   user.isVerified = true;
//   user.verified = new Date();
//   user.verificationToken = "";

//   await user.save();

//   res.status(StatusCodes.OK).json({ msg: "Email Verified" });
// };

// export const login = async (req: Request, res: Response): Promise<void> => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });

//   if (!user) {
//     throw new UnauthenticatedError("Invalid Credentials");
//   }

//   const isPasswordCorrect = await comparePassword(password, user.password);

//   if (!isPasswordCorrect) {
//     throw new UnauthenticatedError("Invalid Credentials");
//   }
//   if (!user.isVerified) {
//     throw new UnauthenticatedError("Please verify your email");
//   }

//   const tokenUser = createTokenUser(user);

//   // Check for existing token or create a new one
//   let refreshToken = "";
//   const existingToken = await Token.findOne({ user: user._id });

//   if (existingToken) {
//     if (!existingToken.isValid) {
//       throw new UnauthenticatedError("Invalid Credentials");
//     }
//     refreshToken = existingToken.refreshToken;
//   } else {
//     refreshToken = randomBytes(40).toString("hex");
//     const userAgent = req.headers["user-agent"];
//     const ip = req.ip;
//     const userToken = { refreshToken, ip, userAgent, user: user._id };
//     await Token.create(userToken);
//   }

//   attachCookiesToResponse({ res, user: tokenUser, refreshToken });
//   res.status(StatusCodes.OK).json({ user: tokenUser });
// };

// export const logout = async (
//   req: UserRequest,
//   res: Response
// ): Promise<void> => {
//   await Token.findOneAndDelete({ user: req.user?.userId });

//   res.cookie("accessToken", "logout", {
//     httpOnly: true,
//     expires: new Date(Date.now()),
//   });
//   res.cookie("refreshToken", "logout", {
//     httpOnly: true,
//     expires: new Date(Date.now()),
//   });
//   res.status(StatusCodes.OK).json({ msg: "User logged out!" });
// };

// export const forgotPassword = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const { email } = req.body;
//   if (!email) {
//     throw new BadRequestError("Please provide a valid email");
//   }

//   const user = await User.findOne({ email });

//   if (user) {
//     const passwordToken = randomBytes(70).toString("hex");
//     const origin = "http://localhost:3000";

//     await sendResetPasswordEmail({
//       name: user.name,
//       email: user.email,
//       token: passwordToken,
//       origin,
//     });

//     const tenMinutes = 1000 * 60 * 10;
//     const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

//     user.passwordToken = hashString(passwordToken);
//     user.passwordTokenExpirationDate = passwordTokenExpirationDate;
//     await user.save();
//   }

//   res
//     .status(StatusCodes.OK)
//     .json({ msg: "Please check your email for reset password link" });
// };

// export const resetPassword = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const { token, email, newPassword } = req.body;

//   const user = await User.findOne({ email });
//   if (!user) {
//     throw new BadRequestError("Invalid or expired token");
//   }

//   const isTokenValid =
//     user.passwordToken === hashString(token) &&
//     user.passwordTokenExpirationDate &&
//     user.passwordTokenExpirationDate > new Date();

//   if (isTokenValid) {
//     user.password = await hashPassword(newPassword);
//     user.passwordToken = null;
//     user.passwordTokenExpirationDate = null;
//     await user.save();
//     res.status(StatusCodes.OK).json({ msg: "Password reset successfully!" });
//   } else {
//     throw new BadRequestError("Invalid or expired token");
//   }
// };
