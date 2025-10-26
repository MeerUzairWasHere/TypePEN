export interface UpdatePasswordTokenDto {
  passwordToken: string;
  passwordTokenExpirationDate: Date;
}

export interface UpdatePasswordDto {
  password: string;
  passwordToken: null;
  passwordTokenExpirationDate: null;
}

export interface UpdateUserPasswordDto {
  password: string;
}

export interface UpdateUserVerificationDto {
  isVerified: boolean;
  verified: Date;
  verificationToken: string;
}

export interface CreateTokenDto {
  refreshToken: string;
  ip: string;
  userAgent: string;
  userId: string;
}
