import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  MONGODB_TLS_ALLOW_INVALID_CERTS: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  COOKIE_NAME: z.string().default("fxdc_token"),
  CORS_ORIGIN: z.string().default("http://localhost:5173,http://localhost:5174"),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
  SUPER_ADMIN_EMAIL: z.string().email().optional(),
  SUPER_ADMIN_PASSWORD: z.string().min(8).optional(),
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),
  CLOUDINARY_FOLDER: z.string().default("fxdc-camp"),
  CIPHERBC_API_BASE_URL: z.string().url().optional(),
  CIPHERBC_APP_ID: z.string().min(1).optional(),
  CIPHERBC_MERCHANT_PRIVATE_KEY: z.string().min(1).optional(),
  CIPHERBC_PLATFORM_PUBLIC_KEY: z.string().min(1).optional(),
  CIPHERBC_CALLBACK_URL: z.string().url().optional(),
  CIPHERBC_WEBSITE_URL: z.string().url().optional(),
  CIPHERBC_KEY_VERSION: z.string().default("admin"),
  CIPHERBC_WEBHOOK_IP_ALLOWLIST: z.string().optional(),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.flatten().fieldErrors;
  console.error("Invalid environment variables:", details);
  process.exit(1);
}

if (
  parsed.data.NODE_ENV === "production" &&
  parsed.data.MONGODB_TLS_ALLOW_INVALID_CERTS
) {
  console.error(
    "Invalid environment: MONGODB_TLS_ALLOW_INVALID_CERTS cannot be true in production."
  );
  process.exit(1);
}

export const env = parsed.data;

export const isProduction = env.NODE_ENV === "production";
export const isCipherBcConfigured = Boolean(
  env.CIPHERBC_API_BASE_URL &&
    env.CIPHERBC_APP_ID &&
    env.CIPHERBC_MERCHANT_PRIVATE_KEY &&
    env.CIPHERBC_PLATFORM_PUBLIC_KEY &&
    env.CIPHERBC_CALLBACK_URL &&
    env.CIPHERBC_WEBSITE_URL
);
export const corsOrigins = env.CORS_ORIGIN.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
