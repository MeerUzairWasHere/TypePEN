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
  TokenUser,
  VerifyEmailInput,
} from "../types";
import { BadRequestError, UnauthenticatedError } from "../errors";
import { IAuthService, IEmailService } from "../types/interfaces";
import { UserRepository } from "../repositories/user.repository";

export class AuthService implements IAuthService {
  constructor(
    private emailService: IEmailService,
    private userRepository: UserRepository
  ) {}

  async registerUser(data: RegisterInput, origin: string) {
    const { email, name, password, username } = data;

    const userCount = await this.userRepository.getUserCount();
    const role = userCount === 0 ? "Admin" : "User";

    const hashedPassword = await hashPassword(password);
    const verificationToken = randomBytes(40).toString("hex");

    await this.userRepository.createUser({
      name,
      email,
      username,
      password: hashedPassword,
      role,
      verificationToken,
    });

    await this.emailService.sendVerificationEmail({
      name,
      email,
      verificationToken,
      origin,
    });

    return {
      msg: "User created successfully",
    };
  }

  async login(data: LoginInput, userAgent: string, ip: string) {
    const { email, password } = data;

    const user = await this.userRepository.findUserByEmail(email);

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
    const existingToken = await this.userRepository.findTokenByUserId(user.id);

    if (existingToken) {
      if (!existingToken.isValid) {
        throw new UnauthenticatedError("Invalid Credentials");
      }
      refreshToken = existingToken.refreshToken;
    } else {
      refreshToken = randomBytes(40).toString("hex");
      await this.userRepository.createToken({
        refreshToken,
        ip,
        userAgent,
        userId: user.id,
      });
    }

    return {
      user: tokenUser,
      refreshToken,
    };
  }

  async verifyEmail(data: VerifyEmailInput) {
    const { verificationToken, email } = data;
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      throw new UnauthenticatedError("Verification Failed");
    }

    if (user.verificationToken !== verificationToken) {
      throw new UnauthenticatedError("Verification Failed");
    }

    await this.userRepository.updateUserVerification(email, {
      isVerified: true,
      verified: new Date(),
      verificationToken: "",
    });

    await this.emailService.sendWelcomeEmail({
      name: user.name,
      email: user.email,
    });

    return { msg: "Email Verified" };
  }

  async logout(tokenUser: TokenUser) {
    await this.userRepository.deleteUserTokens(tokenUser.id);

    return { msg: "User logged out!" };
  }

  async forgotPassword(data: ForgotPasswordInput, origin: string) {
    const { email } = data;

    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      return { msg: "User not found!" };
    }

    const passwordToken = randomBytes(70).toString("hex");

    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    await this.userRepository.updateUserPasswordToken(email, {
      passwordToken: hashString(passwordToken),
      passwordTokenExpirationDate,
    });

    await this.emailService.sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin,
    });

    return { msg: "Password reset email sent" };
  }

  async resetPassword(data: ResetPasswordInput) {
    const { token, email, newPassword } = data;

    const user = await this.userRepository.findUserByEmail(email);
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

    await this.userRepository.updateUserPassword(email, {
      password: hashedPassword,
      passwordToken: null,
      passwordTokenExpirationDate: null,
    });

    return { msg: "Password reset successfully!" };
  }
}
