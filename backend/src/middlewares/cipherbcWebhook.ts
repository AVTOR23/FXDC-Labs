import type { NextFunction, Request, Response } from "express";
import { getCipherBcConfig } from "../config/cipherbc.js";
import { isCipherBcConfigured } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

function normalizeIp(ip?: string) {
  if (!ip) {
    return "";
  }

  return ip.replace(/^::ffff:/, "");
}

export function requireCipherBcConfigured(_req: Request, _res: Response, next: NextFunction) {
  if (!isCipherBcConfigured) {
    next(ApiError.internal("CipherBC payment integration is not configured"));
    return;
  }

  next();
}

export function verifyCipherBcWebhookSource(req: Request, _res: Response, next: NextFunction) {
  if (!isCipherBcConfigured) {
    next(ApiError.internal("CipherBC payment integration is not configured"));
    return;
  }

  const config = getCipherBcConfig();

  if (config.webhookIpAllowlist.length === 0) {
    next();
    return;
  }

  const requestIp = normalizeIp(req.ip);
  const forwarded = req.headers["x-forwarded-for"];
  const forwardedIp =
    typeof forwarded === "string" ? normalizeIp(forwarded.split(",")[0]?.trim()) : "";

  const allowed = config.webhookIpAllowlist.some(
    (ip) => ip === requestIp || (forwardedIp && ip === forwardedIp)
  );

  if (!allowed) {
    next(ApiError.forbidden("Webhook source is not allowed"));
    return;
  }

  next();
}
