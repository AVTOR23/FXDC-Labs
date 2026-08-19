import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import morgan from "morgan";
import { corsOrigins, isProduction } from "./config/env.js";
import { globalLimiter } from "./middlewares/rateLimiters.js";
import { sanitizeRequest } from "./middlewares/sanitizeRequest.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import apiRoutes from "./routes/index.js";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.disable("x-powered-by");

  app.use(
    helmet({
      contentSecurityPolicy: isProduction,
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || corsOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error("Origin not allowed by CORS"));
      },
      credentials: true,
      methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.use(compression());
  app.use(cookieParser());
  app.use(express.json({ limit: "16kb" }));
  app.use(express.urlencoded({ extended: false, limit: "16kb" }));
  app.use(mongoSanitize());
  app.use(
    hpp({
      whitelist: ["status", "page", "limit", "search"],
    })
  );
  app.use(sanitizeRequest);
  app.use(morgan(isProduction ? "combined" : "dev"));
  app.use(globalLimiter);

  app.use("/api", apiRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
