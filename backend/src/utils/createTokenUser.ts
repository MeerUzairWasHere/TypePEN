interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  verificationToken: string | null;
  isVerified: boolean;
  verified: Date | null;
  passwordToken: string | null;
  passwordTokenExpirationDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface TokenUser {
  name: string;
  userId: number;
  role: string;
}

export const createTokenUser = (user: User): TokenUser => {
  return { name: user.name, userId: user.id, role: user.role };
};
