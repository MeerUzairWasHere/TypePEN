import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./modules/common/filters/all-exceptions.filter";
import { openApiSpec } from "./openApiSpec";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

  app.use("/uploads", express.static("uploads"));
  app.use(cookieParser(process.env.COOKIE_SECRET));

  app.getHttpAdapter().getInstance().set("trust proxy", 1);
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      handler: (_req, _res, next, options) => {
        const err = new Error("Too many requests. Please try again later.");
        (err as Error & { statusCode?: number; retryAfter?: string }).statusCode =
          429;
        (err as Error & { statusCode?: number; retryAfter?: string }).retryAfter =
          `${options.windowMs / 1000 / 60} minutes`;
        next(err);
      },
    })
  );

  app.use(helmet());
  app.enableCors();
  app.useGlobalFilters(new AllExceptionsFilter());
  app.use("/documentation", swaggerUi.serve, swaggerUi.setup(openApiSpec));

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
  console.log(`Server is listening on http://localhost:${port}/...`);
}

bootstrap().catch((error) => {
  console.error("Failed to bootstrap Nest application", error);
  process.exit(1);
});
