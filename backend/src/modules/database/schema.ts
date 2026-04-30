import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const Role = {
  SuperAdmin: "SuperAdmin",
  Admin: "Admin",
  User: "User",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const roleEnum = pgEnum("Role", [
  Role.SuperAdmin,
  Role.Admin,
  Role.User,
]);

export const users = pgTable(
  "User",
  {
    id: text("id").primaryKey(),
    username: text("username").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    email: text("email").notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    role: roleEnum("role").default(Role.User).notNull(),
    verificationToken: varchar("verificationToken", { length: 255 }),
    isVerified: boolean("isVerified").default(false).notNull(),
    verified: timestamp("verified", { precision: 3 }),
    passwordToken: varchar("passwordToken", { length: 255 }),
    passwordTokenExpirationDate: timestamp("passwordTokenExpirationDate", {
      precision: 3,
    }),
    createdAt: timestamp("createdAt", { precision: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3 }).notNull(),
  },
  (table) => [
    uniqueIndex("User_username_key").on(table.username),
    uniqueIndex("User_email_key").on(table.email),
  ],
);

export const tokens = pgTable(
  "Token",
  {
    id: text("id").primaryKey(),
    refreshToken: text("refreshToken").notNull(),
    ip: varchar("ip", { length: 255 }).notNull(),
    userAgent: varchar("userAgent", { length: 255 }).notNull(),
    isValid: boolean("isValid").default(true).notNull(),
    userId: text("userId").notNull(),
    createdAt: timestamp("createdAt", { precision: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3 }).notNull(),
  },
  (table) => [
    uniqueIndex("Token_refreshToken_key").on(table.refreshToken),
    foreignKey({
      name: "Token_userId_fkey",
      columns: [table.userId],
      foreignColumns: [users.id],
    })
      .onDelete("restrict")
      .onUpdate("cascade"),
  ],
);

export const companies = pgTable(
  "Company",
  {
    id: text("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    address: varchar("address", { length: 255 }).notNull(),
    website: varchar("website", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    verified_resend_domain: varchar("verified_resend_domain", {
      length: 55,
    }).notNull(),
    createdAt: timestamp("createdAt", { precision: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3 }).notNull(),
  },
  (table) => [
    uniqueIndex("Company_name_key").on(table.name),
    uniqueIndex("Company_website_key").on(table.website),
    uniqueIndex("Company_phone_key").on(table.phone),
    uniqueIndex("Company_email_key").on(table.email),
  ],
);

export const userRelations = relations(users, ({ many }) => ({
  tokens: many(tokens),
}));

export const tokenRelations = relations(tokens, ({ one }) => ({
  user: one(users, {
    fields: [tokens.userId],
    references: [users.id],
  }),
}));

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type Token = InferSelectModel<typeof tokens>;
export type NewToken = InferInsertModel<typeof tokens>;
export type Company = InferSelectModel<typeof companies>;
export type NewCompany = InferInsertModel<typeof companies>;
