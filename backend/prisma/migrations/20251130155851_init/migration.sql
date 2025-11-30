-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('Admin', 'User');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" TEXT NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'User',
    "verificationToken" VARCHAR(255),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verified" TIMESTAMP(3),
    "passwordToken" VARCHAR(255),
    "passwordTokenExpirationDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Token" (
    "id" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "ip" VARCHAR(255) NOT NULL,
    "userAgent" VARCHAR(255) NOT NULL,
    "isValid" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Company" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "website" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "verified_resend_domain" VARCHAR(55) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Token_refreshToken_key" ON "public"."Token"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "public"."Company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Company_website_key" ON "public"."Company"("website");

-- CreateIndex
CREATE UNIQUE INDEX "Company_phone_key" ON "public"."Company"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Company_email_key" ON "public"."Company"("email");

-- AddForeignKey
ALTER TABLE "public"."Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
