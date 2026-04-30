DO $$ BEGIN
 CREATE TYPE "public"."Role" AS ENUM('SuperAdmin', 'Admin', 'User');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Company" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"address" varchar(255) NOT NULL,
	"website" varchar(255) NOT NULL,
	"phone" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"verified_resend_domain" varchar(55) NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Token" (
	"id" text PRIMARY KEY NOT NULL,
	"refreshToken" text NOT NULL,
	"ip" varchar(255) NOT NULL,
	"userAgent" varchar(255) NOT NULL,
	"isValid" boolean DEFAULT true NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" text NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "Role" DEFAULT 'User' NOT NULL,
	"verificationToken" varchar(255),
	"isVerified" boolean DEFAULT false NOT NULL,
	"verified" timestamp (3),
	"passwordToken" varchar(255),
	"passwordTokenExpirationDate" timestamp (3),
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Company_name_key" ON "Company" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Company_website_key" ON "Company" USING btree ("website");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Company_phone_key" ON "Company" USING btree ("phone");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Company_email_key" ON "Company" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Token_refreshToken_key" ON "Token" USING btree ("refreshToken");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "User_username_key" ON "User" USING btree ("username");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User" USING btree ("email");
