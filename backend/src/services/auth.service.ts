import { randomBytes } from "crypto";
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
import { IEmailService, IPrismaService } from "../types/interfaces";

export class AuthService {
  constructor(
    private emailService: IEmailService,
    private prismaService: IPrismaService
  ) {}

  
  async registerUser(data: RegisterInput, origin: string) {
    const { email, name, password } = data;

    
    const userCount = await this.prismaService.user.count();
    const role = userCount === 0 ? "admin" : "user";

    
    const hashedPassword = await hashPassword(password);
    const verificationToken = randomBytes(40).toString("hex");

    
    const user = await this.prismaService.user.create({
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

    await this.emailService.sendVerificationEmail({
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

  
  async login(data: LoginInput, userAgent: string, ip: string) {
    const { email, password } = data;

    
    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthenticatedError("Invalid Credentials");
    }

    
    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid Credentials");
    }

    
    if (!user.isVerified) {
      throw new UnauthenticatedError("Please verify your email");
    }

    
    const tokenUser = createTokenUser(user);

    
    let refreshToken: string;
    const existingToken = await this.prismaService.token.findFirst({
      where: { user: { id: user.id } },
    });

    if (existingToken) {
      if (!existingToken.isValid) {
        throw new UnauthenticatedError("Invalid Credentials");
      }
      refreshToken = existingToken.refreshToken;
    } else {
      refreshToken = randomBytes(40).toString("hex");
      await this.prismaService.token.create({
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

  
  async verifyEmail(data: VerifyEmailInput) {
    const { verificationToken, email } = data;
    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthenticatedError("Verification Failed");
    }

    if (user.verificationToken !== verificationToken) {
      throw new UnauthenticatedError("Verification Failed");
    }

    await this.prismaService.user.update({
      where: { email },
      data: {
        isVerified: true,
        verified: new Date(),
        verificationToken: "",
      },
    });

    await this.emailService.sendWelcomeEmail({
      name: user.name,
      email: user.email,
    });

    return { msg: "Email Verified" };
  }

  
  async logout(userId: number) {
    await this.prismaService.token.deleteMany({
      where: {
        userId: Number(userId),
      },
    });

    return { msg: "User logged out!" };
  }

  
  async forgotPassword(data: ForgotPasswordInput, origin: string) {
    const { email } = data;

    if (!email) {
      throw new BadRequestError("Please provide a valid email");
    }

    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (!user) {
      return { msg: "User not found!" };
    }

    const passwordToken = randomBytes(70).toString("hex");

    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    await this.prismaService.user.update({
      where: { email },
      data: {
        passwordToken: hashString(passwordToken),
        passwordTokenExpirationDate,
      },
    });

    await this.emailService.sendResetPasswordEmail({
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

  
  async resetPassword(data: ResetPasswordInput) {
    const { token, email, newPassword } = data;

    const user = await this.prismaService.user.findUnique({ where: { email } });
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

    await this.prismaService.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        passwordToken: null,
        passwordTokenExpirationDate: null,
      },
    });

    return { msg: "Password reset successfully!" };
  }

  
  async getUserById(userId: number) {
    return await this.prismaService.user.findUnique({
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

  
  async checkEmailExists(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return !!user;
  }
}
