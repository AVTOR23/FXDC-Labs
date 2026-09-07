import { env, isCipherBcConfigured } from "./env.js";
import { ApiError } from "../utils/ApiError.js";

export type CipherBcConfig = {
  apiBaseUrl: string;
  appId: string;
  merchantName: string;
  merchantPrivateKey: string;
  merchantPublicKey: string;
  platformPublicKey: string;
  callbackUrl: string;
  depositCallbackUrl: string;
  withdrawCallbackUrl: string;
  websiteUrl: string;
  keyVersion: string;
  webhookIpAllowlist: string[];
};

export function getCipherBcConfig(): CipherBcConfig {
  if (!isCipherBcConfigured) {
    throw ApiError.internal("CipherBC payment integration is not configured");
  }

  const depositCallbackUrl =
    env.CIPHERBC_DEPOSIT_CALLBACK_URL ?? env.CIPHERBC_CALLBACK_URL!;

  return {
    apiBaseUrl: env.CIPHERBC_API_BASE_URL!.replace(/\/$/, ""),
    appId: env.CIPHERBC_APP_ID!,
    merchantName: env.CIPHERBC_MERCHANT_NAME ?? "FXDC Labs",
    merchantPrivateKey: env.CIPHERBC_MERCHANT_PRIVATE_KEY!,
    merchantPublicKey: env.CIPHERBC_MERCHANT_PUBLIC_KEY ?? "",
    platformPublicKey: env.CIPHERBC_PLATFORM_PUBLIC_KEY!,
    callbackUrl: depositCallbackUrl,
    depositCallbackUrl,
    withdrawCallbackUrl: env.CIPHERBC_WITHDRAW_CALLBACK_URL ?? depositCallbackUrl,
    websiteUrl: env.CIPHERBC_WEBSITE_URL!.replace(/\/$/, ""),
    keyVersion: env.CIPHERBC_KEY_VERSION ?? "admin",
    webhookIpAllowlist: (env.CIPHERBC_WEBHOOK_IP_ALLOWLIST ?? "")
      .split(",")
      .map((ip) => ip.trim())
      .filter(Boolean),
  };
}
