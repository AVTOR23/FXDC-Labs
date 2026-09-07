import type { Request, Response } from "express";
import {
  createPaymentOrder,
  getPaymentById,
  getPaymentStats,
  handleCipherBcCallback,
  handleCipherBcWithdrawCallback,
  listCourses,
  listPaymentEvents,
  listPayments,
  resyncPaymentAdmin,
  syncPaymentByMerchantOrderId,
  updatePaymentAdmin,
} from "../services/payment.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { IdParams } from "../validators/common.validator.js";
import type {
  AdminPaymentUpdate,
  CreatePaymentInput,
  PaymentListQuery,
  PaymentStatusParams,
} from "../validators/payment.validator.js";

export const getCourses = asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json(new ApiResponse(true, "Courses", listCourses()));
});

export const createPayment = asyncHandler(async (req: Request, res: Response) => {
  const data = await createPaymentOrder(req.body as CreatePaymentInput, {
    userId: req.user!.sub,
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });

  res.status(201).json(new ApiResponse(true, "Payment order created", data));
});

export const getPaymentStatus = asyncHandler(async (req: Request, res: Response) => {
  const { merchantOrderId } = req.params as PaymentStatusParams;
  const item = await syncPaymentByMerchantOrderId(merchantOrderId, req.user?.sub);
  res.status(200).json(new ApiResponse(true, "Payment status", item));
});

export const cipherbcWebhook = asyncHandler(async (req: Request, res: Response) => {
  const acknowledgement = await handleCipherBcCallback(req.body as Record<string, unknown>, {
    sourceIp: req.ip,
  });

  res.status(200).json(acknowledgement);
});

export const cipherbcWithdrawWebhook = asyncHandler(async (req: Request, res: Response) => {
  const acknowledgement = await handleCipherBcWithdrawCallback(req.body as Record<string, unknown>, {
    sourceIp: req.ip,
  });

  res.status(200).json(acknowledgement);
});

export const listAdminPayments = asyncHandler(async (req: Request, res: Response) => {
  const result = await listPayments(req.query as unknown as PaymentListQuery);
  res.status(200).json(new ApiResponse(true, "Payments", result.items, result.meta));
});

export const getAdminPayment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as IdParams;
  const item = await getPaymentById(id);
  res.status(200).json(new ApiResponse(true, "Payment", item));
});

export const listAdminPaymentEvents = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as IdParams;
  const events = await listPaymentEvents(id);
  res.status(200).json(new ApiResponse(true, "Payment events", events));
});

export const patchAdminPayment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as IdParams;
  const item = await updatePaymentAdmin(id, req.body as AdminPaymentUpdate);
  res.status(200).json(new ApiResponse(true, "Payment updated", item));
});

export const resyncAdminPayment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as IdParams;
  const item = await resyncPaymentAdmin(id);
  res.status(200).json(new ApiResponse(true, "Payment synced", item));
});

export const getAdminPaymentStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await getPaymentStats();
  res.status(200).json(new ApiResponse(true, "Payment stats", stats));
});
