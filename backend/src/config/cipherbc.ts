import { env, isCipherBcConfigured } from "./env.js";
import { ApiError } from "../utils/ApiError.js";

export type CipherBcConfig = {
  apiBaseUrl: string;
  appId: string;
  merchantPrivateKey: string;
  platformPublicKey: string;
  callbackUrl: string;
  websiteUrl: string;
  keyVersion: string;
  webhookIpAllowlist: string[];
};

export function getCipherBcConfig(): CipherBcConfig {
  if (!isCipherBcConfigured) {
    throw ApiError.internal("CipherBC payment integration is not configured");
  }

  return {
    apiBaseUrl: env.CIPHERBC_API_BASE_URL!.replace(/\/$/, ""),
    appId: env.CIPHERBC_APP_ID!,
    merchantPrivateKey: env.CIPHERBC_MERCHANT_PRIVATE_KEY!,
    platformPublicKey: env.CIPHERBC_PLATFORM_PUBLIC_KEY!,
    callbackUrl: env.CIPHERBC_CALLBACK_URL!,
    websiteUrl: env.CIPHERBC_WEBSITE_URL!.replace(/\/$/, ""),
    keyVersion: env.CIPHERBC_KEY_VERSION ?? "admin",
    webhookIpAllowlist: (env.CIPHERBC_WEBHOOK_IP_ALLOWLIST ?? "")
      .split(",")
      .map((ip) => ip.trim())
      .filter(Boolean),
  };
}
