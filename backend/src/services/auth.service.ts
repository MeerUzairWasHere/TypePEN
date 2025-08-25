import { randomBytes } from "crypto";
import { prismaClient } from "../db";
import {
  hashString,
  createTokenUser,
  hashPassword,
  comparePassword,
} from "../utils";
import {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  VerifyEmailInput,
} from "../types";

import { BadRequestError, UnauthenticatedError } from "../errors";
import { emailService } from "./email.service";

export class AuthService {
  // User Registration
  async registerUser(data: RegisterInput, origin: string) {
    const { email, name, password } = data;

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
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await emailService.sendVerificationEmail({
      name,
      email,
      verificationToken,
      origin,
    });

    return {
      user,
      msg: "User created successfully",
    };
  }

  // User Login
  async login(data: LoginInput, userAgent: string, ip: string) {
    const { email, password } = data;

    // Step 1: Find user by email
    const user = await prismaClient.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthenticatedError("Invalid Credentials");
    }

    // Step 2: Compare passwords
    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid Credentials");
    }

    // Step 3: Verify user's email status
    if (!user.isVerified) {
      throw new UnauthenticatedError("Please verify your email");
    }

    // Step 4: Create token payload for the user
    const tokenUser = createTokenUser(user);

    // Step 5: Check for existing token or create a new one
    let refreshToken: string;
    const existingToken = await prismaClient.token.findFirst({
      where: { user: { id: user.id } },
    });

    if (existingToken) {
      if (!existingToken.isValid) {
        throw new UnauthenticatedError("Invalid Credentials");
      }
      refreshToken = existingToken.refreshToken;
    } else {
      refreshToken = randomBytes(40).toString("hex");
      await prismaClient.token.create({
        data: {
          refreshToken,
          ip,
          userAgent,
          userId: user.id,
        },
      });
    }

    return {
      user: tokenUser,
      refreshToken,
    };
  }

  // Verify Email
  async verifyEmail(data: VerifyEmailInput) {
    const { verificationToken, email } = data;
    const user = await prismaClient.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthenticatedError("Verification Failed");
    }

    if (user.verificationToken !== verificationToken) {
      throw new UnauthenticatedError("Verification Failed");
    }

    await prismaClient.user.update({
      where: { email },
      data: {
        isVerified: true,
        verified: new Date(),
        verificationToken: "",
      },
    });

    await emailService.sendWelcomeEmail({
      name: user.name,
      email: user.email,
    });

    return { msg: "Email Verified" };
  }

  // Logout
  async logout(userId: number) {
    await prismaClient.token.deleteMany({
      where: {
        userId: Number(userId),
      },
    });

    return { msg: "User logged out!" };
  }

  // Forgot Password
  async forgotPassword(data: ForgotPasswordInput, origin: string) {
    const { email } = data;

    if (!email) {
      throw new BadRequestError("Please provide a valid email");
    }

    const user = await prismaClient.user.findUnique({ where: { email } });

    if (!user) {
      return { msg: "User not found!" };
    }

    const passwordToken = randomBytes(70).toString("hex");

    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    await prismaClient.user.update({
      where: { email },
      data: {
        passwordToken: hashString(passwordToken),
        passwordTokenExpirationDate,
      },
    });

    await emailService.sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin,
    });

    return {
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin,
    };
  }

  // Reset Password
  async resetPassword(data: ResetPasswordInput) {
    const { token, email, newPassword } = data;

    const user = await prismaClient.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestError("Invalid or expired token");
    }

    const isTokenValid =
      user.passwordToken === hashString(token) &&
      user.passwordTokenExpirationDate &&
      user.passwordTokenExpirationDate > new Date();

    if (!isTokenValid) {
      throw new BadRequestError("Invalid or expired token");
    }

    const hashedPassword = await hashPassword(newPassword);

    await prismaClient.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        passwordToken: null,
        passwordTokenExpirationDate: null,
      },
    });

    return { msg: "Password reset successfully!" };
  }

  // Get user by ID (optional utility method)
  async getUserById(userId: number) {
    return await prismaClient.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // Check if email exists (optional utility method)
  async checkEmailExists(email: string) {
    const user = await prismaClient.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return !!user;
  }
}

export const authService = new AuthService();
