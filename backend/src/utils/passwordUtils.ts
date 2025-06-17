import * as argon2 from "argon2";

export const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await argon2.hash(password);
  return hashedPassword;
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  const isMatch = await argon2.verify(hashedPassword, password);
  return isMatch;
};
