import dotenv from "dotenv";
dotenv.config();
import "express-async-errors";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimiter from "express-rate-limit";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { openApiSpec } from "./openApiSpec";

// Routers
import authRoutes from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import companyRouter from "./routes/company.routes";

// Middleware
import { prismaService } from "./container";

import {
  httpExceptionFilter,
  jwtExceptionFilter,
  notFoundFilter,
  prismaExceptionFilter,
  rateLimitExceptionFilter,
  zodExceptionFilter,
} from "./filters";

// const __dirname = dirname(fileURLToPath(import.meta.url)); // Uncomment if you have a frontend

// Initialize Express app
const app = express();

// Middleware setup
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use("/uploads", express.static("uploads"));

app.use(cookieParser(process.env.COOKIE_SECRET));

// app.use(express.static(resolve(__dirname, "./client/dist"))); // Uncomment if you have a frontend

// Security
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
    handler: (req, res, next, options) => {
      // Pass a custom error object to the next middleware
      const err = new Error("Too many requests. Please try again later.");
      // Attach useful info
      (err as any).statusCode = 429;
      (err as any).retryAfter = options.windowMs / 1000 / 60 + " minutes";
      next(err);
    },
  })
);

app.use(helmet());
app.use(cors());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/company", companyRouter);
app.use("/api/v1/users", userRouter);


// Remove this in production
app.use("/documentation", swaggerUi.serve, swaggerUi.setup(openApiSpec));

// app.get("*", (req, res) => {
//   // res.redirect("/documentation"); // comment out this route when starting
// });

// Serve static files in production
// Uncomment the below line if you have a frontend to serve in production
// app.get("*", (req: Request, res: Response) => {
//     res.sendFile(resolve(__dirname, "./client/dist", "index.html"));
// });

app.use(notFoundFilter); // 404 errors
app.use(zodExceptionFilter); // Zod validation errors
app.use(jwtExceptionFilter); // JWT token errors
app.use(prismaExceptionFilter); // Prisma database errors
app.use(rateLimitExceptionFilter); // Rate limiting errors
app.use(httpExceptionFilter); // HTTP errors
// Port
const port = process.env.PORT || 3000;

// Start the server
const startServer = async () => {
  try {
    await prismaService.connect();
    app.listen(port, () => {
      console.log(`Server is listening on http://localhost:${port}/...`);
    });
  } catch (error) {
    console.error(error);
    await prismaService.disconnect();
  }
};

startServer();
