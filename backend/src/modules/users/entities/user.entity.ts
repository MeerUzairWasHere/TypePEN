import { Role } from "../../database/schema";

export class UserEntity {
  id!: string;
  username!: string;
  name!: string;
  email!: string;
  role!: Role;
  isVerified!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}

export interface TokenUserDto {
  id: string;
  name: string;
  role: string;
  email: string;
  isVerified: boolean;
}
