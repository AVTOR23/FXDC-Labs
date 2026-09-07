import { Router } from "express";
import {
  cipherbcWebhook,
  cipherbcWithdrawWebhook,
  createPayment,
  getCourses,
  getPaymentStatus,
} from "../controllers/payment.controller.js";
import { optionalAuth, requireAuth } from "../middlewares/auth.js";
import {
  requireCipherBcConfigured,
  verifyCipherBcWebhookSource,
} from "../middlewares/cipherbcWebhook.js";
import { paymentLimiter, webhookLimiter } from "../middlewares/rateLimiters.js";
import { validate } from "../middlewares/validate.js";
import {
  createPaymentSchema,
  paymentStatusParamsSchema,
} from "../validators/payment.validator.js";

const router = Router();

router.get("/courses", getCourses);

router.post(
  "/create",
  requireCipherBcConfigured,
  paymentLimiter,
  requireAuth,
  validate(createPaymentSchema),
  createPayment
);

router.get(
  "/status/:merchantOrderId",
  requireCipherBcConfigured,
  optionalAuth,
  validate(paymentStatusParamsSchema, "params"),
  getPaymentStatus
);

router.post(
  "/webhook/cipherbc",
  webhookLimiter,
  requireCipherBcConfigured,
  verifyCipherBcWebhookSource,
  cipherbcWebhook
);

router.post(
  "/webhook/cipherbc/deposit",
  webhookLimiter,
  requireCipherBcConfigured,
  verifyCipherBcWebhookSource,
  cipherbcWebhook
);

router.post(
  "/webhook/cipherbc/withdraw",
  webhookLimiter,
  requireCipherBcConfigured,
  verifyCipherBcWebhookSource,
  cipherbcWithdrawWebhook
);

export default router;
