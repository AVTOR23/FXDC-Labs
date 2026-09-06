import mongoose from "mongoose";
import { env, isProduction } from "./env.js";
import { logger } from "../utils/logger.js";

function redactMongoUri(uri: string): string {
  return uri.replace(/:\/\/([^:/@]+):([^@]+)@/, "://$1:***@");
}

export function normalizeAtlasUri(uri: string): string {
  if (!uri.startsWith("mongodb+srv://")) {
    return uri;
  }

  const url = new URL(uri.replace("mongodb+srv://", "https://"));
  if (!url.searchParams.has("retryWrites")) {
    url.searchParams.set("retryWrites", "true");
  }
  if (!url.searchParams.has("w")) {
    url.searchParams.set("w", "majority");
  }
  if (!url.searchParams.has("authSource")) {
    url.searchParams.set("authSource", "admin");
  }

  const query = url.searchParams.toString();
  const hostAndPath = `${url.hostname}${url.pathname}`;
  return `mongodb+srv://${url.username}:${url.password}@${hostAndPath}${query ? `?${query}` : ""}`;
}

export function getMongoConnectionOptions(): mongoose.ConnectOptions {
  const options: mongoose.ConnectOptions = {
    serverSelectionTimeoutMS: 20_000,
    maxPoolSize: 10,
  };

  if (env.MONGODB_URI.startsWith("mongodb+srv://") && env.MONGODB_TLS_ALLOW_INVALID_CERTS) {
    options.tlsAllowInvalidCertificates = true;
  }

  return options;
}

function isTlsCertificateError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /unable to verify the first certificate|self signed certificate|UNABLE_TO_VERIFY_LEAF_SIGNATURE/i.test(
    message
  );
}

async function fetchPublicIp(): Promise<string | undefined> {
  try {
    const response = await fetch("https://api.ipify.org?format=text", {
      signal: AbortSignal.timeout(4_000),
    });
    if (!response.ok) {
      return undefined;
    }
    const ip = (await response.text()).trim();
    return ip || undefined;
  } catch {
    return undefined;
  }
}

function logConnectionHelp(error: unknown, publicIp?: string) {
  if (isTlsCertificateError(error)) {
    logger.error(
      "TLS certificate verification failed. This is common on Windows when antivirus HTTPS scanning is enabled."
    );
    logger.error(
      "Dev fix: set MONGODB_TLS_ALLOW_INVALID_CERTS=true in backend/.env (never use in production)."
    );
    logger.error(
      "Permanent fix: disable HTTPS/SSL scanning in your antivirus, or install the missing root CA certificate."
    );
    return;
  }

  if (publicIp) {
    logger.error(
      `If Atlas blocks your IP, add ${publicIp}/32 in MongoDB Atlas → Network Access, wait ~1 minute, and restart.`
    );
    return;
  }

  logger.error(
    "Check Atlas Network Access, Database Access credentials, and that the cluster is running."
  );
}

export async function connectDatabase(): Promise<void> {
  mongoose.set("strictQuery", true);

  const uri = normalizeAtlasUri(env.MONGODB_URI);
  const options = getMongoConnectionOptions();

  if (options.tlsAllowInvalidCertificates && isProduction) {
    throw new Error("MONGODB_TLS_ALLOW_INVALID_CERTS cannot be enabled in production");
  }

  if (options.tlsAllowInvalidCertificates) {
    logger.warn("MongoDB TLS certificate verification is disabled for this dev session.");
  }

  try {
    await mongoose.connect(uri, options);

    const host = mongoose.connection.host;
    logger.info(`MongoDB connected${host ? ` (${host})` : ""}`);

    mongoose.connection.on("error", (error) => {
      logger.error("MongoDB runtime error", error);
    });
  } catch (error) {
    const publicIp = await fetchPublicIp();
    logger.error(`MongoDB connection failed for ${redactMongoUri(uri)}.`);
    logConnectionHelp(error, publicIp);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.connection.close();
  logger.info("MongoDB disconnected");
}
