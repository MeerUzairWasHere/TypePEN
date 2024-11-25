interface User {
  name: string;
  _id: string;
  role: string;
}

interface TokenUser {
  name: string;
  userId: string;
  role: string;
}

export const createTokenUser = (user: User): TokenUser => {
  return { name: user.name, userId: user._id, role: user.role };
};
