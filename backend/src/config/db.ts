import mongoose from "mongoose";
import { env, isProduction } from "./env.js";
import { logger } from "../utils/logger.js";

function redactMongoUri(uri: string): string {
  return uri.replace(/:\/\/([^:/@]+):([^@]+)@/, "://$1:***@");
}

async function tryConnect(uri: string, timeoutMs: number): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: timeoutMs,
    maxPoolSize: 10,
    retryWrites: true,
    family: 4,
  });
}

export async function connectDatabase(): Promise<void> {
  mongoose.set("strictQuery", true);

  const uris = [env.MONGODB_URI];
  if (!isProduction && env.MONGODB_FALLBACK_URI !== env.MONGODB_URI) {
    uris.push(env.MONGODB_FALLBACK_URI);
  }

  let lastError: unknown;

  for (const [index, uri] of uris.entries()) {
    try {
      await tryConnect(uri, index === 0 ? 8_000 : 5_000);
      const host = mongoose.connection.host;
      logger.info(`MongoDB connected${host ? ` (${host})` : ""}`);
      if (index > 0) {
        logger.warn(
          `Using local MongoDB fallback (${redactMongoUri(uri)}). Add this machine's IP in Atlas Network Access to use the cloud database.`
        );
      }

      mongoose.connection.on("error", (error) => {
        logger.error("MongoDB runtime error", error);
      });
      return;
    } catch (error) {
      lastError = error;
      logger.warn(`MongoDB connection failed for ${redactMongoUri(uri)}`);
    }
  }

  logger.error(
    "MongoDB connection failed. If this is Atlas, add this machine's IP in Network Access.",
    lastError
  );
  throw lastError;
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.connection.close();
  logger.info("MongoDB disconnected");
}
